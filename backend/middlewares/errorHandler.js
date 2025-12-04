module.exports = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'Error del servidor' : err.message;

  res.status(statusCode).send({ message });
};
