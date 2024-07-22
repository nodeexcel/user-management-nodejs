import express from 'express';
import * as bodyParser from 'body-parser';
import DBConnection from './db';
import { mongo, Mongoose } from 'mongoose';

/*
 * Creating Express App
 * Use HTTP Interceptor -> For Auth
 * Use Routes
 * Listen to bad requests and handle response
 * Conncting to DB
 * Start Server
 *
 */
export class Server {
  app: express.Application = express();
  db: DBConnection;
  usersRoutes: UserRoutes = new UserRoutes();


  constructor() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(Interceptors.httpInterceptor);

    this.constructRoutes();
    this.handleBadRequests();
    this.app.use(erroHandler);

    this.startServer();
  }

  constructRoutes() {
    this.app.get('/', (req, res) => {
      res.send('Welcome to Main Page');
    });
  }

  handleBadRequests() {
    this.app.all('*', (req, res) => {
      throw new Error('Page Not Found Error 404');
    });
  }

  startServer() {
    const PORT = Number(process.env.PORT) || 8082;
    const HOST = process.env.HOST || 'localhost';

    this.db = new DBConnection();

    this.db.connection.once('open', async () => {
      console.log('DB Connected');



      // Start Server :)
      this.app.listen(PORT, HOST, () => {
        console.log(`Server Works on host ${HOST} and port ${PORT} `);
      });
    });
  }
}
