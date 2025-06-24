// src/pages/HelpCenterPage.jsx
"use client";

import React from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { Link } from "react-router-dom";
import { Mail, Phone } from "lucide-react";
import { Button } from "../components/ui/button";

export default function HelpCenterPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12">
        <div className="container max-w-3xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-center">
            Centro de Ayuda
          </h1>

          <div className="bg-white p-8 rounded-lg shadow space-y-6">
            <p className="text-gray-700 text-lg">
              Bienvenido a nuestro Centro de Ayuda. Aquí encontrarás respuestas
              a las preguntas más frecuentes sobre el uso de H2OGo.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">
              Preguntas Frecuentes (FAQ)
            </h2>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="text-xl font-medium mb-2">
                  ¿Cómo creo una cuenta?
                </h3>
                <p className="text-gray-600">
                  Puedes crear una cuenta haciendo clic en "Mi perfil" en la
                  barra de navegación superior y luego seleccionando la opción
                  de registrarte.
                </p>
              </div>
              <div className="border-b pb-4">
                <h3 className="text-xl font-medium mb-2">
                  ¿Cómo compro un producto?
                </h3>
                <p className="text-gray-600">
                  Navega por nuestra "Galería de publicaciones recientes" o usa
                  la barra de búsqueda para encontrar lo que necesitas. Haz clic
                  en "Agregar" en la tarjeta del producto para añadirlo a tu
                  carrito. Luego, procede al pago desde el ícono del carrito.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">
                  ¿Cómo publico un producto para vender?
                </h3>
                <p className="text-gray-600">
                  Si ya tienes una cuenta, ve a "Crear publicación" en el menú
                  superior o en el pie de página, rellena los detalles de tu
                  producto y haz clic en publicar.
                </p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <h2 className="text-2xl font-semibold mb-4">
                ¿Necesitas más ayuda?
              </h2>
              <p className="text-gray-700 mb-6">
                Si no encuentras lo que buscas, no dudes en contactarnos
                directamente.
              </p>
              <Link to="/contact">
                <Button size="lg">
                  Contáctanos <Mail className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
