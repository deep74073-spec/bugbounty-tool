const express = require("express");
const router = express.Router();

const { getTarget } = require("../services/targetService");
const { runRecon } = require("../../tools/reconOrchestrator");
const {
  generateMarkdownReport,
  generateJsonReport
} = require("../../tools/reportGenerator");

router.get("/", async (req, res) => {
  try {
    const hostname = String(req.query.host || "")
      .toLowerCase()
      .trim();

    const format = String(req.query.format || "markdown")
      .toLowerCase()
      .trim();

    const target = getTarget(hostname);

    if (!target || !target.authorized) {
      return res.status(403).json({
        success: false,
        error: "Target is not in the authorized scope"
      });
    }

    if (!["markdown", "json"].includes(format)) {
      return res.status(400).json({
        success: false,
        error: "format must be markdown or json"
      });
    }

    const recon = await runRecon(target.url);

    const report = format === "json"
      ? generateJsonReport(recon)
      : generateMarkdownReport(recon);

    res.json({
      success: true,
      report
    });
  } catch (error) {
    res.status(502).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
