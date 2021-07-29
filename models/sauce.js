//import mongoose
const mongoose = require('mongoose');

// schéma de données qui contient les champs souhaités pour chaque Thing / sauce
//id de la sauce pas besoin d'un champs il est généré par Mongoose
//id unique mongoDB de l'utilisateur
const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number },
    dislikes: { type: Number },
    usersLiked: { type: [String] },
    usersDisliked: { type: [String] }
});

// export du schema des données pour le rendre disponible pour Express
module.exports = mongoose.model('Sauce', sauceSchema);