const { Router } = require('express');
const {
  listMoviesByTag,
  searchMovieName,
  getMovieDetails,
  getTopRatedMovies,
  getMovidTrailerbyId,
  getMoviesByCondition,
} = require('../controllers/movie');

const movieRouter = Router();

movieRouter.get('/list', listMoviesByTag);
movieRouter.get('/search', searchMovieName);
movieRouter.get('/tops', getTopRatedMovies);
movieRouter.get('/trailers/:resourceId', getMovidTrailerbyId);
movieRouter.get('/details/:postId', getMovieDetails);
movieRouter.get('/allMovies', getMoviesByCondition);

module.exports = movieRouter;
