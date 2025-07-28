import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Article } from "@/types/type";

interface ArticleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  article?: Article;
  onSave: (articleData: Article) => void;
}

export function ArticleDialog({
  open,
  onOpenChange,
  article,
  onSave,
}: ArticleDialogProps) {
  const [formData, setFormData] = useState({
    reference: "",
    designation: "",
    description: "",
    category: "",
    classification: "",
    uniteMesure: "",
    weight: "",
    volume: "",
    seuilMin: "",
    seuilMax: "",
    unitPrice: "",
    supplier: "",
    location: "",
    bareCodes: "",
    stock: "0",
  });

  useEffect(() => {
    if (article) {
      setFormData({
        reference: article.reference,
        designation: article.designation,
        description: article.description,
        category: article.category,
        classification: article.classification,
        uniteMesure: article.uniteMesure,
        weight: article.weight != null ? article.weight.toString() : "",
        volume: article.volume != null ? article.volume.toString() : "",
        seuilMin: article.seuilMin.toString(),
        seuilMax: article.seuilMax.toString(),
        unitPrice: article.unitPrice.toString(),
        supplier: article.supplier,
        location: article.location,
        bareCodes: article.bareCodes,
        stock: article.stock.toString(),
      });
    } else {
      setFormData({
        reference: "",
        designation: "",
        description: "",
        category: "",
        classification: "",
        uniteMesure: "",
        weight: "",
        volume: "",
        seuilMin: "",
        seuilMax: "",
        unitPrice: "",
        supplier: "",
        location: "",
        bareCodes: "",
        stock: "0",
      });
    }
  }, [article]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const articleData: Article = {
      id: article?.id ?? Date.now(),
      status: article?.status ?? "Active",
      ...formData,
      weight: formData.weight ? parseFloat(formData.weight) : null,
      volume: formData.volume ? parseFloat(formData.volume) : null,
      seuilMin: parseInt(formData.seuilMin, 10) || 0,
      seuilMax: parseInt(formData.seuilMax, 10) || 0,
      unitPrice: parseFloat(formData.unitPrice) || 0,
      stock: parseInt(formData.stock, 10) || 0,
    };

    onSave(articleData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{article ? "Edit the item" : "New item"}</DialogTitle>
          <DialogDescription>
            {article
              ? "Edit the item information below."
              : "Add a new item to your catalog."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Information de base */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">General information</CardTitle>
              <CardDescription>Basic item data</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {/* Input */}
              <div className="space-y-2">
                <Label htmlFor="reference">Reference *</Label>
                <Input
                  id="reference"
                  value={formData.reference}
                  onChange={(e) => handleChange("reference", e.target.value)}
                  placeholder="REF-001"
                  required
                />
              </div>
              {/* ----------------------------------------------------------- */}
              <div className="space-y-2">
                <Label htmlFor="reference">Reference *</Label>
                <Input
                  id="reference"
                  value={formData.reference}
                  onChange={(e) => handleChange("reference", e.target.value)}
                  placeholder="REF-001"
                  required
                />
              </div>
              {/* ----------------------------------------------------------- */}
              <div className="space-y-2">
                <Label htmlFor="bareCodes">Barecode</Label>
                <Input
                  id="bareCodes"
                  value={formData.bareCodes}
                  onChange={(e) => handleChange("bareCodes", e.target.value)}
                  placeholder="1234567890123"
                />
              </div>
              {/* ----------------------------------------------------------- */}
              <div className="space-y-2">
                <Label htmlFor="designation">Designation *</Label>
                <Input
                  id="designation"
                  value={formData.designation}
                  onChange={(e) => handleChange("designation", e.target.value)}
                  placeholder="Vis M6x20 Inox"
                  required
                />
              </div>
              {/* ----------------------------------------------------------- */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Detailed description of the item..."
                  rows={3}
                />
              </div>
              {/* endInput */}
            </CardContent>
          </Card>
          {/* Close Information de base */}

          {/* Classification */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Classification</CardTitle>
              <CardDescription>
                ABC categorization and classification
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              {/* Select */}
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleChange("category", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Screws">Screws</SelectItem>
                    <SelectItem value="Lubricant">Lubricant</SelectItem>
                    <SelectItem value="Bearings">Bearings</SelectItem>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Tools">Tools</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* --------------------------------------------------------------- */}
              <div className="space-y-2">
                <Label htmlFor="classification">Classification *</Label>
                <Select
                  value={formData.classification}
                  onValueChange={(value) =>
                    handleChange("classification", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Auto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">Class A (High value)</SelectItem>
                    <SelectItem value="B">Class B (Avarage value)</SelectItem>
                    <SelectItem value="C">Class C (Low value)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* --------------------------------------------------------------- */}
              <div className="space-y-2">
                <Label htmlFor="uniteMesure">Unit of measurement *</Label>
                <Select
                  value={formData.uniteMesure}
                  onValueChange={(value) => handleChange("uniteMesure", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Piece">Piece</SelectItem>
                    <SelectItem value="Kg">Kilogram</SelectItem>
                    <SelectItem value="Liter">Liter</SelectItem>
                    <SelectItem value="Meter">Meter</SelectItem>
                    <SelectItem value="M²">Square meter</SelectItem>
                    <SelectItem value="M³">Cubic meter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* endSelect */}
            </CardContent>
          </Card>
          {/* Close Classification */}

          {/* Caractéristiques physiques */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Physical characteristics
              </CardTitle>
              <CardDescription>Weight, volume and dimensions</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {/* Input poids/volume */}
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.001"
                  value={formData.weight}
                  onChange={(e) => handleChange("weight", e.target.value)}
                  placeholder="0.000"
                />
              </div>
              {/* ---------------------------------------------------------------- */}
              <div className="space-y-2">
                <Label htmlFor="volume">Volume (L)</Label>
                <Input
                  id="volume"
                  type="number"
                  step="0.001"
                  value={formData.volume}
                  onChange={(e) => handleChange("volume", e.target.value)}
                  placeholder="0.000"
                />
              </div>
              {/* endInput poids/volume */}
            </CardContent>
          </Card>
          {/* Close Caractéristiques physiques */}

          {/* Gestion de stock */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Inventory management</CardTitle>
              <CardDescription>Stock thresholds and parameters</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Input Seuil/Stock/Price */}
              <div className="space-y-2">
                <Label htmlFor="stock">Current stock</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => handleChange("stock", e.target.value)}
                  placeholder="0"
                />
              </div>
              {/* ---------------------------------------------------------- */}
              <div className="space-y-2">
                <Label htmlFor="seuilMin">Minimum threshold</Label>
                <Input
                  id="seuilMin"
                  type="number"
                  value={formData.seuilMin}
                  onChange={(e) => handleChange("seuilMin", e.target.value)}
                  placeholder="10"
                  required
                />
              </div>
              {/* ---------------------------------------------------------- */}
              <div className="space-y-2">
                <Label htmlFor="seuilMax">Maximum threshold</Label>
                <Input
                  id="seuilMax"
                  type="number"
                  value={formData.seuilMax}
                  onChange={(e) => handleChange("seuilMax", e.target.value)}
                  placeholder="100"
                />
              </div>
              {/* ---------------------------------------------------------- */}
              <div className="space-y-2">
                <Label htmlFor="unitPrice">Unit price</Label>
                <Input
                  id="unitPrice"
                  type="number"
                  step="0.01"
                  value={formData.unitPrice}
                  onChange={(e) => handleChange("unitPrice", e.target.value)}
                  placeholder="0.00"
                />
              </div>
              {/* endInput Seuil/Stock/Price */}
            </CardContent>
          </Card>
          {/* Close Gestion de stock */}

          {/* Localisation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Location</CardTitle>
              <CardDescription>Location and Supplier</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {/* Input & Select Location/Supplier */}
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  placeholder="A1-B2-C3"
                />
              </div>
              {/* ----------------------------------------------------------- */}
              <div className="space-y-2">
                <Label htmlFor="supplier">Main supplier</Label>
                <Select
                  value={formData.supplier}
                  onValueChange={(value) => handleChange("supplier", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a supplier..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACM Visserie">ACM Visserie</SelectItem>
                    <SelectItem value="Petrole Plus">Petrole Plus</SelectItem>
                    <SelectItem value="SKF Distribution">
                      SKF Distribution
                    </SelectItem>
                    <SelectItem value="TechnoTools">TechnoTools</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Input & Select Location/Supplier */}
            </CardContent>
          </Card>
          {/* Close Location */}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">{article ? "Edit" : "Create"} article</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
