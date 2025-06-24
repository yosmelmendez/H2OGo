import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

// Configuración de la base de datos
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

// Función para conectar a la base de datos
// db.js
export const connectDB = async () => {
  try {
    await pool.query("SELECT 1");
    console.log("✅ Conexión verificada con PostgreSQL");
  } catch (error) {
    console.error("❌ Error verificando conexión:", error.message);
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
