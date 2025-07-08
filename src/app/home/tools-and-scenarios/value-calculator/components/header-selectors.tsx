"use client";

import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Industry, Technology, Solution, Product } from "../types/types";

// API Functions
async function fetchIndustries(): Promise<Industry[]> {
  try {
    const response = await fetch('/api/value-calculator/industries');
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch industries');
    }
    
    return result.data as Industry[];
  } catch (error) {
    console.error('Error fetching industries:', error);
    throw error;
  }
}

async function fetchTechnologies(industryId: string): Promise<Technology[]> {
  try {
    const response = await fetch(`/api/value-calculator/technologies?industryId=${encodeURIComponent(industryId)}`);
    const result = await response.json();
    console.log('fetchTechnologies response:', result);
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch technologies');
    }
    
    return result.data as Technology[];
  } catch (error) {
    console.error('Error fetching technologies:', error);
    throw error;
  }
}

async function fetchSolutions(industryId: string, technologyId: string): Promise<Solution[]> {
  try {
    const response = await fetch(`/api/value-calculator/solutions?technologyId=${encodeURIComponent(technologyId)}`);
    const result = await response.json();
    console.log('fetchSolutions response:', result);
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch solutions');
    }
    
    return result.data as Solution[];
  } catch (error) {
    console.error('Error fetching solutions:', error);
    throw error;
  }
}

