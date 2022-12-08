const sauceModel = require("../models/sauce.model");
const fs = require('fs');

module.exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject.userId;
  const sauce = new sauceModel({
    ...sauceObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
  });
  sauce
    .save()
    .then(() =>
      res.status(201).json({ message: "La sauce a bien été enregistrée !" })
    )
    .catch((error) => res.status(400).json({ error }));
};

module.exports.readAllSauces = (req, res, next) => {
  sauceModel
    .find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

module.exports.readOneSauce = (req, res, next) => {
  sauceModel
    .findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(400).json({ error }));
};

module.exports.updateSauce = (req, res, next) => {
  sauceModel
    .findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Modification non autorisée" });
      } else {
        if (req.file) {
          const sauceObject = {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
          };
          delete sauceObject.userId;
          const filename = sauce.imageUrl.split("/images/")[1];
          fs.unlink(`images/${filename}`, () => {
            sauceModel
              .updateOne(
                { _id: req.params.id },
                { ...sauceObject, _id: req.params.id }
              )
              .then(() =>
                res.status(200).json({
                  message: "mofidication de la sauce accomplie avec succès",
                })
              )
              .catch((error) => res.status(401).json({ error }));
          });
        } else {
          const sauceObject = {
            ...req.body,
          };
          delete sauceObject.userId;
          sauceModel
            .updateOne(
              { _id: req.params.id },
              { ...sauceObject, _id: req.params.id }
            )
            .then(() =>
              res.status(200).json({
                message: "mofidication de la sauce accomplie avec succès",
              })
            )
            .catch((error) => res.status(401).json({ error }));
        }
      }
    })
    .catch((error) => res.status(400).json({ error }));
};

module.exports.deleteSauce = (req, res, next) => {
  sauceModel
    .findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Suppression non autorisée" });
      } else {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          sauceModel
            .deleteOne({ _id: req.params.id })
            .then(() =>
              res.status(200).json({ message: "Sauce supprimée avec succès" })
            )
            .catch((error) => res.status(400).json({ error }));
        });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

module.exports.likeSauce = (req, res, next) => {
  sauceModel
    .findOne({ _id: req.params.id })
    .then((sauce) => {
      switch (req.body.like) {
        case +1:
          sauceModel
            .updateOne(
              { _id: req.params.id },
              { $push: { usersLiked: req.auth.userId }, $inc: { likes: +1 } }
            )
            .then(() =>
              res.status(200).json({ message: "Sauce likée avec succès" })
            )
            .catch((error) => res.status(400).json({ error }));
          break;

        case -1:
          sauceModel
            .updateOne(
              { _id: req.params.id },
              { $push: { usersDisliked: req.auth.userId }, $inc: { dislikes: +1 } }
            )
            .then(() =>
              res.status(200).json({ message: "Sauce dislikée avec succès" })
            )
            .catch((error) => res.status(400).json({ error }));
          break;

        case 0:
          if (sauce.usersLiked.includes(req.auth.userId)) {
            sauceModel
              .updateOne(
                { _id: req.params.id },
                { $pull: { usersLiked: req.auth.userId }, $inc: { likes: -1 } }
              )
              .then(() =>
                res.status(200).json({ message: "Like annulé avec succès" })
              )
              .catch((error) => res.status(400).json({ error }));
          } else {
            sauceModel
              .updateOne(
                { _id: req.params.id },
                { $pull: { usersDisliked: req.auth.userId }, $inc: { dislikes: -1 } }
              )
              .then(() =>
                res.status(200).json({ message: "dislike annulé avec succès" })
              )
              .catch((error) => res.status(400).json({ error }));
          }
          break;
      }
    })
    .catch((error) => res.status(400).json({ error }));
};
