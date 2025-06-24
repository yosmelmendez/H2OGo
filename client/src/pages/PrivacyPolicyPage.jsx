// src/pages/PrivacyPolicyPage.jsx
"use client";

import React from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12">
        <div className="container max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-center">
            Política de Privacidad
          </h1>

          <div className="bg-white p-8 rounded-lg shadow prose max-w-none">
            <p>
              En H2OGo, valoramos su privacidad y nos comprometemos a proteger
              su información personal. Esta Política de Privacidad describe cómo
              recopilamos, usamos y compartimos su información cuando utiliza
              nuestro sitio web.
            </p>
            <h2>1. Información que Recopilamos</h2>
            <h3>Información que nos proporciona:</h3>
            <ul>
              <li>
                Datos de registro (nombre, correo electrónico, contraseña)
              </li>
              <li>Datos de perfil (número de teléfono, dirección, etc.)</li>
              <li>
                Detalles de publicaciones (título, descripción, precio, imágenes
                de productos)
              </li>
              <li>
                Datos de transacciones (información de pago, detalles de
                pedidos)
              </li>
              <li>Comunicaciones (mensajes de soporte, comentarios)</li>
            </ul>
            <h3>Información recopilada automáticamente:</h3>
            <ul>
              <li>
                Información del dispositivo (tipo de dispositivo, sistema
                operativo)
              </li>
              <li>
                Datos de uso (páginas visitadas, tiempo en el sitio, clics)
              </li>
              <li>Datos de ubicación (aproximada, basada en IP)</li>
              <li>
                Cookies y tecnologías similares (para mejorar la experiencia de
                usuario y análisis)
              </li>
            </ul>
            <h2>2. Cómo Usamos Su Información</h2>
            Utilizamos la información recopilada para:
            <ul>
              <li>Proveer, mantener y mejorar nuestros servicios.</li>
              <li>Procesar sus transacciones y gestionar sus pedidos.</li>
              <li>Personalizar su experiencia en el sitio.</li>
              <li>
                Comunicarnos con usted sobre su cuenta, actualizaciones del
                servicio y ofertas.
              </li>
              <li>
                Garantizar la seguridad de la plataforma y prevenir actividades
                fraudulentas.
              </li>
              <li>
                Realizar análisis internos para entender cómo se usa nuestro
                servicio y mejorarlo.
              </li>
            </ul>
            <h2>3. Compartiendo Su Información</h2>
            No vendemos su información personal a terceros. Podemos compartir su
            información con:
            <ul>
              <li>
                Vendedores y compradores para facilitar transacciones (ej.
                dirección de envío).
              </li>
              <li>
                Proveedores de servicios que nos ayudan con operaciones
                (procesamiento de pagos, alojamiento web, análisis).
              </li>
              <li>
                Autoridades legales si es requerido por ley o para proteger
                nuestros derechos.
              </li>
            </ul>
            <h2>4. Sus Derechos de Privacidad</h2>
            Usted tiene derecho a:
            <ul>
              <li>
                Acceder a la información personal que tenemos sobre usted.
              </li>
              <li>Solicitar la corrección de información inexacta.</li>
              <li>
                Solicitar la eliminación de su información personal, sujeto a
                ciertas excepciones.
              </li>
              <li>Oponerse al procesamiento de su información personal.</li>
            </ul>
            Para ejercer estos derechos, por favor contáctenos a través de
            [correo electrónico de contacto o enlace a la página de contacto].
            <h2>5. Seguridad de Datos</h2>
            Implementamos medidas de seguridad para proteger su información
            personal contra el acceso no autorizado, la alteración, divulgación
            o destrucción. Sin embargo, ninguna transmisión de datos por
            Internet es 100% segura.
            <h2>6. Cambios en esta Política</h2>
            Podemos actualizar nuestra Política de Privacidad periódicamente. Le
            notificaremos cualquier cambio publicando la nueva política en esta
            página.
            <h2>7. Contacto</h2>
            Si tiene alguna pregunta sobre esta Política de Privacidad, por
            favor contáctenos a través de [correo electrónico de contacto o
            enlace a la página de contacto].
            <p className="mt-8 text-sm text-gray-500">
              Última actualización: {new Date().toLocaleDateString("es-CL")}
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
