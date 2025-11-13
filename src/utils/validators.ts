import { body, check, param, validationResult } from 'express-validator';

export const validateSignUp = () => [
  body('username')
    .notEmpty()
    .trim()
    .isString()
    .withMessage('Username is required'),
  body('email').isEmail().notEmpty().withMessage('Email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const validateLogin = () => [
  body('email').isEmail().withMessage('Email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const validateNewComment = () => [
  body('title')
    .isString()
    .notEmpty()
    .trim()
    .withMessage('Title must be provided'),
  body('content')
    .isString()
    .notEmpty()
    .trim()
    .withMessage('Content must be provided'),

  body('category')
    .optional()
    .isIn(['UI', 'UX', 'ENHANCEMENT', 'BUG', 'FEATURE'])
    .withMessage('Category must be one of UI, UX, ENHANCEMENT, BUG, FEATURE'),
];

export const validateNewReply = () => [
  body('parentCommentId')
    .isString()
    .isUUID(4)
    .notEmpty()
    .trim()
    .withMessage('Parent comment ID must be a valid UUID'),
  body('content')
    .isString()
    .notEmpty()
    .trim()
    .withMessage('Content must be provided'),
  body('replyingTo')
    .optional()
    .isString()
    .trim()
    .withMessage('ReplyingTo must be a string'),
];

export const validateUpdateProduct = () => [
  body('content').isString().optional(),
];

export const validateNewFeedback = () => [
  body('title').notEmpty().isString().trim().withMessage('title is required'),
  body('details')
    .notEmpty()
    .isString()
    .trim()
    .withMessage('details is required'),
  body('category')
    .optional()
    .isIn(['UI', 'UX', 'ENHANCEMENT', 'BUG', 'FEATURE'])
    .withMessage('Category must be one of UI, UX, ENHANCEMENT, BUG, FEATURE'),
  body('status')
    .optional()
    .isIn(['LIVE', 'PLANNED', 'IN_PROGRESS'])
    .withMessage('Status must be one of LIVE, PLANNED, IN_PROGRESS'),
];

export const validateUrl = () => [
  param('commentId')
    .notEmpty()
    .isString()
    .isUUID(4)
    .trim()
    .withMessage('commentId must be a valid uuid'),
];

export const validateReplyUrl = () => [
  param('replyId')
    .notEmpty()
    .isString()
    .isUUID(4)
    .trim()
    .withMessage('replyId must be a valid uuid'),
];

export const validateCommentUrl = () => [
  param('commentId')
    .notEmpty()
    .isString()
    .isUUID(4)
    .trim()
    .withMessage('commentId must be a valid uuid'),
];

export const validateProductUrl = () => [
  param('productId')
    .notEmpty()
    .isString()
    .isUUID(4)
    .trim()
    .withMessage('productId must be a valid uuid'),
];

export const validationError = (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() });
  }

  next();
};
