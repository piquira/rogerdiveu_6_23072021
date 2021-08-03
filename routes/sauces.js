/*logique de nos routes sauces - routeur Express enregistrer les routes à l'intérieur
remplacer la route de base d'enregistrement du routeur '/api/sauces' par '/'______________*/

//import
const express = require ('express');
const router = express.Router();

//réimplémenter cela dans notre route, nous devons importer notre contrôleur
const saucesCtrl = require("../controllers/sauces");
// importer le middleware d'authentification et le passer comme argument aux routes à protéger
const auth = require('../middleware/auth');
//importer des images du frontend
const multer = require('../middleware/multer-config');

// placer multer après auth, authentification avant import de l'image
//Requête POST pour poster une sauce
router.post('/', auth, multer, saucesCtrl.createSauce);
//Requête PUT pour modifier une sauce
router.put ('/:id', auth, multer, saucesCtrl.modifySauce);
//Requête DELETE pour effacer une sauce
router.delete('/:id', auth, saucesCtrl.deleteSauce);
//Requête GET pour chercher une sauce
router.get ('/:id', auth, saucesCtrl.getOneSauce);
//Requête GET pour chercher toutes les sauces
router.get ('/', auth, saucesCtrl.getAllSauce);
//Requête POST pour enregistrer un like/disklike
router.post('/:id/like', auth, saucesCtrl.likeDislike);


module.exports = router;

