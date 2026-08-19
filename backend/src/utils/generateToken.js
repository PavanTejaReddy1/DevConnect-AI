import jwt from 'jsonwebtoken';

/**
 * Signs a JWT for a given user id with enhanced security
 */
const generateToken = (userId) => {
  return jwt.sign(
    { 
      id: userId,
      iat: Math.floor(Date.now() / 1000),
    }, 
    process.env.JWT_SECRET, 
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      algorithm: 'HS256',
      issuer: 'devconnect-ai',
      audience: 'devconnect-ai-users',
    }
  );
};

export default generateToken;
