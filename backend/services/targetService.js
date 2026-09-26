const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "../../data");
const TARGETS_FILE = path.join(DATA_DIR, "targets.json");

function ensureStorage() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(TARGETS_FILE)) {
    fs.writeFileSync(TARGETS_FILE, "[]", "utf8");
  }
}

function loadTargets() {
  ensureStorage();

  try {
    const data = fs.readFileSync(TARGETS_FILE, "utf8");
    const list = JSON.parse(data);

    return new Map(
      list.map((target) => [target.hostname, target])
    );
  } catch (error) {
    return new Map();
  }
}

function saveTargets(targets) {
  ensureStorage();

  fs.writeFileSync(
    TARGETS_FILE,
    JSON.stringify([...targets.values()], null, 2),
    "utf8"
  );
}

const targets = loadTargets();

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

  saveTargets(targets);

  return targets.get(target.hostname);
}

function listTargets() {
  return [...targets.values()];
}

function getTarget(hostname) {
  return targets.get(String(hostname).toLowerCase());
}

module.exports = {
  addTarget,
  listTargets,
  getTarget,
  normalizeTarget
};
