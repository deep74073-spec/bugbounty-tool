const axios = require("axios");

async function checkSecurityTxt(targetUrl) {
  const base = new URL(targetUrl);

  const securityTxtUrl =
    `${base.protocol}//${base.host}/.well-known/security.txt`;

  const response = await axios.get(securityTxtUrl, {
    timeout: 10000,
    maxRedirects: 5,
    validateStatus: () => true
  });

  const contentType = String(
    response.headers["content-type"] || ""
  ).toLowerCase();

  const body = typeof response.data === "string"
    ? response.data
    : "";

  const lines = body
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);

  const fields = {};

  for (const line of lines) {
    if (line.startsWith("#")) continue;

    const separator = line.indexOf(":");

    if (separator === -1) continue;

    const key = line
      .slice(0, separator)
      .trim()
      .toLowerCase();

    const value = line
      .slice(separator + 1)
      .trim();

    if (!fields[key]) {
      fields[key] = [];
    }

    fields[key].push(value);
  }

  return {
    url: securityTxtUrl,
    status: response.status,
    contentType,
    found: response.status === 200,
    fields: {
      contact: fields.contact || [],
      policy: fields.policy || [],
      expires: fields.expires || [],
      encryption: fields.encryption || [],
      acknowledgments: fields.acknowledgments || []
    }
  };
}

module.exports = {
  checkSecurityTxt
};
