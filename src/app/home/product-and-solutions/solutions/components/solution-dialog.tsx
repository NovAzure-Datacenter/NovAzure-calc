"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Trash2, Edit, Send, Eye } from "lucide-react";

interface ExtendedSolution {
	id: string;
	selected_industry: string;
	selected_technology: string;
	solution_type: string;
	solution_variant: string;
	solution_name: string;
	solution_description: string;
	custom_solution_type: string;
	custom_solution_variant: string;
	parameters: any[];
	calculations: any[];
	status: "draft" | "pending" | "verified";
	created_by: string;
	client_id: string;
	created_at: Date;
	updated_at: Date;
	name: string;
	description: string;
	category: string;
	logo: React.ComponentType<{ className?: string }>;
	products: any[];
	parameterCount: number;
	calculationOverview: string;
}

interface SolutionDialogProps {
    solution: ExtendedSolution | null;
    isOpen: boolean;
    onClose: () => void;
    isEditMode?: boolean;
    onRemove?: (solutionId: string) => void;
    onEdit?: (solution: ExtendedSolution) => void;
    onSubmitForReview?: (solution: ExtendedSolution) => void;
    isRemoving?: string | null;
    isSubmitting?: boolean;
}

const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    verified: "bg-green-100 text-green-800",
    draft: "bg-gray-100 text-gray-800",
} as const;

