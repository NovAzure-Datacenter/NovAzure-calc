"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, RefreshCw, List, Grid3X3, Plus } from "lucide-react";
import { ProductsList } from "./products-list";
import { useRouter } from "next/navigation";

export function ProductsMain() {
	const router = useRouter();
	const [searchQuery, setSearchQuery] = useState("");
	const [viewMode, setViewMode] = useState<"table" | "grid">("table");
	const [isLoading, setIsLoading] = useState(false);

	const handleRefresh = () => {
		setIsLoading(true);
		// Simulate refresh
		setTimeout(() => {
			setIsLoading(false);
		}, 1000);
	};

	const handleCreateProduct = () => {
		router.push("/home/product-and-solutions/products/create");
	};

	return (
		<div className="space-y-4 max-w-full">
			{/* Header */}
			<Card className="w-full">
				<CardContent className="w-full p-4">
					<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
						<div className="relative flex-1 w-full">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search products..."
								value={searchQuery}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
									setSearchQuery(e.target.value)
								}
								className="pl-10 w-full"
							/>
						</div>
						<div className="flex items-center gap-2 w-full sm:w-auto">
							<Button
								variant="default"
								size="sm"
								onClick={handleCreateProduct}
								className="text-xs flex items-center gap-2"
							>
								<Plus className="h-4 w-4" />
								Create Product
							</Button>

							<Button
								variant="outline"
								size="sm"
								onClick={handleRefresh}
								className="text-xs"
								disabled={isLoading}
							>
								<RefreshCw className="h-4 w-4 mr-2" />
								Refresh
							</Button>

							<Button
								variant={viewMode === "grid" ? "default" : "outline"}
								size="sm"
								onClick={() => setViewMode("grid")}
							>
								<Grid3X3 className="h-4 w-4" />
							</Button>
							<Button
								variant={viewMode === "table" ? "default" : "outline"}
								size="sm"
								onClick={() => setViewMode("table")}
							>
								<List className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Products List */}
			<ProductsList searchQuery={searchQuery} viewMode={viewMode} />
		</div>
	);
}
