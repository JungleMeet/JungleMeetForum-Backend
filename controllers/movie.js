const { StatusCodes } = require('http-status-codes');
const formatMovieData = require('../utils/formatMovieData');
const { getMoviesByCondition, searchMovieByName } = require('../api/axios');

const listMoviesByConditions = async (req, res) => {
  const acceptedConditions = ['latest', 'popular', 'top_rated', 'now_playing'];
  const { condition } = req.query;
  if (!acceptedConditions.includes(condition))
    return res.status(StatusCodes.BAD_REQUEST).json({ message: 'query type is not supported' });

  const { results } = await getMoviesByCondition(condition);
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

module.exports = { listMoviesByConditions, searchMovieName };
