"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { useForm } from "../hooks/useForm";
import { Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const { values, handleChange, handleSubmit } = useForm({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const checkPasswordStrength = (password) => {
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;

    return {
      isStrong:
        hasLowerCase &&
        hasUpperCase &&
        hasNumber &&
        hasSpecialChar &&
        isLongEnough,
      checks: {
        hasLowerCase,
        hasUpperCase,
        hasNumber,
        hasSpecialChar,
        isLongEnough,
      },
    };
  };

  const passwordStrength = checkPasswordStrength(values.password);

  const validateForm = () => {
    const errors = {};

    if (!values.name.trim()) {
      errors.name = "El nombre es requerido";
    }

    if (!values.email.trim()) {
      errors.email = "El correo electrónico es requerido";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "El correo electrónico no es válido";
    }

    if (!values.phone.trim()) {
      errors.phone = "El teléfono es requerido";
    }

    if (!values.address.trim()) {
      errors.address = "La dirección es requerida";
    }

    if (!values.password) {
      errors.password = "La contraseña es requerida";
    } else if (!passwordStrength.isStrong) {
      errors.password =
        "La contraseña no cumple con los requisitos de seguridad";
    }

    if (values.password !== values.confirmPassword) {
      errors.confirmPassword = "Las contraseñas no coinciden";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submitRegistration = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          phone: values.phone,
          address: values.address,
          password: values.password,
        }),
      });

      if (!response.ok) {
        let errorMessage = "Error desconocido";
        try {
          const errorData = await response.json();
          console.error("📛 Backend errorData:", errorData);
          errorMessage = errorData.message || errorMessage;
        } catch (err) {
          console.error("❌ Error parseando JSON del backend:", err);
        }
        throw new Error(errorMessage);
      }

      setRegistrationSuccess(true);
    } catch (error) {
      console.error("❌ Error de registro:", error);
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (registrationSuccess) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header showSearch={false} showAuth={false} />
        <main className="flex-1 flex items-center justify-center py-12">
          <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle className="text-2xl text-center">
                ¡Registro exitoso!
              </CardTitle>
              <CardDescription className="text-center">
                Tu cuenta ha sido creada correctamente. Ya puedes iniciar
                sesión.
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-center pt-4">
              <Link to="/login">
                <Button>Iniciar sesión</Button>
              </Link>
            </CardFooter>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header showSearch={false} showAuth={false} />

      <main className="flex-1 flex items-center justify-center py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Crear cuenta</CardTitle>
            <CardDescription className="text-center">
              Completa el formulario para registrarte
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(submitRegistration)}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Nombre
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Tu nombre completo"
                  value={values.name}
                  onChange={handleChange}
                  className={formErrors.name ? "border-red-500" : ""}
                />
                {formErrors.name && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  E-mail
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={values.email}
                  onChange={handleChange}
                  className={formErrors.email ? "border-red-500" : ""}
                />
                {formErrors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Teléfono
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+569 1234 5678"
                  value={values.phone}
                  onChange={handleChange}
                  className={formErrors.phone ? "border-red-500" : ""}
                />
                {formErrors.phone && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.phone}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="address" className="text-sm font-medium">
                  Dirección
                </label>
                <Input
                  id="address"
                  name="address"
                  type="text"
                  placeholder="Tu dirección completa"
                  value={values.address}
                  onChange={handleChange}
                  className={formErrors.address ? "border-red-500" : ""}
                />
                {formErrors.address && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.address}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Contraseña
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={values.password}
                    onChange={handleChange}
                    className={
                      formErrors.password ? "border-red-500 pr-10" : "pr-10"
                    }
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {formErrors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.password}
                  </p>
                )}

                {values.password && (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs font-medium">
                      La contraseña debe tener:
                    </p>
                    <ul className="space-y-1 text-xs">
                      <li className="flex items-center">
                        {passwordStrength.checks.isLongEnough ? (
                          <CheckCircle2 className="h-3 w-3 text-green-500 mr-1" />
                        ) : (
                          <XCircle className="h-3 w-3 text-red-500 mr-1" />
                        )}
                        Al menos 8 caracteres
                      </li>
                      <li className="flex items-center">
                        {passwordStrength.checks.hasLowerCase ? (
                          <CheckCircle2 className="h-3 w-3 text-green-500 mr-1" />
                        ) : (
                          <XCircle className="h-3 w-3 text-red-500 mr-1" />
                        )}
                        Al menos una letra minúscula
                      </li>
                      <li className="flex items-center">
                        {passwordStrength.checks.hasUpperCase ? (
                          <CheckCircle2 className="h-3 w-3 text-green-500 mr-1" />
                        ) : (
                          <XCircle className="h-3 w-3 text-red-500 mr-1" />
                        )}
                        Al menos una letra mayúscula
                      </li>
                      <li className="flex items-center">
                        {passwordStrength.checks.hasNumber ? (
                          <CheckCircle2 className="h-3 w-3 text-green-500 mr-1" />
                        ) : (
                          <XCircle className="h-3 w-3 text-red-500 mr-1" />
                        )}
                        Al menos un número
                      </li>
                      <li className="flex items-center">
                        {passwordStrength.checks.hasSpecialChar ? (
                          <CheckCircle2 className="h-3 w-3 text-green-500 mr-1" />
                        ) : (
                          <XCircle className="h-3 w-3 text-red-500 mr-1" />
                        )}
                        Al menos un carácter especial
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium"
                >
                  Confirmar contraseña
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={values.confirmPassword}
                    onChange={handleChange}
                    className={
                      formErrors.confirmPassword
                        ? "border-red-500 pr-10"
                        : "pr-10"
                    }
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {formErrors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.confirmPassword}
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
              </Button>
              <div className="text-center text-sm">
                <span className="text-gray-600">¿Ya tienes cuenta? </span>
                <Link to="/login" className="text-blue-600 hover:underline">
                  Iniciar sesión
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
