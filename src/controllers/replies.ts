import { Request, Response } from 'express';
import { httpResponse } from '../utils/httpResponse';
import prisma from '../utils/db';

export const createReply = async (req: Request, res: Response) => {
  try {
    const { parentCommentId, content, replyingTo } = req.body;

    const currentUser = req.user
      ? await prisma.user.findUnique({
          where: { id: req.user.id },
          select: {
            id: true,
            image: true,
            name: true,
            username: true,
          },
        })
      : null;

    if (!currentUser) {
      return httpResponse(res, 401, false, 'Authentication required');
    }

    // Verify the parent comment exists
    const parentComment = await prisma.comment.findUnique({
      where: { id: parentCommentId },
      include: {
        productRequest: true,
      },
    });

    if (!parentComment) {
      return httpResponse(res, 404, false, 'Parent comment not found');
    }

    // Create the reply
    const newReply = await prisma.comment.create({
      data: {
        content,
        userId: currentUser.id,
        productRequestId: parentComment.productRequestId,
        parentId: parentCommentId,
        replyingTo: replyingTo || null, // Username being replied to
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
        },
      },
    });

    return httpResponse(res, 201, true, 'Reply created successfully', newReply);
  } catch (error) {
    console.error('Error creating reply:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const getRepliesForComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;

    // Verify the comment exists
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return httpResponse(res, 404, false, 'Comment not found');
    }

    // Get all replies for the comment
    const replies = await prisma.comment.findMany({
      where: {
        parentId: commentId,
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
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return httpResponse(
      res,
      200,
      true,
      'Replies retrieved successfully',
      replies
    );
  } catch (error) {
    console.error('Error getting replies:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const updateReply = async (req: Request, res: Response) => {
  try {
    const { replyId } = req.params;
    const { content } = req.body;

    const existingReply = await prisma.comment.findUnique({
      where: { id: replyId },
    });

    if (!existingReply) {
      return httpResponse(res, 404, false, 'Reply not found');
    }

    // Check if it's actually a reply (has parentId)
    if (!existingReply.parentId) {
      return httpResponse(res, 400, false, 'This is not a reply');
    }

    // Check if the current user owns the reply
    if (existingReply.userId !== req.user?.id) {
      return httpResponse(res, 403, false, 'Unauthorized to edit this reply');
    }

    const updatedReply = await prisma.comment.update({
      where: { id: replyId },
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
      },
    });

    return httpResponse(
      res,
      200,
      true,
      'Reply updated successfully',
      updatedReply
    );
  } catch (error) {
    console.error('Error updating reply:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const deleteReply = async (req: Request, res: Response) => {
  try {
    const { replyId } = req.params;

    const existingReply = await prisma.comment.findUnique({
      where: { id: replyId },
    });

    if (!existingReply) {
      return httpResponse(res, 404, false, 'Reply not found');
    }

    // Check if it's actually a reply (has parentId)
    if (!existingReply.parentId) {
      return httpResponse(res, 400, false, 'This is not a reply');
    }

    // Check if the current user owns the reply
    if (existingReply.userId !== req.user?.id) {
      return httpResponse(res, 403, false, 'Unauthorized to delete this reply');
    }

    await prisma.comment.delete({
      where: { id: replyId },
    });

    return httpResponse(res, 200, true, 'Reply deleted successfully');
  } catch (error) {
    console.error('Error deleting reply:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
