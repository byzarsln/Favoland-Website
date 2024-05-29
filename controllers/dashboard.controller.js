const path = require("path");

const getDashboardPage = (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "dashboard.html"));
};

module.exports = {
  getDashboardPage,
};
