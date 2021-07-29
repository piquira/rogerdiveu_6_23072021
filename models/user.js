//import
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// création d'un schéma User avec les données obligatoires
//mot clé unique pour l'attribut email pour éviter deux utilisateurs avec même courriel
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true, match: [/^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4})*$/, "Veuillez écrire une adresse email valide"] },
    password: { type: String, required: true }
});

//email unique pour un même utilisateur vérification avec le plugin "unique validator"
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);