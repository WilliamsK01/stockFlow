"use client";

import { useEffect, useState } from "react";
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
  Loader2,
} from "lucide-react";
import { ArticleDialog } from "@/components/articles/article-dialog";
import { Article } from "@/types/type";
import { toast } from "sonner";
import { useUserRole } from "@/hooks/use-user-role";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

export default function ArticlesPage() {
  const { canCreate, canEdit, canDelete } = useUserRole();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedClassification, setSelectedClassification] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | undefined>(undefined);
  const [detailArticle, setDetailArticle] = useState<Article | undefined>(undefined);

  useEffect(() => {
    fetch('/api/articles')
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((data: any[]) => setArticles(data.map((a: any) => ({
        ...a,
        category: a.category?.name ?? a.category ?? "",
        supplier: a.supplier?.name ?? a.supplier ?? "",
        stock: a.stocks?.reduce((s: number, l: any) => s + (l.quantity ?? 0), 0) ?? a.stock ?? 0,
      }))))
      .catch(() => toast.error('Failed to load articles'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <MainLayout>
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    </MainLayout>
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

  const handleSave = async (data: Article) => {
    try {
      if (editingArticle) {
        const r = await fetch(`/api/articles/${editingArticle.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!r.ok) throw new Error();
        const updated = await r.json();
        setArticles(prev => prev.map(a => a.id === updated.id ? updated : a));
        toast.success('Article updated');
      } else {
        const r = await fetch('/api/articles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!r.ok) throw new Error();
        const created = await r.json();
        setArticles(prev => [...prev, created]);
        toast.success('Article created');
      }
      setIsDialogOpen(false);
      setEditingArticle(undefined);
    } catch {
      toast.error('Error saving article');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const r = await fetch(`/api/articles/${id}`, { method: 'DELETE' });
      if (!r.ok) throw new Error();
      setArticles(prev => prev.filter(a => a.id !== id));
      toast.success('Article deleted');
    } catch {
      toast.error('Error deleting article');
    }
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
          {canCreate && (
            <Button onClick={handleAdd} className="gap-2">
              <Plus className="h-4 w-4" />New Item
            </Button>
          )}
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
                          <DropdownMenuItem className="gap-2" onClick={() => setDetailArticle(article)}>
                            <Eye className="h-4 w-4" />See Details
                          </DropdownMenuItem>
                          {canEdit && (
                            <DropdownMenuItem className="gap-2" onClick={() => handleEdit(article)}>
                              <Edit className="h-4 w-4" />Edit
                            </DropdownMenuItem>
                          )}
                          {canDelete && <DropdownMenuSeparator />}
                          {canDelete && (
                            <DropdownMenuItem className="gap-2 text-destructive" onClick={() => handleDelete(article.id)}>
                              <Trash2 className="h-4 w-4" />Delete
                            </DropdownMenuItem>
                          )}
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
              onSave={handleSave}
            />
            {/* endDialog */}
          </CardContent>
        </Card>
        {/* endArticles Table */}
      </div>

      {/* Detail Sheet */}
      <Sheet open={!!detailArticle} onOpenChange={(open) => { if (!open) setDetailArticle(undefined); }}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Article — {detailArticle?.reference}</SheetTitle>
            <SheetDescription>{detailArticle?.designation}</SheetDescription>
          </SheetHeader>
          {detailArticle && (
            <div className="px-6 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Reference", detailArticle.reference],
                  ["Designation", detailArticle.designation],
                  ["Category", detailArticle.category],
                  ["Classification", detailArticle.classification],
                  ["Unit", detailArticle.uniteMesure],
                  ["Unit Price", `XOF ${detailArticle.unitPrice.toLocaleString()}`],
                  ["Current Stock", String(detailArticle.stock ?? 0)],
                  ["Min Threshold", String(detailArticle.seuilMin)],
                  ["Max Threshold", String(detailArticle.seuilMax)],
                  ["Supplier", detailArticle.supplier ?? "—"],
                  ["Status", detailArticle.status],
                ].map(([label, value]) => (
                  <div key={label} className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
                    <p className="font-medium">{value}</p>
                  </div>
                ))}
              </div>
              {detailArticle.description && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Description</p>
                  <p className="text-muted-foreground">{detailArticle.description}</p>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </MainLayout>
  );
}
