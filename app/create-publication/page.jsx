"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useForm } from "@/hooks/useForm";

export default function CreatePublicationPage() {
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [publicationSuccess, setPublicationSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const { values, handleChange, setValues } = useForm({
    title: "",
    description: "",
    price: "",
    capacity: "",
    stock: "",
    location: "",
    category: "",
    image: null,
  });

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setValues({
        ...values,
        image: file,
      });

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setValues({
      ...values,
      image: null,
    });
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!values.title.trim()) {
      errors.title = "El título es requerido";
    }

    if (!values.description.trim()) {
      errors.description = "La descripción es requerida";
    }

    if (!values.price) {
      errors.price = "El precio es requerido";
    } else if (isNaN(values.price) || Number(values.price) <= 0) {
      errors.price = "El precio debe ser un número mayor a 0";
    }

    if (!values.stock) {
      errors.stock = "El stock es requerido";
    } else if (isNaN(values.stock) || Number(values.stock) < 0) {
      errors.stock = "El stock debe ser un número mayor o igual a 0";
    }

    if (!values.location.trim()) {
      errors.location = "La ubicación es requerida";
    }

    if (!values.category) {
      errors.category = "La categoría es requerida";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Create publication:", values);
      setIsSubmitting(false);
      setPublicationSuccess(true);
    }, 1500);
  };

  if (publicationSuccess) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 py-12">
          <div className="container max-w-2xl px-4">
            <Card>
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  </div>
                </div>
                <CardTitle className="text-2xl text-center">
                  ¡Publicación creada con éxito!
                </CardTitle>
                <CardDescription className="text-center">
                  Tu producto ha sido publicado correctamente y ya está
                  disponible para todos los usuarios.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center space-x-4 pt-4">
                <Button
                  onClick={() => (window.location.href = "/my-publications")}
                >
                  Ver mis publicaciones
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setPublicationSuccess(false);
                    setValues({
                      title: "",
                      description: "",
                      price: "",
                      capacity: "",
                      stock: "",
                      location: "",
                      category: "",
                      image: null,
                    });
                    setPreviewImage(null);
                  }}
                >
                  Crear otra publicación
                </Button>
              </CardContent>
            </Card>
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
        <div className="container max-w-2xl px-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                Formulario para crear publicación
              </CardTitle>
              <CardDescription>
                Completa todos los campos para publicar tu producto
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Nombre del producto"
                    value={values.title}
                    onChange={handleChange}
                    className={formErrors.title ? "border-red-500" : ""}
                  />
                  {formErrors.title && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.title}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe tu producto en detalle"
                    rows={4}
                    value={values.description}
                    onChange={handleChange}
                    className={formErrors.description ? "border-red-500" : ""}
                  />
                  {formErrors.description && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.description}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Precio</Label>
                  </div>
                </div>
              </CardContent>
            </form>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
