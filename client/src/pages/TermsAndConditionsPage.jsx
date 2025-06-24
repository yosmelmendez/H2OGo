// src/pages/TermsAndConditionsPage.jsx
"use client";

import React from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function TermsAndConditionsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12">
        <div className="container max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-center">
            Términos y Condiciones
          </h1>

          <div className="bg-white p-8 rounded-lg shadow prose max-w-none">
            <p>
              Bienvenido a H2OGo. Al acceder o utilizar nuestro sitio web, usted
              acepta cumplir y estar sujeto a los siguientes términos y
              condiciones de uso. Por favor, revíselos cuidadosamente. Si no
              está de acuerdo con estos términos y condiciones, no debe utilizar
              este sitio.
            </p>

            <h2>1. Aceptación de los Términos</h2>
            <p>
              Al utilizar los servicios de H2OGo, usted declara que ha leído,
              entendido y aceptado los presentes Términos y Condiciones, así
              como nuestra Política de Privacidad.
            </p>

            <h2>2. Cambios en los Términos</h2>
            <p>
              Nos reservamos el derecho de modificar o actualizar estos Términos
              y Condiciones en cualquier momento sin previo aviso. Es su
              responsabilidad revisar periódicamente esta página para estar al
              tanto de cualquier cambio.
            </p>

            <h2>3. Uso del Servicio</h2>
            <p>
              H2OGo es una plataforma de marketplace que conecta a compradores y
              vendedores de productos relacionados con la hidratación. No somos
              responsables directos de las transacciones entre usuarios, solo
              proveemos la plataforma para facilitar dichas interacciones.
            </p>
            <ul>
              <li>
                Los usuarios deben tener al menos 18 años para utilizar el
                servicio.
              </li>
              <li>
                Usted es responsable de mantener la confidencialidad de su
                cuenta y contraseña.
              </li>
              <li>
                Toda la información que proporcione en el sitio debe ser precisa
                y veraz.
              </li>
            </ul>

            <h2>4. Contenido del Usuario</h2>
            <p>
              Usted es el único responsable del contenido que publique en la
              plataforma (descripciones de productos, imágenes, etc.). H2OGo se
              reserva el derecho de eliminar cualquier contenido que considere
              inapropiado o que viole estos términos.
            </p>

            <h2>5. Compras y Ventas</h2>
            <p>
              Todas las transacciones realizadas a través de H2OGo están sujetas
              a la disponibilidad del producto y a la aceptación por parte del
              vendedor. Los precios y la disponibilidad están sujetos a cambios
              sin previo aviso.
            </p>

            <h2>6. Propiedad Intelectual</h2>
            <p>
              Todo el contenido en H2OGo (textos, gráficos, logos, íconos,
              imágenes, clips de audio, descargas digitales, compilaciones de
              datos y software) es propiedad de H2OGo o de sus proveedores de
              contenido y está protegido por las leyes de propiedad intelectual
              chilenas e internacionales.
            </p>

            <h2>7. Limitación de Responsabilidad</h2>
            <p>
              H2OGo no será responsable de ningún daño directo, indirecto,
              incidental, consecuencial o especial que surja del uso o la
              incapacidad de usar el servicio.
            </p>

            <h2>8. Ley Aplicable</h2>
            <p>
              Estos Términos y Condiciones se regirán e interpretarán de acuerdo
              con las leyes de Chile, sin dar efecto a ningún principio de
              conflicto de leyes.
            </p>

            <h2>9. Contacto</h2>
            <p>
              Si tiene alguna pregunta sobre estos Términos y Condiciones, por
              favor contáctenos a través de [correo electrónico de contacto o
              enlace a la página de contacto].
            </p>
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
