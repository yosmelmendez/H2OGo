import {
  body,
  param,
  query as expressQuery,
  validationResult,
} from "express-validator";

// Middleware para manejar errores de validación
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Errores de validación",
      errors: errors.array(),
    });
  }
  next();
};

// Validaciones para autenticación
export const validateRegister = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("El nombre debe tener entre 2 y 100 caracteres"),

  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Debe ser un email válido"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "La contraseña debe contener al menos una mayúscula, una minúscula y un número"
    ),

  body("phone")
    .optional()
    .isMobilePhone("es-CL")
    .withMessage("Debe ser un número de teléfono válido"),

  body("address")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("La dirección no puede exceder 500 caracteres"),

  handleValidationErrors,
];

export const validateLogin = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Debe ser un email válido"),

  body("password").notEmpty().withMessage("La contraseña es requerida"),

  handleValidationErrors,
];

// Validaciones para productos
export const validateProduct = [
  body("title")
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage("El título debe tener entre 3 y 200 caracteres"),

  body("description")
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage("La descripción debe tener entre 10 y 2000 caracteres"),

  body("price")
    .isFloat({ min: 0.01 })
    .withMessage("El precio debe ser mayor a 0"),

  body("stock")
    .isInt({ min: 0 })
    .withMessage("El stock debe ser un número entero mayor o igual a 0"),

  body("location")
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage("La ubicación debe tener entre 3 y 200 caracteres"),

  body("category_id")
    .isUUID()
    .withMessage("Debe ser un ID de categoría válido"),

  body("capacity")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("La capacidad no puede exceder 50 caracteres"),

  handleValidationErrors,
];

// Validaciones para parámetros UUID
export const validateUUID = (paramName) => [
  param(paramName).isUUID().withMessage(`${paramName} debe ser un UUID válido`),

  handleValidationErrors,
];

// Validaciones para queries de búsqueda
export const validateProductSearch = [
  expressQuery("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("La página debe ser un número entero mayor a 0"),

  expressQuery("limit")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("El límite debe ser un número entre 1 y 50"),

  expressQuery("search")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("El término de búsqueda debe tener entre 1 y 100 caracteres"),

  expressQuery("category")
    .optional()
    .isUUID()
    .withMessage("La categoría debe ser un UUID válido"),

  expressQuery("min_price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("El precio mínimo debe ser mayor o igual a 0"),

  expressQuery("max_price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("El precio máximo debe ser mayor o igual a 0"),

  handleValidationErrors,
];
