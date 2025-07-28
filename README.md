This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

```
fix les erreurs dans ce code et donne une résolution qui ne va pas créer d'autre erreur
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

interface ArticleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  article?: any;

  onSave: (articleData: any) => void;
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
        reference: article.reference || "",
        designation: article.designation || "",
        description: article.description || "",
        category: article.category || "",
        classification: article.classification || "",
        uniteMesure: article.uniteMesure || "",
        weight: article.weight.toString() || "",
        volume: article.volume.toString() || "",
        seuilMin: article.seuilMin.toString() || "",
        seuilMax: article.seuilMax.toString() || "",
        unitPrice: article.unitPrice.toString() || "",
        supplier: article.supplier || "",
        location: article.location || "",
        bareCodes: article.bareCodes || "",
        stock: article.stock.toString() || "0",
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

    const articleData = {
      ...formData,
      weight: formData.weight ? Number.parseFloat(formData.weight) : null,
      volume: formData.volume ? Number.parseFloat(formData.volume) : null,
      seuilMin: Number.parseInt(formData.seuilMin) || 0,
      seuilMax: Number.parseInt(formData.seuilMax) || 0,
      unitPrice: Number.parseFloat(formData.unitPrice) || 0,
      stock: Number.parseInt(formData.stock) || 0,
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
            <Button type="submit">
              {article ? "Edit" : "Create"} l&apos;article
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
Unexpected any. Specify a different type. (eslint @typescript-eslint/no-explicit-any)
```

```
"use client";

import { useState } from "react";
import MainLayout from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Package,
  AlertTriangle,
} from "lucide-react";
import { ArticleDialog } from "@/components/articles/article-dialog";

// Données de démonstration à remplacer par notre API
const mockArticles = [
  {
    id: 1,
    reference: "REF-001",
    designation: "Vis M6x20 Inox",
    category: "Screws",
    classification: "A",
    uniteMesure: "Piece",
    stock: "150",
    seuilMin: "50",
    seuilMax: "500",
    unitPrice: "0.25",
    supplier: "ACM Visserie",
    location: "A1-B2-C3",
    status: "Active",
  },
  {
    id: 2,
    reference: "REF-002",
    designation: "Huile moteur 5L SAE 10w40",
    category: "Lubricant",
    classification: "B",
    uniteMesure: "Liter",
    stock: "25",
    seuilMin: "10",
    seuilMax: "100",
    unitPrice: "15.5",
    supplier: "PetroCI",
    location: "B2-A1-D4",
    status: "Active",
  },
  {
    id: 3,
    reference: "REF-003",
    designation: "Roulement SKF 6205-2RS",
    category: "Bearings",
    classification: "A",
    uniteMesure: "Piece",
    stock: "5",
    seuilMin: "15",
    seuilMax: "75",
    unitPrice: "12.8",
    supplier: "SKF Distribution",
    location: "C1-B3-A2",
    status: "Low stock",
  },
];

export default function ArticlesPage() {
  const [articles, setArticles] = useState(mockArticles);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedClassification, setSelectedClassification] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.designation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || article.category === selectedCategory;
    const matchesClassification =
      selectedClassification === "all" ||
      article.classification === selectedClassification;

    return matchesSearch && matchesCategory && matchesClassification;
  });

  const getStatusBadge = (article: any) => {
    if (article.stock <= article.seuilMin) {
      return (
        <Badge variant="destructive" className="gap-1">
          <AlertTriangle className="h-3 w-3" />
          Low stock
        </Badge>
      );
    }
    if (article.status === "Active") {
      return (
        <Badge
          variant="secondary"
          className="bg-success text-success-foreground"
        >
          Active
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-success text-success-foreground">
        {article.status}
      </Badge>
    );
  };
  const getClassificationBadge = (classification: string) => {
    const colors = {
      A: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      B: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      C: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    };
    return (
      <Badge
        className={
          colors[classification as keyof typeof colors] ||
          "bg-gray-100 text-gray-800"
        }
      >
        Class
        {classification}
      </Badge>
    );
  };

  const handleEdit = (article: any) => {
    setEditingArticle(article);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingArticle(null);
    setIsDialogOpen(true);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Items Management
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage your catalog of items and their characteristics
            </p>
          </div>
          <Button onClick={handleAdd} className="gap-2">
            <Plus className="h-4 w-4" />
            New Item
          </Button>
        </div>
        {/* endHeader */}

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{articles.length}</div>
              <p className="text-xs text-muted-foreground">+2 this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">A Class</CardTitle>
              <Badge className="bg-red-100 text-red-800 text-xs">A</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {articles.filter((a) => a.classification === "A").length}
              </div>
              <p className="text-xs text-muted-foreground">high-value items</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low stock</CardTitle>
              <AlertTriangle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">
                {articles.filter((a) => a.stock <= a.seuilMin).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Requires replenishment
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Totale value
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                XOF
                {articles
                  .reduce((sum, a) => {
                    const stock = Number(a.stock) || 0;
                    const unitPrice = Number(a.unitPrice) || 0;
                    return sum + stock * unitPrice;
                  }, 0)
                  .toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Valued stock</p>
            </CardContent>
          </Card>
        </div>
        {/* endStats Cards */}

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters and Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-[300px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by reference or designation..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Screws">Screws</SelectItem>
                  <SelectItem value="Lubricant">Lubricants</SelectItem>
                  <SelectItem value="Bearings">Bearings</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={selectedClassification}
                onValueChange={setSelectedClassification}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Classification" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  <SelectItem value="A">Class A</SelectItem>
                  <SelectItem value="B">Class B</SelectItem>
                  <SelectItem value="C">Class C</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>
        {/* endFilters */}

        {/* Articles Table */}
        <Card>
          <CardHeader>
            <CardTitle>Items list ({filteredArticles.length})</CardTitle>
            <CardDescription>
              Manage your items their characteristics and their stocks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>reference</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Unit mesure</TableHead>
                  <TableHead>Unit price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredArticles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell className="font-medium">
                      {article.reference}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {article.designation}
                    </TableCell>
                    <TableCell>{article.category}</TableCell>
                    <TableCell>
                      {getClassificationBadge(article.classification)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span
                          className={
                            article.stock <= article.seuilMin
                              ? "text-destructive font-medium"
                              : ""
                          }
                        >
                          {article.stock}
                        </span>
                        {article.stock <= article.seuilMin && (
                          <AlertTriangle className="h-4 w-4 text-destructive" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{article.uniteMesure}</TableCell>
                    <TableCell>XOF{article.unitPrice.toFixed(2)}</TableCell>
                    <TableCell>{getStatusBadge(article)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem className="gap-2">
                            <Eye className="h-4 w-4" />
                            See Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="gap-2"
                            onClick={() => handleEdit(article)}
                          >
                            <Edit className="h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="gap-2 text-destructive">
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        {/* endArticles Table */}

        {/* Dialog pour ajouter/modifier un article */}
        <ArticleDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          article={editingArticle}
          onSave={(articleData) => {
            if (editingArticle) {
              // Modifier l'article existant
              setArticles(
                articles.map((a) =>
                  a.id === editingArticle.id ? { ...a, ...articleData } : a,
                ),
              );
            } else {
              // Ajouter un nouvel article
              const newArticle = {
                id: Math.max(...articles.map((a) => a.id)) + 1,
                ...articleData,
                status: "Active",
              };
              setArticles([...articles, newArticle]);
            }
            setIsDialogOpen(false);
            setEditingArticle(null);
          }}
        />
        {/* endDialog */}
      </div>
    </MainLayout>
  );
}

```
