"use client"

import { useEffect, useState } from "react"
import { CategoryDialog } from "@/components/categories/category-dialog"
import MainLayout from "@/components/layout/main-layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Category } from "@/types/type"
import { Edit, Eye, Loader2, MoreHorizontal, Package, Search, Tags, Trash2, TrendingUp } from "lucide-react"
import { toast } from "sonner"
import { useUserRole } from "@/hooks/use-user-role"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingCategory, setEditingCategrory] = useState<Category | undefined>(undefined)
    const [detailCategory, setDetailCategory] = useState<Category | undefined>(undefined)
    const { canCreate, canEdit, canDelete } = useUserRole()

    useEffect(() => {
        fetch('/api/categories')
            .then(r => { if (!r.ok) throw new Error(); return r.json(); })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .then((data: any[]) => setCategories(data.map((c: any) => ({
                ...c,
                nbArticles: c._count?.articles ?? c.nbArticles ?? 0,
                stockValue: c.stockValue ?? 0,
                parent: c.parent?.name ?? c.parent ?? "",
            }))))
            .catch(() => toast.error('Failed to load categories'))
            .finally(() => setLoading(false))
    }, [])

    if (loading) return (
        <MainLayout>
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        </MainLayout>
    )

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

    const handleSave = async (data: Category) => {
        try {
            if (editingCategory) {
                const r = await fetch(`/api/categories/${editingCategory.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                })
                if (!r.ok) throw new Error()
                const updated = await r.json()
                setCategories(prev => prev.map(c => c.id === updated.id ? updated : c))
                toast.success('Category updated')
            } else {
                const r = await fetch('/api/categories', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                })
                if (!r.ok) throw new Error()
                const created = await r.json()
                setCategories(prev => [...prev, created])
                toast.success('Category created')
            }
            setIsDialogOpen(false)
            setEditingCategrory(undefined)
        } catch {
            toast.error('Error saving category')
        }
    }

    const handleDelete = async (id: number) => {
        try {
            const r = await fetch(`/api/categories/${id}`, { method: 'DELETE' })
            if (!r.ok) throw new Error()
            setCategories(prev => prev.filter(c => c.id !== id))
            toast.success('Category deleted')
        } catch {
            toast.error('Error deleting category')
        }
    }

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
                    {canCreate && (
                        <Button onClick={() => { setEditingCategrory(undefined); setIsDialogOpen(true) }} className="gap-2">New category</Button>
                    )}
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
                                {categories.length > 0
                                    ? (categories.reduce((sum, c) => sum + c.seuilRotation, 0) / categories.length).toFixed(1)
                                    : "0.0"
                                }x
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
                                XOF {categories.reduce((sum, c) => sum + c.stockValue, 0).toLocaleString()}
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
                                                    <DropdownMenuItem className="gap-2" onClick={() => setDetailCategory(category)}>
                                                        <Eye className="h-4 w-4" />See Details
                                                    </DropdownMenuItem>
                                                    {canEdit && (
                                                        <DropdownMenuItem
                                                            className="gap-2"
                                                            onClick={() => { setEditingCategrory(category); setIsDialogOpen(true) }}
                                                        >
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                    )}
                                                    {canDelete && <DropdownMenuSeparator />}
                                                    {canDelete && (
                                                        <DropdownMenuItem
                                                            className="gap-2 text-destructive"
                                                            onClick={() => handleDelete(category.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    )}
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
                    onSave={handleSave}
                />
            </div>

            <Sheet open={!!detailCategory} onOpenChange={(open) => { if (!open) setDetailCategory(undefined); }}>
                <SheetContent className="overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle>Category — {detailCategory?.name}</SheetTitle>
                        <SheetDescription>Full details of this category</SheetDescription>
                    </SheetHeader>
                    {detailCategory && (
                        <div className="px-6 space-y-4 text-sm">
                            <div className="grid grid-cols-2 gap-3">
                                {([
                                    ["Name", detailCategory.name],
                                    ["Parent Category", detailCategory.parent || "—"],
                                    ["Articles Count", detailCategory.nbArticles],
                                    ["Rotation Threshold", `${detailCategory.seuilRotation}x`],
                                    ["Auto Classification", detailCategory.autoClassification ? "Enabled" : "Disabled"],
                                    ["Status", detailCategory.active ? "Active" : "Inactive"],
                                ] as [string, unknown][]).map(([label, value]) => (
                                    <div key={label} className="space-y-1">
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
                                        <p className="font-medium">{String(value ?? "—")}</p>
                                    </div>
                                ))}
                            </div>
                            {detailCategory.description && (
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Description</p>
                                    <p className="font-medium">{detailCategory.description}</p>
                                </div>
                            )}
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </MainLayout>
    )
}
