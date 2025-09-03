const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyToken = require('../middlewares/firebaseAuth');

// Obtener todos los usuarios (protegido)
router.get('/', verifyToken, async (req, res) => {
  try {
    const [users] = await db.query('SELECT * FROM users');
    res.json(users);
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
    await db.query(
      'INSERT INTO users (id, email) VALUES (?, ?)',
      [id, email]
    );
    const [newUser] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    res.json(newUser[0]);
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
    await db.query(
      'UPDATE users SET email = ? WHERE id = ?',
      [email, id]
    );
    const [updatedUser] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    res.json(updatedUser[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error actualizando usuario' });
  }
});

// Eliminar usuario (protegido)
router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM users WHERE id = ?', [id]);
    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error eliminando usuario' });
  }
});

module.exports = router;
