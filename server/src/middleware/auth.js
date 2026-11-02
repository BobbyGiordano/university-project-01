const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const prisma = require('../db');

async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token autentikasi tidak ditemukan.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        roleId: true,
        isActive: true,
        roleRel: {
          select: {
            id: true,
            name: true,
            displayName: true,
            isSystem: true,
            permissions: {
              select: {
                permission: {
                  select: { code: true },
                },
              },
            },
          },
        },
      },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Pengguna tidak aktif atau tidak ditemukan.' });
    }

    const permissionCodes = user.role === 'ADMIN'
      ? ['*']
      : (user.roleRel?.permissions.map((rp) => rp.permission.code) || []);

    req.user = {
      ...user,
      permissionCodes,
    };

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token tidak valid atau telah kedaluwarsa.' });
  }
}

function requireRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Autentikasi diperlukan.' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Akses ditolak. Wewenang tidak mencukupi.' });
    }
    next();
  };
}

function requirePermission(permissionCode) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Autentikasi diperlukan.' });
    }
    if (
      req.user.role === 'ADMIN' ||
      req.user.permissionCodes.includes('*') ||
      req.user.permissionCodes.includes(permissionCode)
    ) {
      return next();
    }
    return res.status(403).json({ error: `Akses ditolak. Memerlukan izin: ${permissionCode}` });
  };
}

const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Autentikasi diperlukan.' });
  }
  if (
    req.user.role === 'ADMIN' ||
    req.user.permissionCodes.includes('*') ||
    req.user.permissionCodes.includes('USERS_MANAGE') ||
    req.user.permissionCodes.includes('ROLES_MANAGE')
  ) {
    return next();
  }
  return res.status(403).json({ error: 'Akses ditolak. Memerlukan hak administrator.' });
};

module.exports = {
  requireAuth,
  requireRole,
  requirePermission,
  requireAdmin,
};
