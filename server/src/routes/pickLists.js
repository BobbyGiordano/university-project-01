const express = require('express');
const prisma = require('../db');
const { requireAuth } = require('../middleware/auth');
const { logAudit } = require('../middleware/audit');

const router = express.Router();

// POST /api/pick-lists/generate
router.post('/generate', requireAuth, async (req, res) => {
  try {
    const { motorcycleTypeId, packageId } = req.body;
    if (!motorcycleTypeId) {
      return res.status(400).json({ error: 'ID tipe motor wajib dipilih.' });
    }

    const mId = parseInt(motorcycleTypeId, 10);
    const motorcycle = await prisma.motorcycleType.findUnique({
      where: { id: mId },
      include: {
        images: {
          orderBy: [{ isPrimary: 'desc' }, { createdAt: 'desc' }],
        },
      },
    });

    if (!motorcycle || !motorcycle.isActive) {
      return res.status(404).json({ error: 'Tipe motor tidak ditemukan atau dinonaktifkan.' });
    }

    let selectedPackage = null;
    let itemsToProcess = [];
    let isPackageMode = false;

    if (packageId) {
      const pId = parseInt(packageId, 10);
      selectedPackage = await prisma.package.findUnique({
        where: { id: pId },
        include: {
          items: {
            include: {
              boltSpec: {
                include: {
                  images: {
                    orderBy: [{ isPrimary: 'desc' }, { createdAt: 'desc' }],
                  },
                },
              },
            },
          },
        },
      });

      if (!selectedPackage || selectedPackage.motorcycleTypeId !== mId) {
        return res.status(400).json({
          error: 'Paket yang dipilih tidak sesuai dengan tipe motor ini.',
        });
      }

      isPackageMode = true;
    }

    // Load full motorcycle requirements
    const requirements = await prisma.motorBoltRequirement.findMany({
      where: { motorcycleTypeId: mId },
      include: {
        boltPosition: true,
        boltSpec: {
          include: {
            images: {
              orderBy: [{ isPrimary: 'desc' }, { createdAt: 'desc' }],
            },
          },
        },
      },
      orderBy: [
        { boltPosition: { sortOrder: 'asc' } },
        { sortOrder: 'asc' },
      ],
    });

    // Consolidated aggregation Map: boltSpecId -> { spec, quantity, positions: Set }
    const consolidatedMap = new Map();
    // Position breakdown list
    const positionBreakdown = [];

    if (isPackageMode && selectedPackage) {
      // Process package items
      for (const item of selectedPackage.items) {
        const specId = item.boltSpecId;
        const current = consolidatedMap.get(specId) || {
          boltSpec: item.boltSpec,
          quantity: 0,
          notes: [],
        };
        current.quantity += item.quantity;
        if (item.emblemNote) {
          current.notes.push(item.emblemNote);
        }
        consolidatedMap.set(specId, current);

        positionBreakdown.push({
          positionName: item.emblemNote || 'Paket Komponen',
          category: selectedPackage.packageType,
          side: 'NONE',
          boltSpec: item.boltSpec,
          quantity: item.quantity,
          isOptional: false,
        });
      }
    } else {
      // Process motorcycle requirements
      for (const reqRow of requirements) {
        const specId = reqRow.boltSpecId;
        const current = consolidatedMap.get(specId) || {
          boltSpec: reqRow.boltSpec,
          quantity: 0,
          positions: [],
        };
        current.quantity += reqRow.quantity;
        current.positions.push(`${reqRow.boltPosition.name} (${reqRow.quantity}${reqRow.side !== 'NONE' ? ` ${reqRow.side}` : ''})`);
        consolidatedMap.set(specId, current);

        positionBreakdown.push({
          positionId: reqRow.boltPosition.id,
          positionName: reqRow.boltPosition.name,
          category: reqRow.boltPosition.category,
          side: reqRow.side,
          boltSpec: reqRow.boltSpec,
          quantity: reqRow.quantity,
          isOptional: reqRow.isOptional,
        });
      }
    }

    const consolidatedTotals = Array.from(consolidatedMap.values()).map((entry) => ({
      boltSpecId: entry.boltSpec.id,
      code: entry.boltSpec.code,
      diameterMm: entry.boltSpec.diameterMm,
      lengthMm: entry.boltSpec.lengthMm,
      headType: entry.boltSpec.headType,
      material: entry.boltSpec.material,
      finish: entry.boltSpec.finish,
      totalQuantity: entry.quantity,
      positionsSummary: entry.positions ? entry.positions.join(', ') : (entry.notes ? entry.notes.join(', ') : ''),
      images: entry.boltSpec.images || [],
      boltSpec: entry.boltSpec,
    }));

    // Sort consolidated totals by diameter, length, headType
    consolidatedTotals.sort((a, b) => {
      if (a.diameterMm !== b.diameterMm) return Number(a.diameterMm) - Number(b.diameterMm);
      if (a.lengthMm !== b.lengthMm) return Number(a.lengthMm) - Number(b.lengthMm);
      return a.code.localeCompare(b.code);
    });

    const totalQuantity = consolidatedTotals.reduce((sum, item) => sum + item.totalQuantity, 0);
    const distinctBoltSpecsCount = consolidatedTotals.length;

    const warnings = [];
    if (requirements.length === 0 && !isPackageMode) {
      warnings.push('Data spesifikasi baut untuk tipe motor ini belum diisi (masih kosong).');
    } else if (requirements.length < 5 && !isPackageMode) {
      warnings.push('Data spesifikasi baut untuk motor ini belum lengkap (baru terdata sebagian).');
    }

    res.json({
      motorcycle: {
        id: motorcycle.id,
        displayName: motorcycle.displayName,
        brand: motorcycle.brand,
        model: motorcycle.model,
        variant: motorcycle.variant,
        images: motorcycle.images || [],
      },
      package: selectedPackage
        ? {
            id: selectedPackage.id,
            name: selectedPackage.name,
            packageType: selectedPackage.packageType,
          }
        : null,
      summary: {
        totalQuantity,
        distinctBoltSpecsCount,
        hasWarnings: warnings.length > 0,
        warnings,
      },
      consolidatedTotals,
      positionBreakdown,
    });
  } catch (error) {
    console.error('Error generating pick list:', error);
    res.status(500).json({ error: 'Gagal membuat daftar ambil baut otomatis.' });
  }
});

