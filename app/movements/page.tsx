"use client"

import MainLayout from "@/components/layout/main-layout";
import { MovementDialog } from "@/components/movements/movement-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Movement } from "@/types/type"
import { ArrowUpDown, Eye, Filter, MoreHorizontal, Plus, RotateCcw, Search, TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";

const mockMovements: Movement[] = [
    {
        id: 1,
        reference: "MVT-2024-001",
        type: "Entry",
        article: "REF-001",
        designation: "Vis M6x20 Inox",
        quantity: 150,
        sourceWarehouse: "",
        destinationWarehouse: "EP-001",
        sourceLocation: "",
        destinationLocation: "A1-B2-C3",
        user: "Pierre Martin",
        creationDate: new Date("2024-01-15T10:30:00Z"),
        executionDate: new Date("2024-01-15T14:20:00Z"),
        status: "Finished",
        reason: "Order receipt CMD-2024-001",
        lotNumber: "LOT-2024-001",
        unitCost: 25000,
        notes: "",
    },
    {
        id: 2,
        reference: "MVT-2024-002",
        type: "Output",
        article: "REF-002",
        designation: "Huile moteur 5L",
        quantity: -25,
        sourceWarehouse: "EP-001",
        destinationWarehouse: "",
        sourceLocation: "B2-A1-D4",
        destinationLocation: "",
        user: "Marie Dubois",
        creationDate: new Date("2024-01-15T11:45:00Z"),
        executionDate: new Date("2024-01-15T15:30:00Z"),
        status: "Finished",
        reason: "Order shipping ORD-2024-089",
        lotNumber: "LOT-2024-002",
        unitCost: 15243,
        notes: "",
    },
    {
        id: 3,
        reference: "MVT-2024-003",
        type: "Transfer",
        article: "REF-003",
        designation: "Roulement SKF",
        quantity: 10,
        sourceWarehouse: "EP-001",
        destinationWarehouse: "DR-003",
        sourceLocation: "C1-B3-A2",
        destinationLocation: "A2-B1-C1",
        user: "Jean Mareau",
        creationDate: new Date("2024-01-15T09:15:00Z"),
        executionDate: new Date(""),
        status: "In Progress",
        reason: "Regional depot replenishment",
        lotNumber: "LOT-2024-003",
        unitCost: 12800,
        notes: "",
    }
];

export default function MovementsPage() {
    const [movements, setMovements] = useState<Movement[]>(mockMovements)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedType, setSelectedType] = useState("all")
    const [selectedStatus, setSelectedStatus] = useState("all")
    const [selectedPeriod, setSelectedPeriod] = useState("today")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingMovement, setEditingMovement] = useState<Movement | undefined>(
        undefined,)

    const filteredMovements = movements.filter((movement) => {
        const matchesSearch =
            movement.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
            movement.article.toLowerCase().includes(searchTerm.toLowerCase()) ||
            movement.designation.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesType = selectedType === "all" || movement.type === selectedType
        const matchesStatus = selectedStatus === "all" || movement.status === selectedStatus

        return matchesSearch && matchesType && matchesStatus
    })

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "Entry":
                return <TrendingUp className="h-4 w-4 text-success" />
            case "Output":
                return <TrendingDown className="h-4 w-4 text-destructive" />
            case "Transfer":
                return <RotateCcw className="h-4 w-4 text-warning" />
            default:
                return <ArrowUpDown className="h-4 w-4" />
        }
    }

    const getTypeBadge = (type: string) => {
        const colors = {
            Entry: "bg-success text-success-foreground",
            Output: "bg-destructive text-destructive-foreground",
            Transfer: "bg-warning text-warning-foreground",
            Adjustment: "bg-primary text-primary-foreground",
        }
        return <Badge className={colors[type as keyof typeof colors] || "bg-slate-100 text-slate-800"}>{type}</Badge>
    }

    const getStatusBadge = (status: string) => {
        const colors = {
            Finished: "bg-success text-success-foreground",
            Canceled: "bg-destructive text-destructive-foreground",
            inProgress: "bg-warning text-warning-foreground",
            Planned: "bg-primary text-primary-foreground",
        }
        return <Badge className={colors[status as keyof typeof colors] || "bg-slate-100 text-slate-800"}>{status}</Badge>
    }

    const stats = {
        totalMovements: movements.length,
        entries: movements.filter((m) => m.type === "Entry").length,
        outputs: movements.filter((m) => m.type === "Output").length,
        transfers: movements.filter((m) => m.type === "Transfer").length,
    }

    return (
        <MainLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Movements Log</h1>
                        <p className="text-muted-foreground">Complete traceability of stock movements</p>
                    </div>
                    <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
                        <Plus className="h-4 w-4" />
                        New Movement
                    </Button>
                </div>
                {/* endHeader */}

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total movements</CardTitle>
                            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold"> {stats.totalMovements} </div>
                            <p className="text-xs text-muted-foreground">Today</p>
                        </CardContent>
                    </Card>
                    {/* ------------------------------------------------------------------------------- */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Entries</CardTitle>
                            <TrendingUp className="h-4 w-4 text-success" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-success"> {stats.entries} </div>
                            <p className="text-xs text-muted-foreground">Receptions</p>
                        </CardContent>
                    </Card>
                    {/* ------------------------------------------------------------------------------- */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Outputs</CardTitle>
                            <TrendingDown className="h-4 w-4 text-destructive" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-destructive"> {stats.outputs} </div>
                            <p className="text-xs text-muted-foreground">Expeditions</p>
                        </CardContent>
                    </Card>
                    {/* ------------------------------------------------------------------------------- */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Transfers</CardTitle>
                            <RotateCcw className="h-4 w-4 text-warning" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-warning"> {stats.transfers} </div>
                            <p className="text-xs text-muted-foreground">Inter-warehouses</p>
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
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Search by reference, item..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            <Select value={selectedType} onValueChange={setSelectedType}>
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All types</SelectItem>
                                    <SelectItem value="Entry">Entry</SelectItem>
                                    <SelectItem value="Output">Output</SelectItem>
                                    <SelectItem value="Transfer">Transfer</SelectItem>
                                    <SelectItem value="Adjustment">Adjustment</SelectItem>
                                </SelectContent>
                            </Select>
                            {/* --------------------------------------------------------------------- */}
                            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All statuses</SelectItem>
                                    <SelectItem value="Finished">Finished</SelectItem>
                                    <SelectItem value="In Progress">In Progress</SelectItem>
                                    <SelectItem value="Planned">Planned</SelectItem>
                                    <SelectItem value="Canceled">Canceled</SelectItem>
                                </SelectContent>
                            </Select>
                            {/* ----------------------------------------------------------------------- */}
                            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Period" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All periods</SelectItem>
                                    <SelectItem value="Today">Today</SelectItem>
                                    <SelectItem value="Week">This week</SelectItem>
                                    <SelectItem value="Month">This month</SelectItem>
                                    <SelectItem value="Year">This year</SelectItem>
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

                {/* Movements Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Movements Lists ({filteredMovements.length}) </CardTitle>
                        <CardDescription>Complete history of stock movements</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Reference</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Article</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>Source -&gt; Destination</TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredMovements.map((movement) => (
                                    <TableRow key={movement.id}>
                                        <TableCell className="font-medium">{movement.reference}</TableCell>

                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {getTypeIcon(movement.type)}
                                                {getTypeBadge(movement.type)}
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <div>
                                                <div className="font-medium"> {movement.article} </div>
                                                <div className="text-sm text-muted-foreground truncate max-w-[150px]">
                                                    {movement.designation}
                                                </div>
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <div className={`font-medium ${movement.quantity > 0 ? "text-success" : "text-destructive"}`}>
                                                {movement.quantity > 0 ? "+" : ""} {movement.quantity}
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <div className="text-sm">
                                                <div>
                                                    {movement.sourceLocation || movement.sourceWarehouse || "External"} -&gt;
                                                    {movement.destinationLocation || movement.destinationWarehouse || "External"}
                                                </div>
                                                {movement.lotNumber && <div className="text-muted-foreground">Lot: {movement.lotNumber}</div>}
                                            </div>
                                        </TableCell>

                                        <TableCell> {movement.user} </TableCell>

                                        <TableCell>
                                            <div className="text-sm">
                                                <div> {new Date(movement.creationDate).toLocaleDateString()} </div>
                                                <div className="text-muted-foreground">
                                                    {new Date(movement.creationDate).toLocaleTimeString()}
                                                </div>
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            {getStatusBadge(movement.status)}
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
                                                    {movement.status === "In Progress" && (
                                                        <>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem className="gap-2">
                                                                Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="gap-2 text-destructive">
                                                                Cancel
                                                            </DropdownMenuItem>
                                                        </>
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
                {/* endMovements Table */}

                <MovementDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    onSave={(movementData) => {
                        if (editingMovement) {
                            // 1) Pour la mise à jour, il faut fusionner movementData AU NIVEAU DES PROPRIÉTÉS
                            setMovements(
                                movements.map((m) => m.id === editingMovement.id ? { ...m, ...movementData } : m     // <-- étale les props de movementData,
                                )
                            );
                        } else {
                            // 2) Calculer proprement le prochain id
                            const maxId = movements.length > 0 ? Math.max(...movements.map((m) => m.id)) : 0;

                            const nextId = maxId + 1;

                            // 3) Construire la référence avec padStart sur une string
                            const nextRef = `MVT-2024-${String(nextId).padStart(3, "0")}`;

                            // 4) Dates au format Date, pas string, et executionDate ne peut pas être null si interface attend Date
                            const newMovement: Movement = {
                                ...movementData,
                                id: nextId,
                                reference: nextRef,
                                user: "Current user",
                                creationDate: new Date(),              // <-- Date()
                                executionDate: new Date(),             // <-- ou nouvelle Date d’exécution si tu en as une
                                status: "Planned",
                            };

                            setMovements([...movements, newMovement]);
                        }

                        setIsDialogOpen(false);
                        setEditingMovement(undefined);
                    }}
                />

            </div>
        </MainLayout>
    )
}