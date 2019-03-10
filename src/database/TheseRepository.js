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

  getByParams({ limit, page, sortBy, sortType }) {
    return this.getModel()
      .find({})
      .sort({
        [sortBy]: sortType,
      })
      .skip(+page * +limit)
      .limit(+limit)
      .exec();
  }

  getCountBySurnameNameAndDefenseDate(surname, name, defenseDate) {
    return this.getModel()
      .countDocuments({ surname, name, defenseDate })
      .exec();
  }
}
