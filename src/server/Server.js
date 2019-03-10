import express from 'express';

export default class Server {
  constructor(port, theseRepository) {
    this.port = port;
    this.server = express();
    this.theseRepository = theseRepository;
  }

  run() {
    this.server
      .use(express.json())
      .use(express.urlencoded({ extended: true }));

    this.server.get('/theses', async (req, res) => {
      const {
        limit = 10,
        page = 0,
        sortBy = 'defenseDate',
        sortType = 1,
      } = req.query;

      const params = { limit, page, sortBy, sortType };

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
    });

    this.server.post('/theses', async (req, res) => {
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
      // create -> 200 jak pomyślnie + obiekt, 403 jak nie jest w adminach
    });

    this.server.get('/theses/:theseId', (req, res) => {
      // get one by ID 200 + obiekt a jak nie ma to 404
    });

    this.server.put('/theses/:theseId', (req, res) => {
      // update -> 200 jak pomyślnie + obiekt zaś jak nie znalazło to 404 jak user nie jest w adminach to 403
    });

    this.server.delete('/theses/:theseId', (req, res) => {
      // delete -> 200 jak pomyślnie zaś jak nie znalazło to 404 jak user nie jest w adminach to 403
    });

    return this.server.listen(this.port, () => {
      console.log(`Server is listening on port ${this.port}`);
    });
  }
}