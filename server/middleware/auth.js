import jwt from "jsonwebtoken";
import { query } from "../config/database.js";

// Middleware para verificar token JWT
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token de acceso requerido",
      });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verificar que el usuario existe y está activo
    const userResult = await query(
      "SELECT id, email, name, is_active FROM users WHERE id = $1",
      [decoded.userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    const user = userResult.rows[0];

    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: "Cuenta desactivada",
      });
    }

    // Agregar información del usuario al request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Token inválido",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expirado",
      });
    }

    console.error("Error en autenticación:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

// Middleware opcional para rutas que pueden funcionar con o sin autenticación
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userResult = await query(
        "SELECT id, email, name, is_active FROM users WHERE id = $1",
        [decoded.userId]
      );

      if (userResult.rows.length > 0 && userResult.rows[0].is_active) {
        req.user = userResult.rows[0];
      }
    }

    next();
  } catch (error) {
    // En caso de error, continuar sin usuario autenticado
    next();
  }
};

// Middleware para verificar que el usuario es propietario del recurso
export const checkOwnership = (resourceIdParam = "id") => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params[resourceIdParam];
      const userId = req.user.id;

      // Verificar en la tabla de productos (puedes extender para otras tablas)
      const result = await query("SELECT user_id FROM products WHERE id = $1", [
        resourceId,
      ]);

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Recurso no encontrado",
        });
      }

      if (result.rows[0].user_id !== userId) {
        return res.status(403).json({
          success: false,
          message: "No tienes permisos para acceder a este recurso",
        });
      }

      next();
    } catch (error) {
      console.error("Error verificando propiedad:", error);
      return res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  };
};
