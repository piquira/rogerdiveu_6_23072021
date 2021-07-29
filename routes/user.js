//import
const express = require('express');
const router = express.Router();
// Contrôle si le courriel utilisateur est déja enregistrer
const userCtrl = require('../controllers/user');
// Controle si le mot de passe est conforme pour la sécurité
const passwordValide = require('../middleware/password-valide');

router.post('/signup', passwordValide, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router; 