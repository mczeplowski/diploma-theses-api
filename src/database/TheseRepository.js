import These from './TheseModel';

export default class TheseRepository {
  constructor() {
    this.model = These;
  }

  getModel() {
    return this.model;
  }

  create(these) {
    return this.getModel()
      .create(these);
  }

  getById(id) {
    return this.getModel()
      .findById(id)
      .exec();
  }

  getAll() {
    return this.getModel()
      .find()
      .exec();
  }
}
