//contre le piratage de session et attaque de force brute
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
    max: 100,// limite adresse IP de 100 max requête par session windowsMS
    windowMs: 60 * 60 * 1000, // 1 heure
    message: 'Limite du nombre de requêtes' // message 
});

module.exports = rateLimit(limiter);