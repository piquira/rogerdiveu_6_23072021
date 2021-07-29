//____________________logique globale de l'application
//Import
const express = require('express');
const mongoose = require('mongoose');
//importation du fichier des routes sauces
const saucesRoutes = require ('./routes/sauces');
//importation du fichier des routes utilisateur
const userRoutes = require('./routes/user');
//importation du fichier des routes import d'images
const path = require('path');
//Import de helmet pour la sécurité contre les injections
const helmet = require("helmet");

const app = express();

//logique mongooDB
mongoose.connect('mongodb+srv://roger:open22@cluster0.9u3pz.mongodb.net/sauce?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
   })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//CORS émpêche les requêtes entre différents serveurs. Nous avons deux serveurs, nous devons mettre des headers
//accéder à notre API depuis n'importe quelle origine ( '*' ) 
//on donne l'autorisation d'utiliser certains entêtes sur l'objet requête
//envoyer des requêtes avec les méthodes mentionnées ( GET ,POST , etc.).
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
  });

  app.use(helmet());
/*gérer la ressource images de manière statique (un sous-répertoire de notre répertoire de base, __dirname
 chaque fois qu'elle reçoit une requête vers la route /images ______________*/
  app.use('/images', express.static(path.join(__dirname, 'images')));
  app.use(express.static('images'));
//'extraire l'objet JSON de la demande et analyse le corps de la demande
  app.use(express.urlencoded({extended: true}));
  app.use(express.json());


//enregistrer les différentes routes pour les demandes vers api/......
app.use('/api/sauces',saucesRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;