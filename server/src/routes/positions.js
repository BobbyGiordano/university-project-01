const express = require('express');
const prisma = require('../db');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { logAudit } = require('../middleware/audit');

const router = express.Router();

// GET /api/positions
router.get('/', requireAuth, async (req, res) => {
  try {
    const positions = await prisma.boltPosition.findMany({
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      include: {
        _count: {
          select: { requirements: true },
        },
      },
    });
    res.json(positions);
  } catch (error) {
    console.error('Error fetching positions:', error);
    res.status(500).json({ error: 'Gagal mengambil data posisi baut.' });
  }
});

// POST /api/positions (Admin only)
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { name, category, sortOrder, notes } = req.body;
    if (!name || !category) {
      return res.status(400).json({ error: 'Nama posisi dan kategori wajib diisi.' });
    }

    const position = await prisma.boltPosition.create({
      data: {
        name: name.trim(),
        category: category.trim(),
        sortOrder: sortOrder ? parseInt(sortOrder, 10) : 0,
        notes: notes ? notes.trim() : null,
      },
    });

    await logAudit({
      userId: req.user.id,
      action: 'CREATE',
      entity: 'POSITION',
      entityId: position.id,
      detail: `Menambahkan posisi baut: ${position.name} (${position.category})`,
    });

    res.status(201).json(position);
  } catch (error) {
    console.error('Error creating position:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Nama posisi baut sudah terdaftar.' });
    }
    res.status(500).json({ error: 'Gagal menambahkan posisi baut.' });
  }
});

// PUT /api/positions/:id (Admin only)
router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { name, category, sortOrder, notes } = req.body;

    const position = await prisma.boltPosition.update({
      where: { id },
      data: {
        name: name.trim(),
        category: category.trim(),
        sortOrder: sortOrder ? parseInt(sortOrder, 10) : 0,
        notes: notes ? notes.trim() : null,
      },
    });

    await logAudit({
      userId: req.user.id,
      action: 'UPDATE',
      entity: 'POSITION',
      entityId: position.id,
      detail: `Mengubah posisi baut: ${position.name}`,
    });

    res.json(position);
  } catch (error) {
    console.error('Error updating position:', error);
    res.status(500).json({ error: 'Gagal memperbarui posisi baut.' });
  }
});

module.exports = router;

