export default class TheseRoutes {
  constructor(theseRepository) {
    this.theseRepository = theseRepository;
  }

  install(server) {
    server.get('/theses', this.getAll.bind(this));
    server.post('/theses', this.create.bind(this));
    server.get('/theses/:theseId', this.getOne.bind(this));
    server.put('/theses/:theseId', this.update.bind(this));
    server.delete('/theses/:theseId', this.remove.bind(this));
  }

  async getAll (req, res) {
    const {
      limit = 10,
      page = 0,
      sortBy = 'defenseDate',
      sortType = 1,
    } = req.query;

    const params = {
      limit: +limit,
      page: +page,
      sortBy,
      sortType,
    };

    let theses = [];
    try {
      theses = await this.theseRepository.getByParams(params);
    } catch (e) {
      return res
        .status(500)
        .send(`Internal Server Error (${e.message})`);
    }

    const response = {
      theses,
      limit,
      page,
    };

    return res
      .status(200)
      .send(response);
  }

  async create (req, res) {
    // add 403 -> notAdmin
    const { surname, name, topic, promoter, reviewer, studies, field, specialty, defenseDate: date } = req.body;
    const defenseDate = typeof date === 'string' ? new Date(date) : date;

    let thesesCount = null;
    try {
      thesesCount = await this.theseRepository.getCountBySurnameNameAndDefenseDate(surname, name, defenseDate);
    } catch (e) {
      return res
        .status(500)
        .send(`Internal Server Error (${e.message})`);
    }

    if (!!thesesCount) {
      return res
        .status(409)
        .send('These already exist');
    }

    let these = null;

    try {
      these = await this.theseRepository.create({
        surname,
        name,
        topic,
        promoter,
        reviewer,
        studies,
        field,
        specialty,
        defenseDate,
      });
    } catch (e) {
      return res
        .status(500)
        .send(`Internal Server Error (${e.message})`);
    }

    return res
      .status(200)
      .send({ these });
  }

  async getOne(req, res) {
    const { theseId } = req.params;

    let these = null;

    try {
      these = await this.theseRepository.getById(theseId);
    } catch (e) {
      return res
        .status(500)
        .send(`Internal Server Error (${e.message})`);
    }

    if (!these) {
      return res
        .status(404)
        .send('These does not exits');
    }

    return res
      .status(200)
      .send({ these });
  }

  async update(req, res) {
    // add 403 -> notAdmin
    const { theseId } = req.params;
    const { these } = req.body;

    let updatedThese = null;

    try {
      updatedThese = await this.theseRepository.updateById(theseId, these);
    } catch (e) {
      return res
        .status(500)
        .send(`Internal Server Error (${e.message})`);
    }

    return res
      .status(200)
      .send({ these: updatedThese });

  }

  async remove(req, res) {
    // add 403 -> notAdmin
    const { theseId } = req.params;

    try {
      await this.theseRepository.removeById(theseId);
    } catch (e) {
      return res
        .status(500)
        .send(`Internal Server Error (${e.message})`);
    }

    return res
      .status(200)
      .send();
  }
}