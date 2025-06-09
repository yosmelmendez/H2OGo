import request from "supertest";
import app from "../server.js";

describe("Auth Routes", () => {
  let authToken;
  const testUser = {
    name: "Usuario Test",
    email: "test@example.com",
    password: "Test123456",
    phone: "+573001234567",
    address: "Calle Test 123",
  };

  describe("POST /api/auth/register", () => {
    it("debería registrar un nuevo usuario exitosamente", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send(testUser)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.body.data.token).toBeDefined();

      authToken = response.body.data.token;
    });

    it("debería fallar al registrar usuario con email duplicado", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send(testUser)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("email ya está registrado");
    });

    it("debería fallar con datos inválidos", async () => {
      const invalidUser = {
        name: "A", // Muy corto
        email: "email-invalido",
        password: "123", // Muy corta
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(invalidUser)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe("POST /api/auth/login", () => {
    it("debería hacer login exitosamente", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.body.data.token).toBeDefined();
    });

    it("debería fallar con credenciales incorrectas", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: testUser.email,
          password: "contraseña-incorrecta",
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("Credenciales inválidas");
    });

    it("debería fallar con email no registrado", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "noexiste@example.com",
          password: "password123",
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /api/auth/profile", () => {
    it("debería obtener el perfil del usuario autenticado", async () => {
      const response = await request(app)
        .get("/api/auth/profile")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(testUser.email);
    });

    it("debería fallar sin token de autenticación", async () => {
      const response = await request(app).get("/api/auth/profile").expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("Token de acceso requerido");
    });

    it("debería fallar con token inválido", async () => {
      const response = await request(app)
        .get("/api/auth/profile")
        .set("Authorization", "Bearer token-invalido")
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("Token inválido");
    });
  });

  describe("GET /api/auth/verify", () => {
    it("debería verificar token válido", async () => {
      const response = await request(app)
        .get("/api/auth/verify")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toBeDefined();
    });
  });
});
