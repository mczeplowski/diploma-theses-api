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

  getByParams({ limit, page, searchBy, searchPhrase, sortBy, sortType }) {
    return this.getModel()
      .find(searchBy ? { [searchBy]: searchPhrase } : {})
      .sort({
        [sortBy]: sortType,
      })
      .skip(page * limit)
      .limit(limit)
      .exec();
  }

  getCountBySurnameNameAndDefenseDate(surname, name, defenseDate) {
    return this.getModel()
      .countDocuments({ surname, name, defenseDate })
      .exec();
  }

  updateById(id, updatedThese) {
    return this.getModel()
      .findByIdAndUpdate(id, updatedThese, { new: true })
      .exec();
  }

  removeById(id) {
    return this.getModel()
      .findByIdAndRemove(id)
      .exec();
  }

  getCount({ searchBy, searchPhrase }) {
    return this.getModel()
      .find(searchBy ? { [searchBy]: searchPhrase } : {})
      .count()
      .exec();
  }
}
