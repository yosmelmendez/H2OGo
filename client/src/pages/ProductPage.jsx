import { useEffect, useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ProductCard from "../components/ui/ProductCard";
import { Button } from "../components/ui/button";
import { useCart } from "../context/CartContext";
export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addItem } = useCart();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products`);
        const data = await res.json();
        if (res.ok) {
          setProducts(data.data.products);
        } else {
          console.error("Error cargando productos:", data.message);
        }
      } catch (err) {
        console.error("Error de red al cargar productos:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 py-12">
        <div className="container max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-8">
            Todos los productos
          </h1>

          {isLoading ? (
            <p className="text-center text-gray-500">Cargando productos...</p>
          ) : products.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addItem}
                />
              ))}
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4">
                No hay productos disponibles
              </h2>
              <Button href="/create-publication">Crear una publicación</Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
