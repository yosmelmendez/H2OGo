"use client";

import { useCart } from "../context/CartContext";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { Button } from "../components/ui/button";
import { Trash2, ShoppingCart, Plus, Minus } from "lucide-react";
import { Link } from "react-router-dom";

export default function CartPage() {
  const {
    cartItems = [],
    removeItem,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  console.log("CartPage: cartItems recibidos del contexto:", cartItems);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 py-12">
        <div className="container px-4 mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold mb-8">Carrito de compras</h1>

          {cartItems.length === 0 ? (
            <div className="text-center text-gray-600">
              Tu carrito está vacío.
              <div className="mt-6">
                <Link to="/">
                  <Button>Explorar productos</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center justify-between border-b pb-4"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={
                        item.image_url || "https://via.placeholder.com/80x80"
                      }
                      alt={item.title}
                      className="w-20 h-20 object-cover rounded"
                      crossOrigin="anonymous"
                    />
                    <div>
                      <h2 className="font-semibold text-lg">{item.title}</h2>
                      <p className="text-gray-600">Cantidad: {item.quantity}</p>
                      <p className="text-gray-800 font-medium mb-2">
                        ${item.price.toLocaleString()}
                      </p>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => decreaseQuantity(item.productId)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="font-bold text-lg w-8 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => increaseQuantity(item.productId)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={() => removeItem(item.productId)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Eliminar
                  </Button>
                </div>
              ))}

              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${total.toLocaleString()}</span>
                </div>
                <div className="mt-6 flex justify-between">
                  <Button variant="outline" onClick={clearCart}>
                    Vaciar carrito
                  </Button>
                  <Button>
                    <ShoppingCart className="h-4 w-4 mr-2" /> Pagar
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
