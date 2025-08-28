const express = require('express');
const cors = require('cors');
const db = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Servidor funcionando 👋');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
const entriesRoutes = require('./routes/entires');
const usersRoutes= require("./routes/users");
app.use('/api/entries', entriesRoutes);
app.use("/api/users", usersRoutes)
