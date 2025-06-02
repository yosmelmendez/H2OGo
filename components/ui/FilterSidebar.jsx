"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Filter, ChevronDown, ChevronUp } from "lucide-react"

export default function FilterSidebar({ onFiltersChange }) {
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [location, setLocation] = useState("")
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    categories: true,
    location: true,
  })

  const categories = ["Electrónicos", "Ropa y Accesorios", "Hogar y Jardín", "Deportes", "Libros", "Automóviles"]

  // Update filters when values change
  useEffect(() => {
    const filters = {
      priceRange,
      categories: selectedCategories,
      location,
    }

    onFiltersChange?.(filters)
  }, [priceRange, selectedCategories, location, onFiltersChange])

  const handleCategoryChange = (category, checked) => {
    if (checked) {
      setSelectedCategories((prev) => [...prev, category])
    } else {
      setSelectedCategories((prev) => prev.filter((c) => c !== category))
    }
  }

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const handleApplyFilters = () => {
    const filters = {
      priceRange,
      categories: selectedCategories,
      location,
    }

    onFiltersChange?.(filters)
  }

  const handleResetFilters = () => {
    setPriceRange([0, 10000])
    setSelectedCategories([])
    setLocation("")

    onFiltersChange?.({
      priceRange: [0, 10000],
      categories: [],
      location: "",
    })
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filtros
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Price Range */}
        <div className="space-y-3">
          <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleSection("price")}>
            <Label className="text-sm font-medium">Rango de precio</Label>
            {expandedSections.price ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>

          {expandedSections.price && (
            <>
              <Slider value={priceRange} onValueChange={setPriceRange} max={10000} step={100} className="w-full" />
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  placeholder="Mín"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value) || 0, priceRange[1]])}
                  className="w-full"
                />
                <span>-</span>
                <Input
                  type="number"
                  placeholder="Máx"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value) || 10000])}
                  className="w-full"
                />
              </div>
            </>
          )}
        </div>

        {/* Categories */}
        <div className="space-y-3">
          <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleSection("categories")}>
            <Label className="text-sm font-medium">Categorías</Label>
            {expandedSections.categories ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>

          {expandedSections.categories && (
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={category}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={(checked) => handleCategoryChange(category, checked)}
                  />
                  <Label htmlFor={category} className="text-sm">
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Location */}
        <div className="space-y-3">
          <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleSection("location")}>
            <Label className="text-sm font-medium">Ubicación</Label>
            {expandedSections.location ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>

          {expandedSections.location && (
            <Input
              placeholder="Ciudad o región"
              className="w-full"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          )}
        </div>

        <div className="flex gap-2">
          <Button className="flex-1" onClick={handleApplyFilters}>
            Aplicar filtros
          </Button>
          <Button variant="outline" className="flex-1" onClick={handleResetFilters}>
            Limpiar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
