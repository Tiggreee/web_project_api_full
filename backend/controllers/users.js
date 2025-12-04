const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(500).send({ message: 'Error del servidor' }));
};

const getUserById = (req, res) => {
  User.findById(req.params.id)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'Usuario no encontrado' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'ID de usuario inválido' });
      } else {
        res.status(500).send({ message: 'Error del servidor' });
      }
    });
};

const createUser = (req, res) => {
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
        res.status(400).send({ message: 'Datos inválidos' });
      } else if (err.code === 11000) {
        res.status(409).send({ message: 'El email ya existe' });
      } else {
        res.status(500).send({ message: 'Error del servidor' });
      }
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return res.status(401).send({ message: 'Email o contraseña incorrectos' });
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return res.status(401).send({ message: 'Email o contraseña incorrectos' });
          }

          const token = jwt.sign(
            { _id: user._id },
            'dev-secret',
            { expiresIn: '7d' },
          );

          return res.send({ token });
        });
    })
    .catch(() => res.status(500).send({ message: 'Error del servidor' }));
};

const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'Usuario no encontrado' });
      } else {
        res.status(500).send({ message: 'Error del servidor' });
      }
    });
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'Usuario no encontrado' });
      } else if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Datos inválidos' });
      } else {
        res.status(500).send({ message: 'Error del servidor' });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'Usuario no encontrado' });
      } else if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Datos inválidos' });
      } else {
        res.status(500).send({ message: 'Error del servidor' });
      }
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  login,
  getCurrentUser,
  updateProfile,
  updateAvatar,
};
