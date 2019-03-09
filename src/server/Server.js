import express from 'express';

export default class Server {
  constructor(port) {
    this.port = port;
    this.server = express();
  }

  run() {
    this.server.get('/', (req, res) => {
      res.send('Hi man!');
    });

    return this.server.listen(this.port, () => {
      console.log(`Server is listening on port ${this.port}`);
    });
  }
}