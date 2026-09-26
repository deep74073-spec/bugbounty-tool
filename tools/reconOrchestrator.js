const { checkHttpSecurity } = require("./httpSecurity");
const { checkTlsSecurity } = require("./tlsSecurity");
const { getDnsInfo } = require("./dnsInfo");
const { checkCorsSecurity } = require("./corsSecurity");
const { checkSecurityTxt } = require("./securityTxt");
const { getHttpMetadata } = require("./httpMetadata");
const { detectTechnologies } = require("./techDetect");
const { analyzeApiResponse } = require("./apiAnalysis");

async function runRecon(targetUrl) {
  const results = {};

  async function run(name, fn) {
    try {
      results[name] = {
        success: true,
        result: await fn()
      };
    } catch (error) {
      results[name] = {
        success: false,
        error: error.message
      };
    }
  }

  await run("httpSecurity", () =>
    checkHttpSecurity(targetUrl)
  );

  await run("tls", () =>
    checkTlsSecurity(targetUrl)
  );

  const hostname = new URL(targetUrl).hostname;

  await run("dns", () =>
    getDnsInfo(hostname)
  );

  await run("cors", () =>
    checkCorsSecurity(targetUrl)
  );

  await run("securityTxt", () =>
    checkSecurityTxt(targetUrl)
  );

  await run("httpMetadata", () =>
    getHttpMetadata(targetUrl)
  );

  await run("technology", () =>
    detectTechnologies(targetUrl)
  );

  await run("apiAnalysis", () =>
    analyzeApiResponse(targetUrl, "/")
  );

  return {
    target: targetUrl,
    completedAt: new Date().toISOString(),
    results
  };
}

module.exports = {
  runRecon
};
