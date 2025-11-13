import Router from 'express';
import { getProducts, getOneProduct } from './controllers/product';
import {
  validateNewFeedback,
  validateNewComment,
  validateNewReply,
  validateUpdateProduct,
  validateUrl,
  validateReplyUrl,
  validateCommentUrl,
  validateProductUrl,
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

// TODO: CRUD products
router.post(
  '/comments/:productId',
  validateProductUrl(),
  validateNewComment(),
  validationError,
  createComment
);

router.get('/comments', getProducts);

// Get comments for a specific product
router.get(
  '/products/:productId/comments',
  validateProductUrl(),
  validationError,
  getCommentsForProduct
);

router.get(
  '/comments/:commentId',
  validateUrl(),
  validateUpdateProduct(),
  validationError,
  getOneProduct
);

router.put(
  '/comments/:commentId',
  validateUrl(),
  validateUpdateProduct(),
  validationError,
  updateComment
);

router.delete(
  '/comments/:commentId',
  validateUrl(),
  validationError,
  deleteComment
);

// Reply routes
router.post('/replies', validateNewReply(), validationError, createReply);
router.get(
  '/comments/:commentId/replies',
  validateCommentUrl(),
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

// TODO: CRUD feedback and feedback comments and upvote
// router.post(
//   '/products/:id/feedback',
//   validateUrl(),
//   validateNewFeedback(),
//   validationError,
//   createNewFeedback
// );

export default router;
