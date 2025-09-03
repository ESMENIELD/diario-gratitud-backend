const express = require('express');
const cors = require('cors');
const db = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
res.header(
  "Access-Control-Allow-Headers",
  "Origin, X-Requested-With, Content-Type, Accept, Authorization"
);

  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  
  // Manejar preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});
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
