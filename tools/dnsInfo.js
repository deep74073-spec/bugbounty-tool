const dns = require("dns").promises;

async function getDnsInfo(hostname) {
  const result = {
    hostname,
    A: [],
    AAAA: [],
    MX: [],
    NS: [],
    TXT: []
  };

  const lookups = [
    ["A", "resolve4"],
    ["AAAA", "resolve6"],
    ["MX", "resolveMx"],
    ["NS", "resolveNs"],
    ["TXT", "resolveTxt"]
  ];

  for (const [type, method] of lookups) {
    try {
      result[type] = await dns[method](hostname);
    } catch (error) {
      result[type] = [];
    }
  }

  return result;
}

module.exports = {
  getDnsInfo
};
