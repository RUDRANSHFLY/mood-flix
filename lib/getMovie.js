import axios from "axios";

const getMovie = async (movieName) => {
  const apiKey = process.env.TMDB_API_KEY;
  const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(
    movieName
  )}`;
  const movie_details = await axios.get(searchUrl);
  return movie_details.data.results[0];
};

export default getMovie;
