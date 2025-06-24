// Header.jsx
"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, User, ShoppingCart, Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useToggle } from "../../hooks/useToggle";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

export default function Header({ showSearch = true, showAuth = true }) {
  const { user: currentUser, logout } = useContext(AuthContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, toggleMobileMenu] = useToggle(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { totalQuantity } = useCart();

  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Prevents the default form submission behavior (page reload)
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`); // Trim whitespace
      setSearchQuery(""); // Clear search bar after submitting
      if (mobileMenuOpen) {
        toggleMobileMenu(); // Close mobile menu if search was performed there
      }
    }
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

        {/*}   {showSearch && (
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-md mx-8 items-center gap-2" // Added gap-2 for spacing
          >
            <div className="relative flex-1">
              {" "}
              {/* flex-1 to make input take available space 
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="search"
                placeholder="Buscar productos..."
                className="pl-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {/* Added an explicit submit button
            <Button type="submit" size="sm">
              Buscar
            </Button>
          </form>
        )}*/}

        <div className="flex items-center space-x-4">
          <Link
            to="/cart"
            className="relative p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <ShoppingCart className="h-5 w-5 text-gray-700" />
            {totalQuantity > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1 py-0.5">
                {totalQuantity}
              </span>
            )}
          </Link>
          <nav className="hidden md:flex items-center space-x-4">
            {showAuth && (
              <>
                {currentUser ? (
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
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
                      <Button onClick={logout} size="sm" variant="outline">
                        Cerrar sesión
                      </Button>
                    </div>
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
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t py-4 px-4 bg-white">
          {showSearch && (
            <form
              onSubmit={handleSearchSubmit}
              className="mb-4 flex items-center gap-2"
            >
              {" "}
              {/* Added flex items-center gap-2 */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Buscar productos..."
                  className="pl-10 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              {/* Added an explicit submit button for mobile */}
              <Button type="submit" size="sm">
                Buscar
              </Button>
            </form>
          )}

          <div className="flex flex-col space-y-2">
            <Link
              to="/cart"
              className="flex items-center py-2 px-3 hover:bg-gray-100 rounded-md"
              onClick={toggleMobileMenu}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Carrito de compras
              {totalQuantity > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {totalQuantity}
                </span>
              )}
            </Link>

            {showAuth && (
              <>
                {currentUser ? (
                  <>
                    <Link
                      to="/profile"
                      className="py-2 px-3 hover:bg-gray-100 rounded-md"
                      onClick={toggleMobileMenu}
                    >
                      Mi perfil
                    </Link>
                    <Link
                      to="/my-publications"
                      className="py-2 px-3 hover:bg-gray-100 rounded-md"
                      onClick={toggleMobileMenu}
                    >
                      Mis publicaciones
                    </Link>
                    <Button
                      onClick={() => {
                        logout();
                        toggleMobileMenu();
                      }}
                      variant="outline"
                      className="w-full mt-2"
                    >
                      Cerrar sesión
                    </Button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="py-2 px-3 hover:bg-gray-100 rounded-md"
                      onClick={toggleMobileMenu}
                    >
                      Iniciar sesión
                    </Link>
                    <Link
                      to="/register"
                      className="py-2 px-3 hover:bg-gray-100 rounded-md"
                      onClick={toggleMobileMenu}
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
