import nconf from 'nconf';
import Server from './server/Server';
import Mongo from './database/Mongo';
import TheseRepository from './theses/TheseRepository';
import TheseRoutes from './theses/TheseRoutes';

export default class App {
  constructor() {
    const databaseUrl = nconf.get('database');
    this.mongo = new Mongo(databaseUrl);

    const port = nconf.get('api:port') || 3001;
    const theseRepository = new TheseRepository();
    const routes = [
      new TheseRoutes(theseRepository),
    ];
    this.server = new Server(port, routes);
  }

  async run() {
    await this.mongo.run();
    await this.server.run();

    console.log('Application is ready.');
  }
}
