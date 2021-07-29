//________________Création d'un utilisateur
// imports
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/*fonction de hachage de bcrypt dans notre mot de passe et « saler » le mot de passe 10 fois.
fonction asynchrone qui renvoie une Promise qui nous renvoie le hash généré
bloc then créer un utilisateur et enregistrer dans la base de données, renvoie une réponse de réussite en cas de succès */
exports.signup = (req, res, next) => {
    console.log(req.body);
    bcrypt.genSalt(10).then((salt) => {
        bcrypt.hash(req.body.password, salt)
        .then(hash => {
            const user = new User({
            email: req.body.email,
            password: hash
            });
            user.save()
            .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
            .catch(error => res.status(400).json({ error }));
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({ error })
        });
    })
    .catch((error) => {
        console.log(error);
        res.status(500).json({ error })
    });
  };

/*vérifier si un utilisateur qui tente de se connecter dispose d'identifiants valides
modèle Mongoose vérifie que l'e-mail entré par l'utilisateur correspond à un utilisateur existant de la base
fonction compare debcrypt pour comparer le mot de passe entré par l'utilisateur avec le hash enregistré dans la base 
fonction sign dejsonwebtoken pour encoder un token contient l'ID de l'utilisateur 
chaîne secrète de développement temporaire RANDOM_SECRET_KEY pour encoder notre token (à remplacer en prod.)  
durée de validité du token à 24 heures. nous renvoyons une réponse 200 contenant l'ID utilisateur */
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
  .then(user => {
      if(!user) {
          return res.status(401).json({ error: 'utilisateur inexistant.' });
      }
      bcrypt.compare( req.body.password, user.password)
      .then(valid => {
          if (!valid) {
              return res.status(401).json ({ error: 'mot de passe incorrect.'});
          }
          res.status(200).json({
              userId: user._id,
              token: jwt.sign(
                  {userId: user._id},
                  'RANDOM_TOKEN_SECRET',
                  {expiresIn: '24h'}
              )
          });
      })
      .catch((error) => {
          console.log(error);
          res.status(500).json({ error})
      });
  })
  .catch(error => res.status(500).json({ error}));
};