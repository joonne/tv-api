module.exports = (router) => (req, res) => {
  console.info(`${req.method} ${req.url}`);
  return router(req, res);
};
