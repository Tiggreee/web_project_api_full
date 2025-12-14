const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { JWT_SECRET = 'dev-secret' } = process.env;

const handleUserError = (err, next) => {
  if (err.name === 'DocumentNotFoundError') {
    err.statusCode = 404;
    err.message = 'Usuario no encontrado';
  } else if (err.name === 'CastError') {
    err.statusCode = 400;
    err.message = 'ID de usuario inválido';
  } else if (err.name === 'ValidationError') {
    err.statusCode = 400;
    err.message = 'Datos inválidos';
  } else if (err.code === 11000) {
    err.statusCode = 409;
    err.message = 'El email ya existe';
  }
  next(err);
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.params.id)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => handleUserError(err, next));
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      const userObject = user.toObject();
      delete userObject.password;
      res.status(201).send(userObject);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        err.statusCode = 400;
        err.message = 'Datos inválidos';

      } else if (err.code === 11000) {
        err.statusCode = 409;
        err.message = 'El email ya existe';
      }
      next(err);handleUserError(err, next)   const error = new Error('Email o contraseña incorrectos');
        error.statusCode = 401;
        throw error;
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            const error = new Error('Email o contraseña incorrectos');
            error.statusCode = 401;
            throw error;
          }

          const token = jwt.sign(
            { _id: user._id },
            JWT_SECRET,
            { expiresIn: '7d' },
          );

          return res.send({ token });
        });
    })
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        err.statusCode = 404;
        err.message = 'Usuario no encontrado';
      }
      next(err);
    });
};

const updateProfile = (req, res, next) => {
  const { name, abouhandleUserError(err, next)orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        err.statusCode = 404;
        err.message = 'Usuario no encontrado';
      } else if (err.name === 'ValidationError') {
        err.statusCode = 400;
        err.message handleUserError(err, next));
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => handleUserError(err, next)ateUser,
  login,
  getCurrentUser,
  updateProfile,
  updateAvatar,
};
