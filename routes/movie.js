const { Router } = require('express');
const { listMoviesByConditions } = require('../controllers/movie');

const movieRouter = Router();

movieRouter.get('/', listMoviesByConditions);

module.exports = movieRouter;
