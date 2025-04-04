import express, { Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();
const HELLO = 'Hello Typescript NodeJS!!!';

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get('/', (req: Request, res: Response) => {
  console.log('GET Request received in / route');
  res.send(HELLO);
});

console.log(HELLO);
