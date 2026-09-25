const targets = new Map();

function normalizeTarget(input) {
  if (!input || typeof input !== "string") {
    throw new Error("Target is required");
  }

  let value = input.trim().toLowerCase();

  if (!value.startsWith("http://") && !value.startsWith("https://")) {
    value = `https://${value}`;
  }

  const url = new URL(value);

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("Only HTTP/HTTPS targets are allowed");
  }

  return {
    url: url.origin,
    hostname: url.hostname
  };
}

function addTarget(input) {
  const target = normalizeTarget(input);
  targets.set(target.hostname, {
    ...target,
    authorized: true,
    addedAt: new Date().toISOString()
  });

  return targets.get(target.hostname);
}

function listTargets() {
  return [...targets.values()];
}

function getTarget(hostname) {
  return targets.get(hostname.toLowerCase());
}

module.exports = {
  addTarget,
  listTargets,
  getTarget,
  normalizeTarget
};
