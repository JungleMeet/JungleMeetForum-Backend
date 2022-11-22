const bcrypt = require('bcrypt');

const hashCode = async (string) => {
  const salt = await bcrypt.genSalt(10);
  const hashedCode = await bcrypt.hash(string, salt);
  return hashedCode;
};
const generateString = () => {
  const originalString = Math.random().toString();
  return hashCode(originalString);
};
module.exports = generateString;
