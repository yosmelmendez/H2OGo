import Link from "next/link";
import { ShoppingCart, Facebook, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-8 bg-muted mt-auto">
      <div className="container px-4">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
                <ShoppingCart className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">H2OGo</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Tu marketplace de confianza para comprar y vender agua de calidad.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Comprar</h4>
            <div className="space-y-2">
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-primary block transition-colors"
              >
                Categorías
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-primary block transition-colors"
              >
                Ofertas
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-primary block transition-colors"
              >
                Productos destacados
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Vender</h4>
            <div className="space-y-2">
              <Link
                href="/create-publication"
                className="text-sm text-muted-foreground hover:text-primary block transition-colors"
              >
                Crear publicación
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-primary block transition-colors"
              >
                Guía del vendedor
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-primary block transition-colors"
              >
                Comisiones
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Ayuda</h4>
            <div className="space-y-2">
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-primary block transition-colors"
              >
                Centro de ayuda
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-primary block transition-colors"
              >
                Contacto
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-primary block transition-colors"
              >
                Términos y condiciones
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-xs text-muted-foreground">
              © {currentYear} H2OGo. Todos los derechos reservados.
            </p>
            <div className="flex space-x-4 mt-4 sm:mt-0">
              <Link
                href="#"
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                Política de privacidad
              </Link>
              <Link
                href="#"
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                Términos de servicio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
