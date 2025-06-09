import request from "supertest";
import app from "../server.js";

describe("Users Routes", () => {
  let authToken;
  let userId;

  const testUser = {
    name: "Usuario Test Users",
    email: "users@example.com",
    password: "Test123456",
    phone: "+573001234567",
    address: "Calle Test 123",
  };

  beforeAll(async () => {
    // Registrar usuario para las pruebas
    const registerResponse = await request(app)
      .post("/api/auth/register")
      .send(testUser);

    authToken = registerResponse.body.data.token;
    userId = registerResponse.body.data.user.id;
  });

  describe("GET /api/users/profile", () => {
    it("debería obtener perfil del usuario autenticado", async () => {
      const response = await request(app)
        .get("/api/users/profile")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.body.data.user.name).toBe(testUser.name);
    });

    it("debería fallar sin autenticación", async () => {
      const response = await request(app).get("/api/users/profile").expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe("PUT /api/users/profile", () => {
    it("debería actualizar perfil exitosamente", async () => {
      const updateData = {
        name: "Nombre Actualizado",
        phone: "+573009876543",
        address: "Nueva Dirección 456",
      };

      const response = await request(app)
        .put("/api/users/profile")
        .set("Authorization", `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.name).toBe(updateData.name);
      expect(response.body.data.user.phone).toBe(updateData.phone);
      expect(response.body.data.user.address).toBe(updateData.address);
    });

    it("debería fallar con datos inválidos", async () => {
      const invalidData = {
        name: "A", // Muy corto
        phone: "telefono-invalido",
      };

      const response = await request(app)
        .put("/api/users/profile")
        .set("Authorization", `Bearer ${authToken}`)
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe("PUT /api/users/change-password", () => {
    it("debería cambiar contraseña exitosamente", async () => {
      const passwordData = {
        current_password: testUser.password,
        new_password: "NuevaPassword123",
      };

      const response = await request(app)
        .put("/api/users/change-password")
        .set("Authorization", `Bearer ${authToken}`)
        .send(passwordData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain("actualizada exitosamente");

      // Actualizar password para siguientes pruebas
      testUser.password = passwordData.new_password;
    });

    it("debería fallar con contraseña actual incorrecta", async () => {
      const passwordData = {
        current_password: "contraseña-incorrecta",
        new_password: "NuevaPassword456",
      };

      const response = await request(app)
        .put("/api/users/change-password")
        .set("Authorization", `Bearer ${authToken}`)
        .send(passwordData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain(
        "contraseña actual es incorrecta"
      );
    });
  });

  describe("GET /api/users/my-products", () => {
    it("debería obtener productos del usuario autenticado", async () => {
      const response = await request(app)
        .get("/api/users/my-products")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.products).toBeDefined();
      expect(response.body.data.pagination).toBeDefined();
    });
  });

  describe("GET /api/users/favorites", () => {
    it("debería obtener favoritos del usuario", async () => {
      const response = await request(app)
        .get("/api/users/favorites")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.favorites).toBeDefined();
      expect(response.body.data.pagination).toBeDefined();
    });
  });

  describe("GET /api/users/:id", () => {
    it("debería obtener información pública de usuario", async () => {
      const response = await request(app)
        .get(`/api/users/${userId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.id).toBe(userId);
      expect(response.body.data.user.name).toBeDefined();
      expect(response.body.data.user.email).toBeUndefined(); // No debe mostrar email
    });

    it("debería fallar con ID inválido", async () => {
      const response = await request(app)
        .get("/api/users/id-invalido")
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });
});
