/*Veillez à placer la route POST au-dessus du middleware pour les demandes GET,car la logique GET interceptera actuellement
toutes les demandes envoyées à votre point de terminaison /api/stuff , étant donné qu'on ne lui a pas 
spécifié de verbe spécifique. Placer la route POST au-dessus interceptera les demandes POST,
en les empêchant d'atteindre le middleware GET.node */
//logique de nos routes sauces - routeur Express enregistrer les routes à l'intérieur
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
//Requête GET pour chercher toutes les sauces
router.get ('/', auth, saucesCtrl.getAllSauce);
//Requête POST pour poster une sauce
router.post('/', auth, multer, saucesCtrl.createSauce);
//Requête GET pour chercher une sauce
router.get ('/:id', auth, saucesCtrl.getOneSauce);
//Requête PUT pour modifier une sauce
router.put ('/:id', auth, saucesCtrl.modifySauce);
//Requête DELETE pour effacer une sauce
router.delete('/:id', auth, saucesCtrl.deleteSauce);
//Requête POST pour enregistrer un like/disklike
router.post('/:id/like', auth, saucesCtrl.likeDislike);


module.exports = router;

