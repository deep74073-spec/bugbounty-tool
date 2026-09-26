const axios = require("axios");

async function getHttpMetadata(targetUrl) {
  const startedAt = Date.now();

  const response = await axios.get(targetUrl, {
    timeout: 10000,
    maxRedirects: 5,
    validateStatus: () => true
  });

  const responseTimeMs = Date.now() - startedAt;

  const headers = Object.fromEntries(
    Object.entries(response.headers).map(([key, value]) => [
      key.toLowerCase(),
      value
    ])
  );

  return {
    url: targetUrl,
    status: response.status,
    finalUrl: response.request?.res?.responseUrl || targetUrl,
    responseTimeMs,
    headers: {
      server: headers["server"] || null,
      contentType: headers["content-type"] || null,
      contentLength: headers["content-length"] || null,
      cacheControl: headers["cache-control"] || null,
      location: headers["location"] || null
    }
  };
}

module.exports = {
  getHttpMetadata
};
