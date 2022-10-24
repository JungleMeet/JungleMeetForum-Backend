const { StatusCodes } = require('http-status-codes');
const {formatMovieData, formatMovieDetailData, formatMovieCastandCrew} = require('../utils/formatMovieData');
const { getMoviesByTag, searchMovieByName, getMovieById, getCastByMovieId } = require('../api/axios');

const listMoviesByTag = async (req, res) => {
  const acceptedConditions = ['popular', 'top_rated', 'now_playing'];
  const { tag } = req.query;
  if (!acceptedConditions.includes(tag))
    return res.status(StatusCodes.BAD_REQUEST).json({ message: 'query type is not supported' });

  const { results } = await getMoviesByTag(tag);
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
    const result = await Promise.all([getMovieById(resourceId) ,getCastByMovieId(resourceId)]);
    const details = formatMovieDetailData(result[0]);
    const castsAndCrews = formatMovieCastandCrew(result[1]);
    const allMovieDetails = {...details, ...castsAndCrews};
    return res.json(allMovieDetails);
  } catch (err) {
    return res.json(err);
  }
};

module.exports = { listMoviesByTag, searchMovieName, getMovieDetails };
