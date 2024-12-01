import getMoodFromNote from "../ai/getMood.js";
import { DataAPIClient } from "@datastax/astra-db-ts";

const diaryController = async (dairy, lang) => {
  const movie = await getMoodFromNote(dairy, lang);
  const doc = [
    {
      $vectorize: dairy,
    },
  ];
  try {
    const token = process.env.TOKEN;
    const url = process.env.URL;
    const client = new DataAPIClient(token);
    const db = client.db(url);
    console.log(`* Connected to DB ${db.id}`);
    try {
      const collection = db.collection("notes");
      const result = await collection.insertMany(doc);
      console.log(`Document added : ${result}`);
    } catch (error) {
      console.error(`Error adding document : ${error}`);
    }
  } catch (e) {
    console.log("* Documents found on DB already. Let's move on!");
  }
  return movie;
};

export default diaryController;
