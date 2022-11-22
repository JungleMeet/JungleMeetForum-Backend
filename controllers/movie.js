const { StatusCodes } = require('http-status-codes');
const {
  formatMovieData,
  formatMovieDetailData,
  formatMovieCastandCrew,
  formatTopRatedMovie,
  formatMovieDataForSearch,
} = require('../utils/formatMovieData');
const {
  getMoviesByTag,
  searchMovieByName,
  getMovieById,
  getCastByMovieId,
  getMoviesByTopRated,
  getVideoById,
  getMovieListByCondition,
} = require('../api/axios');
const Post = require('../models/Post');

const listMoviesByTag = async (req, res) => {
  const acceptedConditions = ['popular', 'top_rated', 'now_playing', 'upcoming'];
  const { tag, page } = req.query;
  if (!acceptedConditions.includes(tag))
    return res.status(StatusCodes.BAD_REQUEST).json({ message: 'query type is not supported' });

  const { results } = await getMoviesByTag(tag, page);
  const processedResults = [];
  for (let i = 0; i < results.length; i += 1) {
    processedResults.push(formatMovieData(results[i]));
  }

  return res.status(StatusCodes.OK).json(processedResults);
};

const searchMovieName = async (req, res) => {
  try {
    const { name, page } = req.query;
    if (!name)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'must provide a key word for searching' });
    const { results } = await searchMovieByName(name, page);
    const filterResults = results.filter((entry) => entry.original_language === 'en');
    const processedResults = [];
    for (let i = 0; i < filterResults.length; i += 1) {
      processedResults.push(formatMovieDataForSearch(filterResults[i]));
    }
    return res.json(processedResults);
  } catch (error) {
    return res.json(error);
  }
};

const getMovieDetails = async (req, res) => {
  try {
    const { postId } = req.params;
    if (!postId)
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'must provide a valid post id' });
    const post = await Post.findById(postId);
    const result = await Promise.all([
      getMovieById(post.resourceId),
      getCastByMovieId(post.resourceId),
    ]);
    const details = formatMovieDetailData(result[0]);
    const castsAndCrews = formatMovieCastandCrew(result[1]);
    const allMovieDetails = { ...details, ...castsAndCrews };
    return res.json(allMovieDetails);
  } catch (err) {
    return res.json(err);
  }
};

const getTopRatedMovies = async (req, res) => {
  try {
    const { results } = await getMoviesByTopRated();
    const processedResults = [];
    for (let i = 0; i <= 5; i += 1) {
      processedResults.push(formatTopRatedMovie(results[i]));
    }

    return res.status(StatusCodes.OK).json(processedResults);
  } catch (err) {
    return res.json(err);
  }
};

const getMovidTrailerbyId = async (req, res) => {
  const { resourceId } = req.params;
  if (!resourceId)
    return res.status(StatusCodes.BAD_REQUEST).json({ message: 'must provide a valid movie id' });

  try {
    const { results } = await getVideoById(resourceId);
    const filteredData = results.filter((i) => i.type === 'Trailer');

    const youtubeId = filteredData[0].key;
    const youtubeLink = `https://www.youtube.com/embed/${youtubeId}`;

    return res.status(StatusCodes.OK).json(youtubeLink);
  } catch (err) {
    return res.json(err);
  }
};

const getMoviesByCondition = async (req, res) => {
  const { year, genre, sortBy, page } = req.query;
  try {
    const { results } = await getMovieListByCondition(year, genre, sortBy, page);
    const filterResults = results.filter((filter) => filter.poster_path !== null);
    const movies = filterResults.map((result) => formatMovieData(result));
    return res.status(StatusCodes.OK).json(movies);
  } catch (err) {
    return res.json(err);
  }
};

module.exports = {
  listMoviesByTag,
  searchMovieName,
  getMovieDetails,
  getTopRatedMovies,
  getMovidTrailerbyId,
  getMoviesByCondition,
};
