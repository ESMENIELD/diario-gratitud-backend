const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener todos los usuarios
router.get('/', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Crear nuevo usuario
router.post('/', (req, res) => {
  const { id, email } = req.body;
  if (!id || !email) {
    return res.status(400).json({ error: 'Faltan campos: id y email son obligatorios' });
  }

  db.query(
    'INSERT INTO users (id, email) VALUES (?, ?)',
    [id, email],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: 'Usuario creado', id, email });
    }
  );
});

// Editar solo el email de un usuario
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { email } = req.body;

  db.query(
    'UPDATE users SET email = ? WHERE id = ?',
    [email, id],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: 'Usuario actualizado', id, email });
    }
  );
});

// Eliminar usuario
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM users WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Usuario eliminado', id });
  });
});

module.exports = router;
