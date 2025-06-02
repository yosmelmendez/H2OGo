"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, User, ShoppingCart, Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useToggle } from "../../hooks/useToggle";

export default function Header({
  showSearch = true,
  showAuth = true,
  currentUser,
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, toggleMobileMenu] = useToggle(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-200 ${
        isScrolled ? "bg-white/95 backdrop-blur shadow-sm" : "bg-white"
      }`}
    >
      <div className="container flex h-16 items-center justify-between px-4 mx-auto max-w-7xl">
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
            <ShoppingCart className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold">H2OGo</span>
        </Link>

        {showSearch && (
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-md mx-8"
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="search"
                placeholder="Buscar productos..."
                className="pl-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
        )}

        <nav className="hidden md:flex items-center space-x-4">
          {showAuth && (
            <>
              {currentUser ? (
                <div className="flex items-center space-x-4">
                  <Link to="/profile">
                    <Button variant="ghost" size="sm">
                      <User className="h-4 w-4 mr-2" />
                      Mi perfil
                    </Button>
                  </Link>
                  <Link to="/my-publications">
                    <Button variant="ghost" size="sm">
                      Mis publicaciones
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/login">
                    <Button variant="ghost" size="sm">
                      Iniciar sesión
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm">Registrarse</Button>
                  </Link>
                </div>
              )}
            </>
          )}
        </nav>

        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={toggleMobileMenu}
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t py-4 px-4 bg-white">
          {showSearch && (
            <form onSubmit={handleSearchSubmit} className="mb-4">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Buscar productos..."
                  className="pl-10 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
          )}

          <div className="flex flex-col space-y-2">
            {showAuth && (
              <>
                {currentUser ? (
                  <>
                    <Link
                      to="/profile"
                      className="py-2 px-3 hover:bg-gray-100 rounded-md"
                    >
                      Mi perfil
                    </Link>
                    <Link
                      to="/my-publications"
                      className="py-2 px-3 hover:bg-gray-100 rounded-md"
                    >
                      Mis publicaciones
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="py-2 px-3 hover:bg-gray-100 rounded-md"
                    >
                      Iniciar sesión
                    </Link>
                    <Link
                      to="/register"
                      className="py-2 px-3 hover:bg-gray-100 rounded-md"
                    >
                      Registrarse
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
