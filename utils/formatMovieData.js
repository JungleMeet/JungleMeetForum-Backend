const {
  THUMBNAIL_POSTER_WIDTH,
  MOVIEDETAIL_POSTER_WIDTH,
  CASTS_PROFILE_WIDTH,
  MOVIE_GENRES,
  SEARCH_RESULT_POSTER_WIDTH,
} = require('../constants/constants');
const imagePathGen = require('./imagePathGen');

const formatMovieDataGeneral = (data, imageSize) => {
  const {
    genre_ids: genreIds,
    id: resourceId,
    poster_path,
    release_date,
    title,
    vote_average,
    overview,
  } = data;

  const poster = imagePathGen(poster_path, imageSize);
  const year = release_date.slice(0, 4);
  const voteAverage = vote_average === 0 ? '--' : vote_average;
  const genreNames = genreIds
    .slice(0, 2)
    .map((genreId) => MOVIE_GENRES.find((elem) => elem.id === genreId));
  // const genres = genreNames.join(' ');

  return {
    genreNames,
    resourceId,
    poster,
    title,
    voteAverage,
    year,
    overview,
  };
};

const formatMovieData = (data) => {
  const result = formatMovieDataGeneral(data, THUMBNAIL_POSTER_WIDTH);
  const { genreNames, resourceId, poster, title, voteAverage } = result;
  return { genreNames, resourceId, poster, title, voteAverage };
};

const formatMovieDataForSearch = (data) => {
  const result = formatMovieDataGeneral(data, SEARCH_RESULT_POSTER_WIDTH);
  return result;
};

// const formatMovieData = (data) => {
//   const {
//     genre_ids: genreIds,
//     id: resourceId,
//     // popularity,
//     poster_path,
//     // release_date,
//     title,
//     vote_average: voteAverage,
//   } = data;

//   const poster = imagePathGen(poster_path, THUMBNAIL_POSTER_WIDTH);
//   // const year = release_date.slice(0, 4);
//   const genreNames = genreIds.map((genreId) => MOVIE_GENRES.find((elem) => elem.id === genreId));
//   // const genres = genreNames.join(' ');

//   return {
//     genreNames,
//     resourceId,
//     // popularity,
//     poster,
//     // year,
//     title,
//     voteAverage,
//   };
// };

const formatMovieDetailData = (data) => {
  const {
    genres,
    id: resourceId,
    // popularity,
    poster_path,
    release_date,
    title,
    vote_average: voteAverage,
    vote_count: voteCount,
    runtime,
    spoken_languages,
    overview,
    production_countries,
  } = data;

  const genresName = genres.map((genre) => genre.name);
  const languages = spoken_languages.map((language) => language.english_name);
  const country = production_countries.map(({ name }) => name);

  const poster = imagePathGen(poster_path, MOVIEDETAIL_POSTER_WIDTH);

  const date = new Date(release_date);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const releaseDateRightFormat = `${day}/${month}/${year}`;

  const run_hours = Math.floor(runtime / 60);
  const run_minutes = runtime % 60;
  const length = `${run_hours}h ${run_minutes}m`;

  return {
    genresName,
    resourceId,
    // popularity,
    poster,
    releaseDateRightFormat,
    title,
    voteAverage,
    voteCount,
    length,
    languages,
    overview,
    country,
  };
};

const formatMovieCastandCrew = (data) => {
  const { cast, crew } = data;

  const majorCasts = cast.slice(0, 10).map(({ name, profile_path }) => {
    const path = imagePathGen(profile_path, CASTS_PROFILE_WIDTH);
    return { name, path };
  });
  const director = crew.filter(({ job }) => job === 'Director').map((person) => person.name);
  const writer = crew.filter(({ job }) => job === 'Writer').map((person) => person.name);

  return {
    majorCasts,
    director,
    writer,
  };
};

const formatTopRatedMovie = (data) => {
  const { id, title, backdrop_path, vote_average: voteAverage, overview } = data;

  const heroBanner = imagePathGen(backdrop_path);

  return {
    id,
    title,
    heroBanner,
    voteAverage,
    overview,
  };
};

module.exports = {
  formatMovieData,
  formatMovieDetailData,
  formatMovieCastandCrew,
  formatTopRatedMovie,
  formatMovieDataForSearch,
};
