// components/ui/ProductCard.jsx

"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./card";
import { ShoppingCart, Edit, Trash2, Heart } from "lucide-react";

export default function ProductCard({
  product,
  showActions = false,
  onEdit,
  onDelete,
  onAddToCart,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  // Add state to track image loading error
  const [imageError, setImageError] = useState(false);

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
  return (
    <Card
      className="overflow-hidden transition-all duration-200 hover:shadow-md flex flex-col" // Added flex-col for consistent height
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="p-0">
        <div className="relative aspect-square">
          {!imageError ? ( // Conditionally render image or fallback
            <img
              src={product.image_url}
              alt={product.title}
              className={`w-full h-full object-cover transition-transform duration-300 ${
                isHovered ? "scale-105" : "scale-100"
              }`}
              onError={(e) => {
                console.error(
                  "Error cargando imagen para:",
                  product.title,
                  "URL intentada:",
                  e.target.src
                );
                setImageError(true); // Set state to true on error
                // e.target.src = "https://via.placeholder.com/300x300"; // This line is not needed with imageError state
              }}
              crossOrigin="anonymous"
            />
          ) : (
            // Fallback content when image fails to load
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm p-4 text-center">
              <span>No se pudo cargar la imagen</span>
            </div>
          )}

          <button
            onClick={toggleFavorite}
            className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
          >
            <Heart
              className={`h-4 w-4 ${
                isFavorite ? "fill-red-500 text-red-500" : "text-gray-500"
              }`}
            />
          </button>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        {" "}
        {/* Added flex-grow */}
        <CardTitle className="text-lg mb-2 line-clamp-2 h-12">
          {product.title}
        </CardTitle>
        <p className="text-2xl font-bold text-blue-600">
          ${product.price.toLocaleString()}
        </p>
        <p className="text-sm text-gray-500 mt-1">{product.location}</p>
        {product.stock > 0 ? (
          <p className="text-sm text-green-600 mt-1">Stock: {product.stock}</p>
        ) : (
          <p className="text-sm text-red-600 mt-1">Sin stock</p>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        {showActions ? (
          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => onEdit?.(product.id)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="flex-1"
              onClick={() => onDelete?.(product.id)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar
            </Button>
          </div>
        ) : (
          <div className="flex gap-2 w-full">
            <Link to={`/product/${product.id}`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full">
                Ver detalles
              </Button>
            </Link>
            <Button
              size="sm"
              className="flex-1"
              onClick={() => {
                console.log("Add to Cart button clicked for:", product.title);
                console.log("Product data being passed:", product);
                onAddToCart?.(product);
                console.log("After onAddToCart call.");
              }}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Agregar
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
