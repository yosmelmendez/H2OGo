import request from "supertest";
import app from "../server.js";

describe("Categories Routes", () => {
  describe("GET /api/categories", () => {
    it("debería obtener todas las categorías", async () => {
      const response = await request(app).get("/api/categories").expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.categories).toBeDefined();
      expect(Array.isArray(response.body.data.categories)).toBe(true);
      expect(response.body.data.categories.length).toBeGreaterThan(0);
    });

    it("debería incluir contador de productos en cada categoría", async () => {
      const response = await request(app).get("/api/categories").expect(200);

      const categories = response.body.data.categories;
      categories.forEach((category) => {
        expect(category.product_count).toBeDefined();
        expect(typeof category.product_count).toBe("string");
      });
    });
  });

  describe("GET /api/categories/:id", () => {
    let categoryId;

    beforeAll(async () => {
      const categoriesResponse = await request(app).get("/api/categories");
      categoryId = categoriesResponse.body.data.categories[0].id;
    });

    it("debería obtener una categoría por ID", async () => {
      const response = await request(app)
        .get(`/api/categories/${categoryId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.category.id).toBe(categoryId);
      expect(response.body.data.category.name).toBeDefined();
    });

    it("debería fallar con ID inválido", async () => {
      const response = await request(app)
        .get("/api/categories/id-invalido")
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it("debería fallar con categoría no encontrada", async () => {
      const response = await request(app)
        .get("/api/categories/123e4567-e89b-12d3-a456-426614174000")
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /api/categories/:id/products", () => {
    let categoryId;

    beforeAll(async () => {
      const categoriesResponse = await request(app).get("/api/categories");
      categoryId = categoriesResponse.body.data.categories[0].id;
    });

    it("debería obtener productos de una categoría", async () => {
      const response = await request(app)
        .get(`/api/categories/${categoryId}/products`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.category).toBeDefined();
      expect(response.body.data.products).toBeDefined();
      expect(response.body.data.pagination).toBeDefined();
    });

    it("debería paginar productos de categoría", async () => {
      const response = await request(app)
        .get(`/api/categories/${categoryId}/products?page=1&limit=3`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.pagination.current_page).toBe(1);
      expect(response.body.data.pagination.items_per_page).toBe(3);
    });
  });
});
