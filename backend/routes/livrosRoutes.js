const express = require('express');
const router = express.Router();
const LivroController = require('../controllers/LivroController');
const { autenticarToken } = require('../middleware/authMiddleware');

router.post('/livros', autenticarToken, LivroController.criar);
router.get('/livros', autenticarToken, LivroController.listar);

module.exports = router;
