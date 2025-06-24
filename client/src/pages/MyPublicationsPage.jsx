"use client";

import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // <-- Import useNavigate
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ProductCard from "../components/ui/ProductCard";
import { Button } from "../components/ui/button";
import { Plus } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

export default function MyPublicationsPage() {
  const { user } = useContext(AuthContext);
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // <-- Initialize useNavigate hook

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const token = localStorage.getItem("token");
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

        const response = await fetch(
          `${API_URL}/api/products?user_id=${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Error al obtener publicaciones");
        }

        setPublications(data.data.products);
      } catch (err) {
        console.error("Error cargando publicaciones:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchPublications();
  }, [user]);

  // Modified handleEdit to navigate to the edit page
  const handleEdit = (id) => {
    console.log("Navegando a la edición de publicación:", id);
    navigate(`/edit-publication/${id}`); // <-- Navigate to the edit route
  };

  const handleDelete = async (id) => {
    const confirmDelete = confirm(
      "¿Estás seguro de que quieres eliminar esta publicación?"
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

      const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al eliminar el producto");
      }

      // Eliminar del estado local
      setPublications(publications.filter((p) => p.id !== id));
      console.log("✅ Producto eliminado");
    } catch (err) {
      console.error("❌ Error eliminando producto:", err.message);
      alert("Hubo un problema al eliminar la publicación.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 py-12">
        <div className="container px-4 mx-auto max-w-7xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Mis publicaciones</h1>
            <Link to="/create-publication">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nueva publicación
              </Button>
            </Link>
          </div>

          {loading ? (
            <p className="text-center text-gray-600">
              Cargando publicaciones...
            </p>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : publications.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {publications.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  showActions={true}
                  onEdit={() => handleEdit(product.id)} // <-- Ensure product.id is passed
                  onDelete={() => handleDelete(product.id)} // <-- Ensure product.id is passed
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-4">
                No tienes publicaciones aún
              </h2>
              <p className="text-gray-600 mb-6">
                Crea tu primera publicación para empezar a vender
              </p>
              <Link to="/create-publication">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Crear primera publicación
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
