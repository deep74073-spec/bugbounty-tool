let selectedTarget = "";

async function api(url, options = {}) {
  const response = await fetch(url, options);

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error(`Server returned HTTP ${response.status}`);
  }

  if (!response.ok || data.success === false) {
    throw new Error(data.error || `HTTP ${response.status}`);
  }

  return data;
}

function showOutput(data) {
  document.getElementById("output").textContent =
    JSON.stringify(data, null, 2);
}

async function loadTargets() {
  try {
    const data = await api("/api/targets");

    const container = document.getElementById("targets");

    if (!data.targets.length) {
      container.innerHTML = "<p>No authorized targets.</p>";
      return;
    }

    container.innerHTML = data.targets.map(target => `
      <div class="target">
        <strong>${escapeHtml(target.hostname)}</strong>
        <br>
        <small>${escapeHtml(target.url)}</small>
        <br>
        <button onclick="selectTarget('${escapeJs(target.hostname)}')">
          Select
        </button>
      </div>
    `).join("");

  } catch (error) {
    document.getElementById("targets").textContent =
      `Error: ${error.message}`;
  }
}

async function addTarget() {
  const input = document.getElementById("target");
  const value = input.value.trim();

  if (!value) {
    alert("Enter a target first.");
    return;
  }

  try {
    const data = await api("/api/targets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        target: value
      })
    });

    selectedTarget = data.target.hostname;
    input.value = "";

    showOutput(data);
    await loadTargets();

  } catch (error) {
    alert(error.message);
  }
}

function selectTarget(hostname) {
  selectedTarget = hostname;

  document.getElementById("output").textContent =
    `Selected target: ${hostname}`;
}

function requireTarget() {
  if (!selectedTarget) {
    alert("Select an authorized target first.");
    return false;
  }

  return true;
}

async function runRecon() {
  if (!requireTarget()) return;

  document.getElementById("output").textContent =
    "Running safe recon...";

  try {
    const data = await api(
      `/api/recon?host=${encodeURIComponent(selectedTarget)}`
    );

    showOutput(data);
    await loadFindings();

  } catch (error) {
    document.getElementById("output").textContent =
      `Recon error: ${error.message}`;
  }
}

async function generateReport(format) {
  if (!requireTarget()) return;

  document.getElementById("output").textContent =
    `Generating ${format} report...`;

  try {
    const data = await api(
      `/api/reports?host=${encodeURIComponent(selectedTarget)}&format=${encodeURIComponent(format)}`
    );

    showOutput(data);

  } catch (error) {
    document.getElementById("output").textContent =
      `Report error: ${error.message}`;
  }
}

async function loadFindings() {
  try {
    const data = await api("/api/findings");

    const container = document.getElementById("findings");

    if (!data.findings.length) {
      container.innerHTML = "<p>No findings recorded.</p>";
      return;
    }

    container.innerHTML = data.findings.map(finding => `
      <div class="finding">
        <strong>${escapeHtml(finding.id)}</strong>
        <br>

        <strong>${escapeHtml(finding.title)}</strong>
        <br>

        Target:
        ${escapeHtml(finding.target)}

        <br>

        Severity:
        <span class="severity">
          ${escapeHtml(finding.severity)}
        </span>

        <br>

        <small>
          ${escapeHtml(finding.createdAt)}
        </small>
      </div>
    `).join("");

  } catch (error) {
    document.getElementById("findings").textContent =
      `Error: ${error.message}`;
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeJs(value) {
  return String(value)
    .replaceAll("\\", "\\\\")
    .replaceAll("'", "\\'");
}

window.addEventListener("DOMContentLoaded", async () => {
  await loadTargets();
  await loadFindings();
});
