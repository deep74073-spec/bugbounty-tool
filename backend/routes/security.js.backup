const express = require("express");
const router = express.Router();

const { getTarget } = require("../services/targetService");
const { checkHttpSecurity } = require("../../tools/httpSecurity");

router.get("/headers", async (req, res) => {
  try {
    const hostname = String(req.query.host || "").toLowerCase();
    const target = getTarget(hostname);

    if (!target || !target.authorized) {
      return res.status(403).json({
        success: false,
        error: "Target is not in the authorized scope"
      });
    }

    const result = await checkHttpSecurity(target.url);

    res.json({
      success: true,
      result
    });
  } catch (error) {
    res.status(502).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
