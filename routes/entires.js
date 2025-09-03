const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyToken = require('../middlewares/firebaseAuth');

// Obtener todas las entradas del usuario autenticado
router.get('/', verifyToken, async (req, res) => {
  const userId = req.user.uid;
  try {
    const [entries] = await db.query('SELECT * FROM entries WHERE user_id = ?', [userId]);
    res.json(entries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error obteniendo entradas' });
  }
});

// Crear entrada
router.post('/', verifyToken, async (req, res) => {
  const userId = req.user.uid;
  const { content, date } = req.body;

  try {
    const [result] = await db.query(
      'INSERT INTO entries (user_id, content, date) VALUES (?, ?, ?)',
      [userId, content, date]
    );
    const [newEntry] = await db.query('SELECT * FROM entries WHERE id = ?', [result.insertId]);
    res.json(newEntry[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creando entrada' });
  }
});

// Editar entrada
router.put('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  try {
    await db.query(
      'UPDATE entries SET content = ? WHERE id = ? AND user_id = ?',
      [content, id, req.user.uid]
    );
    const [updatedEntry] = await db.query('SELECT * FROM entries WHERE id = ?', [id]);
    res.json(updatedEntry[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error actualizando entrada' });
  }
});

// Eliminar entrada
router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM entries WHERE id = ? AND user_id = ?', [id, req.user.uid]);
    res.json({ message: 'Entrada eliminada' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error eliminando entrada' });
  }
});

module.exports = router;
