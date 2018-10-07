module.exports = cb => (req, res) => {
  res.status = function status(statusCode) {
    this.writeHead(statusCode, {
      'Content-Type': 'application/json',
    });

    return this;
  };

  res.json = function end(response) {
    this.end(JSON.stringify(response));
  };

  return cb(req, res);
};
