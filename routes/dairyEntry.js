import express from "express";
import diaryController from "../controller/dairyController.js";

const dairyEntryRouter = express.Router();

dairyEntryRouter.post("/recomend", async (req, res) => {
  const data = await diaryController(req.body.note, req.body.lang);
  res.status(200).json({ data });
});

export default dairyEntryRouter;
