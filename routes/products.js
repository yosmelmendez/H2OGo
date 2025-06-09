import express from "express";
import { query } from "../config/database.js";
import {
  authenticateToken,
  optionalAuth,
  checkOwnership,
} from "../middleware/auth.js";
import {
  validateProduct,
  validateUUID,
  validateProductSearch,
} from "../middleware/validation.js";

const router = express.Router();

// Obtener todos los productos con filtros y paginación
router.get("/", validateProductSearch, optionalAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      search,
      category,
      min_price,
      max_price,
      location,
      user_id,
      featured,
    } = req.query;

    const offset = (page - 1) * limit;
    const whereConditions = ["p.is_active = true"];
    const queryParams = [];
    let paramCount = 0;

    // Construir condiciones WHERE dinámicamente
    if (search) {
      paramCount++;
      whereConditions.push(
        `(p.title ILIKE $${paramCount} OR p.description ILIKE $${paramCount})`
      );
      queryParams.push(`%${search}%`);
    }

    if (category) {
      paramCount++;
      whereConditions.push(`p.category_id = $${paramCount}`);
      queryParams.push(category);
    }

    if (min_price) {
      paramCount++;
      whereConditions.push(`p.price >= $${paramCount}`);
      queryParams.push(min_price);
    }

    if (max_price) {
      paramCount++;
      whereConditions.push(`p.price <= $${paramCount}`);
      queryParams.push(max_price);
    }

    if (location) {
      paramCount++;
      whereConditions.push(`p.location ILIKE $${paramCount}`);
      queryParams.push(`%${location}%`);
    }

    if (user_id) {
      paramCount++;
      whereConditions.push(`p.user_id = $${paramCount}`);
      queryParams.push(user_id);
    }

    if (featured === "true") {
      whereConditions.push("p.featured = true");
    }

    const whereClause = whereConditions.join(" AND ");

    // Query principal con información del usuario y categoría
    const productsQuery = `
      SELECT 
        p.id, p.title, p.description, p.price, p.stock, p.capacity, 
        p.location, p.image_url, p.featured, p.created_at, p.updated_at,
        u.name as seller_name, u.id as seller_id,
        c.name as category_name, c.id as category_id,
        CASE WHEN f.id IS NOT NULL THEN true ELSE false END as is_favorite
      FROM products p
      JOIN users u ON p.user_id = u.id
      JOIN categories c ON p.category_id = c.id
      LEFT JOIN favorites f ON p.id = f.product_id AND f.user_id = $${
        paramCount + 1
      }
      WHERE ${whereClause}
      ORDER BY p.created_at DESC
      LIMIT $${paramCount + 2} OFFSET $${paramCount + 3}
    `;

    // Query para contar total de productos
    const countQuery = `
      SELECT COUNT(*) as total
      FROM products p
      WHERE ${whereClause}
    `;

    // Ejecutar queries
    const [productsResult, countResult] = await Promise.all([
      query(productsQuery, [
        ...queryParams,
        req.user?.id || null,
        limit,
        offset,
      ]),
      query(countQuery, queryParams),
    ]);

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
    console.error("Error obteniendo productos:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
});

// Obtener producto por ID
router.get("/:id", validateUUID("id"), optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `
      SELECT 
        p.id, p.title, p.description, p.price, p.stock, p.capacity, 
        p.location, p.image_url, p.featured, p.created_at, p.updated_at,
        u.name as seller_name, u.email as seller_email, u.phone as seller_phone,
        u.id as seller_id,
        c.name as category_name, c.id as category_id,
        CASE WHEN f.id IS NOT NULL THEN true ELSE false END as is_favorite
      FROM products p
      JOIN users u ON p.user_id = u.id
      JOIN categories c ON p.category_id = c.id
      LEFT JOIN favorites f ON p.id = f.product_id AND f.user_id = $2
      WHERE p.id = $1 AND p.is_active = true
    `,
      [id, req.user?.id || null]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado",
      });
    }

    const product = result.rows[0];

    res.json({
      success: true,
      data: { product },
    });
  } catch (error) {
    console.error("Error obteniendo producto:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
});

