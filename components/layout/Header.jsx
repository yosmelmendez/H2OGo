"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, User, ShoppingCart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToggle } from "@/hooks/useToggle";

export default function Header({
  showSearch = true,
  showAuth = true,
  currentUser,
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, toggleMobileMenu] = useToggle(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Handle scroll effect for header
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
    // Implement search functionality
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-200 ${
        isScrolled
          ? "bg-background/95 backdrop-blur shadow-sm"
          : "bg-background"
      }`}
    >
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
            <ShoppingCart className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">H2OGo</span>
        </Link>

        {/* Search Bar */}
        {showSearch && (
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-md mx-8"
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
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

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4">
          {showAuth && (
            <>
              {currentUser ? (
                <div className="flex items-center space-x-4">
                  <Link href="/profile">
                    <Button variant="ghost" size="sm">
                      <User className="h-4 w-4 mr-2" />
                      Mi perfil
                    </Button>
                  </Link>
                  <Link href="/my-publications">
                    <Button variant="ghost" size="sm">
                      Mis publicaciones
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link href="/login">
                    <Button variant="ghost" size="sm">
                      Iniciar sesión
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm">Registrarse</Button>
                  </Link>
                </div>
              )}
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
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

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t py-4 px-4 bg-background">
          {showSearch && (
            <form onSubmit={handleSearchSubmit} className="mb-4">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
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
                      href="/profile"
                      className="py-2 px-3 hover:bg-muted rounded-md"
                    >
                      Mi perfil
                    </Link>
                    <Link
                      href="/my-publications"
                      className="py-2 px-3 hover:bg-muted rounded-md"
                    >
                      Mis publicaciones
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="py-2 px-3 hover:bg-muted rounded-md"
                    >
                      Iniciar sesión
                    </Link>
                    <Link
                      href="/register"
                      className="py-2 px-3 hover:bg-muted rounded-md"
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
