import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js'; 

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  
  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
  }
  
  try {
    const decoded = jwt.verify(token, TOKEN_SECRET);
    req.user = decoded.user; 
    next();
  } catch (error) {
    console.error('Error de autenticación:', error.message);
    return res.status(401).json({ message: 'Acceso denegado. Token inválido.' });
  }
};
