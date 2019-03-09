import nconf from 'nconf';
import Server from './server/Server';
import Mongo from './database/Mongo';

export default class App {
  constructor() {
    const databaseUrl = nconf.get('database');
    this.mongo = new Mongo(databaseUrl);

    const port = nconf.get('api:port') || 3001;
    this.server = new Server(port);
  }

  async run() {
    await this.mongo.run();
    await this.server.run();

    console.log('Application is ready.');
  }
}
