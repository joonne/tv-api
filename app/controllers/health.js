// controllers/health.js

function getHealth(req, res) {
  res.statusCode = 200;
  return res.end();
}

module.exports = {
  getHealth,
};
