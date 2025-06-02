"use client";

import { useParams } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { ShoppingCart, MapPin, Package, Star } from "lucide-react";

const getProduct = (id) => {
  const products = {
    1: {
      id: "1",
      title: "iPhone 14 Pro Max",
      description:
        "Smartphone Apple en excelente estado. Incluye cargador original, caja y todos los accesorios. Sin rayones ni golpes. Batería en perfecto estado con 98% de salud. Libre de cualquier operador.",
      price: 1200000,
      image: "https://via.placeholder.com/500x500",
      stock: 5,
      location: "Bogotá, Colombia",
      category: "Electrónicos",
      seller: {
        name: "María González",
        rating: 4.8,
        reviews: 127,
      },
      specifications: {
        Marca: "Apple",
        Modelo: "iPhone 14 Pro Max",
        Almacenamiento: "256GB",
        Color: "Morado profundo",
        Estado: "Como nuevo",
      },
    },
  };
  return products[id];
};

export default function ProductDetailPage() {
  const { id } = useParams();
  const product = getProduct(id);

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
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="relative aspect-square overflow-hidden rounded-lg border">
                <img
                  src={product.image || "https://via.placeholder.com/500x500"}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800 mb-2">
                  {product.category}
                </div>
                <h1 className="text-3xl font-bold">{product.title}</h1>
                <div className="flex items-center space-x-2 mt-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-500">{product.location}</span>
                </div>
              </div>

              <div className="text-4xl font-bold text-blue-600">
                ${product.price.toLocaleString()}
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Package className="h-4 w-4 text-green-600" />
                  <span className="text-green-600 font-medium">
                    {product.stock} disponibles
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
                  <h4 className="font-semibold mb-3">Especificaciones</h4>
                  <div className="space-y-2">
                    {Object.entries(product.specifications).map(
                      ([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-gray-500">{key}:</span>
                          <span className="font-medium">{value}</span>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-3">Vendedor</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{product.seller.name}</p>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">
                          {product.seller.rating} ({product.seller.reviews}{" "}
                          reseñas)
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Ver perfil
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-3">
                <Button size="lg" className="w-full">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Agregar al carrito
                </Button>
                <Button variant="outline" size="lg" className="w-full">
                  Contactar vendedor
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
