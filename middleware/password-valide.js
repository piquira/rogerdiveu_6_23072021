const passwordSchema = require('../models/password');

// vérifie que le mot de passe valide le schema décrit
module.exports = (req, res, next) => {
    if (!passwordSchema.validate(req.body.password)) {
        res.writeHead(400, '{"message":"8 caractères minimun, au moins 1 Majuscule, 1 minuscule, 1 chiffres et sans espaces"}', 
            {'content-type': 'application/json'
            });
        res.end('Format du mot de passe incorrect');
    } else {
        next();
    }
};