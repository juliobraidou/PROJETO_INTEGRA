const UsuarioModel = require('../models/UsuarioModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET = 'seu_token_secreto';

const AuthController = {
  register: async (req, res) => {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) {
      return res.status(400).json({ error: 'Preencha todos os campos obrigatórios.' });
    }

    try {
      const hashedPassword = await bcrypt.hash(senha, 10);

      UsuarioModel.buscarPorEmail(email, (err, results) => {
        if (err) return res.status(500).json({ error: 'Erro ao verificar e-mail.' });
        if (results.length > 0) {
          return res.status(409).json({ error: 'E-mail já cadastrado.' });
        }

        UsuarioModel.criar(nome, email, hashedPassword, (err, result) => {
          if (err) return res.status(500).json({ error: 'Erro ao registrar usuário.' });
          res.status(201).json({ message: 'Usuário registrado com sucesso!' });
        });
      });
    } catch (err) {
      res.status(500).json({ error: 'Erro interno.' });
    }
  },

  login: (req, res) => {
    const { email, senha } = req.body;

    UsuarioModel.buscarPorEmail(email, async (err, results) => {
      if (err) return res.status(500).json({ error: 'Erro ao consultar usuário.' });
      if (results.length === 0) return res.status(401).json({ error: 'Usuário não encontrado.' });

      const usuario = results[0];
      const senhaValida = await bcrypt.compare(senha, usuario.senha);
      if (!senhaValida) return res.status(401).json({ error: 'Senha incorreta.' });

      const token = jwt.sign({ id: usuario.id }, SECRET, { expiresIn: '1h' });

      res.json({
        message: 'Login realizado com sucesso!',
        token,
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email
        }
      });
    });
  },

  atualizarFoto: (req, res) => {
    const { foto_perfil } = req.body;
    const id = req.usuario.id;

    if (!foto_perfil) {
      return res.status(400).json({ error: 'Foto é obrigatória.' });
    }

    UsuarioModel.atualizarFoto(id, foto_perfil, (err) => {
      if (err) return res.status(500).json({ error: 'Erro ao atualizar a foto.' });
      res.json({ message: 'Foto atualizada com sucesso!' });
    });
  },

  perfil: (req, res) => {
    const id = req.usuario.id;

    UsuarioModel.buscarPorId(id, (err, results) => {
      if (err) return res.status(500).json({ error: 'Erro ao buscar perfil.' });
      if (results.length === 0) return res.status(404).json({ error: 'Usuário não encontrado.' });

      const { id, nome, email, foto_perfil } = results[0];
      res.json({ id, nome, email, foto_perfil });
    });
  }
};

module.exports = AuthController;
