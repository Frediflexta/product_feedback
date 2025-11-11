import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { httpResponse } from './httpResponse';
import prisma from './db';

export const hashPassword = (password) => bcrypt.hash(password, 8);

export const verifyPassword = (password, hash) =>
  bcrypt.compare(password, hash);

export const createJWT = (user) => {
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET
  );

  return token;
};

export const bouncer = async (req, res, next) => {
  const bearer = req.headers.authorization;

  if (!bearer) return httpResponse(res, 401, false, 'No bearer found');

  const [, token] = bearer.split(' ');

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);

    const validUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!validUser) return httpResponse(res, 401, false, 'User does not exist');

    req.user = user;
    next();
  } catch (error) {
    return httpResponse(res, 401, false, 'Unauthorized');
  }
};
