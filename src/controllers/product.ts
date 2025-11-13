import { Request, Response } from 'express';
import { httpResponse } from '../utils/httpResponse';
import prisma from '../utils/db';

export const getProducts = async (req: Request, res: Response) => {
  try {
    // Get current user from the authenticated request
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

    // Fetch all product requests with their comments and nested replies
    const productRequests = await prisma.productRequest.findMany({
      include: {
        comments: {
          where: {
            parentId: null, // Only get top-level comments
          },
          include: {
            user: {
              select: {
                image: true,
                name: true,
                username: true,
              },
            },
            replies: {
              include: {
                user: {
                  select: {
                    image: true,
                    name: true,
                    username: true,
                  },
                },
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

    // Transform the data to match the required structure
    const transformedProducts = productRequests.map((product) => ({
      id: product.id,
      title: product.title,
      description: product.description,
      ...(product.comments.length > 0 && {
        comments: product.comments.map((comment) => ({
          id: comment.id,
          title: comment.title,
          content: comment.content,
          category: comment.category,
          status: comment.status,
          upvotes: comment.upvotes,
          user: {
            image: comment.user.image || './assets/user-images/default.jpg',
            name: comment.user.name,
            username: comment.user.username,
          },
          ...(comment.replies.length > 0 && {
            replies: comment.replies.map((reply) => ({
              content: reply.content,
              replyingTo: reply.replyingTo,
              user: {
                image: reply.user.image || './assets/user-images/default.jpg',
                name: reply.user.name,
                username: reply.user.username,
              },
            })),
          }),
        })),
      }),
    }));

    const response = {
      ...(currentUser && {
        currentUser: {
          image: currentUser.image || './assets/user-images/default.jpg',
          name: currentUser.name,
          username: currentUser.username,
        },
      }),
      productRequests: transformedProducts,
    };

    return httpResponse(
      res,
      200,
      true,
      'Products fetched successfully',
      response
    );
  } catch (error) {
    console.error('Get products error:', error);
    return httpResponse(res, 500, false, 'Internal server error');
  }
};

export const getOneProduct = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    console.log('Fetching product with commentId:', commentId);

    // Get current user from the authenticated request
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

    // Fetch single product request with its comments and nested replies
    const productRequest = await prisma.productRequest.findUnique({
      where: { id: commentId },
      include: {
        comments: {
          where: {
            parentId: null, // Only get top-level comments
          },
          include: {
            user: {
              select: {
                image: true,
                name: true,
                username: true,
              },
            },
            replies: {
              include: {
                user: {
                  select: {
                    image: true,
                    name: true,
                    username: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!productRequest) {
      return httpResponse(res, 404, false, 'Product not found');
    }

    // Transform the data to match the required structure
    const transformedProduct = {
      id: productRequest.id,
      title: productRequest.title,
      description: productRequest.description,
      ...(productRequest.comments.length > 0 && {
        comments: productRequest.comments.map((comment) => ({
          id: comment.id,
          title: comment.title,
          content: comment.content,
          category: comment.category.toLowerCase(),
          upvotes: comment.upvotes,
          status: comment.status.toLowerCase().replace('_', '-'),
          user: {
            image: comment.user.image || './assets/user-images/default.jpg',
            name: comment.user.name,
            username: comment.user.username,
          },
          ...(comment.replies.length > 0 && {
            replies: comment.replies.map((reply) => ({
              content: reply.content,
              replyingTo: reply.replyingTo,
              user: {
                image: reply.user.image || './assets/user-images/default.jpg',
                name: reply.user.name,
                username: reply.user.username,
              },
            })),
          }),
        })),
      }),
    };

    const response = {
      ...(currentUser && {
        currentUser: {
          image: currentUser.image || './assets/user-images/default.jpg',
          name: currentUser.name,
          username: currentUser.username,
        },
      }),
      productRequest: transformedProduct,
    };
    return httpResponse(
      res,
      200,
      true,
      'Product fetched successfully',
      response
    );
  } catch (error) {
    console.error('Get one product error:', error);
    return httpResponse(res, 500, false, 'Internal server error');
  }
};
