const { Router } = require('express');
const { listMoviesByConditions, searchMovieName } = require('../controllers/movie');

const movieRouter = Router();

movieRouter.get('/', listMoviesByConditions);
movieRouter.get('/search', searchMovieName);

module.exports = movieRouter;
