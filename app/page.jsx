"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ArrowRight, TrendingUp, Search } from "lucide-react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/ui/ProductCard";
import FilterSidebar from "@/components/ui/FilterSidebar";
import { useCart } from "@/hooks/useCart";
import { Input } from "@/components/ui/input";

// Mock data
const featuredProducts = [
  {
    id: "1",
    title: "Bidon de 10 Litros",
    description: "Para hogares pequeños o uso personal",
    price: 1500,
    image: "/10-Litros.jpg",
    stock: 1,
    location: "Santiago, Chile",
  },
  {
    id: "2",
    title: "Bidon de 12 Litros",
    description: "Intermedio, fácil de manejar",
    price: 2000,
    image: "/12-litros.jpg",
    stock: 2,
    location: "Santiago, Chile",
  },
  {
    id: "3",
    title: "Bidon de 20 Litros",
    description: "El mas popular, mejor vendido",
    price: 2500,
    image: "/20-litros.jpg",
    stock: 5,
    location: "Santiago, Chile",
  },
];

export default function HomePage() {
  const [products, setProducts] = useState(featuredProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { addToCart, totalItems } = useCart();

  // Simulate loading effect
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    // Filter products based on search query
    const filtered = featuredProducts.filter((product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setProducts(filtered);
  };

  const handleFiltersChange = (filters) => {
    console.log("Filters applied:", filters);
    // Filter products based on filters
    let filtered = [...featuredProducts];

    // Apply price filter
    if (filters?.priceRange) {
      filtered = filtered.filter(
        (product) =>
          product.price >= filters.priceRange[0] &&
          product.price <= filters.priceRange[1]
      );
    }

    // Apply category filter
    if (filters?.categories && filters.categories.length > 0) {
      // This is a mock implementation since we don't have categories in our mock data
    }

    // Apply location filter
    if (filters?.location) {
      filtered = filtered.filter((product) =>
        product.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    setProducts(filtered);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge variant="secondary" className="mb-4">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Más de 10,000 productos disponibles
                </Badge>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Encuentra todo lo que necesitas
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  El marketplace para hidratarse más grande de Chile. Compra y
                  vende agua de forma segura y confiable.
                </p>
              </div>

              {/* Hero Search */}
              <form
                onSubmit={handleSearch}
                className="w-full max-w-md mx-auto mt-6"
              >
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
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
                <Link href="/products">
                  <Button size="lg" className="h-12 px-8">
                    Explorar productos
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/create-publication">
                  <Button variant="outline" size="lg" className="h-12 px-8">
                    Vender ahora
                  </Button>
                </Link>
              </div>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
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

        {/* Featured Products Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <Badge variant="secondary">Productos destacados</Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Galería de publicaciones destacadas
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Descubre los productos más populares y mejor valorados por
                  nuestra comunidad.
                </p>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
              {/* Filters Sidebar */}
              <div className="hidden lg:block">
                <FilterSidebar onFiltersChange={handleFiltersChange} />
              </div>

              {/* Products Grid */}
              <div>
                {isLoading ? (
                  // Loading skeleton
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="bg-muted rounded-lg aspect-square mb-4"></div>
                        <div className="h-4 bg-muted rounded mb-2 w-3/4"></div>
                        <div className="h-6 bg-muted rounded mb-2 w-1/2"></div>
                        <div className="h-4 bg-muted rounded w-1/4"></div>
                      </div>
                    ))}
                  </div>
                ) : products.length > 0 ? (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {products.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={addToCart}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-medium mb-2">
                      No se encontraron productos
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Intenta con otros filtros o términos de búsqueda
                    </p>
                    <Button
                      onClick={() => {
                        setSearchQuery("");
                        setProducts(featuredProducts);
                      }}
                    >
                      Ver todos los productos
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-center mt-12">
              <Link href="/products">
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
