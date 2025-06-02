"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/ui/ProductCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

// Mock user data
const currentUser = {
  name: "Juan Pérez",
  email: "juan@email.com",
};

// Mock user publications
const userPublications = [
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
    image: "/12-Litros.jpg",
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

export default function MyPublicationsPage() {
  const [publications, setPublications] = useState(userPublications);

  const handleEdit = (id) => {
    console.log("Edit publication:", id);
    // Redirect to edit page
  };

  const handleDelete = (id) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta publicación?")) {
      setPublications(publications.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header currentUser={currentUser} />

      <main className="flex-1 py-12">
        <div className="container px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Mis publicaciones</h1>
            <Link href="/create-publication">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nueva publicación
              </Button>
            </Link>
          </div>

          {publications.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {publications.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  showActions={true}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-4">
                No tienes publicaciones aún
              </h2>
              <p className="text-muted-foreground mb-6">
                Crea tu primera publicación para empezar a vender
              </p>
              <Link href="/create-publication">
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
