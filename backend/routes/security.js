const express = require("express");
const router = express.Router();

const { getTarget } = require("../services/targetService");
const { checkHttpSecurity } = require("../../tools/httpSecurity");
const { addFinding } = require("../services/findingService");

router.get("/headers", async (req, res) => {
  try {
    const hostname = String(req.query.host || "").toLowerCase().trim();
    const target = getTarget(hostname);

    if (!target || !target.authorized) {
      return res.status(403).json({
        success: false,
        error: "Target is not in the authorized scope"
      });
    }

    const result = await checkHttpSecurity(target.url);

    const missingHeaders = Object.entries(result.securityHeaders)
      .filter(([, present]) => !present)
      .map(([header]) => header);

    let observation = null;

    if (missingHeaders.length > 0) {
      observation = addFinding({
        target: hostname,
        title: "HTTP security header observation",
        severity: "informational",
        evidence: `Missing headers: ${missingHeaders.join(", ")}`,
        description:
          "One or more commonly used HTTP security headers were not detected in the response. This is an observation and does not by itself establish a vulnerability.",
        remediation:
          "Review whether these headers are appropriate for the application's architecture and security requirements."
      });
    }

    res.json({
      success: true,
      result,
      observation
    });
  } catch (error) {
    res.status(502).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
