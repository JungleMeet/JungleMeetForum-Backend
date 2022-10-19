const imagePathGen = (imagePath, width) => {
  const baseUrl = 'https://image.tmdb.org/t/p/';
  const widthBreakPoints = [92, 154, 185, 342, 500, 780];
  widthBreakPoints.sort((a, b) => a - b); // make sure the array is in ascending order

  let imageWidth;
  for (const breakPoint of widthBreakPoints) {
    if (width <= breakPoint) {
      imageWidth = breakPoint;
      break;
    }
  }
  imageWidth = imageWidth ? `w${imageWidth}` : 'original';

  return baseUrl + imageWidth + imagePath;
};

module.exports = imagePathGen;