async function fetchProducts(industryId: string, technologyId: string, solutionId: string): Promise<Product[]> {
  try {
    const response = await fetch(`/api/value-calculator/products?solutionId=${encodeURIComponent(solutionId)}`);
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch products');
    }
    
    return result.data as Product[];
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

interface HeaderSelectorsProps {
    selectedIndustry: string;
    setSelectedIndustry: (value: string) => void;
    selectedTechnology: string;
    setSelectedTechnology: (value: string) => void;
    selectedSolution: string;
    setSelectedSolution: (value: string) => void;
    selectedProduct: string;
    setSelectedProduct: (value: string) => void;
}

export function HeaderSelectors({
    selectedIndustry,
    setSelectedIndustry,
    selectedTechnology,
    setSelectedTechnology,
    selectedSolution,
    setSelectedSolution,
    selectedProduct,
    setSelectedProduct,
}: HeaderSelectorsProps) {
    
    const [industries, setIndustries] = useState<Industry[]>([]);
    const [technologies, setTechnologies] = useState<Technology[]>([]);
    const [solutions, setSolutions] = useState<Solution[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    
    const [loading, setLoading] = useState({
        industries: false,
        technologies: false,
        solutions: false,
        products: false,
    });

    // Simple handlers that just pass the ID directly
    const handleIndustryChange = (value: string) => {
        // Find the selected industry to log its details
        const selectedIndustryObj = industries.find(i => {
            const idToCheck = i.id || (i as { _id?: string })._id;
            return idToCheck === value;
        });
        console.log('Selected industry object:', selectedIndustryObj);
        setSelectedIndustry(value);
    };

    const handleTechnologyChange = (value: string) => {
        console.log('Technology selected:', value);
        setSelectedTechnology(value);
    };

    const handleSolutionChange = (value: string) => {
        console.log('Solution selected:', value);
        setSelectedSolution(value);
    };

    const handleProductChange = (value: string) => {
        console.log('Product selected:', value);
        setSelectedProduct(value);
    };

    // Fetch industries on component mount
    useEffect(() => {
        const loadIndustries = async () => {
            setLoading(prev => ({ ...prev, industries: true }));
            try {
                const data = await fetchIndustries();
                setIndustries(data);
            } catch (error) {
                console.error('Failed to load industries:', error);
                setIndustries([]);
            } finally {
                setLoading(prev => ({ ...prev, industries: false }));
            }
        };

        loadIndustries();
    }, []);

    // Fetch technologies when industry changes
    useEffect(() => {
        const loadTechnologies = async () => {
            console.log('loadTechnologies: selectedIndustry =', selectedIndustry);
            if (!selectedIndustry) {
                console.log('No industry selected, clearing technologies');
                setTechnologies([]);
                return;
            }

            setLoading(prev => ({ ...prev, technologies: true }));
            try {
                console.log('Fetching technologies for industry:', selectedIndustry);
                const data = await fetchTechnologies(selectedIndustry);
                setTechnologies(data);
            } catch (error) {
                console.error('Failed to load technologies:', error);
                setTechnologies([]);
            } finally {
                setLoading(prev => ({ ...prev, technologies: false }));
            }
        };

        loadTechnologies();
        // Reset downstream selections
        setSelectedTechnology("");
        setSelectedSolution("");
        setSelectedProduct("");
    }, [selectedIndustry, setSelectedTechnology, setSelectedSolution, setSelectedProduct]);

    // Fetch solutions when technology changes
    useEffect(() => {
        const loadSolutions = async () => {
            if (!selectedIndustry || !selectedTechnology) {
                setSolutions([]);
                return;
            }

            setLoading(prev => ({ ...prev, solutions: true }));
            try {
                const data = await fetchSolutions(selectedIndustry, selectedTechnology);
                setSolutions(data);
            } catch (error) {
                console.error('Failed to load solutions:', error);
                setSolutions([]);
            } finally {
                setLoading(prev => ({ ...prev, solutions: false }));
            }
        };

        loadSolutions();
        // Reset downstream selections
        setSelectedSolution("");
        setSelectedProduct("");
    }, [selectedIndustry, selectedTechnology, setSelectedSolution, setSelectedProduct]);

    // Fetch products when solution changes
    useEffect(() => {
        const loadProducts = async () => {
            if (!selectedIndustry || !selectedTechnology || !selectedSolution) {
                setProducts([]);
                return;
            }

            setLoading(prev => ({ ...prev, products: true }));
            try {
                const data = await fetchProducts(selectedIndustry, selectedTechnology, selectedSolution);
                setProducts(data);
            } catch (error) {
                console.error('Failed to load products:', error);
                setProducts([]);
            } finally {
                setLoading(prev => ({ ...prev, products: false }));
            }
        };

        loadProducts();
        // Reset downstream selection
        setSelectedProduct("");
    }, [selectedIndustry, selectedTechnology, selectedSolution, setSelectedProduct]);

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Value Calculator Configuration
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Industry Selector */}
                <div className="space-y-2 min-w-0">
                    <Label htmlFor="industry">Industry</Label>
                    <Select value={selectedIndustry} onValueChange={handleIndustryChange}>
                        <SelectTrigger id="industry" className="w-full">
                            <SelectValue placeholder={loading.industries ? "Loading..." : "Select Industry"} />
                        </SelectTrigger>
                        <SelectContent className="max-w-[300px]">
                            {industries.map((industry) => {
                                // Handle both id and _id fields from MongoDB
                                const industryId = industry.id || (industry as { _id?: string })._id || '';
                                return (
                                    <SelectItem key={industryId} value={industryId} className="max-w-[280px]">
                                        <div className="flex items-center">
                                            <span className="truncate" title={industry.name}>
                                                {industry.name}
                                            </span>
                                        </div>
                                    </SelectItem>
                                );
                            })}
                        </SelectContent>
                    </Select>
                </div>

                {/* Technology Selector */}
                <div className="space-y-2 min-w-0">
                    <Label htmlFor="technology">Technology</Label>
                    <Select 
                        value={selectedTechnology} 
                        onValueChange={handleTechnologyChange}
                        disabled={!selectedIndustry || loading.technologies}
                    >
                        <SelectTrigger id="technology" className="w-full">
                            <SelectValue placeholder={
                                !selectedIndustry 
                                    ? "Select Industry First" 
                                    : loading.technologies 
                                        ? "Loading..." 
                                        : "Select Technology"
                            } />
                        </SelectTrigger>
                        <SelectContent className="max-w-[300px]">
                            {technologies.map((tech) => (
                                <SelectItem key={tech.id} value={tech.id} className="max-w-[280px]">
                                    <span className="truncate" title={tech.name}>
                                        {tech.name}
                                    </span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Solution Selector */}
                <div className="space-y-2 min-w-0">
                    <Label htmlFor="solution">Solution</Label>
                    <Select 
                        value={selectedSolution} 
                        onValueChange={handleSolutionChange}
                        disabled={!selectedTechnology || loading.solutions}
                    >
                        <SelectTrigger id="solution" className="w-full">
                            <SelectValue placeholder={
                                !selectedTechnology 
                                    ? "Select Technology First" 
                                    : loading.solutions 
                                        ? "Loading..." 
                                        : "Select Solution"
                            } />
                        </SelectTrigger>
                        <SelectContent className="max-w-[300px]">
                            {solutions.map((solution) => (
                                <SelectItem key={solution.id} value={solution.id} className="max-w-[280px]">
                                    <span className="truncate" title={solution.name}>
                                        {solution.name}
                                    </span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Product Selector */}
                <div className="space-y-2 min-w-0">
                    <Label htmlFor="product">Product</Label>
                    <Select 
                        value={selectedProduct} 
                        onValueChange={handleProductChange}
                        disabled={!selectedSolution || loading.products}
                    >
                        <SelectTrigger id="product" className="w-full">
                            <SelectValue placeholder={
                                !selectedSolution 
                                    ? "Select Solution First" 
                                    : loading.products 
                                        ? "Loading..." 
                                        : "Select Product"
                            } />
                        </SelectTrigger>
                        <SelectContent className="max-w-[300px]">
                            {products.map((product) => (
                                <SelectItem key={product.id} value={product.id} className="max-w-[280px]">
                                    <span className="truncate" title={product.name}>
                                        {product.name}
                                    </span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}
