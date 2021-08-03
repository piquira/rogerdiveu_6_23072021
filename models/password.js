const passwordValidator = require('password-validator');

// création du schéma pour le mot de passe 
const passSchema = new passwordValidator();

// propriétés du schéma du mot de passe
passSchema
    .is().min(8) // 8 caractères minimun
    .is().max(100) // 100 caractères maximum
    .has().uppercase() // Au moins une majuscule
    .has().lowercase() // Au moins une minuscule
    .has().digits(1) // Au moins un chiffre
    .has().not().spaces() // Pas d'espace
    .is().not().oneOf(['Passw0rd', 'Password123',]); // Interdit

module.exports = passSchema;