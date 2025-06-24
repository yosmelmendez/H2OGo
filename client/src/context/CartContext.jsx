import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();
export const useCart = () => useContext(CartContext);

const API_URL = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:3001";

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const { user, isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    const loadCart = async () => {
      const token = localStorage.getItem("token");
      if (isAuthenticated() && user && token) {
        try {
          const res = await fetch(`${API_URL}/api/cart`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await res.json();
          if (res.ok && data.success) {
            const cleaned = data.data.cartItems.map((item) => ({
              productId: item.product_id,
              title: item.title,
              price: item.price,
              image_url: item.image_url,
              quantity: item.quantity,
            }));
            setCartItems(cleaned);
          } else {
            setCartItems([]);
          }
        } catch (error) {
          console.error("CartContext: Network error fetching cart:", error);
          setCartItems([]);
        }
      } else {
        const stored = localStorage.getItem("cart");
        setCartItems(stored ? JSON.parse(stored) : []);
      }
    };
    loadCart();
  }, [user, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated()) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems, isAuthenticated]);

  const syncCartToBackend = useCallback(
    async (items) => {
      const token = localStorage.getItem("token");
      if (isAuthenticated() && user && token) {
        const itemsForBackend = items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        }));

        try {
          const res = await fetch(`${API_URL}/api/cart`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ cartItems: itemsForBackend }),
          });
          const data = await res.json();
          if (!res.ok || !data.success) {
            console.error("CartContext: Failed to sync cart:", data.message);
          }
        } catch (error) {
          console.error("CartContext: Network error syncing cart:", error);
        }
      }
    },
    [user, isAuthenticated]
  );

  const addItem = useCallback(
    async (productToAdd, quantity = 1) => {
      setCartItems((prevItems) => {
        const existingItem = prevItems.find(
          (item) => item.productId === productToAdd.id
        );
        let newItems;
        if (existingItem) {
          newItems = prevItems.map((item) =>
            item.productId === productToAdd.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          newItems = [
            ...prevItems,
            {
              productId: productToAdd.id,
              title: productToAdd.title,
              price: productToAdd.price,
              image_url: productToAdd.image_url,
              quantity,
            },
          ];
        }
        syncCartToBackend(newItems);
        return newItems;
      });
    },
    [syncCartToBackend]
  );

  const removeItem = useCallback(
    async (productId) => {
      setCartItems((prev) => {
        const newItems = prev.filter((item) => item.productId !== productId);
        syncCartToBackend(newItems);
        return newItems;
      });
    },
    [syncCartToBackend]
  );

  const clearCart = useCallback(async () => {
    setCartItems([]);
    if (isAuthenticated() && user && user.token) {
      try {
        const res = await fetch(`${API_URL}/api/cart/clear`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        });
        if (!res.ok) {
          const data = await res.json();
          console.error("CartContext: Failed to clear cart:", data.message);
        }
      } catch (error) {
        console.error("CartContext: Network error clearing cart:", error);
      }
    } else {
      localStorage.removeItem("cart");
    }
  }, [user, isAuthenticated]);

  const increaseQuantity = useCallback(
    async (productId) => {
      setCartItems((prevItems) => {
        const newItems = prevItems.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        syncCartToBackend(newItems);
        return newItems;
      });
    },
    [syncCartToBackend]
  );

  const decreaseQuantity = useCallback(
    async (productId) => {
      setCartItems((prevItems) => {
        const newItems = prevItems
          .map((item) =>
            item.productId === productId
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
          .filter((item) => item.quantity > 0);
        syncCartToBackend(newItems);
        return newItems;
      });
    },
    [syncCartToBackend]
  );

  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addItem,
        removeItem,
        clearCart,
        increaseQuantity,
        decreaseQuantity,
        totalQuantity,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
