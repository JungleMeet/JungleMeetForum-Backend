const { THUMBNAIL_POSTER_WIDTH, MOVIEDETAIL_POSTER_WIDTH, CASTS_PROFILE_WIDTH } = require('../constants/constants');
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

const formatMovieDetailData = (data) => {
  const {
    genres,
    id: resourceId,
    // popularity,
    poster_path,
    release_date,
    title,
    vote_average,
    vote_count,
    runtime,
    spoken_languages,
    overview,
    production_countries
  } = data;

  const genres_name = genres.map(genre => genre.name);
  const languages = spoken_languages.map(language => language.english_name)
  const country = production_countries.map(({name}) => name)

  const poster = imagePathGen(poster_path, MOVIEDETAIL_POSTER_WIDTH);

  const date = new Date(release_date);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = (date.getDate()).toString().padStart(2, "0");
  const release_date_right_format = `${day}/${month}/${year}`;

  const run_hours = Math.floor(runtime/60);
  const run_minutes = runtime%60;
  const length = `${run_hours}h ${run_minutes}m`;

  return {
    genres_name,
    resourceId,
    // popularity,
    poster,
    release_date_right_format,
    title,
    vote_average,
    vote_count,
    length,
    languages,
    overview,
    country
  };
  
};

const formatMovieCastandCrew = (data) => {
  const {
    cast,
    crew
  } = data;

  const majorCasts = cast.slice(0, 10).map(({name, profile_path }) => {
    const path = imagePathGen(profile_path, CASTS_PROFILE_WIDTH);
    return {name, path};
  })
  const director = crew.filter(({job}) => job === 'Director').map(person => person.name);
  const writer = crew.filter(({job}) => job === 'Writer').map(person => person.name);

  return {
    majorCasts,
    director,
    writer
  };
};

module.exports = {formatMovieData, formatMovieDetailData, formatMovieCastandCrew};
