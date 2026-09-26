const express = require("express");
const router = express.Router();

const { getTarget } = require("../services/targetService");
const { checkTlsSecurity } = require("../../tools/tlsSecurity");
const { addFinding } = require("../services/findingService");

router.get("/", async (req, res) => {
  try {
    const hostname = String(req.query.host || "")
      .toLowerCase()
      .trim();

    const target = getTarget(hostname);

    if (!target || !target.authorized) {
      return res.status(403).json({
        success: false,
        error: "Target is not in the authorized scope"
      });
    }

    const result = await checkTlsSecurity(target.url);

    let observation = null;

    if (!result.authorized) {
      observation = addFinding({
        target: hostname,
        title: "TLS certificate trust observation",
        severity: "informational",
        evidence: result.authorizationError || "Certificate was not trusted by the TLS client",
        description:
          "The TLS connection completed, but the certificate was not trusted by the local TLS validation process. This can have multiple causes and requires verification.",
        remediation:
          "Review the certificate chain, hostname configuration, and certificate trust configuration."
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
