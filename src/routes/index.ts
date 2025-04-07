import express, { Router } from 'express';
import authentication from './authentication';
import users from './users';

const router = express.Router();

export default (): Router => {
  authentication(router);
  users(router);
  return router;
};