export function SolutionDialog({
    solution,
    isOpen,
    onClose,
    isEditMode = false,
    onRemove,
    onEdit,
    onSubmitForReview,
    isRemoving,
    isSubmitting
}: SolutionDialogProps) {
    const [isConfirmingRemove, setIsConfirmingRemove] = useState(false);

    if (!solution) return null;

    const handleRemove = () => {
        setIsConfirmingRemove(true);
    };

    const handleEdit = () => {
        if (onEdit) {
            onEdit(solution);
        }
        onClose();
    };

    const handleSubmitForReview = () => {
        if (onSubmitForReview) {
            onSubmitForReview(solution);
        }
        onClose();
    };

    return (
        <>
            {/* Solution Detail Dialog */}
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="min-w-[900px] max-h-[85vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-3 text-xl">
                            <div className="flex items-center justify-center bg-gray-100 rounded-lg p-2">
                                <solution.logo className="h-6 w-6 text-gray-600" />
                            </div>
                            <div>
                                <div className="font-semibold">{solution.name}</div>
                                <div className="text-sm font-normal text-muted-foreground">
                                    {solution.category}
                                </div>
                            </div>
                        </DialogTitle>
                    </DialogHeader>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto px-6">
                        <div className="space-y-6 pt-4">
                            {/* Description Section */}
                            <div className="bg-muted/30 rounded-lg p-4">
                                <h4 className="font-semibold text-sm text-gray-900 mb-2">Description</h4>
                                <p className="text-sm text-gray-600 leading-relaxed">{solution.description}</p>
                            </div>
                            
                            {/* Key Information Grid */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-muted/30 rounded-lg p-3">
                                    <h4 className="font-medium text-sm text-gray-900 mb-1">Category</h4>
                                    <p className="text-sm text-gray-600">{solution.category}</p>
                                </div>
                                <div className="bg-muted/30 rounded-lg p-3">
                                    <h4 className="font-medium text-sm text-gray-900 mb-1">Status</h4>
                                    <Badge
                                        variant="outline"
                                        className={`text-xs px-2 py-1 ${
                                            statusColors[solution.status as keyof typeof statusColors]
                                        }`}
                                    >
                                        {solution.status}
                                    </Badge>
                                </div>
                                <div className="bg-muted/30 rounded-lg p-3">
                                    <h4 className="font-medium text-sm text-gray-900 mb-1">Parameter Count</h4>
                                    <p className="text-sm text-gray-600">{solution.parameterCount}</p>
                                </div>
                                <div className="bg-muted/30 rounded-lg p-3">
                                    <h4 className="font-medium text-sm text-gray-900 mb-1">Calculation Overview</h4>
                                    <p className="text-sm text-gray-600">{solution.calculationOverview}</p>
                                </div>
                            </div>

                            {/* Products Section */}
                            <div className="bg-muted/30 rounded-lg p-4">
                                <h4 className="font-semibold text-sm text-gray-900 mb-3">
                                    Products ({solution.products.length})
                                </h4>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    {solution.products.map((product) => (
                                        <div key={product.id} className="border rounded-lg p-4 bg-white">
                                            <div className="flex items-center justify-between mb-3">
                                                <h5 className="font-semibold text-sm">{product.name}</h5>
                                                <Badge
                                                    variant="outline"
                                                    className={`text-xs px-2 py-1 ${
                                                        statusColors[product.status as keyof typeof statusColors]
                                                    }`}
                                                >
                                                    {product.status}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-3 leading-relaxed">{product.description}</p>
                                            
                                            {/* Product Specifications */}
                                            <div className="grid grid-cols-2 gap-3 text-xs">
                                                <div className="space-y-1">
                                                    <div className="text-muted-foreground">Model</div>
                                                    <div className="font-medium">{product.model}</div>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="text-muted-foreground">Efficiency</div>
                                                    <div className="font-medium">{product.efficiency}</div>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="text-muted-foreground">Parameters</div>
                                                    <div className="font-medium">{product.parameterCount}</div>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="text-muted-foreground">Category</div>
                                                    <div className="font-medium">{product.category}</div>
                                                </div>
                                            </div>

                                            {/* Product Features */}
                                            {product.features.length > 0 && (
                                                <div className="mt-3">
                                                    <div className="text-xs text-muted-foreground mb-1">Key Features</div>
                                                    <div className="flex flex-wrap gap-1">
                                                        {product.features.slice(0, 4).map((feature: string, index: number) => (
                                                            <Badge key={index} variant="secondary" className="text-xs">
                                                                {feature}
                                                            </Badge>
                                                        ))}
                                                        {product.features.length > 4 && (
                                                            <Badge variant="outline" className="text-xs">
                                                                +{product.features.length - 4} more
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Specifications Section */}
                            {solution.products.length > 0 && (
                                <div className="bg-muted/30 rounded-lg p-4">
                                    <h4 className="font-semibold text-sm text-gray-900 mb-3">
                                        Technical Specifications
                                    </h4>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        {solution.products.map((product) => (
                                            <div key={product.id} className="bg-white rounded-lg p-4 border">
                                                <h5 className="font-medium text-sm mb-3">{product.name} - Specifications</h5>
                                                <div className="grid grid-cols-2 gap-3 text-xs">
                                                    <div className="space-y-1">
                                                        <div className="text-muted-foreground">Power Rating</div>
                                                        <div className="font-medium">{product.specifications.powerRating}</div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="text-muted-foreground">Cooling Capacity</div>
                                                        <div className="font-medium">{product.specifications.coolingCapacity}</div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="text-muted-foreground">Dimensions</div>
                                                        <div className="font-medium">{product.specifications.dimensions}</div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="text-muted-foreground">Weight</div>
                                                        <div className="font-medium">{product.specifications.weight}</div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="text-muted-foreground">Operating Temperature</div>
                                                        <div className="font-medium">{product.specifications.operatingTemperature}</div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="text-muted-foreground">Certifications</div>
                                                        <div className="font-medium">{product.specifications.certifications}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Dialog Footer - Always Visible */}
                    <DialogFooter className="flex items-center justify-between pt-6 border-t mt-6 flex-shrink-0">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Eye className="h-4 w-4" />
                            <span>Solution Details</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* Edit Button */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleEdit}
                                disabled={isRemoving === solution.id || isSubmitting}
                            >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                            </Button>

                            {/* Submit for Review Button (only for drafts) */}
                            {solution.status === "draft" && (
                                <Button
                                    variant="default"
                                    size="sm"
                                    onClick={handleSubmitForReview}
                                    disabled={isRemoving === solution.id || isSubmitting}
                                >
                                    <Send className="h-4 w-4 mr-2" />
                                    {isSubmitting ? "Submitting..." : "Submit for Review"}
                                </Button>
                            )}

                            {/* Remove Button */}
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleRemove}
                                disabled={isRemoving === solution.id || isSubmitting}
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                {isRemoving === solution.id ? "Removing..." : "Remove"}
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Confirmation Dialog for Remove */}
            {isConfirmingRemove && (
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
                                    <strong>"{solution.name}"</strong>?
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
                                disabled={isRemoving === solution.id}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={async () => {
                                    if (onRemove) {
                                        onRemove(solution.id);
                                    }
                                    setIsConfirmingRemove(false);
                                }}
                                size="sm"
                                variant="destructive"
                                disabled={isRemoving === solution.id}
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                {isRemoving === solution.id ? "Removing..." : "Remove Solution"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
} 