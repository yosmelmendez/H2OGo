import { notFound } from "next/navigation"
import Image from "next/image"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, MapPin, Package, Star } from "lucide-react"

// Mock product data
const getProduct = (id) => {
  const products = {
    1: {
      id: "1",
      title: "iPhone 14 Pro Max",
      description:
        "Smartphone Apple en excelente estado. Incluye cargador original, caja y todos los accesorios. Sin rayones ni golpes. Batería en perfecto estado con 98% de salud. Libre de cualquier operador.",
      price: 1200000,
      image: "/placeholder.svg?height=500&width=500",
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
  }
  return products[id]
}

export default function ProductDetailPage({ params }) {
  const product = getProduct(params.id)

  if (!product) {
    notFound()
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 py-12">
        <div className="container px-4">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="relative aspect-square overflow-hidden rounded-lg border">
                <Image src={product.image || "/placeholder.svg"} alt={product.title} fill className="object-cover" />
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <Badge variant="secondary" className="mb-2">
                  {product.category}
                </Badge>
                <h1 className="text-3xl font-bold">{product.title}</h1>
                <div className="flex items-center space-x-2 mt-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{product.location}</span>
                </div>
              </div>

              <div className="text-4xl font-bold text-primary">${product.price.toLocaleString()}</div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Package className="h-4 w-4 text-green-600" />
                  <span className="text-green-600 font-medium">{product.stock} disponibles</span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Descripción</h3>
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              </div>

              <Card>
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-3">Especificaciones</h4>
                  <div className="space-y-2">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-muted-foreground">{key}:</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
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
                          {product.seller.rating} ({product.seller.reviews} reseñas)
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
  )
}
