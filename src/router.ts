import Router from 'express';
import { getProducts, getOneProduct } from './controllers/product';
import {
  validateNewComment,
  validateNewReply,
  validateUpdateProduct,
  validateUrl,
  validateReplyUrl,
  validationError,
} from './utils/validators';
import {
  createComment,
  updateComment,
  deleteComment,
  getCommentsForProduct,
} from './controllers/comments';
import {
  createReply,
  getRepliesForComment,
  updateReply,
  deleteReply,
} from './controllers/replies';

const router = Router();

router.post(
  '/comments/:productId',
  validateUrl('productId'),
  validateNewComment(),
  validationError,
  createComment
);

router.get('/comments', getProducts);

// Get comments for a specific product
router.get(
  '/products/:productId/comments',
  validateUrl('productId'),
  validationError,
  getCommentsForProduct
);

router.get(
  '/comments/:commentId',
  validateUrl('commentId'),
  validateUpdateProduct(),
  validationError,
  getOneProduct
);

router.put(
  '/comments/:commentId',
  validateUrl('commentId'),
  validateUpdateProduct(),
  validationError,
  updateComment
);

router.delete(
  '/comments/:commentId',
  validateUrl('commentId'),
  validationError,
  deleteComment
);

// Reply routes
router.post('/replies', validateNewReply(), validationError, createReply);
router.get(
  '/comments/:commentId/replies',
  validateUrl('commentId'),
  validationError,
  getRepliesForComment
);
router.put(
  '/replies/:replyId',
  validateReplyUrl(),
  validateUpdateProduct(),
  validationError,
  updateReply
);
router.delete(
  '/replies/:replyId',
  validateReplyUrl(),
  validationError,
  deleteReply
);

export default router;
