import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

// Configuración de la base de datos
const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "marketplace",
  password: process.env.DB_PASSWORD || "password",
  port: process.env.DB_PORT || 5432,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

// Función para conectar a la base de datos
export const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log("✅ Conectado a PostgreSQL");
    client.release();
  } catch (error) {
    console.error("❌ Error conectando a PostgreSQL:", error.message);
    process.exit(1);
  }
};

// Función para ejecutar queries
export const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log("📊 Query ejecutado:", { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error("❌ Error en query:", error);
    throw error;
  }
};

// Función para obtener un cliente de la pool
export const getClient = () => {
  return pool.connect();
};

export default pool;
