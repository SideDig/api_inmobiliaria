import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { conexion } from "../db.js";
import { TOKEN_SECRET, createAccessToken } from '../components/token.js';

// Registro de Usuario
export const register = async (req, res) => {
    const { nombre, email, contrasena } = req.body;
  
    try {
      const passwordHash = await bcrypt.hash(contrasena, 10);
  
      const query = `INSERT INTO usuarios (nombre, email, contrasena) VALUES (?, ?, ?)`;
      await conexion.execute(query, [nombre, email, passwordHash]);
  
      const [newUser] = await conexion.execute('SELECT * FROM usuarios WHERE email = ?', [email]);
      const token = await createAccessToken({ id: newUser[0].id });
  
      res.cookie('token', token);
      res.json({
        ...newUser[0],
        token
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

// Inicio de Sesión
export const login = async (req, res) => {
    const { email, contrasena } = req.body;
  
    try {
      const [foundUser] = await conexion.execute('SELECT * FROM usuarios WHERE email = ?', [email]);
      if (foundUser.length === 0) {
        return res.status(400).json({ message: 'Usuario no encontrado' });
      }
  
      const match = await bcrypt.compare(contrasena, foundUser[0].contrasena);
      if (!match) {
        return res.status(400).json({ message: 'Credenciales inválidas' });
      }
  
      const token = await createAccessToken({ id: foundUser[0].id });
  
      res.cookie('token', token);
      res.json({
        ...foundUser[0],
        token
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

// Cerrar Sesión
export const logout = (req, res) => {
    res.cookie('token', "", { expires: new Date(0) });
    return res.sendStatus(200);
  };

// Verificar Token
export const verifyToken = async (req, res) => {
    const { token } = req.cookies;
  
    if (!token) {
      return res.status(401).json(['No autorizado']);
    }
  
    jwt.verify(token, TOKEN_SECRET, async (err, user) => {
      if (err) {
        return res.status(401).json(['No autorizado']);
      }
  
      const [userFound] = await conexion.execute('SELECT * FROM usuarios WHERE id = ?', [user.id]);
      if (userFound.length === 0) {
        return res.status(401).json(['No se encontró el usuario']);
      }
      return res.json(userFound[0]);
    });
  };
