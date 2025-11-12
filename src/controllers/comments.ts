import { Request, Response } from 'express';
import { httpResponse } from '../utils/httpResponse';
import prisma from '../utils/db';

export const createComment = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const { content } = req.body;

    const currentUser = req.user
      ? await prisma.user.findUnique({
          where: { id: req.user.id },
          select: {
            image: true,
            name: true,
            username: true,
          },
        })
      : null;

    // TODO: Add your database logic here to:
    // 1. Verify the product exists
    // 2. Get current user from auth middleware
    // 3. Create the comment/reply in database
    // 4. Return the updated product with comments
    const productExists = await prisma.productRequest.findUnique({
      where: { id: productId },
    });

    if (!productExists) httpResponse(res, 404, false, 'Product not found');

    const newComment = await prisma.comment.create({
      data: {
        content,
        productRequestId: productId,
        userId: currentUser ? req.user.id : null,
        parentId: null,
        replyingTo: null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    return httpResponse(
      res,
      201,
      true,
      'Comment created successfully',
      newComment
    );
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const updateComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    console.log({ commentId, content });

    const existingComment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!existingComment) {
      return httpResponse(res, 404, false, 'Comment not found');
    }

    // Check if the current user owns the comment
    if (existingComment.userId !== req.user?.id) {
      return httpResponse(res, 403, false, 'Unauthorized to edit this comment');
    }

    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: { content },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    return httpResponse(
      res,
      200,
      true,
      'Comment updated successfully',
      updatedComment
    );
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;

    const existingComment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!existingComment) {
      return httpResponse(res, 404, false, 'Comment not found');
    }

    // Check if the current user owns the comment
    if (existingComment.userId !== req.user?.id) {
      return httpResponse(
        res,
        403,
        false,
        'Unauthorized to delete this comment'
      );
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });

    return httpResponse(res, 200, true, 'Comment deleted successfully');
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const getCommentsForProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    // Verify the product exists
    const product = await prisma.productRequest.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return httpResponse(res, 404, false, 'Product not found');
    }

    // Get all top-level comments (not replies) for the product with their replies
    const comments = await prisma.comment.findMany({
      where: {
        productRequestId: productId,
        parentId: null, // Only top-level comments
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return httpResponse(
      res,
      200,
      true,
      'Comments retrieved successfully',
      comments
    );
  } catch (error) {
    console.error('Error getting comments:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
