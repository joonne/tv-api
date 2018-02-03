const handleErrors = (res, err) => {
  res.statusCode = err.status || 500;

  return res.end(JSON.stringify({
    message: err.message,
  }));
};

module.exports = {
  handleErrors,
};