// POST /api/pick-lists/sessions
router.post('/sessions', requireAuth, async (req, res) => {
  try {
    const { motorcycleTypeId, packageId, notes, items } = req.body;
    if (!motorcycleTypeId || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Data motor dan item pick session wajib diisi.' });
    }

    const session = await prisma.pickSession.create({
      data: {
        motorcycleTypeId: parseInt(motorcycleTypeId, 10),
        packageId: packageId ? parseInt(packageId, 10) : null,
        createdBy: req.user.id,
        status: 'IN_PROGRESS',
        notes: notes ? notes.trim() : null,
        items: {
          create: items.map((item) => ({
            boltSpecId: parseInt(item.boltSpecId, 10),
            quantity: parseInt(item.quantity, 10),
            positionSummary: item.positionsSummary || item.positionSummary || '',
            checked: Boolean(item.checked),
          })),
        },
      },
      include: {
        motorcycleType: true,
        package: true,
        creator: {
          select: { id: true, username: true, name: true },
        },
        items: {
          include: { boltSpec: true },
        },
      },
    });

    await logAudit({
      userId: req.user.id,
      action: 'PICK_LIST',
      entity: 'PICK_SESSION',
      entityId: session.id,
      detail: `Membuat sesi pengambilan baut untuk: ${session.motorcycleType.displayName}`,
    });

    res.status(201).json(session);
  } catch (error) {
    console.error('Error creating pick session:', error);
    res.status(500).json({ error: 'Gagal menyimpan sesi pick-list.' });
  }
});

// GET /api/pick-lists/sessions
router.get('/sessions', requireAuth, async (req, res) => {
  try {
    const { status, limit = 20 } = req.query;
    const where = {};
    if (status) where.status = status;

    const sessions = await prisma.pickSession.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit, 10),
      include: {
        motorcycleType: true,
        package: true,
        creator: {
          select: { id: true, username: true, name: true },
        },
        _count: {
          select: { items: true },
        },
        items: {
          select: { id: true, checked: true },
        },
      },
    });

    const mapped = sessions.map((s) => {
      const totalItems = s.items.length;
      const checkedItems = s.items.filter((i) => i.checked).length;
      return {
        ...s,
        totalItems,
        checkedItems,
        progressPercent: totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0,
      };
    });

    res.json(mapped);
  } catch (error) {
    console.error('Error fetching pick sessions:', error);
    res.status(500).json({ error: 'Gagal mengambil riwayat sesi pick-list.' });
  }
});

// GET /api/pick-lists/sessions/:id
router.get('/sessions/:id', requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const session = await prisma.pickSession.findUnique({
      where: { id },
      include: {
        motorcycleType: {
          include: {
            images: {
              orderBy: [{ isPrimary: 'desc' }, { createdAt: 'desc' }],
            },
          },
        },
        package: true,
        creator: {
          select: { id: true, username: true, name: true },
        },
        items: {
          include: {
            boltSpec: {
              include: {
                images: {
                  orderBy: [{ isPrimary: 'desc' }, { createdAt: 'desc' }],
                },
              },
            },
          },
          orderBy: { id: 'asc' },
        },
      },
    });

    if (!session) {
      return res.status(404).json({ error: 'Sesi pick-list tidak ditemukan.' });
    }

    const totalItems = session.items.length;
    const checkedItems = session.items.filter((i) => i.checked).length;

    res.json({
      ...session,
      totalItems,
      checkedItems,
      progressPercent: totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0,
    });
  } catch (error) {
    console.error('Error fetching session detail:', error);
    res.status(500).json({ error: 'Gagal mengambil detail sesi pick-list.' });
  }
});

// PATCH /api/pick-lists/sessions/:id/items/:itemId
router.patch('/sessions/:id/items/:itemId', requireAuth, async (req, res) => {
  try {
    const sessionId = parseInt(req.params.id, 10);
    const itemId = parseInt(req.params.itemId, 10);
    const { checked } = req.body;

    const updatedItem = await prisma.pickSessionItem.update({
      where: { id: itemId },
      data: { checked: Boolean(checked) },
    });

    // Check if all items in session are checked
    const allItems = await prisma.pickSessionItem.findMany({
      where: { pickSessionId: sessionId },
    });

    const isAllChecked = allItems.every((item) => item.checked);
    const newStatus = isAllChecked ? 'COMPLETED' : 'IN_PROGRESS';

    await prisma.pickSession.update({
      where: { id: sessionId },
      data: { status: newStatus },
    });

    res.json({ updatedItem, sessionStatus: newStatus, isAllChecked });
  } catch (error) {
    console.error('Error updating session item:', error);
    res.status(500).json({ error: 'Gagal memperbarui status checklist item.' });
  }
});

module.exports = router;

