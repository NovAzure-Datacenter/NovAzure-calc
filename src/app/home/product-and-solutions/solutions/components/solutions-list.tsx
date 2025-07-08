"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Edit, MoreHorizontal, Trash2, Eye, AlertTriangle, Package } from "lucide-react";
import { mockSolutions, type Solution, type Product } from "../mock-data";

export default function SolutionsList() {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [isRemoving, setIsRemoving] = useState<string | null>(null);
    const [selectedSolution, setSelectedSolution] = useState<Solution | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isConfirmingRemove, setIsConfirmingRemove] = useState(false);

    const statusColors = {
        pending: "bg-yellow-100 text-yellow-800",
        verified: "bg-green-100 text-green-800",
        active: "bg-blue-100 text-blue-800",
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        setSelectedSolution(null);
        setIsEditMode(false);
    };

    const handleDropdownButtonClick = (e: React.MouseEvent, solutionName: string) => {
        e.stopPropagation();
        setOpenDropdown(openDropdown === solutionName ? null : solutionName);
    };

    const handleDropdownItemClick = async (action: string, solutionName: string) => {
        setOpenDropdown(null);
        const solution = mockSolutions.find((s) => s.name === solutionName);
        if (!solution) return;

        if (action === "View") {
            setSelectedSolution(solution);
            setIsEditMode(false);
            setIsDialogOpen(true);
        } else if (action === "Edit") {
            setSelectedSolution(solution);
            setIsEditMode(true);
            setIsDialogOpen(true);
        } else if (action === "Remove") {
            setSelectedSolution(solution);
            setIsConfirmingRemove(true);
        }
    };

    return (
        <>
            <div className="h-[calc(100vh-200px)] overflow-y-auto">
                <Card className="rounded-md border p-2">
                    <TooltipProvider>
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b">
                                    <TableHead className="h-8 px-2 py-1 text-xs font-medium">
                                        Icon
                                    </TableHead>
                                    <TableHead className="h-8 px-2 py-1 text-xs font-medium">
                                        Name
                                    </TableHead>
                                    <TableHead className="h-8 px-2 py-1 text-xs font-medium">
                                        Description
                                    </TableHead>
                                    <TableHead className="h-8 px-2 py-1 text-xs font-medium">
                                        Parameter Count
                                    </TableHead>
                                    <TableHead className="h-8 px-2 py-1 text-xs font-medium">
                                        Calculation Overview
                                    </TableHead>
                                    <TableHead className="h-8 px-2 py-1 text-xs font-medium">
                                        Status
                                    </TableHead>
                                    <TableHead className="h-8 px-2 py-1 text-xs font-medium">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockSolutions.map((solution) => (
                                    <TableRow
                                        key={solution.id}
                                        className="hover:bg-muted/50"
                                    >
                                        <TableCell className="h-10 px-2 py-1">
                                            <div className="flex items-center justify-center bg-gray-100 rounded">
                                                <solution.logo className="h-4 w-4 text-gray-600" />
                                            </div>
                                        </TableCell>
                                        <TableCell className="h-10 px-2 py-1 font-medium text-sm">
                                            {solution.name}
                                        </TableCell>
                                        <TableCell className="h-10 px-2 py-1 max-w-xs truncate text-sm text-muted-foreground">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <span>{solution.description}</span>
                                                </TooltipTrigger>
                                                <TooltipContent className="max-w-xs">
                                                    <p className="text-sm">{solution.description}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell className="h-10 px-2 py-1 text-sm">
                                            <div className="flex items-center gap-1">
                                                <Package className="h-3 w-3 text-gray-600" />
                                                <span>{solution.parameterCount}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="h-10 px-2 py-1 max-w-xs truncate text-sm text-muted-foreground">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <span>{solution.calculationOverview}</span>
                                                </TooltipTrigger>
                                                <TooltipContent className="max-w-xs">
                                                    <p className="text-sm">{solution.calculationOverview}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell className="h-10 px-2 py-1">
                                            {solution.status && (
                                                <Badge
                                                    variant="outline"
                                                    className={`text-xs px-2 py-0.5 ${
                                                        statusColors[solution.status]
                                                    }`}
                                                >
                                                    {solution.status}
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="h-10 px-2 py-1">
                                            {/* Custom Simple Dropdown */}
                                            <div className="relative dropdown-container">
                                                <Button
                                                    variant="ghost"
                                                    className="h-6 w-6 p-0"
                                                    onClick={(e) =>
                                                        handleDropdownButtonClick(e, solution.name)
                                                    }
                                                >
                                                    <MoreHorizontal className="h-3 w-3" />
                                                </Button>

                                                {openDropdown === solution.name && (
                                                    <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-[9999] min-w-[120px]">
                                                        <button
                                                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                                                            onClick={() =>
                                                                handleDropdownItemClick("View", solution.name)
                                                            }
                                                        >
                                                            <Eye className="h-3 w-3" />
                                                            View
                                                        </button>
                                                        <button
                                                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                                                            onClick={() =>
                                                                handleDropdownItemClick("Edit", solution.name)
                                                            }
                                                        >
                                                            <Edit className="h-3 w-3" />
                                                            Edit
                                                        </button>
                                                        <button
                                                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                                            onClick={() =>
                                                                handleDropdownItemClick("Remove", solution.name)
                                                            }
                                                            disabled={isRemoving === solution.id}
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                            {isRemoving === solution.id
                                                                ? "Removing..."
                                                                : "Remove"}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TooltipProvider>
                </Card>
            </div>

            {/* Solution Detail Dialog */}
            {selectedSolution && (
                <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <selectedSolution.logo className="h-5 w-5" />
                                {selectedSolution.name}
                            </DialogTitle>
                            <DialogDescription className="space-y-4">
                                <div>
                                    <h4 className="font-medium text-sm text-gray-900 mb-2">Description</h4>
                                    <p className="text-sm text-gray-600">{selectedSolution.description}</p>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-medium text-sm text-gray-900 mb-2">Category</h4>
                                        <p className="text-sm text-gray-600">{selectedSolution.category}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-sm text-gray-900 mb-2">Status</h4>
                                        <Badge
                                            variant="outline"
                                            className={`text-xs px-2 py-0.5 ${
                                                statusColors[selectedSolution.status]
                                            }`}
                                        >
                                            {selectedSolution.status}
                                        </Badge>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-sm text-gray-900 mb-2">Parameter Count</h4>
                                        <p className="text-sm text-gray-600">{selectedSolution.parameterCount}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-sm text-gray-900 mb-2">Calculation Overview</h4>
                                        <p className="text-sm text-gray-600">{selectedSolution.calculationOverview}</p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-medium text-sm text-gray-900 mb-2">Products ({selectedSolution.products.length})</h4>
                                    <div className="space-y-3">
                                        {selectedSolution.products.map((product) => (
                                            <div key={product.id} className="border rounded-lg p-3 bg-gray-50">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h5 className="font-medium text-sm">{product.name}</h5>
                                                    <Badge
                                                        variant="outline"
                                                        className={`text-xs px-2 py-0.5 ${
                                                            statusColors[product.status]
                                                        }`}
                                                    >
                                                        {product.status}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                                                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                                                    <div>Model: {product.model}</div>
                                                    <div>Efficiency: {product.efficiency}</div>
                                                    <div>Parameters: {product.parameterCount}</div>
                                                    <div>Category: {product.category}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            )}

            {/* Confirmation Dialog for Remove */}
            {isConfirmingRemove && selectedSolution && (
                <Dialog open={isConfirmingRemove} onOpenChange={setIsConfirmingRemove}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-destructive" />
                                Remove Solution
                            </DialogTitle>
                            <DialogDescription className="space-y-2">
                                <p>
                                    Are you sure you want to remove{" "}
                                    <strong>"{selectedSolution.name}"</strong>?
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    This will permanently delete the solution and all associated products
                                </p>
                                <p className="text-sm font-medium text-destructive">
                                    This action cannot be undone.
                                </p>
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end gap-3 pt-6 border-t mt-6">
                            <Button
                                variant="outline"
                                onClick={() => setIsConfirmingRemove(false)}
                                size="sm"
                                disabled={isRemoving === selectedSolution.id}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={async () => {
                                    setIsRemoving(selectedSolution.id);
                                    try {
                                        // Simulate API call
                                        await new Promise(resolve => setTimeout(resolve, 1000));
                                        setIsConfirmingRemove(false);
                                        // In a real app, you would call your API here
                                    } catch (error) {
                                        console.error("Error removing solution:", error);
                                    } finally {
                                        setIsRemoving(null);
                                    }
                                }}
                                size="sm"
                                variant="destructive"
                                disabled={isRemoving === selectedSolution.id}
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                {isRemoving === selectedSolution.id ? "Removing..." : "Remove Solution"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
}
