const express = require('express');
const router = express.Router();
const db = require('../../db');
const verifyToken = require('../middleware/verifyToken');

router.use(verifyToken);

// 🔹 Obtener todas las entradas del usuario autenticado
router.get('/', (req, res) => {
  const userId = req.uid;

  db.query(
    'SELECT * FROM entries WHERE user_id = ? ORDER BY updated_at DESC',
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    }
  );
});

// 🔹 Crear nueva entrada
router.post('/', (req, res) => {
  
  const { title, content, frequency_title, frequency_link } = req.body;
  const userId = req.uid;
  const now = new Date();
  
  console.log('🔔 POST /api/entries recibido');
  console.log('Body:', req.body);
  console.log('UID:', req.user);

  db.query(
    `INSERT INTO entries (user_id, title, content, frequency_title, frequency_link, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [userId, title, content, frequency_title, frequency_link, now, now],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({
        id: result.insertId,
        user_id: userId,
        title,
        content,
        frequency_title,
        frequency_link,
        created_at: now,
        updated_at: now
      });
    }
  );
});

// 🔹 Editar entrada (solo si pertenece al usuario)
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, content, frequency_title, frequency_link } = req.body;
  const userId = req.uid;
  const now = new Date();
  
  db.query(
    'SELECT * FROM entries WHERE id = ? AND user_id = ?',
    [id, userId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      if (results.length === 0) return res.status(403).json({ error: 'Acceso denegado' });

      const createdAt = results[0].created_at; // mantener created_at original

      db.query(
        `UPDATE entries
         SET title = ?, content = ?, frequency_title = ?, frequency_link = ?, updated_at = ?
         WHERE id = ?`,
        [title, content, frequency_title, frequency_link, now, id],
        (err) => {
          if (err) return res.status(500).json({ error: err });

          // Devuelve la entrada COMPLETA actualizada
          res.json({
            id: parseInt(id),
            user_id: userId,
            title,
            content,
            frequency_title,
            frequency_link,
            created_at: createdAt,
            updated_at: now
          });
        }
      );
    }
  );
});

// 🔹 Eliminar entrada (solo si pertenece al usuario)
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const userId = req.uid;

  db.query(
    'DELETE FROM entries WHERE id = ? AND user_id = ?',
    [id, userId],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      if (result.affectedRows === 0) return res.status(403).json({ error: 'Acceso denegado o entrada no encontrada' });
      res.json({ message: 'Entrada eliminada' });
    }
  );
});

module.exports = router;
