// routes/cartRoutes.js
import express from "express";
import { query, getClient } from "../config/database.js"; // Adjust path and ensure 'query' and 'getClient' are exported
import { authenticateToken } from "../middleware/auth.js";
// IMPORTANT: You'll also need access to your 'Product' table for validation.
// If you have a separate 'productQueries.js' or similar for product fetching,
// you might import that here, or write raw SQL to fetch products directly.

const router = express.Router();

// Helper to fetch product details (if you don't have a product service/queries file)
// This is critical for validating item prices and details from the backend
// instead of trusting frontend data.
async function getProductDetails(productId) {
  try {
    const result = await query(
      "SELECT id, title, price, image_url FROM products WHERE id = $1",
      [productId]
    );
    return result.rows[0]; // Returns undefined if not found
  } catch (error) {
    console.error("Error fetching product details for validation:", error);
    return null;
  }
}

// @route   GET /api/cart
// @desc    Get user's cart
// @access  Private
router.get("/", authenticateToken, async (req, res) => {
  const userId = req.user.id; // User ID from auth middleware
  console.log(
    `[GET /api/cart] Attempting to fetch cart for User ID: ${userId}`
  );

  try {
    const result = await query(
      `SELECT
         ci.id AS item_id, ci.product_id, ci.title, ci.price, ci.image_url, ci.quantity
       FROM carts c
       JOIN cart_items ci ON c.id = ci.cart_id
       WHERE c.user_id = $1
       ORDER BY ci.created_at`,
      [userId]
    );

    console.log(
      `[GET /api/cart] Query executed. Number of rows found: ${result.rows.length}`
    );
    console.log(
      `[GET /api/cart] Retrieved cart items:`,
      JSON.stringify(result.rows, null, 2)
    );

    // Frontend expects 'cartItems' as an array of objects
    res.status(200).json({
      success: true,
      message: "Cart fetched successfully",
      data: { cartItems: result.rows },
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
});

// @route   PUT /api/cart
// @desc    Update/replace user's entire cart
// @access  Private
// This endpoint expects the full cartItems array from the frontend.
// It will overwrite the existing cart with the new data in a transaction.
router.put("/", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { cartItems } = req.body; // Expects an array of cart item objects from frontend

  console.log(`[PUT /api/cart] User ID: ${userId}`);
  console.log(
    `[PUT /api/cart] Incoming cartItems:`,
    JSON.stringify(cartItems, null, 2)
  ); // Stringify for full view

  if (!Array.isArray(cartItems)) {
    console.log("[PUT /api/cart] Invalid cartItems format.");

    return res.status(400).json({
      success: false,
      message: "Invalid cartItems format. Must be an array.",
    });
  }

  const client = await getClient(); // Get a client from the pool for a transaction
  try {
    await client.query("BEGIN"); // Start transaction
    console.log("[PUT /api/cart] Transaction started.");

    // 1. Find or create the user's cart
    let cartResult = await client.query(
      "SELECT id FROM carts WHERE user_id = $1",
      [userId]
    );
    let cartId;

    if (cartResult.rows.length === 0) {
      // Cart doesn't exist, create it
      console.log(
        `[PUT /api/cart] No cart found for user ${userId}. Creating new cart.`
      );
      const newCartResult = await client.query(
        "INSERT INTO carts (user_id) VALUES ($1) RETURNING id",
        [userId]
      );
      cartId = newCartResult.rows[0].id;
      console.log(`[PUT /api/cart] New cart created with ID: ${cartId}`);
    } else {
      cartId = cartResult.rows[0].id;
      console.log(
        `[PUT /api/cart] Found existing cart with ID: ${cartId} for user ${userId}.`
      );
    }

    // 2. Delete all existing items for this cart (to replace with new ones)
    console.log(`[PUT /api/cart] Deleting existing items for cart ${cartId}.`);
    await client.query("DELETE FROM cart_items WHERE cart_id = $1", [cartId]);
    console.log("[PUT /api/cart] Existing items deleted.");

    // 3. Insert new cart items (with validation)
    const newCartItems = [];
    for (const item of cartItems) {
      console.log(
        `[PUT /api/cart] Processing item: ${item.productId}, Quantity: ${item.quantity}`
      );

      if (
        !item.productId ||
        typeof item.quantity !== "number" ||
        item.quantity <= 0
      ) {
        await client.query("ROLLBACK"); // Rollback if any item is invalid
        console.error("[PUT /api/cart] Invalid item found. Rolling back.");
        return res.status(400).json({
          success: false,
          message:
            "Invalid item in cart. Missing productId or invalid quantity.",
        });
      }

      // --- CRITICAL: VALIDATE PRODUCT DETAILS FROM BACKEND DATABASE ---
      const product = await getProductDetails(item.productId); // Use the helper function
      if (!product) {
        await client.query("ROLLBACK"); // Rollback if product not found
        console.error(
          `[PUT /api/cart] Product with ID ${item.productId} not found. Rolling back.`
        );
        return res.status(404).json({
          success: false,
          message: `Product with ID ${item.productId} not found.`,
        });
      }

      // Use backend's product data for consistency and security
      newCartItems.push({
        productId: product.id,
        title: product.title,
        price: product.price, // Use backend's price (ESSENTIAL for security)
        image_url: product.image_url,
        quantity: item.quantity,
      });
    }
    console.log(
      `[PUT /api/cart] Validated items to insert:`,
      JSON.stringify(newCartItems, null, 2)
    );

    // Perform bulk insert if there are items to add
    if (newCartItems.length > 0) {
      const insertValues = newCartItems
        .map(
          (item) =>
            `('${cartId}', '${item.productId}', '${item.title.replace(
              /'/g,
              "''"
            )}', ${item.price}, ${
              item.image_url
                ? `'${item.image_url.replace(/'/g, "''")}'`
                : "NULL"
            }, ${item.quantity})`
        )
        .join(",");

      // WARNING: Building SQL strings like this can be prone to SQL injection if not careful with escaping.
      // For titles/image_urls that might contain single quotes, `replace(/'/g, "''")` is a basic escape.
      // For more complex values or larger inserts, consider parameterized queries for each item or a library that helps with bulk inserts.
      console.log(
        `[PUT /api/cart] Executing INSERT SQL: INSERT INTO cart_items (...) VALUES ${insertValues}`
      );

      await client.query(
        `INSERT INTO cart_items (cart_id, product_id, title, price, image_url, quantity) VALUES ${insertValues}`
      );
      console.log("[PUT /api/cart] New items inserted.");
    } else {
      console.log(
        "[PUT /api/cart] No new items to insert (cart is empty or invalid items were filtered)."
      );
    }

    await client.query("COMMIT"); // Commit the transaction
    console.log("[PUT /api/cart] Transaction committed successfully.");

    // Fetch the updated cart to return to the frontend
    const updatedCartResult = await client.query(
      `SELECT
           ci.id AS item_id, ci.product_id, ci.title, ci.price, ci.image_url, ci.quantity
         FROM carts c
         JOIN cart_items ci ON c.id = ci.cart_id
         WHERE c.user_id = $1
         ORDER BY ci.created_at`,
      [userId]
    );

    res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      data: { cartItems: updatedCartResult.rows },
    });
  } catch (error) {
    await client.query("ROLLBACK"); // Rollback transaction on error
    console.error("Error updating cart:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  } finally {
    client.release(); // Release the client back to the pool
    console.log("[PUT /api/cart] Client released.");
  }
});

// @route   DELETE /api/cart/clear
// @desc    Clear user's cart
// @access  Private
router.delete("/clear", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const client = await getClient(); // Get a client for transaction

  try {
    await client.query("BEGIN"); // Start transaction

    // Find the cart ID
    const cartResult = await client.query(
      "SELECT id FROM carts WHERE user_id = $1",
      [userId]
    );

    if (cartResult.rows.length === 0) {
      await client.query("COMMIT"); // No cart to clear, still commit
      return res
        .status(200)
        .json({ success: true, message: "Cart is already empty" });
    }

    const cartId = cartResult.rows[0].id;

    // Delete all cart items associated with this cart
    await client.query("DELETE FROM cart_items WHERE cart_id = $1", [cartId]);

    await client.query("COMMIT"); // Commit the transaction

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      data: { cartItems: [] },
    });
  } catch (error) {
    await client.query("ROLLBACK"); // Rollback on error
    console.error("Error clearing cart:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  } finally {
    client.release(); // Release the client back to the pool
  }
});

export default router;
