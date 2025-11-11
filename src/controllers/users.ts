import { Request, Response } from 'express';
import { httpResponse } from '../utils/httpResponse';
import { verifyPassword, createJWT } from '../utils/auth';
import prisma from '../utils/db';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return httpResponse(res, 404, false, 'User does not exist');
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      return httpResponse(res, 401, false, 'Invalid password');
    }

    // Create JWT token
    const token = createJWT(user);

    // Return success response with token and user data (excluding password)
    const { password: _, ...userWithoutPassword } = user;

    return httpResponse(res, 200, true, 'Login successful', {
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    return httpResponse(res, 500, false, 'Internal server error');
  }
};
