const { Router } = require('express');
const {
  listMoviesByTag,
  searchMovieName,
  getMovieDetails,
  getTopRatedMovies,
} = require('../controllers/movie');

const movieRouter = Router();

movieRouter.get('/list', listMoviesByTag);
movieRouter.get('/search', searchMovieName);
movieRouter.get('/tops', getTopRatedMovies);
movieRouter.get('/details/:resourceId', getMovieDetails);

module.exports = movieRouter;
