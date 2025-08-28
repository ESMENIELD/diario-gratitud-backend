const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener todas las entradas de un usuario
router.get('/:user_id', (req, res) => {
  const { user_id } = req.params;
  db.query(
    'SELECT * FROM entries WHERE user_id = ? ORDER BY created_at DESC',
    [user_id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    }
  );
});

// Crear nueva entrada para un usuario
router.post('/', (req, res) => {
  console.log("POST /entries body:", req.body);
  const { title, content, frequency_title, frequency_link, user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: 'El user_id es obligatorio' });
  }

  const now = new Date();
  db.query(
    'INSERT INTO entries (title, content, frequency_title, frequency_link, user_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [title, content, frequency_title, frequency_link, user_id, now, now],
    (err, result) => {
      if (err) {
        console.error("❌ Error al insertar en la DB:", err);
        return res.status(500).json({ error: err.message });
      }
      res.json({
        id: result.insertId,
        title,
        content,
        frequency_title,
        frequency_link,
        user_id,
        created_at: now,
        updated_at: now
      });
    }
  );
});

// Editar una entrada de un usuario
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, content, frequency_title, frequency_link, user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: 'El user_id es obligatorio' });
  }

  const now = new Date();
  db.query(
    'UPDATE entries SET title = ?, content = ?, frequency_title = ?, frequency_link = ?, updated_at = ? WHERE id = ? AND user_id = ?',
    [title, content, frequency_title, frequency_link, now, id, user_id],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: 'Entrada actualizada', updated_at: now });
    }
  );
});

// Eliminar una entrada de un usuario
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: 'El user_id es obligatorio' });
  }

  db.query('DELETE FROM entries WHERE id = ? AND user_id = ?', [id, user_id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Entrada eliminada', id, user_id });
  });
});

module.exports = router;
