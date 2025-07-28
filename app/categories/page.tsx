"use client"

import { CategoryDialog } from "@/components/categories/category-dialog"
import MainLayout from "@/components/layout/main-layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Category } from "@/types/type"
import { Edit, Eye, MoreHorizontal, Package, Search, Tags, Trash2, TrendingUp } from "lucide-react"
import { useState } from "react"



const mockCategories: Category[] = [
    {
        id: 1,
        name: "Screws",
        description: "Screws, bolts, nuts and fixing accessories",
        parent: "",
        nbArticles: 145,
        stockValue: 12450.5,
        seuilRotation: 4.5,
        autoClassification: true,
        color: "#10B981",
        active: true,
    },
    {
        id: 2,
        name: "Lubricants",
        description: "Engine oil, greases, and maintenance products",
        parent: "",
        nbArticles: 67,
        stockValue: 45230.8,
        seuilRotation: 6.2,
        autoClassification: true,
        color: "#F59E0B",
        active: true,
    },
    {
        id: 3,
        name: "Bearings",
        description: "Ball bearings, roller bearings and accessories",
        parent: "",
        nbArticles: 89,
        stockValue: 78920.3,
        seuilRotation: 3.8,
        autoClassification: true,
        color: "#EF4444",
        active: true,
    },
    {
        id: 4,
        name: "Vis Inox",
        description: "Stainless steel screws",
        parent: "Screws",
        nbArticles: 45,
        stockValue: 8920.2,
        seuilRotation: 5.1,
        autoClassification: true,
        color: "#10B981",
        active: true,
    },
]

export default function CategoriesPage() {
    const [categories, setCategories] = useState(mockCategories)
    const [searchTerm, setSearchTerm] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingCategory, setEditingCategrory] = useState<Category | undefined>(undefined,);

    const filteredCategories = categories.filter(
        (category) =>
            category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            category.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const getClassificationStats = () => {
        const total = categories.reduce((sum, cat) => sum + cat.nbArticles, 0)
        return {
            total,
            classA: Math.round(total * 0.2),
            classB: Math.round(total * 0.3),
            classC: Math.round(total * 0.5),
        }
    }
    const stats = getClassificationStats()

    return (
        <MainLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex item-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Category management
                        </h1>
                        <p className="text-muted-foreground">
                            Organize your items by category and manage ABC classification.
                        </p>
                    </div>
                    <Button onClick={() => setIsDialogOpen(true)} className="gap-2">New category</Button>
                </div>
                {/* endHeader */}

                {/* Stats cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total categories</CardTitle>
                            <Tags className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{categories.length}</div>
                            <p className="text-xs text-muted-foreground">
                                {categories.filter((c) => c.parent).length} subcategories
                            </p>
                        </CardContent>
                    </Card>
                    {/* -------------------------------------------------------------------------------- */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">A-rated Items</CardTitle>
                            <Badge className="text-xs bg-red-100 text-red-800">A</Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.classA}</div>
                            <p className="text-xs text-muted-foreground">
                                20% high value
                            </p>
                        </CardContent>
                    </Card>
                    {/* -------------------------------------------------------------------------------- */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Average rotation</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {(categories.reduce((sum, c) => sum + c.seuilRotation, 0) / categories.length).toFixed(1)}x
                            </div>
                            <p className="text-xs text-muted-foreground">All categories</p>
                        </CardContent>
                    </Card>
                    {/* --------------------------------------------------------------------------------- */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total value</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                XOF {(categories.reduce((sum, c) => sum + c.stockValue, 0).toLocaleString())}
                            </div>
                            <p className="text-xs text-muted-foreground">Valued stock</p>
                        </CardContent>
                    </Card>
                    {/* --------------------------------------------------------------------------------- */}
                </div>
                {/* endStats cards */}

                {/* Search */}
                <Card>
                    <CardHeader>
                        <CardTitle>Search</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative max-w-md">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search a category..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </CardContent>
                </Card>
                {/* endSearch */}

                {/* Categories Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Categories List ({filteredCategories.length}) </CardTitle>
                        <CardDescription>Manage your categories and their automatic classifications</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Parent</TableHead>
                                    <TableHead>Items</TableHead>
                                    <TableHead>Stock value</TableHead>
                                    <TableHead>Rotate</TableHead>
                                    <TableHead>Classification</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredCategories.map((category) => (
                                    <TableRow key={category.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                                                {category.name}
                                            </div>
                                        </TableCell>
                                        <TableCell className="max-w-[200px] truncate"> {category.description} </TableCell>
                                        <TableCell>
                                            {category.parent ? (
                                                <Badge variant="outline">{category.parent}</Badge>) : (<span className="text-muted-foreground">-</span>)
                                            }
                                        </TableCell>
                                        <TableCell> {category.nbArticles} </TableCell>
                                        <TableCell>XOF {category.stockValue.toLocaleString()} </TableCell>
                                        <TableCell> {category.seuilRotation} x</TableCell>
                                        <TableCell>
                                            {category.autoClassification ? (
                                                <Badge variant="secondary" className="bg-success text-success-foreground">
                                                    Auto
                                                </Badge>) : (
                                                <Badge variant="outline">Manual</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={category.active ? "secondary" : "outline"}>
                                                {category.active ? "Active" : "Inactive"}
                                            </Badge>
                                        </TableCell>
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
                                                    <DropdownMenuItem className="gap-2">
                                                        <Edit className="mr-2 h-4 w-4" />
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
                {/* endCategories Table */}

                <CategoryDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    category={editingCategory}
                    onSave={(categoryData) => {
                        if (editingCategory) {
                            setCategories(
                                categories.map((c) =>
                                    c.id === editingCategory.id ? {
                                        ...c, ...categoryData
                                    } : c,
                                ),
                            );
                        } else {
                            const newCategory: Category = {
                                ...categoryData,
                                id: Math.max(...categories.map((c) => c.id)) + 1,
                                nbArticles: 0,
                                stockValue: 0,
                            }
                            setCategories([...categories, newCategory])
                        }
                        setIsDialogOpen(false);
                        setEditingCategrory(undefined);
                    }}
                />
            </div>
        </MainLayout>
    )
}