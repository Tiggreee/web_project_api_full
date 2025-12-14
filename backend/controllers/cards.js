const Card = require('../models/card');

const handleCardError = (err, next) => {
  if (err.name === 'DocumentNotFoundError') {
    err.statusCode = 404;
    err.message = 'Tarjeta no encontrada';
  } else if (err.name === 'CastError') {
    err.statusCode = 400;
    err.message = 'ID de tarjeta inválido';
  } else if (err.name === 'ValidationError') {
    err.statusCode = 400;
    err.message = 'Datos inválidos';
  }
  next(err);
};

const getCards = (req, res, next) => {
  Card.find({ owner: req.user._id })
    .then((cards) => res.send(cards))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((err) => handleCardError(err, next));
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail()
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        const error = new Error('No tienes permiso para eliminar esta tarjeta');
        error.statusCode = 403;
        throw error;
      }
      return Card.findByIdAndDelete(req.params.cardId)
        .then((deletedCard) => res.send(deletedCard));
    })
    .catch((err) => handleCardError(err, next));
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => res.send(card))
    .catch((err) => handleCardError(err, next));
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => res.send(card))
    .catch((err) => handleCardError(err, next));
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
