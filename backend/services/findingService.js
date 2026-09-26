const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "../../data");
const FINDINGS_FILE = path.join(DATA_DIR, "findings.json");

function ensureStorage() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(FINDINGS_FILE)) {
    fs.writeFileSync(FINDINGS_FILE, "[]", "utf8");
  }
}

function loadFindings() {
  ensureStorage();

  try {
    const data = fs.readFileSync(FINDINGS_FILE, "utf8");
    const list = JSON.parse(data);

    return Array.isArray(list) ? list : [];
  } catch (error) {
    return [];
  }
}

function saveFindings(findings) {
  ensureStorage();

  fs.writeFileSync(
    FINDINGS_FILE,
    JSON.stringify(findings, null, 2),
    "utf8"
  );
}

const findings = loadFindings();

function addFinding({
  target,
  title,
  severity,
  evidence,
  description,
  remediation
}) {
  const finding = {
    id: `F-${String(findings.length + 1).padStart(4, "0")}`,
    target,
    title,
    severity,
    evidence,
    description,
    remediation,
    createdAt: new Date().toISOString()
  };

  findings.push(finding);
  saveFindings(findings);

  return finding;
}

function listFindings() {
  return findings;
}

module.exports = {
  addFinding,
  listFindings
};
