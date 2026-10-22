const crypto = require('crypto');

/**
 * Hash a plain text password using PBKDF2 with SHA-512 and a random 16-byte salt.
 * Output format: "salt:hash"
 */
function hashPassword(password, existingSalt = null) {
  if (!password || typeof password !== 'string') {
    throw new Error('Password must be a non-empty string');
  }
  const salt = existingSalt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Verify a plain text password against a stored salt:hash string.
 * Supports legacy plain text password migration gracefully.
 */
function verifyPassword(password, storedHash) {
  if (!password || !storedHash) return false;
  if (!storedHash.includes(':')) {
    // Migration fallback for legacy plain text passwords
    return password === storedHash;
  }
  const [salt, originalHash] = storedHash.split(':');
  if (!salt || !originalHash) return false;
  const newHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(newHash, 'hex'), Buffer.from(originalHash, 'hex'));
  } catch (e) {
    return false;
  }
}

/**
 * Generate default user accounts (Owner + Staff)
 */
function getDefaultUsers() {
  const initialOwnerPass = process.env.ADMIN_PASSWORD || 'husenonlinemarketing1234';
  const initialStaffPass = 'staff1234';

  return [
    {
      id: 'usr-owner',
      username: 'owner',
      name: 'Store Owner (ሁሴን)',
      role: 'owner',
      passwordHash: hashPassword(initialOwnerPass)
    },
    {
      id: 'usr-staff',
      username: 'staff',
      name: 'Staff Member',
      role: 'staff',
      passwordHash: hashPassword(initialStaffPass)
    }
  ];
}

/**
 * Sanitize user object for client consumption (strip passwordHash)
 */
function sanitizeUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    username: user.username,
    name: user.name,
    role: user.role
  };
}

module.exports = {
  hashPassword,
  verifyPassword,
  getDefaultUsers,
  sanitizeUser
};
