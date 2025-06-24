// src/pages/ProductDetailPage.jsx
"use client";

import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { ShoppingCart, MapPin, Package, Star, ArrowLeft } from "lucide-react";
import { useCart } from "../context/CartContext"; // <-- Import useCart hook

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const { addItem } = useCart(); // <-- Get addItem from useCart, just like in ProductsPage.jsx

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products/${id}`);
        const data = await res.json();
        if (res.ok && data.success) {
          setProduct(data.data.product);
          setImageError(false);
        } else {
          setProduct(null);
          console.error(
            "Error obteniendo producto:",
            data.message || data.error
          );
        }
      } catch (err) {
        console.error("Error de red al obtener producto:", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, API_URL]);

  // Handle adding product to cart (same logic as ProductCard's onAddToCart)
  const handleAddToCart = () => {
    if (product) {
      addItem(product); // Pass the entire product object
      // Optional: Add a more sophisticated notification (e.g., toast) here
      console.log(`${product.title} added to cart.`); // For debugging
    }
  };

  // Function to determine contact link (e.g., mailto or a dedicated chat page)
  const getContactSellerLink = () => {
    // Assuming 'seller_email' or a similar contact info is available on the product object
    // You'll need to confirm your API sends this with the product details.
    if (product && product.seller_email) {
      return `mailto:${product.seller_email}`;
    }
    // If you have an internal messaging system, you might return a link like:
    // if (product && product.seller_id) {
    //    return `/chat/${product.seller_id}`;
    // }
    return null; // If no contact info, the button will be disabled
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Cargando producto...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Producto no encontrado</h1>
            <p className="text-gray-600">
              El producto que buscas no existe o ha sido eliminado.
            </p>
            <Button onClick={() => navigate(-1)} className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" /> Volver atrás
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 py-12">
        <div className="container px-4 mx-auto max-w-7xl">
          <Button onClick={() => navigate(-1)} variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" /> Volver atrás
          </Button>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="relative aspect-square overflow-hidden rounded-lg border">
                {!imageError ? (
                  <img
                    src={product.image_url}
                    alt={product.title}
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
                    onError={(e) => {
                      console.error(
                        "Error cargando imagen para:",
                        product.title,
                        "URL intentada:",
                        e.target.src
                      );
                      setImageError(true);
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm p-4 text-center">
                    <span>No se pudo cargar la imagen</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800 mb-2">
                  {/* Safely access category name based on common API structures */}
                  {product.category?.name || product.category_name || "General"}
                </div>
                <h1 className="text-3xl font-bold">{product.title}</h1>
                <div className="flex items-center space-x-2 mt-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-500">{product.location}</span>
                </div>
              </div>

              <div className="text-4xl font-bold text-blue-600">
                ${product.price ? product.price.toLocaleString() : "N/A"}
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Package className="h-4 w-4 text-green-600" />
                  <span className="text-green-600 font-medium">
                    {product.stock > 0
                      ? `${product.stock} disponibles`
                      : "Sin stock"}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Descripción</h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <Card>
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-3">Vendedor</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      {/* Safely access seller name */}
                      <p className="font-medium">
                        {product.seller?.user_name ||
                          product.seller_name ||
                          "N/A"}
                      </p>
                    </div>
                    {product.seller_id && (
                      <Link to={`/users/${product.seller_id}`}>
                        <Button variant="outline" size="sm">
                          Ver perfil
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-3">
                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleAddToCart} // <-- Now calls handleAddToCart
                  disabled={product.stock === 0} // Disable if out of stock
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Agregar al carrito
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  asChild // Use asChild to render Link/a internally
                  disabled={!getContactSellerLink()} // Disable if no contact link
                >
                  {getContactSellerLink() ? (
                    <a
                      href={getContactSellerLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Contactar vendedor
                    </a>
                  ) : (
                    <span>Contactar vendedor</span> // Render as span if disabled
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
