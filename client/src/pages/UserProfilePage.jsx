import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { Button } from "../components/ui/button";

export default function UserProfilePage() {
  const { id } = useParams();
  const [seller, setSeller] = useState(null);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

  useEffect(() => {
    const fetchSeller = async () => {
      try {
        const res = await fetch(`${API_URL}/api/users/${id}`);
        const data = await res.json();

        if (res.ok) {
          setSeller(data.data.user);
        } else {
          setError(data.message || "Error al cargar el perfil");
        }
      } catch (err) {
        setError("Error de red");
      }
    };

    fetchSeller();
  }, [id]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 py-12">
        <div className="container max-w-xl mx-auto px-4">
          {error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : seller ? (
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-center">
                Perfil de {seller.name}
              </h1>
              <p>
                <strong>Correo:</strong> {seller.email}
              </p>
              <p>
                <strong>Teléfono:</strong> {seller.phone}
              </p>
              <p>
                <strong>Dirección:</strong> {seller.address}
              </p>
              <a
                href={`mailto:${seller.email}?subject=Interés en tus productos`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="mt-4 w-full" variant="default">
                  Contactar por correo
                </Button>
              </a>
            </div>
          ) : (
            <p className="text-center">Cargando perfil...</p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
