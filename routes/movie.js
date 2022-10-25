const { Router } = require('express');
const { listMoviesByTag, searchMovieName, getMovieDetails } = require('../controllers/movie');

const movieRouter = Router();

movieRouter.get('/list', listMoviesByTag);
movieRouter.get('/search', searchMovieName);
movieRouter.get('/details/:resourceId', getMovieDetails);


module.exports = movieRouter;
