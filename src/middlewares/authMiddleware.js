import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js'; 

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, TOKEN_SECRET);

    if (decoded.exp < Date.now() / 1000) {
      return res.status(401).json({ message: 'Acceso denegado. Token expirado.' });
    }
    req.user = decoded; 
    console.log('Token verificado, usuario:', req.user); 
    next();
  } catch (error) {
    console.error('Error de autenticación:', error.message);
    return res.status(401).json({ message: 'Acceso denegado. Token inválido.' });
  }
};
