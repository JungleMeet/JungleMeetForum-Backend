const mongoose = require('mongoose');

const connectDB = (url) => mongoose.connect(url);

module.exports = connectDB;
