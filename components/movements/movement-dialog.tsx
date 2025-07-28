"use client"

import { Movement } from "@/types/type";
import React, { forwardRef, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"
import { Calendar } from "lucide-react";



interface MovementDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void
    movement?: Movement
    onSave: (movementData: Movement) => void
}

const DatePickerInput = forwardRef<HTMLInputElement, { value?: string; onClick?: () => void }>(
    ({ value, onClick }, ref) => (
        <div className="relative w-full">
            <Input
                readOnly
                ref={ref}
                value={value}
                onClick={onClick}
                className="w-full cursor-pointer pl-3 pr-10"
            />
            <Calendar className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        </div>
    )
)
DatePickerInput.displayName = "DatePickerInput"

export function MovementDialog({
    open,
    onOpenChange,
    movement,
    onSave,
}: MovementDialogProps) {
    const [formData, setFormData] = useState({
        reference: "",
        type: "Entry",
        article: "",
        designation: "",
        quantity: "",
        sourceWarehouse: "",
        destinationWarehouse: "",
        sourceLocation: "",
        destinationLocation: "",
        user: "",
        creationDate: new Date(),
        executionDate: new Date(),
        status: "",
        reason: "",
        lotNumber: "",
        unitCost: "",
        notes: "",
    })

    useEffect(() => {
        if (movement) {
            setFormData({
                reference: movement.reference || "",
                type: movement.type || "Entry",
                article: movement.article || "",
                designation: movement.designation || "",
                quantity: movement.quantity.toString() || "",
                sourceWarehouse: movement.sourceWarehouse || "",
                destinationWarehouse: movement.destinationWarehouse || "",
                sourceLocation: movement.sourceLocation || "",
                destinationLocation: movement.destinationLocation || "",
                user: movement.user || "",
                creationDate: movement.creationDate || new Date(),
                executionDate: movement.executionDate || new Date(),
                status: movement.status || "",
                reason: movement.reason || "",
                lotNumber: movement.lotNumber || "",
                unitCost: movement.unitCost.toString() || "",
                notes: movement.notes || "",
            })
        } else {
            setFormData({
                reference: "",
                type: "Entry",
                article: "",
                designation: "",
                quantity: "",
                sourceWarehouse: "",
                destinationWarehouse: "",
                sourceLocation: "",
                destinationLocation: "",
                user: "",
                creationDate: new Date(),
                executionDate: new Date(),
                status: "",
                reason: "",
                lotNumber: "",
                unitCost: "",
                notes: "",
            })
        }
    }, [movement]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const movementData: Movement = {
            id: movement?.id ?? Date.now(),
            ...formData,
            quantity: Number.parseInt(formData.quantity) || 0,
            unitCost: Number.parseInt(formData.unitCost) || 0,
            // creationDate: new Date(formData.creationDate),
            // executionDate: new Date(formData.executionDate),
            creationDate: formData.creationDate ? new Date(formData.creationDate) : new Date(),
            executionDate: formData.executionDate ? new Date(formData.executionDate) : new Date(),

        };
        onSave(movementData);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>New stock movement</DialogTitle>
                    <DialogDescription>Record an entry, exit or transfer movement</DialogDescription>
                </DialogHeader>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Movement */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Type of movement</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="type">Type *</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Entry">Entry (Reception) </SelectItem>
                                        <SelectItem value="Output">Output (Shipping) </SelectItem>
                                        <SelectItem value="Transfer">Internal transfer</SelectItem>
                                        <SelectItem value="Adjustment">Inventory adjustment</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {/* ----------------------------------------------------------------------------- */}
                            <div className="space-y-2">
                                <Label htmlFor="reason">Reason *</Label>
                                <Input
                                    id="reason"
                                    value={formData.reason}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, reason: e.target.value }))}
                                    placeholder="Order reception, customer shipping..."
                                    required
                                />
                            </div>
                        </CardContent>
                    </Card>
                    {/* endMovement */}

                    {/* Quantity & Article */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg"> Quantity and Article</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                                <Label htmlFor="article">Article *</Label>
                                <Select
                                    value={formData.article}
                                    onValueChange={(value) => setFormData((prev) => ({ ...prev, article: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="REF-001">REF-001 - vis M6x20 Inox</SelectItem>
                                        <SelectItem value="REF-002">REF-002 - Huile moteur 5L</SelectItem>
                                        <SelectItem value="REF-003">REF-003 - Roulement SKF</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {/* --------------------------------------------------------------------------------- */}
                            <div className="space-y-2">
                                <Label htmlFor="quantity">Quantity *</Label>
                                <Input
                                    id="quantity"
                                    type="number"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, quantity: e.target.value }))}
                                    placeholder="100"
                                    required
                                />
                            </div>
                            {/* ----------------------------------------------------------------------------------- */}
                            <div className="space-y-2">
                                <Label htmlFor="unitCost">UnitCost (XOF) </Label>
                                <Input
                                    id="unitCost"
                                    type="number"
                                    step={0.01}
                                    value={formData.unitCost}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, unitCost: e.target.value }))}
                                    placeholder="0.00"
                                />
                            </div>
                        </CardContent>
                    </Card>
                    {/* endQuantity & Article */}

                    {/* Location */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Location</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-4">
                                <h4 className="font-medium">Source</h4>
                                <div className="space-y-2">
                                    <Label htmlFor="sourceWarehouse">Source warehouse</Label>
                                    <Select
                                        value={formData.sourceWarehouse}
                                        onValueChange={(value) => setFormData((prev) => ({ ...prev, sourceWarehouse: value }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="External" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="External">External</SelectItem>
                                            <SelectItem value="EP-001">EP-001 - main warehouse</SelectItem>
                                            <SelectItem value="DR-003">DR-003 - Abidjan Regional Depot</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                {/* ------------------------------------------------------------------------------------ */}
                                <div className="space-y-2">
                                    <Label htmlFor="sourceLocation">Source Location</Label>
                                    <Input
                                        id="sourceLocation"
                                        value={formData.sourceLocation}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, sourceLocation: e.target.value }))}
                                        placeholder="A1-B2-C3"
                                    />
                                </div>
                                {/* --------------------------------------------------------------------------------------- */}
                                <div className="space-y-4">
                                    <h4 className="font-medium">
                                        Destination
                                    </h4>
                                    <div className="space-y-2">
                                        <Label htmlFor="destinationWarehouse">Destination warehouse</Label>
                                        <Select
                                            value={formData.destinationWarehouse}
                                            onValueChange={(value) => setFormData((prev) => ({ ...prev, destinationWarehouse: value }))}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="External" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="External">External</SelectItem>
                                                <SelectItem value="EP-001">EP-001 - main warehouse</SelectItem>
                                                <SelectItem value="DR-003">DR-003 - Abidjan Regional Depot</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                {/* --------------------------------------------------------------------------------------- */}
                                <div className="space-y-2">
                                    <Label htmlFor="destinationLocation">Destination Location</Label>
                                    <Input
                                        id="destinationLocation"
                                        value={formData.destinationLocation}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, destinationLocation: e.target.value }))}
                                        placeholder="A1-B2-C3"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    {/* endLocation */}

                    {/* Informations complémentaires */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Additional Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                {/* Date + heure de création */}
                                <Label htmlFor="creationDate">Creation Date</Label>
                                <DatePicker
                                    id="creationDate"
                                    selected={formData.creationDate}
                                    onChange={(date) =>
                                        setFormData((prev) => ({ ...prev, creationDate: date as Date }))
                                    }
                                    showTimeSelect
                                    dateFormat="Pp"
                                    customInput={<DatePickerInput />}
                                    popperClassName="z-50" // pour s'assurer devant les modals
                                />
                            </div>
                            {/* ------------------------------------------------------------------- */}
                            <div className="space-y-2">
                                {/* Date + heure d’exécution */}
                                <Label htmlFor="executionDate">Execution Date</Label>
                                <DatePicker
                                    id="executionDate"
                                    selected={formData.executionDate}
                                    onChange={(date) =>
                                        setFormData((prev) => ({ ...prev, executionDate: date as Date }))
                                    }
                                    showTimeSelect
                                    dateFormat="Pp"
                                    customInput={<DatePickerInput />}
                                    popperClassName="z-50"
                                />
                            </div>
                            {/* ------------------------------------------------------------------------ */}
                            <div className="space-y-2">
                                <Label htmlFor="lotNumber">Lot Number</Label>
                                <Input
                                    id="lotNumber"
                                    value={formData.lotNumber}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, lotNumber: e.target.value }))}
                                    placeholder="LOT-2025-001"
                                />
                            </div>
                            {/* ---------------------------------------------------------------------------------- */}
                            <div className="space-y-2">
                                <Label htmlFor="notes">Notes</Label>
                                <Textarea
                                    id="notes"
                                    value={formData.notes}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                                    placeholder="Complementaries Notes..."
                                    rows={3}
                                />
                            </div>
                        </CardContent>
                    </Card>
                    {/* endInformations complémentaires */}

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit"> Create the movement</Button>
                    </DialogFooter>
                </form>
                {/* endForm */}
            </DialogContent>
        </Dialog>
    )

}
