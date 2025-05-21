const db = require('../config/db');

const UsuarioModel = {
  buscarPorEmail: (email, callback) => {
    db.query('SELECT * FROM usuarios WHERE email = ?', [email], callback);
  },

  buscarPorId: (id, callback) => {
    db.query('SELECT id, nome, email, foto_perfil FROM usuarios WHERE id = ?', [id], callback);
  },

  criar: (nome, email, senha, callback) => {
    db.query(
      'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
      [nome, email, senha],
      callback
    );
  },

  atualizarFoto: (id, url, callback) => {
    db.query('UPDATE usuarios SET foto_perfil = ? WHERE id = ?', [url, id], callback);
  }
};

module.exports = UsuarioModel;
