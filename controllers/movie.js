const { StatusCodes } = require('http-status-codes');
const { getMoviesByCondition } = require('../api/axios');

const listMoviesByConditions = async (req, res) => {
  const acceptedConditions = ['latest', 'popular', 'top_rated', 'now_playing'];
  const { condition } = req.query;
  if (!acceptedConditions.includes(condition))
    return res.status(StatusCodes.BAD_REQUEST).json({ message: 'query type is not supported' });

  const data = await getMoviesByCondition(condition);
  return res.status(StatusCodes.OK).json(data);
};

module.exports = { listMoviesByConditions };
