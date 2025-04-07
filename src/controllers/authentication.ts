import express, { Request, Response } from 'express';

import { createUser, getUserByEmail } from '../db/users';
import { authentication, random } from '../helpers';

export const register = async (req: Request, res: Response) => {
  try {
    console.log('Registering user');

    const { email, password, username } = req.body;
    if (!email || !password || !username) {
      return res
        .send(400)
        .send(
          'Missing required fields - username, email and password values must be given'
        )
        .end();
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      console.log(existingUser);
      return res.status(400).send('User already exists').end();
    }

    const salt = random();
    const user = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    console.log('Logging in user');
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send('Missing required fields').end();
    }

    const user = await getUserByEmail(email).select(
      '+authentication.salt +authentication.password'
    );
    if (!user) {
      return res.status(400).send('User not found').end();
    }

    const hashedPassword = authentication(user.authentication.salt, password);
    if (hashedPassword !== user.authentication.password) {
      return res.status(403).send('Invalid password').end();
    }

    // Generate sessionToken
    const salt = random();
    const sessionToken = authentication(salt, user._id.toString());
    user.authentication.sessionToken = sessionToken;
    await user.save();
    // Set sessionToken in cookie
    res.cookie('sessionToken', sessionToken, {
      domain: 'localhost',
      path: '/',
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
