const { StatusCodes } = require('http-status-codes');
const {
  formatMovieData,
  formatMovieDetailData,
  formatMovieCastandCrew,
  formatTopRatedMovie,
} = require('../utils/formatMovieData');
const {
  getMoviesByTag,
  searchMovieByName,
  getMovieById,
  getCastByMovieId,
  getMoviesByTopRated,
  getVideoById,
  getYoutubeLinkById,
  getMovieListByCondition,
} = require('../api/axios');

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
    const { name } = req.query;
    if (!name)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'must provide a key word for searching' });
    const result = await searchMovieByName(name);
    return res.json(result);
  } catch (error) {
    return res.json(error);
  }
};

const getMovieDetails = async (req, res) => {
  try {
    const { resourceId } = req.params;
    if (!resourceId)
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'must provide a valid movie id' });
    const result = await Promise.all([getMovieById(resourceId), getCastByMovieId(resourceId)]);
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
    const data = await getMoviesByTopRated();
    const filteredData = data.results.filter((item) => item.original_language === 'en');
    const processedResults = [];
    for (let i = 0; i <= 5; i += 1) {
      processedResults.push(formatTopRatedMovie(filteredData[i]));
    }

    const result = await Promise.all(
      processedResults.map(async ({ id, ...rest }) => ({
        ...rest,
        id,
        youtubeLink: await getYoutubeLinkById(id),
      }))
    );

    return res.status(StatusCodes.OK).json(result);
  } catch (err) {
    return res.json(err);
  }
};

const getMovidTrailerbyId = async (req, res) => {
  const { resourceId } = req.params;
  if (!resourceId)
    return res.status(StatusCodes.BAD_REQUEST).json({ message: 'must provide a valid movie id' });

  try {
    const data = await getVideoById(resourceId);
    const youtubeId = data.results[0].key;
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
    const movies = results.map((result) => formatMovieData(result));
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
