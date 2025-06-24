import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import productRoutes from "./routes/products.js";
import categoryRoutes from "./routes/categories.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { connectDB } from "./config/database.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import cartRoutes from "./routes/cartRoutes.js";

// Definir __dirname para módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Conectar a la base de datos
connectDB();

// Middleware de seguridad
app.use(helmet());

// Rate limiting
const limiter =
  process.env.NODE_ENV === "production"
    ? rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100, // Producción: 100 solicitudes cada 15 minutos
        message:
          "Demasiadas solicitudes desde esta IP, intenta de nuevo más tarde.",
      })
    : rateLimit({
        windowMs: 1 * 60 * 1000,
        max: 1000, // Desarrollo: 1000 solicitudes por minuto
        message: "Estás en desarrollo, pero igual calma 🧘‍♂️.",
      });

app.use(limiter);

// CORS
const allowedOrigins = [
  "http://localhost:3000",
  "https://h2-o-go.vercel.app",
  process.env.FRONTEND_URL,
];
app.use(
  cors({
    origin: function (origin, callback) {
      // Permite peticiones sin 'origin' (ej. de Postman/curl o peticiones de mismo origen)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Métodos permitidos
    credentials: true, // Si usas cookies o encabezados de autorización
    optionsSuccessStatus: 204,
  })
);
//app.use(cors());

// Body parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// --- SERVIR ARCHIVOS ESTÁTICOS ---

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);

// Ruta de prueba
app.get("/api/health", (req, res) => {
  res.json({
    message: "API funcionando correctamente",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Middleware de manejo de errores
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📊 Ambiente: ${process.env.NODE_ENV || "development"}`);
});
// Manejo de rutas no encontradas
/*app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Ruta no encontrada",
  });
});*/
export default app;
