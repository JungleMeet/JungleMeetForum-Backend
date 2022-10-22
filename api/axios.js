const axios = require('axios');

const tmdbRequest = axios.create({
  baseURL: 'https://api.themoviedb.org/3/',
  method: 'get',
  params: { api_key: process.env.TMDB_KEY, language: 'en-US' },
});

const searchMovieByName = async (name) => {
  const response = await tmdbRequest(`/search/movie?query=${name}`);
  return response.data;
};

const getMoviesByCondition = async (condition) => {
  const response = await tmdbRequest(`/movie/${condition}`);
  return response.data;
};
module.exports = { searchMovieByName, getMoviesByCondition };
