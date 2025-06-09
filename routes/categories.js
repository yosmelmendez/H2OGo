import express from "express";
import { query } from "../config/database.js";
import { validateUUID } from "../middleware/validation.js";

const router = express.Router();

// Obtener todas las categorías activas
router.get("/", async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        c.id, c.name, c.description, c.image_url, c.created_at,
        COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id AND p.is_active = true
      WHERE c.is_active = true
      GROUP BY c.id, c.name, c.description, c.image_url, c.created_at
      ORDER BY c.name ASC
    `);

    const categories = result.rows;

    res.json({
      success: true,
      data: { categories },
    });
  } catch (error) {
    console.error("Error obteniendo categorías:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
});

// Obtener categoría por ID
router.get("/:id", validateUUID("id"), async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `
      SELECT 
        c.id, c.name, c.description, c.image_url, c.created_at,
        COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id AND p.is_active = true
      WHERE c.id = $1 AND c.is_active = true
      GROUP BY c.id, c.name, c.description, c.image_url, c.created_at
    `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Categoría no encontrada",
      });
    }

    const category = result.rows[0];

    res.json({
      success: true,
      data: { category },
    });
  } catch (error) {
    console.error("Error obteniendo categoría:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
});

// Obtener productos de una categoría
router.get("/:id/products", validateUUID("id"), async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 12 } = req.query;
    const offset = (page - 1) * limit;

    // Verificar que la categoría existe
    const categoryResult = await query(
      "SELECT id, name FROM categories WHERE id = $1 AND is_active = true",
      [id]
    );

    if (categoryResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Categoría no encontrada",
      });
    }

    // Obtener productos de la categoría
    const productsResult = await query(
      `
      SELECT 
        p.id, p.title, p.description, p.price, p.stock, p.capacity, 
        p.location, p.image_url, p.featured, p.created_at,
        u.name as seller_name, u.id as seller_id
      FROM products p
      JOIN users u ON p.user_id = u.id
      WHERE p.category_id = $1 AND p.is_active = true
      ORDER BY p.created_at DESC
      LIMIT $2 OFFSET $3
    `,
      [id, limit, offset]
    );

    // Contar total de productos
    const countResult = await query(
      "SELECT COUNT(*) as total FROM products WHERE category_id = $1 AND is_active = true",
      [id]
    );

    const products = productsResult.rows;
    const total = Number.parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        category: categoryResult.rows[0],
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
    console.error("Error obteniendo productos de categoría:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
});

export default router;
