"use client"

import { Category } from "@/types/type"
import type React from "react"
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Textarea } from "../ui/textarea"
import { Switch } from "../ui/switch"
import { Button } from "../ui/button"

interface CategoryDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    category?: Category
    onSave: (categoryData: Category) => void
}
export function CategoryDialog({
    open,
    onOpenChange,
    category,
    onSave,
}: CategoryDialogProps) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        parent: "defaultParent",
        nbArticles: "0",
        stockValue: "0",
        color: "#10B981",
        seuilRotation: "4.0",
        autoClassification: true,
        active: true,
    });

    useEffect(() => {
        if (category) {
            setFormData({
                name: category.name || "",
                description: category.description || "",
                parent: category.parent || "defaultParent",
                nbArticles: category.nbArticles?.toString() || "0",
                stockValue: category.stockValue.toString() || "0",
                color: category.color || "#10B981",
                seuilRotation: category.seuilRotation?.toString() || "4.0",
                autoClassification: category.autoClassification ?? true,
                active: category.active ?? true,
            })
        } else {
            setFormData({
                name: "",
                description: "",
                parent: "defaultParent",
                nbArticles: "0",
                stockValue: "0",
                color: "#10B981",
                seuilRotation: "4.0",
                autoClassification: true,
                active: true,
            })
        }
    }, [category])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const categoryData: Category = {
            id: category?.id ?? Date.now(),
            ...formData,
            nbArticles: formData.nbArticles ? parseFloat(formData.nbArticles) : 0,
            stockValue: formData.stockValue ? parseFloat(formData.stockValue) : 0,
            seuilRotation: Number.parseFloat(formData.seuilRotation) || 4.0,
        }
        onSave(categoryData)
    }

    const colors = [
        { name: "Green", value: "#10B981" },
        { name: "Blue", value: "#3B82F6" },
        { name: "Red", value: "#EF4444" },
        { name: "Orange", value: "#F59E0B" },
        { name: "Purple", value: "#8B5CF6" },
        { name: "Pink", value: "#EC4899" },
    ]

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {category ? "Edit Category" : "Add Category"}
                    </DialogTitle>
                    <DialogDescription>
                        Configure classification and organization settings
                    </DialogDescription>
                </DialogHeader>

                {/* Info générales */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* card one */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                General information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                {/* champs de saisi */}
                                <div className="space-y-2">
                                    <Label htmlFor="name">Category name *</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                                        placeholder="Srcews"
                                        required
                                    />
                                </div>
                                {/* ------------------------------------------------------------ */}
                                <div className="space-y-2">
                                    <Label htmlFor="parent">Parent Category</Label>
                                    <Select
                                        value={formData.parent}
                                        onValueChange={(value) => setFormData((prev) => ({ ...prev, parent: value }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="no (main categrory)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="defaultParent">None</SelectItem>
                                            {/* Update Value */}
                                            <SelectItem value="Screws">Screws</SelectItem>
                                            <SelectItem value="Lubricant">Lubricants</SelectItem>
                                            <SelectItem value="Bearings">Bearings</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                {/* ---------------------------------------------------------- */}
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                                        placeholder="Category description..."
                                        rows={3}
                                    />
                                </div>
                                {/* endChamps de saisi */}
                            </div>
                        </CardContent>
                    </Card>
                    {/* endCard one */}

                    {/* Card two */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">ABC classification</CardTitle>
                            <CardDescription>Automatic classification parameters</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Automatic classification</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Automatically classify items according to their values and rotation.
                                    </p>
                                </div>
                                <Switch
                                    checked={formData.autoClassification}
                                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, autoClassification: checked }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="seuilRotation">Rotation threashold (by year)</Label>
                                <Input
                                    id="seuilRotation"
                                    type="number"
                                    step="0.1"
                                    value={formData.seuilRotation}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, seuilRotation: e.target.value }))}
                                    placeholder="4.0"
                                />
                                <p className="text-sm text-muted-foreground">
                                    Items with higher rotation will be classified A or B.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                    {/* endCard two */}

                    {/* Card three */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Appearance</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Category color</Label>
                                <div className="flex gap-2 flex-wrap">
                                    {colors.map((color) => (
                                        <button
                                            key={color.value}
                                            type="button"
                                            className={`w-8 h-8 rounded-full border-2 ${formData.color === color.value ? "border-primary" : "border-gray-300"
                                                }`}
                                            style={{ backgroundColor: color.value }}
                                            onClick={() => setFormData((prev) => ({ ...prev, color: color.value }))}
                                            title={color.name}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Active category</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Inactive categories are not usable.
                                    </p>
                                </div>
                                <Switch
                                    checked={formData.active}
                                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, active: checked }))}
                                />
                            </div>
                        </CardContent>
                    </Card>
                    {/* endCard three */}

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">{category ? "Edit" : "Create"}</Button>
                    </DialogFooter>

                </form>
            </DialogContent>
        </Dialog>
    )
}
