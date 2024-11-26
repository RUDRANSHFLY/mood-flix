import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import dairyEntryRouter from "./routes/dairyEntry.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/", dairyEntryRouter);

app.listen(PORT, () => {
  console.log(`Server is running on : http://localhost:${PORT}`);
});
