const { TMDB_IMAGE_WIDTH_BREAKPOINTS } = require('../constants/constans');

const imagePathGen = (imagePath, width) => {
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
