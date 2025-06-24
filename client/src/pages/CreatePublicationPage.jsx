"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { useForm } from "../hooks/useForm";
import { Upload, ImageIcon } from "lucide-react";

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
    category: "", // This will hold category ID
    image: null,
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001"; // Consistent API_URL
        const res = await fetch(`${API_URL}/api/categories`);
        const data = await res.json();
        // CORRECTED LINE: Access data.data.categories
        if (data.success && Array.isArray(data.data.categories)) {
          setCategories(data.data.categories);
        } else {
          console.error("Respuesta de categorías inesperada:", data);
          setCategories([]); // Ensure it's an array even on unexpected data
        }
      } catch (error) {
        console.error("Error cargando categorías:", error);
        setCategories([]); // Ensure it's an array on error
      }
    };

    fetchCategories();
  }, []);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setValues((prevValues) => ({
        ...prevValues,
        image: file,
      }));

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setValues((prevValues) => ({
      ...prevValues,
      image: null,
    }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setFormErrors({});

    try {
      const token = localStorage.getItem("token");
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("price", parseFloat(values.price)); // Ensure number type
      formData.append("stock", parseInt(values.stock, 10)); // Ensure number type
      formData.append("capacity", parseFloat(values.capacity) || 0); // Handle optional capacity
      formData.append("location", values.location);
      formData.append("category_id", values.category); // Backend expects category_id

      // Only append image if it exists
      if (values.image) {
        formData.append("image", values.image);
      } else {
        // If no image is selected, and backend expects a URL for creation, you might need a default
        // Or your backend should handle the case where no image is provided.
        // For now, if values.image is null, it won't be appended to FormData.
        // Ensure your backend's POST /products endpoint can handle no image or needs a default.
      }

      const response = await fetch(`${API_URL}/api/products`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // 'Content-Type': 'multipart/form-data' is NOT needed with FormData,
          // browser sets it automatically with correct boundary
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok)
        throw new Error(data.message || "Error creando producto");

      console.log("✅ Producto creado:", data);
      setPublicationSuccess(true);
    } catch (error) {
      console.error("❌ Error creando producto:", error.message);
      setFormErrors({ global: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (publicationSuccess) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 py-12">
          <div className="container max-w-2xl px-4 mx-auto">
            <Card>
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
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
        <div className="container max-w-2xl px-4 mx-auto">
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
                  <label htmlFor="title" className="text-sm font-medium">
                    Título
                  </label>
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
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Descripción
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Describe tu producto en detalle"
                    rows={4}
                    value={values.description}
                    onChange={handleChange}
                    className={`flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                      formErrors.description ? "border-red-500" : ""
                    }`}
                  />
                  {formErrors.description && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.description}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="price" className="text-sm font-medium">
                      Precio
                    </label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      placeholder="0"
                      value={values.price}
                      onChange={handleChange}
                      className={formErrors.price ? "border-red-500" : ""}
                    />
                    {formErrors.price && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.price}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="stock" className="text-sm font-medium">
                      Stock
                    </label>
                    <Input
                      id="stock"
                      name="stock"
                      type="number"
                      placeholder="Cantidad disponible"
                      value={values.stock}
                      onChange={handleChange}
                      className={formErrors.stock ? "border-red-500" : ""}
                    />
                    {formErrors.stock && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.stock}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="capacity" className="text-sm font-medium">
                    Capacidad
                  </label>
                  <Input
                    id="capacity"
                    name="capacity"
                    placeholder="Ej: 64GB, 500ml, etc."
                    value={values.capacity}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="location" className="text-sm font-medium">
                    Ubicación
                  </label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="Ciudad, departamento"
                    value={values.location}
                    onChange={handleChange}
                    className={formErrors.location ? "border-red-500" : ""}
                  />
                  {formErrors.location && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.location}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="category" className="text-sm font-medium">
                    Categoría
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={values.category}
                    onChange={handleChange}
                    className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                      formErrors.category ? "border-red-500" : ""
                    }`}
                  >
                    <option value="">Selecciona una categoría</option>
                    {Array.isArray(categories) &&
                      categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                  </select>
                  {formErrors.category && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.category}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="image" className="text-sm font-medium">
                    Imagen
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <ImageIcon className="h-8 w-8 text-gray-400" />
                      <div className="text-center">
                        <label htmlFor="image" className="cursor-pointer">
                          <span className="text-blue-600 hover:underline">
                            Haz clic para subir
                          </span>
                          <span className="text-gray-500">
                            {" "}
                            o arrastra y suelta
                          </span>
                        </label>
                        <input
                          ref={fileInputRef}
                          id="image"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG hasta 10MB
                      </p>
                      {previewImage && (
                        <div className="mt-4">
                          <img
                            src={
                              previewImage || "https://via.placeholder.com/150"
                            }
                            alt="Preview"
                            className="max-w-32 max-h-32 object-cover rounded"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={removeImage}
                            className="mt-2"
                          >
                            Remover imagen
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isSubmitting}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Publicando..." : "Publicar"}
                </Button>
              </CardContent>
            </form>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
