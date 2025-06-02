"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "./button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./card"
import { ShoppingCart, Edit, Trash2, Heart } from "lucide-react"

export default function ProductCard({ product, showActions = false, onEdit, onDelete, onAddToCart }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  const toggleFavorite = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsFavorite(!isFavorite)
  }

  return (
    <Card
      className="overflow-hidden transition-all duration-200 hover:shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="p-0">
        <div className="relative aspect-square">
          <img
            src={product.image || "https://via.placeholder.com/300x300"}
            alt={product.title}
            className={`w-full h-full object-cover transition-transform duration-300 ${isHovered ? "scale-105" : "scale-100"}`}
          />
          <button
            onClick={toggleFavorite}
            className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
          >
            <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-500"}`} />
          </button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg mb-2 line-clamp-2 h-12">{product.title}</CardTitle>
        <p className="text-2xl font-bold text-blue-600">${product.price.toLocaleString()}</p>
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
            <Button variant="outline" size="sm" className="flex-1" onClick={() => onEdit?.(product.id)}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
            <Button variant="destructive" size="sm" className="flex-1" onClick={() => onDelete?.(product.id)}>
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
            <Button size="sm" className="flex-1" onClick={() => onAddToCart?.(product)} disabled={product.stock === 0}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Agregar
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
