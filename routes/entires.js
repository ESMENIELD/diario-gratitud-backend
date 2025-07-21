const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener todas las entradas
router.get('/', (req, res) => {
  db.query('SELECT * FROM entries ORDER BY created_at DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Crear nueva entrada
router.post('/', (req, res) => {
   console.log("POST /entries body:", req.body)
  const { title, content, frequency_title, frequency_link } = req.body;
  const now = new Date();
  db.query(
    'INSERT INTO entries (title, content, frequency_title, frequency_link, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
    [title, content, frequency_title, frequency_link, now, now],
    (err, result) => {
      if (err) {
  console.error("❌ Error al insertar en la DB:", err);
  return res.status(500).json({ error: err.message });
}
      res.json({ id: result.insertId, title, content, frequency_title, frequency_link, created_at: now, updated_at: now });
    }
  );
});

// Editar una entrada
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, content, frequency_title, frequency_link } = req.body;
  const now = new Date();
  db.query(
    'UPDATE entries SET title = ?, content = ?, frequency_title = ?, frequency_link = ?, updated_at = ? WHERE id = ?',
    [title, content, frequency_title, frequency_link, now, id],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: 'Entrada actualizada', updated_at: now });
    }
  );
});


module.exports = router;
