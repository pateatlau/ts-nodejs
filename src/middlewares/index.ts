import express, { NextFunction, Request, Response } from 'express';
import { get, identity, merge } from 'lodash';

import { getUserBySessionToken } from '../db/users';

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sessionToken = req.cookies['sessionToken'];
    if (!sessionToken) {
      return res.status(403).send('Forbidden').end();
    }

    const existingUser = await getUserBySessionToken(sessionToken);
    if (!existingUser) {
      return res.status(403).send('Forbidden').end();
    }

    merge(req, { identity: existingUser });

    return next();
  } catch (error) {
    console.log(error);
    return res.status(403).send('Forbidden').end();
  }
};

export const isOwner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const currentUserId = get(req, 'identity._id') as string;

    if (!id) {
      return res.status(400).send('Missing required field').end();
    }

    if (!currentUserId) {
      return res.status(403).send('Forbidden').end();
    }

    return next();
  } catch (error) {
    console.log(error);
    return res.status(403).send('Forbidden').end();
  }
};
