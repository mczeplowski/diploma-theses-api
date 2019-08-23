import nconf from 'nconf';
import jwt from 'jsonwebtoken';

export default class TheseRoutes {
  constructor(theseRepository) {
    this.theseRepository = theseRepository;
    this.jwtSecret = nconf.get('jwt:secret');
    this.admins = nconf.get('admins').split(',');
  }

  install(server) {
    server.get('/theses', this.getAll.bind(this));
    server.post('/theses', this.authorize.bind(this), this.create.bind(this));
    server.get('/theses/:theseId', this.getOne.bind(this));
    server.put('/theses/:theseId', this.authorize.bind(this), this.update.bind(this));
    server.delete('/theses/:theseId', this.authorize.bind(this), this.remove.bind(this));
  }

  authorize(req, res, next) {
    const { authorization } = req.headers;
    const authorizationParts = authorization.split(' ');
    const token = authorizationParts[0] === 'Bearer' ? authorizationParts[1] : null;

    const sendUnauthorizedRes = res => res.status(401).json({ message: '401 Unauthorized'});

    if (!token) {
      return sendUnauthorizedRes(res);
    }

    let decodedToken = null;

    try {
      decodedToken = jwt.verify(token, this.jwtSecret)
    } catch (e) {
      return sendUnauthorizedRes(res);
    }

    if (!this.admins.includes(decodedToken.googleId)) {
      return sendUnauthorizedRes(res);
    }

    return next();
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
        .json({ message: `Internal Server Error (${e.message})` });
    }

    const response = {
      theses,
      limit,
      page,
    };

    return res
      .status(200)
      .json(response);
  }

  async create (req, res) {
    const { surname, name, topic, promoter, reviewer, studies, field, specialty, defenseDate: date } = req.body;
    const defenseDate = typeof date === 'string' ? new Date(date) : date;

    let thesesCount = null;
    try {
      thesesCount = await this.theseRepository.getCountBySurnameNameAndDefenseDate(surname, name, defenseDate);
    } catch (e) {
      return res
        .status(500)
        .json({ message: `Internal Server Error (${e.message})` });
    }

    if (!!thesesCount) {
      return res
        .status(409)
        .json({ message: 'These already exist' });
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
        .json({ message: `Internal Server Error (${e.message})` });
    }

    return res
      .status(200)
      .json({ these });
  }

  async getOne(req, res) {
    const { theseId } = req.params;

    let these = null;

    try {
      these = await this.theseRepository.getById(theseId);
    } catch (e) {
      return res
        .status(500)
        .json({ message: `Internal Server Error (${e.message})` });
    }

    if (!these) {
      return res
        .status(404)
        .json({ message: 'These does not exits' });
    }

    return res
      .status(200)
      .json({ these });
  }

  async update(req, res) {
    const { theseId } = req.params;
    const { these } = req.body;

    let updatedThese = null;

    try {
      updatedThese = await this.theseRepository.updateById(theseId, these);
    } catch (e) {
      return res
        .status(500)
        .json({ message: `Internal Server Error (${e.message})` });
    }

    return res
      .status(200)
      .json({ these: updatedThese });

  }

  async remove(req, res) {
    const { theseId } = req.params;

    try {
      await this.theseRepository.removeById(theseId);
    } catch (e) {
      return res
        .status(500)
        .json({ message: `Internal Server Error (${e.message})` });
    }

    return res
      .status(200)
      .json();
  }
}