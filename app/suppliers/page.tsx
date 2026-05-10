"use client"

import MainLayout from "@/components/layout/main-layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Supplier } from "@/types/type"
import { Clock, DollarSign, Edit, Eye, Filter, Loader2, MoreHorizontal, Percent, Plus, Search, Star, Trash2, Users } from "lucide-react"
import { useEffect, useState } from "react"
// Import du CountrySelector et de la liste de pays enrichie
import { CountrySelector } from "@/components/utils/selector"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SupplierDialog } from "@/components/suppliers/supplier-dialog"
import { FILTER_COUNTRIES } from "@/components/utils/countries"
import { toast } from "sonner"
import { useUserRole } from "@/hooks/use-user-role"



export default function SuppliersPage() {
    const [suppliers, setSuppliers] = useState<Supplier[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedCountryCode, setSelectedCountryCode] = useState("all");
    const [selectedStatus, setSelectedStatus] = useState<string>("all");
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [editingSupplier, setEditingSupplier] = useState<Supplier | undefined>(undefined);
    const [isCountryOpen, setIsCountryOpen] = useState<boolean>(false);
    const { canCreate, canEdit, canDelete } = useUserRole();

    useEffect(() => {
        fetch('/api/suppliers')
            .then(r => r.json())
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .then((data: any[]) => setSuppliers(data.map((s: any) => ({
                ...s,
                contact: s.contact ?? "",
                email: s.email ?? "",
                // Normalise en E.164 : retire les espaces pour react-phone-number-input
                phone: (s.phone ?? "").replace(/\s/g, ""),
                totalAmount: s.totalAmount ?? 0,
                notes: s.notes ?? "",
                nbOrder: s._count?.orders ?? s.nbOrder ?? 0,
            }))))
            .catch(() => toast.error('Error loading suppliers'))
            .finally(() => setLoading(false));
    }, []);

    // Liste de pays pour filtre, inclut l'option "All countries"
    const selectedCountry = FILTER_COUNTRIES.find(
        (c) => c.value === selectedCountryCode
    )!;


    const filteredSuppliers = suppliers.filter((supplier) => {
        const matchesSearch =
            supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (supplier.contact ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (supplier.email ?? "").toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCountry =
            selectedCountryCode === "all" ||
            supplier.country === selectedCountryCode;

        const matchesStatus = selectedStatus === "all" || supplier.status === selectedStatus


        return matchesSearch && matchesCountry && matchesStatus
    });

    const getNoteStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`h-4 w-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
            />
        ))
    }

    const getStatusBadge = (status: string) => {
        const colors = {
            Active: "bg-success text-success-foreground",
            Inactive: "bg-slate-100 text-gray-800",
            Suspended: "bg-destructive text-destructive-foureground"
        }
        return <Badge className={colors[status as keyof typeof colors] || "bg-slate-100 text-gray-800"}> {status} </Badge>
    }

    const handleSave = async (data: Supplier) => {
        try {
            if (editingSupplier) {
                const r = await fetch(`/api/suppliers/${editingSupplier.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
                if (!r.ok) throw new Error();
                const updated = await r.json();
                setSuppliers(prev => prev.map(s => s.id === updated.id ? updated : s));
                toast.success('Supplier updated');
            } else {
                const r = await fetch('/api/suppliers', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
                if (!r.ok) throw new Error();
                const created = await r.json();
                setSuppliers(prev => [...prev, created]);
                toast.success('Supplier created');
            }
            setIsDialogOpen(false);
            setEditingSupplier(undefined);
        } catch {
            toast.error('Error saving supplier');
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await fetch(`/api/suppliers/${id}`, { method: 'DELETE' });
            setSuppliers(prev => prev.filter(s => s.id !== id));
            toast.success('Deleted');
        } catch {
            toast.error('Error deleting');
        }
    };

    if (loading) return (
        <MainLayout>
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        </MainLayout>
    );

    return (
        <MainLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Supplier Management</h1>
                        <p className="text-muted-foreground">Manage your partners and their commercial conditions</p>
                    </div>
                    {canCreate && (
                        <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add Supplier
                        </Button>
                    )}
                </div>
                {/* endHeader */}

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Suppliers</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold"> {suppliers.length} </div>
                            <p className="text-xs text-muted-foreground">
                                {suppliers.filter((s) => s.status === "Active").length} Active
                            </p>
                        </CardContent>
                    </Card>
                    {/* ------------------------------------------------------------------- */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Average delay</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {suppliers.length > 0
                                    ? Math.round(suppliers.reduce((sum, s) => sum + s.deliveryTime, 0) / suppliers.length)
                                    : 0} days
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Average Delivery
                            </p>
                        </CardContent>
                    </Card>
                    {/* ------------------------------------------------------------------- */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Average Discount</CardTitle>
                            <Percent className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {suppliers.length > 0
                                    ? (suppliers.reduce((sum, s) => sum + s.discount, 0) / suppliers.length).toFixed(1)
                                    : "0.0"} %
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Negotiated
                            </p>
                        </CardContent>
                    </Card>
                    {/* ------------------------------------------------------------------- */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                XOF {suppliers.reduce((sum, s) => sum + s.totalAmount, 0).toLocaleString()}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Annual purchases
                            </p>
                        </CardContent>
                    </Card>
                    {/* ------------------------------------------------------------------- */}
                </div>
                {/* endStats Cards */}

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Search and Filters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4 flex-wrap">
                            <div className="flex-1 min-w-[300px]">
                                <div className="relative">
                                    <Search
                                        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                                    />
                                    <Input
                                        placeholder="Search by name, contact or email..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            {/* Country Filter via CountrySelector */}
                            <div className="w-[250px]">
                                <CountrySelector
                                    id="filter-country"
                                    open={isCountryOpen}
                                    onToggle={() => setIsCountryOpen(!isCountryOpen)}
                                    selected={selectedCountry}
                                    onChange={(country) => setSelectedCountryCode(country.value)}
                                    options={FILTER_COUNTRIES}
                                />
                            </div>

                            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="Active">Active</SelectItem>
                                    <SelectItem value="Inactive">Inactive</SelectItem>
                                    <SelectItem value="Suspended">Suspended</SelectItem>
                                </SelectContent>
                            </Select>

                            <Button variant="outline" className="gap-2">
                                <Filter className="w-4 h-4" />
                                More Filters
                            </Button>
                        </div>
                    </CardContent>
                </Card>
                {/* endFilters */}

                {/* Suppliers Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>List of Suppliers ({filteredSuppliers.length}) </CardTitle>
                        <CardDescription>Manage your suppliers and their conditions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Supplier</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Country</TableHead>
                                    <TableHead>Delivery Time</TableHead>
                                    <TableHead>payment Terms</TableHead>
                                    <TableHead>Discount</TableHead>
                                    <TableHead>Notes</TableHead>
                                    <TableHead>Total Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredSuppliers.map((supplier) => (
                                    <TableRow key={supplier.id}>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">
                                                    {supplier.name}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {supplier.email}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">
                                                {supplier.contact}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {supplier.phone}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {FILTER_COUNTRIES.find(c => c.value === supplier.country)?.title ?? supplier.country}
                                        </TableCell>
                                        <TableCell> {supplier.deliveryTime} days</TableCell>
                                        <TableCell> {supplier.paymentTerms} </TableCell>
                                        <TableCell> {supplier.discount} % </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                {getNoteStars(supplier.notes)}
                                                <span className="text-sm ml-1">
                                                    {supplier.notes}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>XOF {supplier.totalAmount.toLocaleString()}</TableCell>
                                        <TableCell>{getStatusBadge(supplier.status)}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem>
                                                        <Eye className="h-4 w-4" />
                                                        See Details
                                                    </DropdownMenuItem>
                                                    {canEdit && (
                                                        <DropdownMenuItem onClick={() => { setEditingSupplier(supplier); setIsDialogOpen(true); }}>
                                                            <Edit className="h-4 w-4" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                    )}
                                                    {canDelete && <DropdownMenuSeparator />}
                                                    {canDelete && (
                                                        <DropdownMenuItem
                                                            className="text-destructive"
                                                            onClick={() => handleDelete(supplier.id)}
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

                <SupplierDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    supplier={editingSupplier}
                    onSave={handleSave}
                />
            </div>
        </MainLayout>
    )
}
