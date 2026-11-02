const express = require('express');
const prisma = require('../db');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { logAudit } = require('../middleware/audit');

const router = express.Router();

// GET /api/motorcycles
router.get('/', requireAuth, async (req, res) => {
  try {
    const { q, brand, status } = req.query;

    const where = {};
    if (status === 'active') where.isActive = true;
    if (status === 'inactive') where.isActive = false;
    if (brand) where.brand = { equals: brand, mode: 'insensitive' };

    if (q) {
      where.OR = [
        { displayName: { contains: q, mode: 'insensitive' } },
        { brand: { contains: q, mode: 'insensitive' } },
        { model: { contains: q, mode: 'insensitive' } },
        { variant: { contains: q, mode: 'insensitive' } },
      ];
    }

    const motorcycles = await prisma.motorcycleType.findMany({
      where,
      orderBy: [{ brand: 'asc' }, { model: 'asc' }, { yearStart: 'desc' }],
      include: {
        _count: {
          select: {
            requirements: true,
            packages: true,
          },
        },
      },
    });

    res.json(motorcycles);
  } catch (error) {
    console.error('Error fetching motorcycles:', error);
    res.status(500).json({ error: 'Gagal mengambil data tipe motor.' });
  }
});

// GET /api/motorcycles/:id
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const motorcycle = await prisma.motorcycleType.findUnique({
      where: { id },
      include: {
        requirements: {
          include: {
            boltPosition: true,
            boltSpec: true,
          },
          orderBy: [
            { boltPosition: { sortOrder: 'asc' } },
            { sortOrder: 'asc' },
          ],
        },
        packages: {
          include: {
            items: {
              include: { boltSpec: true },
            },
          },
        },
      },
    });

    if (!motorcycle) {
      return res.status(404).json({ error: 'Tipe motor tidak ditemukan.' });
    }

    res.json(motorcycle);
  } catch (error) {
    console.error('Error fetching motorcycle details:', error);
    res.status(500).json({ error: 'Gagal mengambil detail motor.' });
  }
});

// POST /api/motorcycles (Admin only)
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { brand, model, variant, yearStart, yearEnd, notes } = req.body;
    if (!brand || !model || !variant || !yearStart) {
      return res.status(400).json({ error: 'Merek, model, varian, dan tahun awal wajib diisi.' });
    }

    const yStart = parseInt(yearStart, 10);
    const yEnd = yearEnd ? parseInt(yearEnd, 10) : null;
    const displayName = `${brand.trim()} ${model.trim()} ${variant.trim()} (${yStart}${yEnd ? `-${yEnd}` : ''})`;

    const existing = await prisma.motorcycleType.findFirst({
      where: {
        brand: { equals: brand.trim(), mode: 'insensitive' },
        model: { equals: model.trim(), mode: 'insensitive' },
        variant: { equals: variant.trim(), mode: 'insensitive' },
        yearStart: yStart,
        yearEnd: yEnd,
      },
    });

    if (existing) {
      return res.status(400).json({ error: 'Tipe motor dengan data ini sudah terdaftar.' });
    }

    const motorcycle = await prisma.motorcycleType.create({
      data: {
        brand: brand.trim(),
        model: model.trim(),
        variant: variant.trim(),
        yearStart: yStart,
        yearEnd: yEnd,
        displayName,
        notes: notes ? notes.trim() : null,
        isActive: true,
      },
    });

    await logAudit({
      userId: req.user.id,
      action: 'CREATE',
      entity: 'MOTORCYCLE',
      entityId: motorcycle.id,
      detail: `Menambahkan motor: ${motorcycle.displayName}`,
    });

    res.status(201).json(motorcycle);
  } catch (error) {
    console.error('Error creating motorcycle:', error);
    res.status(500).json({ error: 'Gagal menambahkan motor baru.' });
  }
});

// PUT /api/motorcycles/:id (Admin only)
router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { brand, model, variant, yearStart, yearEnd, notes, isActive } = req.body;

    const yStart = parseInt(yearStart, 10);
    const yEnd = yearEnd ? parseInt(yearEnd, 10) : null;
    const displayName = `${brand.trim()} ${model.trim()} ${variant.trim()} (${yStart}${yEnd ? `-${yEnd}` : ''})`;

    const updated = await prisma.motorcycleType.update({
      where: { id },
      data: {
        brand: brand.trim(),
        model: model.trim(),
        variant: variant.trim(),
        yearStart: yStart,
        yearEnd: yEnd,
        displayName,
        notes: notes ? notes.trim() : null,
        ...(isActive !== undefined ? { isActive: Boolean(isActive) } : {}),
      },
    });

    await logAudit({
      userId: req.user.id,
      action: 'UPDATE',
      entity: 'MOTORCYCLE',
      entityId: updated.id,
      detail: `Mengubah data motor: ${updated.displayName}`,
    });

    res.json(updated);
  } catch (error) {
    console.error('Error updating motorcycle:', error);
    res.status(500).json({ error: 'Gagal memperbarui data motor.' });
  }
});

// PATCH /api/motorcycles/:id/deactivate (Admin only)
router.patch('/:id/deactivate', requireAuth, requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const motorcycle = await prisma.motorcycleType.findUnique({ where: { id } });
    if (!motorcycle) {
      return res.status(404).json({ error: 'Tipe motor tidak ditemukan.' });
    }

    const updated = await prisma.motorcycleType.update({
      where: { id },
      data: { isActive: !motorcycle.isActive },
    });

    await logAudit({
      userId: req.user.id,
      action: updated.isActive ? 'ACTIVATE' : 'DEACTIVATE',
      entity: 'MOTORCYCLE',
      entityId: id,
      detail: `${updated.isActive ? 'Mengaktifkan' : 'Menonaktifkan'} motor: ${updated.displayName}`,
    });

    res.json(updated);
  } catch (error) {
    console.error('Error toggling motorcycle active status:', error);
    res.status(500).json({ error: 'Gagal mengubah status aktif motor.' });
  }
});

module.exports = router;

