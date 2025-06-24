"use client";

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function ProfilePage() {
  const { user, login, logout } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      console.log(
        "ProfilePage: Submitting with token from localStorage:",
        token
      ); // <-- Add this
      console.log("ProfilePage: FormData being sent:", formData); // <-- Add this (useful for backend debugging)

      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

      const res = await fetch(`${API_URL}/api/users/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al actualizar el perfil");
      }
      console.log("ProfilePage: Backend response on successful update:", data); // <-- Add this
      login(data.data.user); // actualiza el contexto con los nuevos datos
      setIsEditing(false);
      setMessage("✅ Perfil actualizado exitosamente");
    } catch (err) {
      console.error("❌ Error:", err.message);
      setMessage(`❌ ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };
  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-center text-gray-600">
            Debes iniciar sesión para ver tu perfil.
          </p>
        </main>
        <Footer />
      </div>
    );
  }
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12">
        <div className="container max-w-xl mx-auto px-4">
          <h1 className="text-2xl font-bold mb-6">Mi perfil</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Nombre</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Correo</label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Teléfono</label>
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Dirección</label>
              <Input
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            {message && (
              <p
                className={`text-sm ${
                  message.startsWith("✅") ? "text-green-600" : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}

            <div className="flex space-x-4 pt-2">
              {!isEditing ? (
                <Button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    console.log("Button clicked: Setting isEditing to true"); // ADD THIS LOG
                    setIsEditing(true);
                  }}
                >
                  Editar perfil
                </Button>
              ) : (
                <>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? "Guardando..." : "Guardar cambios"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      console.log(
                        "Button clicked: Setting isEditing to false (Cancel)"
                      ); // ADD THIS LOG
                      setIsEditing(false);
                      setFormData({
                        name: user.name || "",
                        email: user.email || "",
                        phone: user.phone || "",
                        address: user.address || "",
                      });
                      setMessage("");
                    }}
                  >
                    Cancelar
                  </Button>
                </>
              )}
            </div>
          </form>
          <div className="pt-6 flex justify-end">
            <Button onClick={logout} variant="destructive">
              Cerrar sesión
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
