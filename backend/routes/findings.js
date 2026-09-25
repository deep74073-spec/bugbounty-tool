const express = require("express");
const router = express.Router();

const {
  addFinding,
  listFindings
} = require("../services/findingService");

router.get("/", (req, res) => {
  res.json({
    success: true,
    findings: listFindings()
  });
});

router.post("/", (req, res) => {
  try {
    const {
      target,
      title,
      severity,
      evidence,
      description,
      remediation
    } = req.body;

    if (!target || !title || !severity) {
      return res.status(400).json({
        success: false,
        error: "target, title and severity are required"
      });
    }

    const finding = addFinding({
      target,
      title,
      severity,
      evidence: evidence || "",
      description: description || "",
      remediation: remediation || ""
    });

    res.status(201).json({
      success: true,
      finding
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
