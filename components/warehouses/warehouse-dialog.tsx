"use client"

import { Warehouse } from "@/types/type";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { CountrySelector } from "../utils/selector";
import { COUNTRIES } from "../utils/countries";
import { Button } from "../ui/button";

interface WarehouseDialogProps {
    open: boolean,
    onOpenChange: (open: boolean) => void,
    warehouse?: Warehouse,
    onSave: (warehouseData: Warehouse) => void,
}

export function WarehouseDialog({ open, onOpenChange, warehouse, onSave }: WarehouseDialogProps) {
    const [formData, setFormData] = useState({
        name: "",
        code: "",
        address: "",
        city: "",
        postalCode: "",
        country: "CI",
        manager: "",
        phone: "",
        email: "",
        area: "",
        maxCapacity: "",
        currentOccupation: "",
        nbLocations: "",
        occupiedLocations: "",
        type: "Main",
        temperature: "Ambient",
        notes: "",
        status: "Active",
    });

    useEffect(() => {
        if (warehouse) {
            setFormData({
                name: warehouse.name || "",
                code: warehouse.code || "",
                address: warehouse.address || "",
                city: warehouse.city || "",
                postalCode: warehouse.postalCode || "",
                country: warehouse.country || "CI",
                manager: warehouse.manager || "",
                phone: warehouse.phone.toString() || "",
                email: warehouse.email || "",
                area: warehouse.area.toString() || "",
                maxCapacity: warehouse.maxCapacity.toString() || "",
                currentOccupation: warehouse.currentOccupation.toString() || "",
                nbLocations: warehouse.nbLocations.toString() || "",
                occupiedLocations: warehouse.occupiedLocations.toString() || "",
                type: warehouse.type || "Main",
                temperature: warehouse.temperature || "Ambient",
                notes: warehouse.notes || "",
                status: warehouse.status || "Active",
            })
        } else {
            setFormData({
                name: "",
                code: "",
                address: "",
                city: "",
                postalCode: "",
                country: "CI",
                manager: "",
                phone: "",
                email: "",
                area: "",
                maxCapacity: "",
                currentOccupation: "",
                nbLocations: "",
                occupiedLocations: "",
                type: "Main",
                temperature: "Ambient",
                notes: "",
                status: "Active",
            })
        }
    }, [warehouse]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const warehouseData: Warehouse = {
            id: warehouse?.id ?? Date.now(),
            ...formData,
            area: Number.parseInt(formData.area) || 0,
            maxCapacity: Number.parseInt(formData.maxCapacity) || 0,
            currentOccupation: Number.parseInt(formData.currentOccupation) || 0,
            nbLocations: Number.parseInt(formData.nbLocations) || 0,
            occupiedLocations: Number.parseInt(formData.occupiedLocations) || 0,
        }
        onSave(warehouseData);
    }

    const [isCountryOpen, setIsCountryOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle> {warehouse ? "Edit warehouse" : "New warehouse"} </DialogTitle>
                    <DialogDescription>configure warehouse information</DialogDescription>
                </DialogHeader>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y6">
                    {/* Informations générales */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">General information</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">Warehouse name *</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                                    placeholder="Main Warehouse"
                                    required
                                />
                            </div>
                            {/* ------------------------------------------------------------------- */}
                            <div className="space-y-2">
                                <Label htmlFor="code">Warehouse code *</Label>
                                <Input
                                    id="code"
                                    value={formData.code}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value }))}
                                    placeholder="EP-001"
                                    required
                                />
                            </div>
                            {/* ------------------------------------------------------------------- */}
                            <div className="space-y-2">
                                <Label htmlFor="type"> Warehouse type *</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Main">Main</SelectItem>
                                        <SelectItem value="Regional">Regional</SelectItem>
                                        <SelectItem value="Specialized">Specialized</SelectItem>
                                        <SelectItem value="Transit">Transit</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {/* ------------------------------------------------------------------- */}
                            <div className="space-y-2">
                                <Label htmlFor="status"> Status </Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Active">Active</SelectItem>
                                        <SelectItem value="Inactive">Inactive</SelectItem>
                                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>
                    {/* endInformations générales */}

                    {/* Address */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Location</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="sapce-y-2">
                                <Label htmlFor="address">Full Address</Label>
                                <Textarea
                                    id="address"
                                    value={formData.address}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                                    placeholder="Industrial Zone"
                                    rows={2}
                                />
                            </div>
                            {/* ---------------------------------------------------------------------------------- */}
                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="sapce-y-2">
                                    <Label htmlFor="city">City</Label>
                                    <Input
                                        id="city"
                                        value={formData.city}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                                        placeholder="Amsterdam"
                                    />
                                </div>
                                {/* ---------------------------------------------------------------------------------- */}
                                <div className="sapce-y-2">
                                    <Label htmlFor="postalCode">Postal Code</Label>
                                    <Input
                                        id="postalCode"
                                        value={formData.postalCode}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, postalCode: e.target.value }))}
                                        placeholder="00225"
                                    />
                                </div>
                                {/* ---------------------------------------------------------------------------------- */}
                                <div className="space-y-2">
                                    <Label htmlFor="country">Country</Label>
                                    <CountrySelector
                                        id="country"
                                        open={isCountryOpen}
                                        onToggle={() => setIsCountryOpen(!isCountryOpen)}
                                        selected={
                                            COUNTRIES.find((c) => c.value === formData.country)!
                                        }
                                        onChange={(country) =>
                                            setFormData((prev) => ({ ...prev, country: country.value }))
                                        }
                                    />

                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    {/* endAddress */}

                    {/* Responsable */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Manager</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                                <Label htmlFor="manager">Manager name</Label>
                                <Input id="manager" value={formData.manager} onChange={(e) => setFormData((prev) => ({ ...prev, manager: e.target.value }))} placeholder="Pierre Martin" />
                            </div>
                            {/* ------------------------------------------------------------------------------- */}
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input id="phone" type="number" value={formData.phone} onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))} placeholder="+00 ...." />
                            </div>
                            {/* ------------------------------------------------------------------------------- */}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))} placeholder="responsable@warehouse.ci" />
                            </div>
                        </CardContent>
                    </Card>
                    {/* endResponsable */}

                    {/* Carctéristiques */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg"> Features</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <div className="space-y-2">
                                <Label htmlFor="area">Area (m²)</Label>
                                <Input id="area" type="number" value={formData.area} onChange={(e) => setFormData((prev) => ({ ...prev, area: e.target.value }))} placeholder="1000" />
                            </div>
                            {/* ------------------------------------------------------------------------------- */}
                            <div className="space-y-2">
                                <Label htmlFor="maxCapacity">Max Capacity (unity)</Label>
                                <Input id="maxCapacity" type="number" value={formData.maxCapacity} onChange={(e) => setFormData((prev) => ({ ...prev, maxCapacity: e.target.value }))} placeholder="1000" />
                            </div>
                            {/* -------------------------------------------------------------------------------- */}
                            <div className="space-y-2">
                                <Label htmlFor="nbLocations">Number of Locations</Label>
                                <Input id="nbLocations" type="number" value={formData.nbLocations} onChange={(e) => setFormData((prev) => ({ ...prev, nbLocations: e.target.value }))} placeholder="150 " />
                            </div>
                            {/* --------------------------------------------------------------------------------- */}
                            <div className="space-y-2">
                                <Label htmlFor="temperature">Temperature</Label>
                                <Select
                                    value={formData.temperature}
                                    onValueChange={(value) => setFormData((prev) => ({ ...prev, temperature: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Ambiant">Ambiant</SelectItem>
                                        <SelectItem value="Refrigerated">Refrigerated</SelectItem>
                                        <SelectItem value="Frozen">Frozen</SelectItem>
                                        <SelectItem value="controlled">controlled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>
                    {/* endCarctéristiques */}

                    {/* Notes */}
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
                    {/* endNotes */}

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">{warehouse ? "Edit" : "Create"}</Button>
                    </DialogFooter>
                </form>
                {/* endForm */}
            </DialogContent>
        </Dialog>
    )
}
