const axios = require("axios");

async function checkHttpSecurity(targetUrl) {
  const response = await axios.get(targetUrl, {
    timeout: 10000,
    maxRedirects: 5,
    validateStatus: () => true
  });

  const headers = Object.fromEntries(
    Object.entries(response.headers).map(([key, value]) => [
      key.toLowerCase(),
      value
    ])
  );

  const securityHeaders = {
    "strict-transport-security": Boolean(headers["strict-transport-security"]),
    "content-security-policy": Boolean(headers["content-security-policy"]),
    "x-content-type-options": Boolean(headers["x-content-type-options"]),
    "x-frame-options": Boolean(headers["x-frame-options"]),
    "referrer-policy": Boolean(headers["referrer-policy"]),
    "permissions-policy": Boolean(headers["permissions-policy"])
  };

  return {
    url: targetUrl,
    status: response.status,
    finalUrl: response.request?.res?.responseUrl || targetUrl,
    securityHeaders
  };
}

module.exports = {
  checkHttpSecurity
};
