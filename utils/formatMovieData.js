const { THUMBNAIL_POSTER_WIDTH } = require('../constants/constans');
const imagePathGen = require('./imagePathGen');

const formatMovieData = (data) => {
  const {
    genre_ids,
    id: resourceId,
    popularity,
    poster_path,
    release_date,
    title,
    vote_average,
  } = data;

  const poster = imagePathGen(poster_path, THUMBNAIL_POSTER_WIDTH);
  const year = release_date.slice(0, 4);

  return {
    genre_ids,
    resourceId,
    popularity,
    poster,
    year,
    title,
    vote_average,
  };
};

module.exports = formatMovieData;
