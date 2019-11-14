import express from 'express';
import http from 'http';
import cors from 'cors';

import api from '../routes/api';
import home from '../routes/home';

const app = express();
const server = http.createServer(app);

const setupApp = () => {
  // By default, this is a RESTFul service and
  // therefore communicates using JSON. There is also no
  // 'additional' security such as tokens, etc.
  app.use((req, res, next) => {
    res
      .type('application/json');

    next();
  });

  app.use(cors());
  // We don't accept this type of data right now.
  // app.use(express.json());
  // app.use(express.urlencoded({ extended: true }));

  app.use('/favicon.ico', (req, res) => {
    return res.sendStatus(204);
  });

  app.use('/', home);
  app.use('/api', api);

  // Invalid route / Error
  // Todo: better errors.
  app.use((req, res, next) => next(new Error(404)));
  app.use((err, req, res) => res.sendStatus(500));

  return app;
};

export default function createServer() {
  setupApp();

  return server;
}
