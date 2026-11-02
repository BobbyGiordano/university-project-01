const express = require('express');
const prisma = require('../db');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { logAudit } = require('../middleware/audit');

const router = express.Router();

// GET /api/packages
router.get('/', requireAuth, async (req, res) => {
  try {
    const { motorcycle_id } = req.query;
    const where = {};
    if (motorcycle_id) {
      where.motorcycleTypeId = parseInt(motorcycle_id, 10);
    }

    const packages = await prisma.package.findMany({
      where,
      include: {
        motorcycleType: {
          select: { id: true, displayName: true, brand: true, model: true },
        },
        items: {
          include: {
            boltSpec: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(packages);
  } catch (error) {
    console.error('Error fetching packages:', error);
    res.status(500).json({ error: 'Gagal mengambil data paket bundling.' });
  }
});

// GET /api/packages/:id/items
router.get('/:id/items', requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const pkg = await prisma.package.findUnique({
      where: { id },
      include: {
        motorcycleType: true,
        items: {
          include: {
            boltSpec: true,
          },
        },
      },
    });

    if (!pkg) {
      return res.status(404).json({ error: 'Paket bundling tidak ditemukan.' });
    }

    res.json(pkg);
  } catch (error) {
    console.error('Error fetching package items:', error);
    res.status(500).json({ error: 'Gagal mengambil rincian paket.' });
  }
});

// POST /api/packages (Admin only)
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { motorcycleTypeId, packageType, name, description, items } = req.body;
    if (!motorcycleTypeId || !packageType || !name || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Data paket dan rincian item wajib diisi.' });
    }

    const pkg = await prisma.package.create({
      data: {
        motorcycleTypeId: parseInt(motorcycleTypeId, 10),
        packageType,
        name: name.trim(),
        description: description ? description.trim() : null,
        items: {
          create: items.map((item) => ({
            boltSpecId: parseInt(item.boltSpecId, 10),
            quantity: parseInt(item.quantity, 10),
            emblemNote: item.emblemNote ? item.emblemNote.trim() : null,
          })),
        },
      },
      include: {
        items: {
          include: { boltSpec: true },
        },
      },
    });

    await logAudit({
      userId: req.user.id,
      action: 'CREATE',
      entity: 'PACKAGE',
      entityId: pkg.id,
      detail: `Membuat paket bundling: ${pkg.name}`,
    });

    res.status(201).json(pkg);
  } catch (error) {
    console.error('Error creating package:', error);
    res.status(500).json({ error: 'Gagal membuat paket bundling baru.' });
  }
});

module.exports = router;

