import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { query } from "../config/database.js";
import { validateRegister, validateLogin } from "../middleware/validation.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Función para generar JWT
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// Registro de usuario
router.post("/register", validateRegister, async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await query("SELECT id FROM users WHERE email = $1", [
      email,
    ]);

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "El email ya está registrado",
      });
    }

    // Hashear contraseña
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear usuario
    const result = await query(
      `INSERT INTO users (name, email, password, phone, address) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, name, email, phone, address, created_at`,
      [name, email, hashedPassword, phone, address]
    );

    const user = result.rows[0];

    // Generar token
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: "Usuario registrado exitosamente",
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          created_at: user.created_at,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
});

// Login de usuario
router.post("/login", validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const result = await query(
      "SELECT id, name, email, password, phone, address, is_active FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas",
      });
    }

    const user = result.rows[0];

    // Verificar si la cuenta está activa
    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: "Cuenta desactivada",
      });
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas",
      });
    }

    // Generar token
    const token = generateToken(user.id);

    res.json({
      success: true,
      message: "Login exitoso",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
      },
      token,
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
});

// Obtener perfil del usuario autenticado
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const result = await query(
      "SELECT id, name, email, phone, address, avatar_url, created_at, updated_at FROM users WHERE id = $1",
      [req.user.id]
    );

    const user = result.rows[0];

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    console.error("Error obteniendo perfil:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
});

// Verificar token
router.get("/verify", authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: "Token válido",
    data: {
      user: req.user,
    },
  });
});

// Logout (invalidar token - en una implementación real podrías usar una blacklist)
router.post("/logout", authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: "Logout exitoso",
  });
});

export default router;
