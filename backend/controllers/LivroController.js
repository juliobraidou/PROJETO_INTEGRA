const db = require('../config/db');

exports.criar = (req, res) => {
  const { titulo, autor, genero, nota, capa, comentario } = req.body;
  const usuario_id = req.usuario.id;

  if (!titulo || !autor || !nota) {
    return res.status(400).json({ error: 'Título, autor e nota são obrigatórios.' });
  }

  const sql = `
    INSERT INTO livros (titulo, autor, genero, nota, capa, comentario, usuario_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [titulo, autor, genero, nota, capa, comentario, usuario_id];

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error('Erro ao salvar livro:', err); // ← Aqui aparecerá o erro detalhado no terminal
      return res.status(500).json({ error: 'Erro ao salvar livro.' });
    }

    res.status(201).json({
      message: 'Livro adicionado com sucesso!',
      id: result.insertId
    });
  });
};

exports.listar = (req, res) => {
  const usuario_id = req.usuario.id;

  db.query('SELECT * FROM livros WHERE usuario_id = ?', [usuario_id], (err, results) => {
    if (err) {
      console.error('Erro ao buscar livros:', err);
      return res.status(500).json({ error: 'Erro ao buscar livros.' });
    }

    res.json(results);
  });
};
