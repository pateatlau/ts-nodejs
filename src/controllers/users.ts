import express from 'express';

import { deleteUserById, getUserById, getUsers } from '../db/users';

export const getAllUsers = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const users = await getUsers();

    return res.status(200).json(users).end();
  } catch (error) {
    console.log(error);
    return res.status(400).send('Error fetching users').end();
  }
};

export const deleteUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).send('Missing required field').end();
    }

    const deletedUser = await deleteUserById(id);
    if (!deletedUser) {
      return res.status(400).send('User not found').end();
    }

    return res.status(200).json(deletedUser).end();
  } catch (error) {
    console.log(error);
    return res.status(400).send('Error deleting user').end();
  }
};

export const updateUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).send('Id missing').end();
    }

    const { userName } = req.body;
    if (!userName) {
      return res.status(400).send('Username missing').end();
    }

    const user = await getUserById(id);
    if (!user) {
      return res.status(400).send('User not found').end();
    }

    user.username = userName;
    await user.save();
    const updatedUser = await getUserById(id);

    return res.status(200).json(updatedUser).end();
  } catch (error) {
    console.log(error);
    return res.status(400).send('Error deleting user').end();
  }
};
