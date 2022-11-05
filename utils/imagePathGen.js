const { TMDB_IMAGE_WIDTH_BREAKPOINTS, FALLBACK_POSTER } = require('../constants/constants');

const imagePathGen = (imagePath, width) => {
  if (!imagePath) return FALLBACK_POSTER;
  const baseUrl = 'https://image.tmdb.org/t/p/';
  const imageBreakPoints = TMDB_IMAGE_WIDTH_BREAKPOINTS;
  imageBreakPoints.sort((a, b) => a - b); // make sure the array is in ascending order

  let imageWidth;
  for (const breakPoint of imageBreakPoints) {
    if (width <= breakPoint) {
      imageWidth = breakPoint;
      break;
    }
  }
  imageWidth = imageWidth ? `w${imageWidth}` : 'original';

  return baseUrl + imageWidth + imagePath;
};

module.exports = imagePathGen;
