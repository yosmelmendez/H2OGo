// Middleware global para manejo de errores
export const errorHandler = (err, req, res, next) => {
  console.error("Error stack:", err.stack);

  // Error de validación de base de datos
  if (err.code === "23505") {
    // Unique violation
    return res.status(409).json({
      success: false,
      message: "Ya existe un registro con esos datos",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }

  // Error de foreign key violation
  if (err.code === "23503") {
    return res.status(400).json({
      success: false,
      message: "Referencia inválida en los datos proporcionados",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }

  // Error de sintaxis SQL
  if (err.code === "42601") {
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }

  // Error de JWT
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Token inválido",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token expirado",
    });
  }

  // Error de multer (subida de archivos)
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      success: false,
      message: "El archivo es demasiado grande",
    });
  }

  // Error por defecto
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Error interno del servidor",
    error: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

// Middleware para manejar rutas no encontradas
export const notFound = (req, res, next) => {
  const error = new Error(`Ruta no encontrada - ${req.originalUrl}`);
  error.status = 404;
  next(error);
};
