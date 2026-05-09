"use client"

import { Reception, ReceptionLine } from "@/types/type";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Trash2, Plus } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

interface ReceptionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    reception?: Reception;
    onSave: (receptionData: Reception) => void;
}

const emptyLine = (): ReceptionLine => ({
    articleRef: "",
    designation: "",
    orderedQty: 0,
    receivedQty: 0,
    unitPrice: 0,
});

export function ReceptionDialog({ open, onOpenChange, reception, onSave }: ReceptionDialogProps) {
    const [formData, setFormData] = useState({
        reference: "",
        supplier: "ACM Visserie",
        warehouse: "Entrepôt Principal",
        status: "Pending",
        expectedDate: "",
        receivedDate: "",
        notes: "",
    });

    const [lines, setLines] = useState<ReceptionLine[]>([]);

    useEffect(() => {
        if (reception) {
            setFormData({
                reference: reception.reference || "",
                supplier: reception.supplier || "ACM Visserie",
                warehouse: reception.warehouse || "Entrepôt Principal",
                status: reception.status || "Pending",
                expectedDate: reception.expectedDate || "",
                receivedDate: reception.receivedDate || "",
                notes: reception.notes || "",
            });
            setLines(reception.lines ? reception.lines.map((l) => ({ ...l })) : []);
        } else {
            setFormData({
                reference: "",
                supplier: "ACM Visserie",
                warehouse: "Entrepôt Principal",
                status: "Pending",
                expectedDate: "",
                receivedDate: "",
                notes: "",
            });
            setLines([]);
        }
    }, [reception, open]);

    const handleLineChange = (index: number, field: keyof ReceptionLine, value: string | number) => {
        setLines((prev) => prev.map((line, i) => i === index ? { ...line, [field]: value } : line));
    };

    const handleAddLine = () => {
        setLines((prev) => [...prev, emptyLine()]);
    };

    const handleRemoveLine = (index: number) => {
        setLines((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const totalValue = lines.reduce((sum, l) => sum + l.receivedQty * l.unitPrice, 0);
        const receptionData: Reception = {
            id: reception?.id ?? Date.now(),
            reference: formData.reference,
            supplier: formData.supplier,
            warehouse: formData.warehouse,
            status: formData.status,
            expectedDate: formData.expectedDate,
            receivedDate: formData.receivedDate || undefined,
            notes: formData.notes,
            lines,
            totalValue,
        };
        onSave(receptionData);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{reception ? "Edit Reception" : "New Reception"}</DialogTitle>
                    <DialogDescription>Configure reception information</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
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
                                    onChange={(e) => setFormData((prev) => ({ ...prev, reference: e.target.value }))}
                                    placeholder="REC-2024-005"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="supplier">Supplier</Label>
                                <Select
                                    value={formData.supplier}
                                    onValueChange={(value) => setFormData((prev) => ({ ...prev, supplier: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ACM Visserie">ACM Visserie</SelectItem>
                                        <SelectItem value="PetroCI">PetroCI</SelectItem>
                                        <SelectItem value="SKF Distribution">SKF Distribution</SelectItem>
                                        <SelectItem value="TechnoTools">TechnoTools</SelectItem>
                                        <SelectItem value="SCI Pharma">SCI Pharma</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="warehouse">Warehouse</Label>
                                <Select
                                    value={formData.warehouse}
                                    onValueChange={(value) => setFormData((prev) => ({ ...prev, warehouse: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Entrepôt Principal">Entrepôt Principal</SelectItem>
                                        <SelectItem value="Entrepôt Frigorifique">Entrepôt Frigorifique</SelectItem>
                                        <SelectItem value="Dépôt Régional HK">Dépôt Régional HK</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Pending">Pending</SelectItem>
                                        <SelectItem value="Received">Received</SelectItem>
                                        <SelectItem value="Partial">Partial</SelectItem>
                                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Dates</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="expectedDate">Expected Date *</Label>
                                <Input
                                    id="expectedDate"
                                    type="date"
                                    value={formData.expectedDate}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, expectedDate: e.target.value }))}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="receivedDate">Received Date</Label>
                                <Input
                                    id="receivedDate"
                                    type="date"
                                    value={formData.receivedDate}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, receivedDate: e.target.value }))}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg">Received Items</CardTitle>
                            <Button type="button" variant="outline" size="sm" className="gap-2" onClick={handleAddLine}>
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
                                        <TableHead>Ordered Qty</TableHead>
                                        <TableHead>Received Qty</TableHead>
                                        <TableHead>Unit Price (XOF)</TableHead>
                                        <TableHead className="w-[50px]">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {lines.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center text-muted-foreground py-4">
                                                No items. Click &quot;Add line&quot; to add one.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {lines.map((line, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <Input
                                                    value={line.articleRef}
                                                    onChange={(e) => handleLineChange(index, "articleRef", e.target.value)}
                                                    placeholder="REF-001"
                                                    className="w-full"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    value={line.designation}
                                                    onChange={(e) => handleLineChange(index, "designation", e.target.value)}
                                                    placeholder="Item designation"
                                                    className="w-full"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    value={line.orderedQty}
                                                    onChange={(e) => handleLineChange(index, "orderedQty", Number(e.target.value))}
                                                    placeholder="0"
                                                    className="w-24"
                                                    min={0}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    value={line.receivedQty}
                                                    onChange={(e) => handleLineChange(index, "receivedQty", Number(e.target.value))}
                                                    placeholder="0"
                                                    className="w-24"
                                                    min={0}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    value={line.unitPrice}
                                                    onChange={(e) => handleLineChange(index, "unitPrice", Number(e.target.value))}
                                                    placeholder="0"
                                                    className="w-32"
                                                    min={0}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-destructive hover:text-destructive"
                                                    onClick={() => handleRemoveLine(index)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Notes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                value={formData.notes}
                                onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                                placeholder="Notes and comments..."
                                rows={3}
                            />
                        </CardContent>
                    </Card>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">{reception ? "Save changes" : "Create"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
