import { Link } from "react-router-dom";
import { ShoppingCart, Facebook, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-8 bg-gray-100 mt-auto">
      <div className="container px-4 mx-auto max-w-7xl">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
                <ShoppingCart className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">H2OGo</span>
            </div>
            <p className="text-sm text-gray-600">
              Tu H2OGo de confianza para comprar y vender agua de calidad.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Comprar</h4>
            <div className="space-y-2">
              <a
                href="/categories"
                className="text-sm text-gray-600 hover:text-blue-600 block transition-colors"
              >
                Categorías
              </a>
              <a
                href="/products"
                className="text-sm text-gray-600 hover:text-blue-600 block transition-colors"
              >
                Productos destacados
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Vender</h4>
            <div className="space-y-2">
              <Link
                to="/create-publication"
                className="text-sm text-gray-600 hover:text-blue-600 block transition-colors"
              >
                Crear publicación
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Ayuda</h4>
            <div className="space-y-2">
              <a
                href="/help-center"
                className="text-sm text-gray-600 hover:text-blue-600 block transition-colors"
              >
                Centro de ayuda
              </a>
              <a
                href="/contact"
                className="text-sm text-gray-600 hover:text-blue-600 block transition-colors"
              >
                Contacto
              </a>
              <a
                href="/terms-and-conditions"
                className="text-sm text-gray-600 hover:text-blue-600 block transition-colors"
              >
                Términos y condiciones
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-xs text-gray-600">
              © {currentYear} H2OGo. Todos los derechos reservados.
            </p>
            <div className="flex space-x-4 mt-4 sm:mt-0">
              <a
                href="/privacy-policy"
                className="text-xs text-gray-600 hover:text-blue-600 transition-colors"
              >
                Política de privacidad
              </a>
              <a
                href="/terms-and-conditions"
                className="text-xs text-gray-600 hover:text-blue-600 transition-colors"
              >
                Términos de servicio
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
