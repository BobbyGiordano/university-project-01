const prisma = require('../db');

async function logAudit({ userId, action, entity, entityId, detail }) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: userId || null,
        action,
        entity,
        entityId: entityId ? parseInt(entityId, 10) : null,
        detail: typeof detail === 'object' ? JSON.stringify(detail) : (detail || ''),
      },
    });
  } catch (err) {
    console.error('Failed to write audit log:', err.message);
  }
}

module.exports = { logAudit };

