const express = require("express");

const app = express();
const PORT = 3010;

app.use(express.json());
app.use(express.static("app"));

const targetRoutes = require("./backend/routes/targets");

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "BugBounty Toolkit"
  });
});

app.use("/api/targets", targetRoutes);

app.listen(PORT, "127.0.0.1", () => {
  console.log(`BugBounty Toolkit: http://127.0.0.1:${PORT}`);
});
