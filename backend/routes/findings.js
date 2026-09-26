const express = require("express");
const router = express.Router();

const {
  addFinding,
  listFindings
} = require("../services/findingService");

const { getTarget } = require("../services/targetService");

const ALLOWED_SEVERITIES = [
  "informational",
  "low",
  "medium",
  "high",
  "critical"
];

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

    const hostname = String(target)
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .split("/")[0];

    const authorizedTarget = getTarget(hostname);

    if (!authorizedTarget || !authorizedTarget.authorized) {
      return res.status(403).json({
        success: false,
        error: "Target is not in the authorized scope"
      });
    }

    if (!ALLOWED_SEVERITIES.includes(String(severity).toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: `Invalid severity. Allowed values: ${ALLOWED_SEVERITIES.join(", ")}`
      });
    }

    const finding = addFinding({
      target: hostname,
      title: String(title).trim(),
      severity: String(severity).toLowerCase(),
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
