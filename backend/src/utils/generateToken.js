import jwt from 'jsonwebtoken';

/**
 * Signs a JWT for a given user id.
 * Uses HS256 algorithm by default for security.
 */
const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    algorithm: 'HS256',
  });

export default generateToken;
