import { DataAPIClient } from "@datastax/astra-db-ts";

const token =
  "AstraCS:TMvjPIjEkCcXyeNPcXszAzdT:b043760811149418639b724cf9c3754b72b428df1de9c783238b75162d1c5dc2";
const url =
  "https://2a1fa4bc-60f8-45da-bbf4-56b65524e40b-us-east1.apps.astra.datastax.com";

const client = new DataAPIClient(token);

const db = client.db(url);

console.log(`* Connected to DB ${db.id}`);

export async function addDocumentToNotes(document) {
  try {
    const collection = db.collection("notes");
    const result = await collection.insertMany(document);
    console.log(`Document added : ${result}`);
  } catch (error) {
    console.error(`Error adding document : ${error}`);
  }
}
