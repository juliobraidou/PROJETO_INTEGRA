const mysql = require('mysql2');
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'mylibrary'
});

db.connect(err => {
  if (err) console.error('Erro ao conectar no banco:', err);
  else console.log('MySQL conectado.');
});

module.exports = db;
