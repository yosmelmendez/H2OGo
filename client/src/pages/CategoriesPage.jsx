// src/pages/CategoriesPage.jsx
"use client";

import React, { useState, useEffect } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Assuming your API has an endpoint for categories, e.g., /api/categories
        const res = await fetch(`${API_URL}/api/categories`);
        const data = await res.json();

        if (res.ok && data.success) {
          setCategories(data.data.categories); // Adjust based on your actual API response
        } else {
          throw new Error(data.message || "Error al cargar categorías.");
        }
      } catch (err) {
        console.error("Error al cargar categorías:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [API_URL]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12">
        <div className="container max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-center">
            Explorar Categorías
          </h1>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-gray-200 h-20 rounded-lg"
                ></div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center text-red-600">Error: {error}</div>
          ) : categories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((category) => (
                <Link
                  key={category.id} // Assuming each category has an 'id'
                  to={`/products?category=${encodeURIComponent(category.name)}`} // Link to products filtered by category
                  className="flex items-center justify-between p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200"
                >
                  <span className="text-lg font-medium">{category.name}</span>{" "}
                  {/* Assuming 'name' property */}
                  <ChevronRight className="h-5 w-5 text-gray-500" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-600">
              No se encontraron categorías.
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
