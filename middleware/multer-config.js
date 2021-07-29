/*télécharger des images d'articles depuis le frontend. Pour ce faire, nous utiliserons multer
qui permet de gérer les fichiers entrants dans les requêtes HTTP  */
//import
const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};
/*constante storage , à passer à multer comme configuration
contient la logique nécessaire pour indiquer à multer où enregistrer les fichiers entrants
fonction destination indique à multer d'enregistrer les fichiers dans le dossier images
fonction filename indique à multer d'utiliser le nom d'origine
de remplacer les espaces par des underscores et d'ajouter un timestamp Date.now() comme nom de fichier.
constante dictionnaire de type MIME pour résoudre l'extension de fichier appropriée   */

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

//exportation et constante storage et gestion uniquement des téléchargements de fichiers image.
module.exports = multer({storage: storage}).single('image');