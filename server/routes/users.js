import express from "express";
import bcrypt from "bcrypt";
import { query } from "../config/database.js";
import { authenticateToken } from "../middleware/auth.js";
import { validateUUID } from "../middleware/validation.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

// Middleware para validar actualización de perfil
const validateProfileUpdate = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("El nombre debe tener entre 2 y 100 caracteres"),

  body("phone")
    .optional()
    .isMobilePhone("es-CO")
    .withMessage("Debe ser un número de teléfono válido"),

  body("address")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("La dirección no puede exceder 500 caracteres"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Errores de validación",
        errors: errors.array(),
      });
    }
    next();
  },
];
//editar informacion desde el perfil
router.put("/me", authenticateToken, async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    const userId = req.user.id;

    const result = await query(
      `UPDATE users SET 
        name = $1, 
        email = $2, 
        phone = $3, 
        address = $4 
      WHERE id = $5 
      RETURNING id, name, email, phone, address`,
      [name, email, phone, address, userId]
    );

    const updatedUser = result.rows[0];

    res.json({
      success: true,
      message: "Perfil actualizado",
      data: { user: updatedUser },
    });
  } catch (error) {
    console.error("Error actualizando perfil:", error);
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
      `
      SELECT 
        id, name, email, phone, address, avatar_url, 
        email_verified, created_at, updated_at
      FROM users 
      WHERE id = $1
    `,
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

// Actualizar perfil del usuario
router.put(
  "/profile",
  authenticateToken,
  validateProfileUpdate,
  async (req, res) => {
    try {
      const { name, phone, address, avatar_url } = req.body;
      const userId = req.user.id;

      // Construir query dinámicamente
      const updates = [];
      const values = [];
      let paramCount = 0;

      if (name !== undefined) {
        paramCount++;
        updates.push(`name = $${paramCount}`);
        values.push(name);
      }

      if (phone !== undefined) {
        paramCount++;
        updates.push(`phone = $${paramCount}`);
        values.push(phone);
      }

      if (address !== undefined) {
        paramCount++;
        updates.push(`address = $${paramCount}`);
        values.push(address);
      }

      if (avatar_url !== undefined) {
        paramCount++;
        updates.push(`avatar_url = $${paramCount}`);
        values.push(avatar_url);
      }

      if (updates.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No hay campos para actualizar",
        });
      }

      // Agregar updated_at y user_id
      updates.push("updated_at = CURRENT_TIMESTAMP");
      paramCount++;
      values.push(userId);

      const updateQuery = `
      UPDATE users SET ${updates.join(", ")}
      WHERE id = $${paramCount}
      RETURNING id, name, email, phone, address, avatar_url, updated_at
    `;

      const result = await query(updateQuery, values);
      const user = result.rows[0];

      res.json({
        success: true,
        message: "Perfil actualizado exitosamente",
        data: { user },
      });
    } catch (error) {
      console.error("Error actualizando perfil:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  }
);

// Cambiar contraseña
router.put(
  "/change-password",
  authenticateToken,
  [
    body("current_password")
      .notEmpty()
      .withMessage("La contraseña actual es requerida"),

    body("new_password")
      .isLength({ min: 6 })
      .withMessage("La nueva contraseña debe tener al menos 6 caracteres")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage(
        "La nueva contraseña debe contener al menos una mayúscula, una minúscula y un número"
      ),

    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Errores de validación",
          errors: errors.array(),
        });
      }
      next();
    },
  ],
  async (req, res) => {
    try {
      const { current_password, new_password } = req.body;
      const userId = req.user.id;

      // Obtener contraseña actual
      const userResult = await query(
        "SELECT password FROM users WHERE id = $1",
        [userId]
      );

      const user = userResult.rows[0];

      // Verificar contraseña actual
      const isValidPassword = await bcrypt.compare(
        current_password,
        user.password
      );

      if (!isValidPassword) {
        return res.status(400).json({
          success: false,
          message: "La contraseña actual es incorrecta",
        });
      }

      // Hashear nueva contraseña
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(new_password, saltRounds);

      // Actualizar contraseña
      await query(
        "UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
        [hashedPassword, userId]
      );

      res.json({
        success: true,
        message: "Contraseña actualizada exitosamente",
      });
    } catch (error) {
      console.error("Error cambiando contraseña:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  }
);

// Obtener productos del usuario autenticado
router.get("/my-products", authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const offset = (page - 1) * limit;
    const userId = req.user.id;

    const productsResult = await query(
      `
      SELECT 
        p.id, p.title, p.description, p.price, p.stock, p.capacity, 
        p.location, p.image_url, p.featured, p.is_active, p.created_at, p.updated_at,
        c.name as category_name, c.id as category_id
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE p.user_id = $1
      ORDER BY p.created_at DESC
      LIMIT $2 OFFSET $3
    `,
      [userId, limit, offset]
    );

    const countResult = await query(
      "SELECT COUNT(*) as total FROM products WHERE user_id = $1",
      [userId]
    );

    const products = productsResult.rows;
    const total = Number.parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          current_page: Number.parseInt(page),
          total_pages: totalPages,
          total_items: total,
          items_per_page: Number.parseInt(limit),
          has_next: page < totalPages,
          has_prev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Error obteniendo productos del usuario:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
});

// Obtener favoritos del usuario
router.get("/favorites", authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const offset = (page - 1) * limit;
    const userId = req.user.id;

    const favoritesResult = await query(
      `
      SELECT 
        p.id, p.title, p.description, p.price, p.stock, p.capacity, 
        p.location, p.image_url, p.featured, p.created_at,
        u.name as seller_name, u.id as seller_id,
        c.name as category_name, c.id as category_id,
        f.created_at as favorited_at
      FROM favorites f
      JOIN products p ON f.product_id = p.id
      JOIN users u ON p.user_id = u.id
      JOIN categories c ON p.category_id = c.id
      WHERE f.user_id = $1 AND p.is_active = true
      ORDER BY f.created_at DESC
      LIMIT $2 OFFSET $3
    `,
      [userId, limit, offset]
    );

    const countResult = await query(
      `
      SELECT COUNT(*) as total 
      FROM favorites f
      JOIN products p ON f.product_id = p.id
      WHERE f.user_id = $1 AND p.is_active = true
    `,
      [userId]
    );

    const favorites = favoritesResult.rows;
    const total = Number.parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        favorites,
        pagination: {
          current_page: Number.parseInt(page),
          total_pages: totalPages,
          total_items: total,
          items_per_page: Number.parseInt(limit),
          has_next: page < totalPages,
          has_prev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Error obteniendo favoritos:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
});

// Obtener información pública de un usuario
router.get("/:id", validateUUID("id"), async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      "SELECT id, name, email, phone, address FROM users WHERE id = $1 AND is_active = true",
      [id]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado" });
    }

    res.json({ success: true, data: { user: result.rows[0] } });
  } catch (error) {
    console.error("Error cargando usuario:", error);
    res
      .status(500)
      .json({ success: false, message: "Error interno del servidor" });
  }
});

// Obtener productos de un usuario específico
router.get("/:id/products", validateUUID("id"), async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 12 } = req.query;
    const offset = (page - 1) * limit;

    // Verificar que el usuario existe
    const userResult = await query(
      "SELECT id, name FROM users WHERE id = $1 AND is_active = true",
      [id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    const productsResult = await query(
      `
      SELECT 
        p.id, p.title, p.description, p.price, p.stock, p.capacity, 
        p.location, p.image_url, p.featured, p.created_at,
        c.name as category_name, c.id as category_id
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE p.user_id = $1 AND p.is_active = true
      ORDER BY p.created_at DESC
      LIMIT $2 OFFSET $3
    `,
      [id, limit, offset]
    );

    const countResult = await query(
      "SELECT COUNT(*) as total FROM products WHERE user_id = $1 AND is_active = true",
      [id]
    );

    const products = productsResult.rows;
    const total = Number.parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        user: userResult.rows[0],
        products,
        pagination: {
          current_page: Number.parseInt(page),
          total_pages: totalPages,
          total_items: total,
          items_per_page: Number.parseInt(limit),
          has_next: page < totalPages,
          has_prev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Error obteniendo productos del usuario:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
});

export default router;
