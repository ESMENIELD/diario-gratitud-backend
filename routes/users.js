const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyToken = require('../middlewares/firebaseAuth');

// Obtener todos los usuarios (protegido)
router.get('/', verifyToken, async (req, res) => {
  try {
    const users = await db.query('SELECT * FROM users');
    res.json(users.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error obteniendo usuarios' });
  }
});

// Crear usuario (protegido)
router.post('/', verifyToken, async (req, res) => {
  const { email } = req.body;
  const id = req.user.uid; // uid de Firebase

  try {
    const result = await db.query(
      'INSERT INTO users (id, email) VALUES ($1, $2) RETURNING *',
      [id, email]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creando usuario' });
  }
});

// Editar email de usuario (protegido)
router.put('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;

  try {
    const result = await db.query(
      'UPDATE users SET email = $1 WHERE id = $2 RETURNING *',
      [email, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error actualizando usuario' });
  }
});

// Eliminar usuario (protegido)
router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error eliminando usuario' });
  }
});

module.exports = router;