// Crear nuevo producto
router.post("/", authenticateToken, validateProduct, async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      stock,
      capacity,
      location,
      category_id,
      image_url,
      featured = false,
    } = req.body;

    // Verificar que la categoría existe
    const categoryResult = await query(
      "SELECT id FROM categories WHERE id = $1 AND is_active = true",
      [category_id]
    );

    if (categoryResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Categoría no válida",
      });
    }

    const result = await query(
      `
      INSERT INTO products (
        title, description, price, stock, capacity, location, 
        category_id, user_id, image_url, featured
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `,
      [
        title,
        description,
        price,
        stock,
        capacity,
        location,
        category_id,
        req.user.id,
        image_url,
        featured,
      ]
    );

    const product = result.rows[0];

    res.status(201).json({
      success: true,
      message: "Producto creado exitosamente",
      data: { product },
    });
  } catch (error) {
    console.error("Error creando producto:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
});

// Actualizar producto
router.put(
  "/:id",
  authenticateToken,
  validateUUID("id"),
  checkOwnership(),
  validateProduct,
  async (req, res) => {
    try {
      const { id } = req.params;
      const {
        title,
        description,
        price,
        stock,
        capacity,
        location,
        category_id,
        image_url,
        featured,
      } = req.body;

      // Verificar que la categoría existe
      const categoryResult = await query(
        "SELECT id FROM categories WHERE id = $1 AND is_active = true",
        [category_id]
      );

      if (categoryResult.rows.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Categoría no válida",
        });
      }

      const result = await query(
        `
      UPDATE products SET
        title = $1, description = $2, price = $3, stock = $4,
        capacity = $5, location = $6, category_id = $7, image_url = $8,
        featured = $9, updated_at = CURRENT_TIMESTAMP
      WHERE id = $10 AND user_id = $11
      RETURNING *
    `,
        [
          title,
          description,
          price,
          stock,
          capacity,
          location,
          category_id,
          image_url,
          featured,
          id,
          req.user.id,
        ]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Producto no encontrado",
        });
      }

      const product = result.rows[0];

      res.json({
        success: true,
        message: "Producto actualizado exitosamente",
        data: { product },
      });
    } catch (error) {
      console.error("Error actualizando producto:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  }
);

// Eliminar producto (soft delete)
router.delete(
  "/:id",
  authenticateToken,
  validateUUID("id"),
  checkOwnership(),
  async (req, res) => {
    try {
      const { id } = req.params;

      const result = await query(
        "UPDATE products SET is_active = false WHERE id = $1 AND user_id = $2 RETURNING id",
        [id, req.user.id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Producto no encontrado",
        });
      }

      res.json({
        success: true,
        message: "Producto eliminado exitosamente",
      });
    } catch (error) {
      console.error("Error eliminando producto:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  }
);

// Agregar/quitar de favoritos
router.post(
  "/:id/favorite",
  authenticateToken,
  validateUUID("id"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      // Verificar que el producto existe
      const productResult = await query(
        "SELECT id FROM products WHERE id = $1 AND is_active = true",
        [id]
      );

      if (productResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Producto no encontrado",
        });
      }

      // Verificar si ya está en favoritos
      const existingFavorite = await query(
        "SELECT id FROM favorites WHERE user_id = $1 AND product_id = $2",
        [userId, id]
      );

      if (existingFavorite.rows.length > 0) {
        // Quitar de favoritos
        await query(
          "DELETE FROM favorites WHERE user_id = $1 AND product_id = $2",
          [userId, id]
        );

        res.json({
          success: true,
          message: "Producto removido de favoritos",
          data: { is_favorite: false },
        });
      } else {
        // Agregar a favoritos
        await query(
          "INSERT INTO favorites (user_id, product_id) VALUES ($1, $2)",
          [userId, id]
        );

        res.json({
          success: true,
          message: "Producto agregado a favoritos",
          data: { is_favorite: true },
        });
      }
    } catch (error) {
      console.error("Error manejando favoritos:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  }
);

export default router;
