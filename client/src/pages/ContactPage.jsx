// src/pages/ContactPage.jsx
"use client";

import React from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12">
        <div className="container max-w-3xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-center">Contáctanos</h1>

          <div className="bg-white p-8 rounded-lg shadow space-y-6 text-center">
            <p className="text-lg text-gray-700">
              Estamos aquí para ayudarte. Si tienes preguntas, comentarios o
              necesitas soporte, no dudes en contactarnos a través de los
              siguientes medios:
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-center gap-3 text-lg">
                <Mail className="h-6 w-6 text-blue-600" />
                <a
                  href="mailto:soporte@h2ogo.cl"
                  className="text-blue-600 hover:underline"
                >
                  soporte@h2ogo.cl
                </a>
              </div>
              <div className="flex items-center justify-center gap-3 text-lg">
                <Phone className="h-6 w-6 text-blue-600" />
                <a
                  href="tel:+56912345678"
                  className="text-blue-600 hover:underline"
                >
                  +56 9 1234 5678
                </a>{" "}
                {/* Replace with actual number */}
              </div>
              <div className="flex items-center justify-center gap-3 text-lg">
                <MapPin className="h-6 w-6 text-blue-600" />
                <span>
                  Oficina Central: Calle Ficticia 123, Santiago, Chile
                </span>{" "}
                {/* Replace with actual address */}
              </div>
            </div>

            <p className="text-md text-gray-600 pt-6">
              Nuestro equipo de soporte está disponible de Lunes a Viernes, de
              9:00 AM a 6:00 PM (hora de Chile).
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
