/*middleware qui protége les routes sélectionnées et vérifie que l'utilisateur est authentifié avant d'autoriser l'envoi de ses requêtes.
gestion des erruers avec bloc try...catch
Extraire le token du header Authorization de la requête entrante.il contient également le mot-clé Bearer . 
Utiliser la fonction split pour récupérer tout après l'espace dans le header
fonction verify pour décoder notre token. Extraire l'ID utilisateur de notre token
 ID utilisateur comparé à celui extrait du token
Si utilisateur authentifié. passer l'exécution à l'aide de la fonction next()
*/
//import
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw 'ID utilisateur non valide';
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Non autorisé')
    });
  }
};