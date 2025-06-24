"use client";

import React, { useState, useEffect, useContext, useCallback } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ProductCard from "../components/ui/ProductCard";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  ArrowRight,
  Search,
  Search as SearchIcon,
  Star,
  TrendingUp,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom"; // <-- Ensure useSearchParams is imported
import { AuthContext } from "../context/AuthContext"; // <--- ¡Apunta al Context API!
import { useCart } from "../context/CartContext";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState(""); // This state is for the local input field
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const { addItem } = useCart();

  const { user } = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();

  // --- CRITICAL: Memoize fetchProducts with useCallback ---
  const fetchProducts = useCallback(
    async (currentPage, currentSearchQuery, currentCategory) => {
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        params.append("page", currentPage);
        params.append("limit", 12);
        if (currentSearchQuery) {
          params.append("search", currentSearchQuery);
        }
        if (currentCategory) {
          params.append("category", currentCategory);
        }
        const url = `${API_URL}/api/products?${params.toString()}`;
        const res = await fetch(
          `${API_URL}/api/products?${params.toString()}`,
          {
            headers: {
              Authorization: user ? `Bearer ${user.token}` : "",
            },
          }
        );
        const data = await res.json();

        if (res.ok && data.success) {
          setProducts(data.data.products);
          setTotalPages(data.data.pagination.total_pages);
        } else {
          throw new Error(data.message || "Error al cargar productos.");
        }
      } catch (err) {
        console.error("Error al cargar productos:", err);
        setError(err.message);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    },
    [user]
  );

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

  useEffect(() => {
    const fetchRecentProducts = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/products?limit=4`);
        const data = await res.json();
        if (res.ok) {
          setProducts(data.data.products);
        } else {
          console.error("Error cargando productos recientes:", data.message);
        }
      } catch (err) {
        console.error("Error de red al cargar productos:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentProducts();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/api/products?search=${encodeURIComponent(searchQuery)}`
      );
      const data = await res.json();
      if (res.ok) {
        setProducts(data.data.products);
      } else {
        console.error("Error en búsqueda:", data.message);
      }
    } catch (err) {
      console.error("Error de red en búsqueda:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="container px-4 md:px-6 mx-auto max-w-7xl">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 mb-4">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Más de 100 productos disponibles
                </div>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Encuentra todo lo que necesitas
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl">
                  El marketplace para hidratarse más grande de Chile. Compra y
                  vende agua de forma segura y confiable.
                </p>
              </div>

              <form
                onSubmit={handleSearch}
                className="w-full max-w-md mx-auto mt-6"
              >
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="search"
                    placeholder="¿Qué estás buscando?"
                    className="pl-10 w-full h-12 text-base"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button type="submit" className="absolute right-1 top-1 h-10">
                    Buscar
                  </Button>
                </div>
              </form>

              <div className="flex flex-col gap-2 min-[400px]:flex-row mt-6">
                <Link to="/products">
                  <Button size="lg" className="h-12 px-8">
                    Explorar productos
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/create-publication">
                  <Button variant="outline" size="lg" className="h-12 px-8">
                    Vender ahora
                  </Button>
                </Link>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>4.8/5 en reseñas</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>•</span>
                  <span>Envío gratis en compras +$10,000</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto max-w-7xl">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800">
                  Productos destacados
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Galería de publicaciones recientes
                </h2>
                <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Descubre los productos más populares y mejor valorados por
                  nuestra comunidad.
                </p>
              </div>
            </div>

            <div>
              {isLoading ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-gray-200 rounded-lg aspect-square mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                      <div className="h-6 bg-gray-200 rounded mb-2 w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  ))}
                </div>
              ) : products.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={addItem}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">
                    No se encontraron productos
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Intenta con otros términos de búsqueda
                  </p>
                  <Button
                    onClick={async () => {
                      setSearchQuery("");
                      setIsLoading(true);
                      try {
                        const res = await fetch(`${API_URL}/api/products`);
                        const data = await res.json();
                        if (res.ok) {
                          setProducts(data.data.products);
                        }
                      } catch (err) {
                        console.error("Error al resetear productos:", err);
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                  >
                    Ver todos los productos
                  </Button>
                </div>
              )}
            </div>

            <div className="flex justify-center mt-12">
              <Link to="/products">
                <Button size="lg" variant="outline">
                  Ver todos los productos
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
