import { DataAPIClient } from "@datastax/astra-db-ts";

const token =
  "AstraCS:DhFGHZHgCnpBMGkpictpfKbz:9d220cc2fddafec79c34422fd696ad0a0e277b2366e3ece1af9a1b3cc38b39c0";
const url =
  "https://77b8ef2b-6a82-4aa9-aa04-8039463a6820-us-east-2.apps.astra.datastax.com";

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
