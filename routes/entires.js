const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyToken = require('../middlewares/firebaseAuth');

// Obtener todas las entradas del usuario autenticado
router.get('/', verifyToken, async (req, res) => {
  const userId = req.user.uid;
  try {
    const entries = await db.query('SELECT * FROM entries WHERE user_id = $1', [userId]);
    res.json(entries.rows);
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
    const result = await db.query(
      'INSERT INTO entries (user_id, content, date) VALUES ($1, $2, $3) RETURNING *',
      [userId, content, date]
    );
    res.json(result.rows[0]);
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
    const result = await db.query(
      'UPDATE entries SET content = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
      [content, id, req.user.uid]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error actualizando entrada' });
  }
});

// Eliminar entrada
router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM entries WHERE id = $1 AND user_id = $2', [id, req.user.uid]);
    res.json({ message: 'Entrada eliminada' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error eliminando entrada' });
  }
});

module.exports = router;
