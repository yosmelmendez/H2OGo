import request from "supertest";
import app from "../server.js";

describe("Products Routes", () => {
  let authToken;
  let categoryId;
  let productId;

  const testUser = {
    name: "Usuario Productos",
    email: "productos@example.com",
    password: "Test123456",
  };

  const testProduct = {
    title: "iPhone 14 Pro Test",
    description: "Smartphone Apple en excelente estado para testing",
    price: 1200000,
    stock: 5,
    capacity: "256GB",
    location: "Bogotá, Colombia",
    image_url: "https://example.com/iphone.jpg",
  };

  beforeAll(async () => {
    // Registrar usuario para las pruebas
    const registerResponse = await request(app)
      .post("/api/auth/register")
      .send(testUser);

    authToken = registerResponse.body.data.token;

    // Obtener una categoría para usar en las pruebas
    const categoriesResponse = await request(app).get("/api/categories");

    categoryId = categoriesResponse.body.data.categories[0].id;
    testProduct.category_id = categoryId;
  });

  describe("GET /api/products", () => {
    it("debería obtener lista de productos", async () => {
      const response = await request(app).get("/api/products").expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.products).toBeDefined();
      expect(response.body.data.pagination).toBeDefined();
    });

    it("debería filtrar productos por búsqueda", async () => {
      const response = await request(app)
        .get("/api/products?search=iPhone")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.products).toBeDefined();
    });

    it("debería paginar correctamente", async () => {
      const response = await request(app)
        .get("/api/products?page=1&limit=5")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.pagination.current_page).toBe(1);
      expect(response.body.data.pagination.items_per_page).toBe(5);
    });
  });

  describe("POST /api/products", () => {
    it("debería crear un producto exitosamente", async () => {
      const response = await request(app)
        .post("/api/products")
        .set("Authorization", `Bearer ${authToken}`)
        .send(testProduct)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.product.title).toBe(testProduct.title);
      expect(response.body.data.product.price).toBe(testProduct.price);

      productId = response.body.data.product.id;
    });

    it("debería fallar sin autenticación", async () => {
      const response = await request(app)
        .post("/api/products")
        .send(testProduct)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it("debería fallar con datos inválidos", async () => {
      const invalidProduct = {
        title: "AB", // Muy corto
        description: "Desc", // Muy corta
        price: -100, // Precio negativo
        stock: -1, // Stock negativo
      };

      const response = await request(app)
        .post("/api/products")
        .set("Authorization", `Bearer ${authToken}`)
        .send(invalidProduct)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe("GET /api/products/:id", () => {
    it("debería obtener un producto por ID", async () => {
      const response = await request(app)
        .get(`/api/products/${productId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.product.id).toBe(productId);
      expect(response.body.data.product.title).toBe(testProduct.title);
    });

    it("debería fallar con ID inválido", async () => {
      const response = await request(app)
        .get("/api/products/id-invalido")
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it("debería fallar con producto no encontrado", async () => {
      const response = await request(app)
        .get("/api/products/123e4567-e89b-12d3-a456-426614174000")
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe("PUT /api/products/:id", () => {
    it("debería actualizar producto exitosamente", async () => {
      const updatedData = {
        ...testProduct,
        title: "iPhone 14 Pro Actualizado",
        price: 1300000,
      };

      const response = await request(app)
        .put(`/api/products/${productId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(updatedData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.product.title).toBe(updatedData.title);
      expect(response.body.data.product.price).toBe(updatedData.price);
    });

    it("debería fallar sin autenticación", async () => {
      const response = await request(app)
        .put(`/api/products/${productId}`)
        .send(testProduct)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe("DELETE /api/products/:id", () => {
    it("debería eliminar producto exitosamente", async () => {
      const response = await request(app)
        .delete(`/api/products/${productId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain("eliminado exitosamente");
    });

    it("debería fallar al eliminar producto ya eliminado", async () => {
      const response = await request(app)
        .delete(`/api/products/${productId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });
});
