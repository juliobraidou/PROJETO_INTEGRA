const db = require('../config/db');

const LivroModel = {
  adicionarLivro: (dados, callback) => {
    const query = `
  INSERT INTO livros (titulo, autor, genero, nota, capa, comentario, usuario_id)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`;
    const valores = [
      dados.titulo,
      dados.autor,
      dados.genero,
      dados.nota,
      dados.capa,
      dados.comentario,
      dados.usuario_id
    ];
    db.query(query, valores, callback);
  },

  listarPorUsuario: (usuario_id, callback) => {
    db.query('SELECT * FROM livros WHERE usuario_id = ?', [usuario_id], callback);
  }
};

module.exports = LivroModel;