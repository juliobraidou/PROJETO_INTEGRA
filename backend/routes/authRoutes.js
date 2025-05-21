const express = require('express');
const router = express.Router();
const db = require('../config/db');
const AuthController = require('../controllers/AuthController');
const { autenticarToken } = require('../middleware/authMiddleware');

// Registro e login
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// Atualizar foto do usuário
router.put('/usuario/foto', autenticarToken, AuthController.atualizarFoto);

// Buscar dados do usuário logado
router.get('/usuario', autenticarToken, AuthController.perfil);

// Listar todos os usuários (uso interno ou administrativo)
router.get('/usuarios', (req, res) => {
  db.query('SELECT id, nome, email FROM usuarios', (err, results) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar usuários' });
    res.json(results);
  });
});

module.exports = router;
