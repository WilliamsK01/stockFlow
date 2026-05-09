"use client"

import { Order, OrderLine } from "@/types/type";
import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";
import { Trash2, Plus } from "lucide-react";

interface OrderDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    order?: Order;
    onSave: (orderData: Order) => void;
}

const emptyLine = (): OrderLine => ({
    articleRef: "",
    designation: "",
    quantity: 0,
    unitPrice: 0,
});

export function OrderDialog({ open, onOpenChange, order, onSave }: OrderDialogProps) {
    const [formData, setFormData] = useState({
        reference: "",
        type: "Purchase",
        status: "Draft",
        supplier: "",
        warehouse: "Entrepôt Principal",
        orderDate: "",
        expectedDate: "",
        notes: "",
    });

    const [lines, setLines] = useState<OrderLine[]>([]);

    useEffect(() => {
        if (order) {
            setFormData({
                reference: order.reference || "",
                type: order.type || "Purchase",
                status: order.status || "Draft",
                supplier: order.supplier || "",
                warehouse: order.warehouse || "Entrepôt Principal",
                orderDate: order.orderDate || "",
                expectedDate: order.expectedDate || "",
                notes: order.notes || "",
            });
            setLines(order.lines ? order.lines.map((l) => ({ ...l })) : []);
        } else {
            setFormData({
                reference: "",
                type: "Purchase",
                status: "Draft",
                supplier: "",
                warehouse: "Entrepôt Principal",
                orderDate: "",
                expectedDate: "",
                notes: "",
            });
            setLines([]);
        }
    }, [order, open]);

    const handleAddLine = () => {
        setLines((prev) => [...prev, emptyLine()]);
    };

    const handleDeleteLine = (index: number) => {
        setLines((prev) => prev.filter((_, i) => i !== index));
    };

    const handleLineChange = (
        index: number,
        field: keyof OrderLine,
        value: string | number
    ) => {
        setLines((prev) =>
            prev.map((line, i) =>
                i === index ? { ...line, [field]: value } : line
            )
        );
    };

    const totalAmount = lines.reduce(
        (sum, line) => sum + (Number(line.quantity) || 0) * (Number(line.unitPrice) || 0),
        0
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const orderData: Order = {
            id: order?.id ?? Date.now(),
            ...formData,
            lines,
            totalAmount,
        };
        onSave(orderData);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{order ? "Edit Order" : "New Order"}</DialogTitle>
                    <DialogDescription>Configure order information and lines</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Informations générales */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">General Information</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="reference">Reference *</Label>
                                <Input
                                    id="reference"
                                    value={formData.reference}
                                    onChange={(e) =>
                                        setFormData((prev) => ({ ...prev, reference: e.target.value }))
                                    }
                                    placeholder="ORD-2024-001"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="type">Type *</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(value) =>
                                        setFormData((prev) => ({ ...prev, type: value }))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Purchase">Purchase</SelectItem>
                                        <SelectItem value="Sale">Sale</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(value) =>
                                        setFormData((prev) => ({ ...prev, status: value }))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Draft">Draft</SelectItem>
                                        <SelectItem value="Confirmed">Confirmed</SelectItem>
                                        <SelectItem value="In Progress">In Progress</SelectItem>
                                        <SelectItem value="Delivered">Delivered</SelectItem>
                                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="supplier">
                                    {formData.type === "Sale" ? "Client" : "Supplier"}
                                </Label>
                                <Input
                                    id="supplier"
                                    value={formData.supplier}
                                    onChange={(e) =>
                                        setFormData((prev) => ({ ...prev, supplier: e.target.value }))
                                    }
                                    placeholder={
                                        formData.type === "Sale" ? "Client name" : "Supplier name"
                                    }
                                />
                            </div>
                        </CardContent>
                    </Card>
                    {/* endInformations générales */}

                    {/* Logistique */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Logistics</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                                <Label htmlFor="warehouse">Warehouse</Label>
                                <Select
                                    value={formData.warehouse}
                                    onValueChange={(value) =>
                                        setFormData((prev) => ({ ...prev, warehouse: value }))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Entrepôt Principal">
                                            Entrepôt Principal
                                        </SelectItem>
                                        <SelectItem value="Entrepôt Frigorifique">
                                            Entrepôt Frigorifique
                                        </SelectItem>
                                        <SelectItem value="Dépôt Régional HK">
                                            Dépôt Régional HK
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="orderDate">Order Date</Label>
                                <Input
                                    id="orderDate"
                                    type="date"
                                    value={formData.orderDate}
                                    onChange={(e) =>
                                        setFormData((prev) => ({ ...prev, orderDate: e.target.value }))
                                    }
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="expectedDate">Expected Date</Label>
                                <Input
                                    id="expectedDate"
                                    type="date"
                                    value={formData.expectedDate}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            expectedDate: e.target.value,
                                        }))
                                    }
                                />
                            </div>
                        </CardContent>
                    </Card>
                    {/* endLogistique */}

                    {/* Order Lines */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-lg">Order Lines</CardTitle>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="gap-2"
                                onClick={handleAddLine}
                            >
                                <Plus className="h-4 w-4" />
                                Add line
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Reference</TableHead>
                                        <TableHead>Designation</TableHead>
                                        <TableHead className="w-[110px]">Quantity</TableHead>
                                        <TableHead className="w-[150px]">Unit Price (XOF)</TableHead>
                                        <TableHead className="w-[130px] text-right">Total</TableHead>
                                        <TableHead className="w-[60px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {lines.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={6}
                                                className="text-center text-muted-foreground py-6"
                                            >
                                                No lines yet. Click &quot;Add line&quot; to begin.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        lines.map((line, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    <Input
                                                        value={line.articleRef}
                                                        onChange={(e) =>
                                                            handleLineChange(index, "articleRef", e.target.value)
                                                        }
                                                        placeholder="REF-001"
                                                        className="h-8"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        value={line.designation}
                                                        onChange={(e) =>
                                                            handleLineChange(
                                                                index,
                                                                "designation",
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Article designation"
                                                        className="h-8"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        type="number"
                                                        min={0}
                                                        value={line.quantity}
                                                        onChange={(e) =>
                                                            handleLineChange(
                                                                index,
                                                                "quantity",
                                                                Number(e.target.value)
                                                            )
                                                        }
                                                        className="h-8"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        type="number"
                                                        min={0}
                                                        value={line.unitPrice}
                                                        onChange={(e) =>
                                                            handleLineChange(
                                                                index,
                                                                "unitPrice",
                                                                Number(e.target.value)
                                                            )
                                                        }
                                                        className="h-8"
                                                    />
                                                </TableCell>
                                                <TableCell className="text-right font-medium">
                                                    {(
                                                        (Number(line.quantity) || 0) *
                                                        (Number(line.unitPrice) || 0)
                                                    ).toLocaleString()}
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-destructive hover:text-destructive"
                                                        onClick={() => handleDeleteLine(index)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>

                            {lines.length > 0 && (
                                <div className="flex justify-end mt-4 pt-4 border-t">
                                    <div className="text-right">
                                        <p className="text-sm text-muted-foreground">Total Amount</p>
                                        <p className="text-xl font-bold">
                                            XOF {totalAmount.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                    {/* endOrder Lines */}

                    {/* Notes */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Notes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                value={formData.notes}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, notes: e.target.value }))
                                }
                                placeholder="Notes and comments..."
                                rows={3}
                            />
                        </CardContent>
                    </Card>
                    {/* endNotes */}

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">{order ? "Edit" : "Create"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
