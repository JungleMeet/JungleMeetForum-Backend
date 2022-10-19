const { StatusCodes } = require('http-status-codes');
const { searchMovieByName } = require('../api/axios');

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

module.exports = { searchMovieName };
