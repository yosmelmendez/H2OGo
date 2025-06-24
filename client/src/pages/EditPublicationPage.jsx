"use client";

import { useEffect, useState, useContext, useRef } from "react"; // <-- Import useRef
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { AuthContext } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ImageIcon, Upload, X } from "lucide-react"; // Import necessary icons for upload UI

export default function EditPublicationPage() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [productData, setProductData] = useState({
    title: "",
    description: "",
    price: 0,
    stock: 0,
    capacity: 0,
    location: "",
    category_id: "",
    image_url: "", // This will store the URL
    featured: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

  const [categories, setCategories] = useState([]);

  // New state for file upload management
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const fileInputRef = useRef(null); // Ref for the hidden file input

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/api/categories`);
        const data = await res.json();
        if (res.ok && data.success) {
          setCategories(data.data.categories);
        } else {
          console.error("Error fetching categories:", data.message);
        }
      } catch (err) {
        console.error("Network error fetching categories:", err);
      }
    };
    fetchCategories();
  }, [API_URL]);

  // Fetch product data on component mount or when ID/user changes
  useEffect(() => {
    const fetchProduct = async () => {
      if (!user || !id) {
        navigate("/login");
        return;
      }
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/products/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok && data.success) {
          const product = data.data.product;
          setProductData({
            title: product.title || "",
            description: product.description || "",
            price: product.price || 0,
            stock: product.stock || 0,
            capacity: product.capacity || 0,
            location: product.location || "",
            category_id: product.category_id || "",
            image_url: product.image_url || "", // Set initial image_url
            featured: product.featured || false,
          });
          // If there's an existing image_url, set it as preview
          if (product.image_url) {
            setPreviewImage(product.image_url);
          }
        } else {
          throw new Error(
            data.message || "Error al cargar los datos del producto."
          );
        }
      } catch (err) {
        console.error("Error fetching product for edit:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, user, navigate, API_URL]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // --- Image Upload Handlers ---
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file)); // Create a local URL for preview
      // Optional: Automatically set image_url to an empty string to indicate new upload in progress
      setProductData((prevData) => ({ ...prevData, image_url: "" }));
    } else {
      setSelectedFile(null);
      setPreviewImage("");
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setPreviewImage("");
    fileInputRef.current.value = ""; // Clear file input value
    setProductData((prevData) => ({ ...prevData, image_url: "" })); // Clear the image_url in productData
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Add styling for drag-over effect if needed
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleImageChange({ target: { files: [files[0]] } });
    }
    // Remove styling for drag-over effect if needed
  };

  // Function to simulate image upload and get a URL
  const uploadImageToServer = async (file) => {
    // THIS IS A PLACEHOLDER. YOU WILL REPLACE THIS WITH ACTUAL API CALL
    // TO YOUR IMAGE UPLOAD ENDPOINT (e.g., /api/upload-image)
    return new Promise((resolve) => {
      // Simulate network request
      setTimeout(() => {
        const mockImageUrl = `https://picsum.photos/id/${Math.floor(
          Math.random() * 100
        )}/400/400`; // Example mock URL
        console.log(
          `Simulating upload for ${file.name}. Returning mock URL: ${mockImageUrl}`
        );
        resolve(mockImageUrl);
      }, 1500);
    });

    // Example of how it might look with a real API call (you'd need to create this endpoint)
    /*
    const formData = new FormData();
    formData.append('image', file);
    try {
        const token = localStorage.getItem('token');
        const uploadRes = await fetch(`${API_URL}/api/upload-image`, { // Your dedicated upload endpoint
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData,
        });
        if (!uploadRes.ok) {
            const uploadErrorData = await uploadRes.json();
            throw new Error(uploadErrorData.message || 'Error al subir la imagen.');
        }
        const uploadData = await uploadRes.json();
        return uploadData.imageUrl; // Assuming your upload endpoint returns { imageUrl: '...' }
    } catch (uploadError) {
        console.error("Error uploading image:", uploadError);
        throw uploadError; // Re-throw to be caught by the handleSubmit's catch block
    }
    */
  };
  // --- End Image Upload Handlers ---

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic validation
    if (
      !productData.title ||
      !productData.description ||
      !productData.price ||
      !productData.stock ||
      !productData.category_id
    ) {
      alert(
        "Por favor, rellena todos los campos obligatorios (Título, Descripción, Precio, Stock, Categoría)."
      );
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", productData.title);
    formData.append("description", productData.description);
    formData.append("price", productData.price); // Numbers will be converted by backend
    formData.append("stock", productData.stock);
    formData.append("capacity", productData.capacity);
    formData.append("location", productData.location);
    formData.append("category_id", productData.category_id);

    let finalImageUrl = productData.image_url; // Start with the existing URL

    if (selectedFile) {
      formData.append("image", selectedFile); // 'image' must match multer's upload.single('image')
    } else if (productData.image_url) {
      // If no new file, but there was an existing image, send its URL
      // so the backend knows to keep it.
      formData.append("image_url", productData.image_url);
    } else {
      // If no new file and no existing image, explicitly tell backend to clear it
      formData.append("image_url", ""); // Send an empty string to signify removal
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          // IMPORTANT: Do NOT set 'Content-Type': 'multipart/form-data' here.
          // The browser automatically sets it with the correct boundary when you send FormData.
        },
        body: formData, // <-- Send FormData instead of JSON.stringify
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert("¡Publicación actualizada exitosamente!");
        navigate("/my-publications");
      } else {
        throw new Error(data.message || "Error al actualizar la publicación.");
      }
    } catch (err) {
      console.error("Error updating product:", err);
      setError(err.message);
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <p className="text-center py-12">Cargando datos del producto...</p>;
  if (error)
    return <p className="text-center py-12 text-red-600">Error: {error}</p>;
  if (!productData.title && !loading)
    return (
      <p className="text-center py-12">
        Producto no encontrado o no tienes permiso para editarlo.
      </p>
    );

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12">
        <div className="container px-4 mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold mb-8">
            Editar Publicación: {productData.title}
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ... other product fields (title, description, price, stock, capacity, location, category_id, featured) ... */}
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Título
              </label>
              <Input
                type="text"
                id="title"
                name="title"
                value={productData.title}
                onChange={handleChange}
                required
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Descripción
              </label>
              <textarea
                id="description"
                name="description"
                value={productData.description}
                onChange={handleChange}
                className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              />
            </div>

            {/* Price */}
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700"
              >
                Precio
              </label>
              <Input
                type="number"
                id="price"
                name="price"
                value={productData.price}
                onChange={handleChange}
                step="0.01"
                required
              />
            </div>

            {/* Stock */}
            <div>
              <label
                htmlFor="stock"
                className="block text-sm font-medium text-gray-700"
              >
                Stock
              </label>
              <Input
                type="number"
                id="stock"
                name="stock"
                value={productData.stock}
                onChange={handleChange}
                required
              />
            </div>

            {/* Capacity */}
            <div>
              <label
                htmlFor="capacity"
                className="block text-sm font-medium text-gray-700"
              >
                Capacidad (litros/ml)
              </label>
              <Input
                type="number"
                id="capacity"
                name="capacity"
                value={productData.capacity}
                onChange={handleChange}
                step="0.01"
              />
            </div>

            {/* Location */}
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700"
              >
                Ubicación
              </label>
              <Input
                type="text"
                id="location"
                name="location"
                value={productData.location}
                onChange={handleChange}
              />
            </div>

            {/* Category ID */}
            <div>
              <label
                htmlFor="category_id"
                className="block text-sm font-medium text-gray-700"
              >
                Categoría
              </label>
              <select
                id="category_id"
                name="category_id"
                value={productData.category_id}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="">Selecciona una categoría</option>
                {Array.isArray(categories) &&
                  categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Image Upload/URL Input Combined */}
            <div className="space-y-2">
              <label htmlFor="image" className="text-sm font-medium">
                Imagen
              </label>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center space-y-2 cursor-pointer"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()} // Click on div to open file dialog
              >
                <ImageIcon className="h-8 w-8 text-gray-400" />
                <div className="text-center">
                  <label htmlFor="image" className="cursor-pointer">
                    <span className="text-blue-600 hover:underline">
                      Haz clic para subir
                    </span>
                    <span className="text-gray-500"> o arrastra y suelta</span>
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
                <p className="text-xs text-gray-500">PNG, JPG hasta 10MB</p>
                {previewImage && (
                  <div className="mt-4 flex flex-col items-center">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="max-w-32 max-h-32 object-cover rounded"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage();
                      }} // Stop propagation to prevent re-opening file dialog
                      className="mt-2"
                    >
                      <X className="h-4 w-4 mr-1" /> Remover imagen
                    </Button>
                  </div>
                )}
                {/* Optional: Add a text input for URL directly if user prefers */}
                {!selectedFile &&
                  !previewImage && ( // Only show text input if no file selected and no preview
                    <>
                      <p className="text-sm text-gray-500 mt-4">
                        O introduce una URL de imagen:
                      </p>
                      <Input
                        type="text"
                        name="image_url" // Important to match productData key
                        value={productData.image_url}
                        onChange={handleChange}
                        placeholder="https://ejemplo.com/imagen.jpg"
                        className="w-full max-w-xs"
                        onClick={(e) => e.stopPropagation()} // Prevent file input click when typing
                      />
                    </>
                  )}
              </div>
            </div>

            <div className="flex space-x-2 mt-6">
              <Button type="submit" disabled={loading}>
                {loading ? "Guardando..." : "Guardar Cambios"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/my-publications")}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
