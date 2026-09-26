const express = require("express");

const app = express();
const PORT = 3010;

app.use(express.json());
app.use(express.static("app"));

const targetRoutes = require("./backend/routes/targets");
const securityRoutes = require("./backend/routes/security");
const findingRoutes = require("./backend/routes/findings");
const tlsRoutes = require("./backend/routes/tls");
const dnsRoutes = require("./backend/routes/dns");
const corsRoutes = require("./backend/routes/cors");
const securityTxtRoutes = require("./backend/routes/securityTxt");
const httpMetadataRoutes = require("./backend/routes/httpMetadata");
const techDetectRoutes = require("./backend/routes/techDetect");
const apiAnalysisRoutes = require("./backend/routes/apiAnalysis");
const reconRoutes = require("./backend/routes/recon");
const reportRoutes = require("./backend/routes/reports");

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "BugBounty Toolkit"
  });
});

app.use("/api/targets", targetRoutes);
app.use("/api/security", securityRoutes);
app.use("/api/findings", findingRoutes);
app.use("/api/tls", tlsRoutes);
app.use("/api/dns", dnsRoutes);
app.use("/api/cors", corsRoutes);
app.use("/api/security-txt", securityTxtRoutes);
app.use("/api/http-metadata", httpMetadataRoutes);
app.use("/api/tech", techDetectRoutes);
app.use("/api/api-analysis", apiAnalysisRoutes);
app.use("/api/recon", reconRoutes);
app.use("/api/reports", reportRoutes);

app.listen(PORT, "127.0.0.1", () => {
  console.log(`BugBounty Toolkit: http://127.0.0.1:${PORT}`);
});
