// src/utils/auth.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const SECRET_KEY = 'tu_clave_secreta_super_segura'; // En producción, usa una variable de entorno

export const generateToken = (user) => {
  return jwt.sign(
    { 
      userId: user.id, 
      phone: user.phone,
      role: user.role 
    },
    SECRET_KEY,
    { expiresIn: '24h' }
  );
};

// Verificar token JWT
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
};

// Hash de contraseña
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Comparar contraseña con hash
export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};