const videoPathGen = (id) => {
  const baseUrl = 'https://image.tmdb.org/t/p/';

  return `${baseUrl + id }/videos`;
};

module.exports = videoPathGen;
