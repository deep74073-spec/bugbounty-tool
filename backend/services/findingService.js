const findings = [];

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
  return finding;
}

function listFindings() {
  return findings;
}

module.exports = {
  addFinding,
  listFindings
};
