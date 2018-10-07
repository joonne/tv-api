// controllers/health.js

function getHealth(req, res) {
  return res.status(200).end();
}

module.exports = {
  getHealth,
};
