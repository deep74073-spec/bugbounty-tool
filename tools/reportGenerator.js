const fs = require("fs");
const path = require("path");

const REPORT_DIR = path.join(__dirname, "../reports");

function ensureReportDir() {
  if (!fs.existsSync(REPORT_DIR)) {
    fs.mkdirSync(REPORT_DIR, { recursive: true });
  }
}

function safeName(value) {
  return String(value)
    .replace(/[^a-z0-9.-]/gi, "_")
    .toLowerCase();
}

function generateMarkdownReport(recon) {
  ensureReportDir();

  const hostname = new URL(recon.target).hostname;
  const filename = `${safeName(hostname)}-${Date.now()}.md`;
  const filePath = path.join(REPORT_DIR, filename);

  const results = recon.results || {};

  const lines = [
    "# BugBounty Toolkit Report",
    "",
    `- Target: ${recon.target}`,
    `- Completed: ${recon.completedAt}`,
    "",
    "## Results",
    ""
  ];

  for (const [name, item] of Object.entries(results)) {
    lines.push(`### ${name}`);
    lines.push("");

    if (!item.success) {
      lines.push(`- Status: Error`);
      lines.push(`- Error: ${item.error || "Unknown error"}`);
      lines.push("");
      continue;
    }

    lines.push("- Status: Success");
    lines.push("");
    lines.push("```json");
    lines.push(JSON.stringify(item.result, null, 2));
    lines.push("```");
    lines.push("");
  }

  const report = lines.join("\n");

  fs.writeFileSync(filePath, report, "utf8");

  return {
    filename,
    path: filePath,
    format: "markdown"
  };
}

function generateJsonReport(recon) {
  ensureReportDir();

  const hostname = new URL(recon.target).hostname;
  const filename = `${safeName(hostname)}-${Date.now()}.json`;
  const filePath = path.join(REPORT_DIR, filename);

  fs.writeFileSync(
    filePath,
    JSON.stringify(recon, null, 2),
    "utf8"
  );

  return {
    filename,
    path: filePath,
    format: "json"
  };
}

module.exports = {
  generateMarkdownReport,
  generateJsonReport
};
