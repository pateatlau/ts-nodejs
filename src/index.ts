import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import http from 'http';

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors({ credentials: true}));
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const server = http.createServer(app);
server.timeout = 0; // Disable timeout
server.keepAliveTimeout = 0; // Disable keep-alive timeout
server.headersTimeout = 0; // Disable headers timeout
server.setTimeout(0); // Disable server timeout

const HELLO = 'Hello Typescript NodeJS!!!';

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get('/', (req: Request, res: Response) => {
  console.log('GET Request received in / route');
  res.send(HELLO);
});

console.log(HELLO);
