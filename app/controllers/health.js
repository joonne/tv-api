// controllers/health.js

function getHealth(req, res) {
  return res.sendStatus(200);
}

module.exports = {
  getHealth,
};
