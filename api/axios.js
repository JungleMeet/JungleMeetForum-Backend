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

const getMoviesByTag = async (condition) => {
  const response = await tmdbRequest(`/movie/${condition}`);
  return response.data;
};

const getMovieById = async (movieId) => {
  const response = await tmdbRequest(`/movie/${movieId}`);
  return response.data;
};

const getCastByMovieId = async (movieId) => {
  const response = await tmdbRequest(`/movie/${movieId}/credits`);
  return response.data;
};

const getMoviesByTopRated = async () => {
  const response = await tmdbRequest(`/movie/top_rated`);
  return response.data;
};

const getVideoById = async (movieId) => {
  const response = await tmdbRequest(`/movie/${movieId}/videos`);
  return response.data;
};

const getYoutubeLinkById = async (id) => {
  const data = await getVideoById(id);
  const youtubeId = data.results[0].key;
  const youtubeLink = `https://www.youtube.com/embed/${youtubeId}`;

  return youtubeLink;
};

module.exports = {
  searchMovieByName,
  getMoviesByTag,
  getMovieById,
  getCastByMovieId,
  getMoviesByTopRated,
  getVideoById,
  getYoutubeLinkById,
};
