import { validationResult } from 'express-validator';

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

// Sanitize user input to prevent XSS
export const sanitizeInput = (req, res, next) => {
  if (req.body) {
    const sanitizeString = (str) => {
      if (typeof str !== 'string') return str;
      return str
        .replace(/[<>]/g, '')
        .trim();
    };

    const sanitizeObject = (obj) => {
      const sanitized = {};
      for (const key in obj) {
        if (typeof obj[key] === 'string') {
          sanitized[key] = sanitizeString(obj[key]);
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          sanitized[key] = sanitizeObject(obj[key]);
        } else {
          sanitized[key] = obj[key];
        }
      }
      return sanitized;
    };

    req.body = sanitizeObject(req.body);
  }
  next();
};
