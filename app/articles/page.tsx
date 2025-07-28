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
import { Article } from "@/types/type";

// Données de démonstration à remplacer par notre API
const mockArticles: Article[] = [
  {
    id: 1,
    reference: "REF-001",
    designation: "Vis M6x20 Inox",
    description: "Description here", // **NE PAS OUBLIER**
    category: "Screws",
    classification: "A",
    uniteMesure: "Piece",
    seuilMin: 50,
    seuilMax: 500,
    unitPrice: 25000,
    supplier: "ACM Visserie",
    location: "A1-B2-C3",
    bareCodes: "1234567890123", // **NE PAS OUBLIER**
    stock: 150,
    status: "Active",
  },
  {
    id: 2,
    reference: "REF-002",
    designation: "Huile moteur 5L SAE 10w40",
    description: "Description here", // **NE PAS OUBLIER**
    category: "Lubricant",
    classification: "B",
    uniteMesure: "Liter",
    seuilMin: 10,
    seuilMax: 100,
    unitPrice: 150057.5,
    supplier: "PetroCI",
    location: "B2-A1-D4",
    bareCodes: "1234567890123", // **NE PAS OUBLIER**
    stock: 25,
    status: "Active",
  },
  {
    id: 3,
    reference: "REF-003",
    designation: "Roulement SKF 6205-2RS",
    description: "Description here",
    category: "Bearings",
    classification: "A",
    uniteMesure: "Piece",
    stock: 5,
    seuilMin: 15,
    seuilMax: 75,
    unitPrice: 12651.8,
    supplier: "SKF Distribution",
    location: "C1-B3-A2",
    bareCodes: "1234567890123", // **NE PAS OUBLIER**
    status: "Low stock",
  },
];

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>(mockArticles);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedClassification, setSelectedClassification] =
    useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | undefined>(
    undefined,
  );

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

  const getStatusBadge = (article: Article) => {
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
          "bg-slate-100 text-gray-800"
        }
      >
        Class
        {classification}
      </Badge>
    );
  };

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingArticle(undefined);
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
                XOF {articles.reduce((sum, a) => sum + a.stock * a.unitPrice, 0).toLocaleString()}
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
                  <TableHead>Classification</TableHead>
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
                    <TableCell>XOF {article.unitPrice.toLocaleString()}</TableCell>
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
                  const newArticle: Article = {
                    ...articleData, // son id
                    id: Math.max(...articles.map((a) => a.id)) + 1, // votre nouveau id, qui écrase
                    status: "Active",
                  };

                  setArticles([...articles, newArticle]);
                }
                setIsDialogOpen(false);
                setEditingArticle(undefined);
              }}
            />
            {/* endDialog */}
          </CardContent>
        </Card>
        {/* endArticles Table */}
      </div>
    </MainLayout>
  );
}
