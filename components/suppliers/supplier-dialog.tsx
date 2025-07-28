"use client"

import { Supplier } from "@/types/type"
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from "../ui/select"
import { Textarea } from "../ui/textarea"
import { CountrySelector } from "@/components/utils/selector"
import { COUNTRIES } from "@/components/utils/countries"
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { PhoneInputComponent } from "@/components/utils/phoneInputComponent"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"

interface SupplierDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    supplier?: Supplier
    onSave: (supplierData: Supplier) => void
}

export function SupplierDialog({ open, onOpenChange, supplier, onSave }: SupplierDialogProps) {
    const [formData, setFormData] = useState({
        name: "",
        contact: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        postalCode: "",
        country: "CI",
        deliveryTime: "7",
        paymentTerms: "30 days",
        discount: "0",
        notes: "",
        nbOrder: "",
        totalAmount: "",
        status: "Active",
        certifications: [] as string[],
    })

    const [newCertification, setNewCertification] = useState("")

    useEffect(() => {
        if (supplier) {
            setFormData({
                name: supplier.name || "",
                contact: supplier.contact || "",
                email: supplier.email || "",
                phone: supplier.phone.toString() || "",
                address: supplier.address || "",
                city: supplier.city || "",
                postalCode: supplier.postalCode || "",
                country: supplier.country || "CI",
                deliveryTime: supplier.deliveryTime.toString() || "7",
                paymentTerms: supplier.paymentTerms || "30 days",
                discount: supplier.discount.toString() || "0",
                notes: supplier.notes.toString() || "",
                nbOrder: supplier.nbOrder.toString() || "",
                totalAmount: supplier.totalAmount.toString() || "",
                status: supplier.status || "Active",
                certifications: supplier.certifications || [],
            })
        } else {
            setFormData({
                name: "",
                contact: "",
                email: "",
                phone: "",
                address: "",
                city: "",
                postalCode: "",
                country: "CI",
                deliveryTime: "7",
                paymentTerms: "30 days",
                discount: "0",
                notes: "",
                nbOrder: "",
                totalAmount: "",
                status: "Active",
                certifications: [],
            })
        }
    }, [supplier]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const supplierData: Supplier = {
            id: supplier?.id ?? Date.now(),
            ...formData,
            notes: Number.parseInt(formData.notes, 10) || 0,
            deliveryTime: Number.parseInt(formData.deliveryTime, 10) || 7,
            discount: Number.parseInt(formData.discount, 10) || 0,
            nbOrder: Number.parseInt(formData.nbOrder, 10) || 0,
            totalAmount: Number.parseInt(formData.totalAmount, 10) || 0,
        };

        onSave(supplierData);
    };

    const addCertification = () => {
        if (newCertification.trim() && !formData.certifications.includes(newCertification.trim())) {
            setFormData((prev) => ({
                ...prev,
                certifications: [...prev.certifications, newCertification.trim()],
            }))
            setNewCertification("");
        }
    }

    const removeCertification = (cert: string) => {
        setFormData((prev) => ({
            ...prev,
            certifications: prev.certifications.filter((c) => c !== cert),
        }));
    }

    const [isCountryOpen, setIsCountryOpen] = useState(false);


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle> {supplier ? "Edit the supplier" : "New supplier"} </DialogTitle>
                    <DialogDescription>manage information and commercial conditions</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Informations générales */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">General information</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">Supplier name *</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                                    placeholder="ACME Visserie"
                                    required
                                />
                            </div>
                            {/* ------------------------------------------------------------------------- */}
                            <div className="space-y-2">
                                <Label htmlFor="contact">Main Contact</Label>
                                <Input
                                    id="contact"
                                    type="text"
                                    value={formData.contact}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, contact: e.target.value }))}
                                    placeholder="Jean Dupont"
                                />
                            </div>
                            {/* ------------------------------------------------------------------------- */}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                                    placeholder="contact@mail.ci"
                                    required
                                />
                            </div>
                            {/* ------------------------------------------------------------------------- */}
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <PhoneInput
                                    international
                                    defaultCountry="CI"
                                    value={formData.phone}
                                    onChange={(value) => setFormData((prev) => ({ ...prev, phone: value || "" }))}
                                    id="phone"
                                    className="w-full"
                                    inputComponent={PhoneInputComponent}
                                />

                            </div>
                            {/* ------------------------------------------------------------------------- */}
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
                                        <SelectItem value="Active">Active</SelectItem>
                                        <SelectItem value="Inactive">Inactive</SelectItem>
                                        <SelectItem value="Suspended">Suspended</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {/* ------------------------------------------------------------------------- */}
                        </CardContent>
                    </Card>
                    {/* endInformations générales */}

                    {/* Adresses */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Address</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="address">Full address</Label>
                                <Textarea
                                    id="address"
                                    value={formData.address}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                                    placeholder="Avenue des Metiers Koumassi, Abidjan"
                                    rows={2}
                                />
                            </div>
                            {/* ------------------------------------------------------------------------- */}
                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="city">City</Label>
                                    <Input
                                        id="city"
                                        value={formData.city}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                                        placeholder="Abidjan"
                                    />
                                </div>
                                {/* ------------------------------------------------------------------------- */}
                                <div className="space-y-2">
                                    <Label htmlFor="postalCode">Postal code</Label>
                                    <Input
                                        id="postalCode"
                                        value={formData.postalCode}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, postalCode: e.target.value }))}
                                        placeholder="01000"
                                    />
                                </div>
                            </div>
                            {/* ------------------------------------------------------------------------- */}
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
                        </CardContent>
                    </Card>
                    {/* endAdresses */}

                    {/* Conditions Commerciales */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Commercial Conditions</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                                <Label htmlFor="deliveryTime">Delivery Time (Days)</Label>
                                <Input
                                    id="deliveryTime"
                                    type="number"
                                    value={formData.deliveryTime}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            deliveryTime: e.target.value
                                        }))
                                    }
                                    placeholder="7"
                                />
                            </div>
                            {/* ------------------------------------------------------------------------- */}
                            <div className="space-y-2">
                                <Label htmlFor="paymentTerms">Payment Terms</Label>
                                <Select
                                    value={formData.paymentTerms}
                                    onValueChange={(value) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            paymentTerms: value
                                        }))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="cash">Cash</SelectItem>
                                        <SelectItem value="credit">Credit</SelectItem>
                                        <SelectItem value="15 days">15 Days</SelectItem>
                                        <SelectItem value="30 days">30 Days</SelectItem>
                                        <SelectItem value="45 days">45 Days</SelectItem>
                                        <SelectItem value="60 days">60 Days</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {/* ------------------------------------------------------------------------- */}
                            <div className="space-y-2">
                                <Label htmlFor="discount">Negotiated Discount (%)</Label>
                                <Input
                                    id="discount"
                                    type="number"
                                    value={formData.discount}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            discount: e.target.value
                                        }))
                                    }
                                    placeholder="0"
                                />
                            </div>
                        </CardContent>
                    </Card>
                    {/* endConditions Commerciales */}

                    {/* Certifications */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Certifications</CardTitle>
                            <CardDescription>Certifications and quality labels</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-2">
                                <Input
                                    value={newCertification}
                                    onChange={(e) =>
                                        setNewCertification(e.target.value)
                                    }
                                    placeholder="ISO 9001, ISO 14001, etc."
                                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCertification())}
                                />
                                <Button type="button" onClick={addCertification}></Button>
                            </div>
                            {/* ------------------------------------------------------------------------- */}
                            <div className="flex flex-wrap gap-2">
                                {formData.certifications.map((cert) => (
                                    <Badge
                                        key={cert}
                                        variant="secondary"
                                        className="gap-1"
                                    >
                                        {cert} <button
                                            type="button"
                                            onClick={() => removeCertification(cert)}
                                            className="ml-1 hover:text-destructive"
                                        >
                                            x
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                            {/* ------------------------------------------------------------------------- */}
                        </CardContent>
                    </Card>
                    {/* endCertifications */}

                    {/* Notes */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Notes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                value={formData.notes}
                                onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                                placeholder="Internal notes on the supplier"
                                rows={3}
                            />
                        </CardContent>
                    </Card>
                    {/* endNotes */}

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            {supplier ? "Edit" : "Create"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
