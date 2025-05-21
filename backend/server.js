const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

const authRoutes = require('./routes/authRoutes');
const livrosRoutes = require('./routes/livrosRoutes');

app.use('/', authRoutes);
app.use('/', livrosRoutes);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
