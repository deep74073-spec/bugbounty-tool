const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("app"));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(3010, "127.0.0.1", () => {
  console.log("BugBounty Toolkit: http://127.0.0.1:3010");
});
