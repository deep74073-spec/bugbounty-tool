const axios = require("axios");

async function analyzeApiResponse(targetUrl, endpoint = "/") {
  const base = new URL(targetUrl);

  if (!endpoint.startsWith("/")) {
    endpoint = `/${endpoint}`;
  }

  const url = new URL(endpoint, base.origin).toString();

  const response = await axios.get(url, {
    timeout: 10000,
    maxRedirects: 5,
    validateStatus: () => true
  });

  const headers = Object.fromEntries(
    Object.entries(response.headers).map(([key, value]) => [
      key.toLowerCase(),
      String(value)
    ])
  );

  const body = typeof response.data === "string"
    ? response.data
    : JSON.stringify(response.data);

  return {
    url,
    status: response.status,
    contentType: headers["content-type"] || null,
    contentLength: headers["content-length"] || null,
    server: headers["server"] || null,
    responseSize: Buffer.byteLength(body, "utf8"),
    json: (() => {
      try {
        JSON.parse(body);
        return true;
      } catch {
        return false;
      }
    })()
  };
}

module.exports = {
  analyzeApiResponse
};
