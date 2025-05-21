const jwt = require('jsonwebtoken');
const SECRET = 'seu_token_secreto';

function autenticarToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token não fornecido.' });

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido.' });
    req.usuario = user;
    next();
  });
}

module.exports = { autenticarToken };
