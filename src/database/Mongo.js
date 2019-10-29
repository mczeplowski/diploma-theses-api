import mongoose from 'mongoose';

export default class Mongo {
  constructor(databaseUrl) {
    this.databaseUrl = databaseUrl;
  }

  run() {
    console.log('Conecting with Mongo...');
    const options = { useNewUrlParser: true, useUnifiedTopology: true };
    return mongoose.connect(this.databaseUrl, options)
      .then(() => {
        console.log('Successful connect with Mongo');
      })
      .catch((e) => {
        console.error('Unable connect with Mongo', JSON.stringify(e));
        process.exit(1);
      });

  }
}