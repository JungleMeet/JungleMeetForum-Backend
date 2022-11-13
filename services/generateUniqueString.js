const generateUniqueString = (len) =>
  Math.random()
    .toString(36)
    .substring(2, len + 2);

module.exports = generateUniqueString;
