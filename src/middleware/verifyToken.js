// src/middleware/verifyToken.js
const admin = require('../firebaseAdmin');

async function verifyToken(req, res, next) {
  const auth = req.headers.authorization;
  console.log('auth', auth);
  
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' });
  }

  const idToken = auth.split('Bearer ')[1];
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    req.uid = decoded.uid;
    console.log('user',req.user);
    
    next();
  } catch (e) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = verifyToken;
