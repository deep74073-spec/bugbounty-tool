const express = require("express");
const router = express.Router();

const {
  addTarget,
  listTargets
} = require("../services/targetService");

router.get("/", (req, res) => {
  res.json({
    success: true,
    targets: listTargets()
  });
});

router.post("/", (req, res) => {
  try {
    const target = addTarget(req.body.target);

    res.status(201).json({
      success: true,
      target
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
