import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ meessage: "App Index Route sucess" });
});

export default router;
