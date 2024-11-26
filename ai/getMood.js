import { GoogleGenerativeAI } from "@google/generative-ai";
import getMovie from "../lib/getMovie.js";

const getMoodFromNote = async (note, lang) => {
  const apiKey = process.env.API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `Based on the following diary note, recommend a movie title that suits the mood or theme: "${note}". Language: "${lang}". Please provide only the movie title.`;

  const result = await model.generateContent(prompt);
  const movieTitle = result.response.text().trim();
  const data = await getMovie(movieTitle);
  return data;
};

export default getMoodFromNote;
