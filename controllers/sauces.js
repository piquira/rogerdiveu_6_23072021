/*___________POST le frontend envoie les données vers le backend création de l'objet
méthode next permet à chaque middleware de passer l'exécution au middleware suivant
mot-clé new avec un modèle Mongoose crée par défaut un champ_id
méthode save renvoie une Promise
opérateur spread ... est utilisé pour faire une copie de tous les éléments de req.body
remplacer la route de base d'enregistrement du routeur '/api/sauces' par '/'______________*/
//______________________Logique métier de nos routes des sauces pour chaque crud
//Import modèle sauce Mongoose 
const Sauce = require("../models/sauce");
const fs = require('fs');

/* ajouter un fichier à la requête, le front-end envoie les données de la requête sous la forme form-data, et non sous forme de JSON
analyser à l'aide de JSON.parse() pour obtenir un objet utilisable.
résoudre l'URL complète de notre image. utilisons req.protocol
le premier segment (dans notre cas 'http' ). ajouter '://' , puis utiliser req.get('host') pour résoudre l'hôte du serveur (ici, 'localhost:3000' ).
ajouter '/images/' et le nom de fichier  */

// fonction appelée creerSauce Permet de créer une nouvelle sauce
exports.createSauce = (req, res, next) => {
  // données envoyées par le front-end
  const sauceObject = JSON.parse(req.body.sauce);
  //Supprimer l'id généré par le front-end. L'id de la sauce est créé par la base MongoDB lors de sa création
  delete sauceObject._id;
  // Création du modèle Sauce
  const sauce = new Sauce({
      ...sauceObject,
      //modifier l'URL de l'image aprés avoir mis en place le middleware multer
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      likes: 0,
      dislikes: 0,
      usersLiked: [],
      usersDisliked: []
  });
  // Sauvegarde de la sauce dans la base de données
  sauce.save()
      .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
      .catch(error => res.status(400).json({ error }));
  };

//Route requêtes PUT pour modifier l'objet
//méthode updateOne() dans notre modèle Thing . Pour mettre à jour le Thing correspondant à l'objet passé en premier argument. 
//Utiliser le paramètre id passé dans la demande et le remplacer par le Thing passé comme second argument.
exports.modifySauce = (req, res, next) => {                                  
  const sauceObject = req.file ?
    {// Operateur Spread "..." utilisé pour faire une copie de tout les elemts de req.body
      ...JSON.parse(req.body.sauce),        
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id }) 
    .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
    .catch(error => res.status(400).json({ error }));
};


/* Partie métier servant à supprimer une sauce On recherche la sauce par rapport a son Id
récupèrer également son image et à l'aide de fs.unlink() on supprime l'image puis la sauce
à l'aide de (deleteOne) */
 exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

/*Route méthode get pour répondre uniquement aux demandes GET à cet endpoint backend envoie les données au frontend
: en face du segment dynamique de la route pour la rendre accessible en tant que paramètre
findOne dans notre modèle Sauce pour trouver le Sauce unique ayant le même _id */
exports.getOneSauce = (req, res , next) => {
    Sauce.findOne ({_id: req.params.id})
    .then (sauce => res.status(200).json(sauce))
    .catch (error => res.status(404).json ({ error}));
};

//route GET pour renvoyer les Sauces dans la base de données
// méthode find dans le modèle Mongoose pour renvoyer un tableau avec toutes les Sauces dans base de données.
exports.getAllSauce = (req,res, next) => {
    Sauce.find()
    .then (sauces => res.status (200).json (sauces))
    .catch (error => res.status(400).json ({error}));
};

//Route pour envoyer les "j'aime"ou "j'aime pas" pour une sauce
exports.likeDislike = (req, res, next) => {

  // Like présent dans le body
  let like = req.body.like;
  // le userID
  let userId = req.body.userId;
  // l'id de la sauce
  let sauceId = req.params.id;

  if (like === 1) { // si j'aime
      Sauce.updateOne({ _id: sauceId }, 
        {  // On push l'utilisateur et on incrémente le compteur de 1
            $push: { usersLiked: userId },
            $inc: { likes: +1 },
        })
          .then(() => res.status(200).json({ message: ' jaime !'}))
          .catch(error => res.status(400).json({ error }));
    }
  if (like === -1) { // si j'aime pas
      Sauce.updateOne({ _id: sauceId },
        {
            $push: { usersDisliked: userId },
            $inc: { dislikes: +1 },
        })
          .then(() => res.status(200).json({ message: 'jaime pas !'}))
          .catch(error => res.status(400).json({ error }));
  }
  if (like === 0) { // Si annuler un j'aime ou un j'aime pas
      Sauce.findOne({ _id: sauceId })
      .then((sauce) => {
          if (sauce.usersLiked.includes(userId)) { // Si annuler un j'aime
              Sauce.updateOne({ _id: sauceId },
                {
                    $pull: { usersLiked: userId },
                    $inc: { likes: -1 },
                })
                  .then(() => res.status(200).json({ message: ' neutre !'}))
                  .catch(error => res.status(400).json({ error }));
    }
    if (sauce.usersDisliked.includes(userId)) { // Si annuler un j'aime pas
              Sauce.updateOne({ _id: sauceId },
                {
                    $pull: { usersDisliked: userId },
                    $inc: { dislikes: -1 },
                  })
                  .then(() => res.status(200).json({ message: 'neutre !'}))
                  .catch(error => res.status(400).json({ error }));
    }
      }).catch((error) => res.status(404).json({ error }));
  }
};