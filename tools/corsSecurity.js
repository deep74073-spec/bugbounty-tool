const axios = require("axios");

async function checkCorsSecurity(targetUrl) {
  const response = await axios.get(targetUrl, {
    timeout: 10000,
    maxRedirects: 5,
    validateStatus: () => true,
    headers: {
      Origin: "https://security-check.invalid"
    }
  });

  const headers = Object.fromEntries(
    Object.entries(response.headers).map(([key, value]) => [
      key.toLowerCase(),
      value
    ])
  );

  return {
    url: targetUrl,
    status: response.status,
    cors: {
      accessControlAllowOrigin:
        headers["access-control-allow-origin"] || null,
      accessControlAllowCredentials:
        headers["access-control-allow-credentials"] || null,
      accessControlAllowMethods:
        headers["access-control-allow-methods"] || null,
      accessControlAllowHeaders:
        headers["access-control-allow-headers"] || null
    }
  };
}

module.exports = {
  checkCorsSecurity
};
