const express = require('express');
const prisma = require('../db');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { logAudit } = require('../middleware/audit');

const router = express.Router();

// GET /api/bolt-specs
router.get('/', requireAuth, async (req, res) => {
  try {
    const { q, finish, headType } = req.query;

    const where = {};
    if (finish) where.finish = { equals: finish, mode: 'insensitive' };
    if (headType) where.headType = { equals: headType, mode: 'insensitive' };
    if (q) {
      where.OR = [
        { code: { contains: q, mode: 'insensitive' } },
        { headType: { contains: q, mode: 'insensitive' } },
        { notes: { contains: q, mode: 'insensitive' } },
      ];
    }

    const specs = await prisma.boltSpec.findMany({
      where,
      orderBy: [{ diameterMm: 'asc' }, { lengthMm: 'asc' }, { code: 'asc' }],
      include: {
        _count: {
          select: { requirements: true, packageItems: true },
        },
      },
    });

    res.json(specs);
  } catch (error) {
    console.error('Error fetching bolt specs:', error);
    res.status(500).json({ error: 'Gagal mengambil spesifikasi baut.' });
  }
});

// POST /api/bolt-specs (Admin only)
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { code, diameterMm, lengthMm, headType, threadPitch, material, finish, notes } = req.body;
    if (!code || diameterMm === undefined || lengthMm === undefined || !headType) {
      return res.status(400).json({ error: 'Kode, diameter, panjang, dan tipe kepala baut wajib diisi.' });
    }

    const spec = await prisma.boltSpec.create({
      data: {
        code: code.trim().toUpperCase(),
        diameterMm: parseFloat(diameterMm),
        lengthMm: parseFloat(lengthMm),
        headType: headType.trim(),
        threadPitch: threadPitch ? threadPitch.trim() : null,
        material: material ? material.trim() : 'Titanium Gr5',
        finish: finish ? finish.trim() : 'Glossy',
        notes: notes ? notes.trim() : null,
      },
    });

    await logAudit({
      userId: req.user.id,
      action: 'CREATE',
      entity: 'BOLT_SPEC',
      entityId: spec.id,
      detail: `Menambahkan spesifikasi baut: ${spec.code}`,
    });

    res.status(201).json(spec);
  } catch (error) {
    console.error('Error creating bolt spec:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Kode spesifikasi baut sudah terdaftar.' });
    }
    res.status(500).json({ error: 'Gagal menambahkan spesifikasi baut.' });
  }
});

// PUT /api/bolt-specs/:id (Admin only)
router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { code, diameterMm, lengthMm, headType, threadPitch, material, finish, notes } = req.body;

    const spec = await prisma.boltSpec.update({
      where: { id },
      data: {
        code: code ? code.trim().toUpperCase() : undefined,
        diameterMm: diameterMm !== undefined ? parseFloat(diameterMm) : undefined,
        lengthMm: lengthMm !== undefined ? parseFloat(lengthMm) : undefined,
        headType: headType ? headType.trim() : undefined,
        threadPitch: threadPitch !== undefined ? (threadPitch ? threadPitch.trim() : null) : undefined,
        material: material ? material.trim() : undefined,
        finish: finish ? finish.trim() : undefined,
        notes: notes !== undefined ? (notes ? notes.trim() : null) : undefined,
      },
    });

    await logAudit({
      userId: req.user.id,
      action: 'UPDATE',
      entity: 'BOLT_SPEC',
      entityId: spec.id,
      detail: `Mengubah spesifikasi baut: ${spec.code}`,
    });

    res.json(spec);
  } catch (error) {
    console.error('Error updating bolt spec:', error);
    res.status(500).json({ error: 'Gagal memperbarui spesifikasi baut.' });
  }
});

module.exports = router;

