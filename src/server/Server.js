import express from 'express';
import cors from 'cors';

export default class Server {
  constructor(port, routes) {
    this.port = port;
    this.routes = routes;
    this.server = express();
  }

  run() {
    this.server
      .use(cors({ origin: 'http://localhost:8080' }))
      .use(express.json())
      .use(express.urlencoded({ extended: true }));

    this.routes.forEach(r => r.install(this.server));

    return this.server.listen(this.port, () => {
      console.log(`Server is listening on port ${this.port}`);
    });
  }
}