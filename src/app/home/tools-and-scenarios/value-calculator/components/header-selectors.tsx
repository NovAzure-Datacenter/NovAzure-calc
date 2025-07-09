"use client";

import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Industry, Technology, Solution, SolutionVariant } from "../types/types";

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
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch solutions');
    }
    
    return result.data as Solution[];
  } catch (error) {
    console.error('Error fetching solutions:', error);
    throw error;
  }
}

async function fetchSolutionVariants(solutionId: string): Promise<SolutionVariant[]> {
  try {
    const response = await fetch(`/api/value-calculator/solution-variants?solutionId=${encodeURIComponent(solutionId)}`);
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch solution variants');
    }
    
    return result.data as SolutionVariant[];
  } catch (error) {
    console.error('Error fetching solution variants:', error);
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
    selectedSolutionVariant: string;
    setSelectedSolutionVariant: (value: string) => void;
    onSolutionInfoChange?: (solutionInfo: {name: string, description?: string} | null) => void;
}

export function HeaderSelectors({
    selectedIndustry,
    setSelectedIndustry,
    selectedTechnology,
    setSelectedTechnology,
    selectedSolution,
    setSelectedSolution,
    selectedSolutionVariant,
    setSelectedSolutionVariant,
    onSolutionInfoChange,
}: HeaderSelectorsProps) {
    
    const [industries, setIndustries] = useState<Industry[]>([]);
    const [technologies, setTechnologies] = useState<Technology[]>([]);
    const [solutions, setSolutions] = useState<Solution[]>([]);
    const [solutionVariants, setSolutionVariants] = useState<SolutionVariant[]>([]);
    
    const [loading, setLoading] = useState({
        industries: false,
        technologies: false,
        solutions: false,
        solutionVariants: false,
    });

    // Simple handlers that just pass the ID directly
    const handleIndustryChange = (value: string) => {
        setSelectedIndustry(value);
    };

    const handleTechnologyChange = (value: string) => {
        setSelectedTechnology(value);
    };

    const handleSolutionChange = (value: string) => {
        setSelectedSolution(value);
        
        // Find the selected solution info and pass it back
        if (onSolutionInfoChange) {
            const selectedSolutionObj = solutions.find(sol => sol.id === value);
            if (selectedSolutionObj) {
                onSolutionInfoChange({
                    name: selectedSolutionObj.name,
                    description: selectedSolutionObj.description
                });
            } else {
                onSolutionInfoChange(null);
            }
        }
    };

    const handleSolutionVariantChange = (value: string) => {
        setSelectedSolutionVariant(value);
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
            if (!selectedIndustry) {
                console.log('No industry selected, clearing technologies');
                setTechnologies([]);
                return;
            }

            setLoading(prev => ({ ...prev, technologies: true }));
            try {
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
        setSelectedSolutionVariant("");
    }, [selectedIndustry]);

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
        setSelectedSolutionVariant("");
    }, [selectedIndustry, selectedTechnology]);

    // Fetch solution variants when solution changes
    useEffect(() => {
        const loadSolutionVariants = async () => {
            if (!selectedSolution) {
                setSolutionVariants([]);
                return;
            }

            setLoading(prev => ({ ...prev, solutionVariants: true }));
            try {
                const data = await fetchSolutionVariants(selectedSolution);
                setSolutionVariants(data);
            } catch (error) {
                console.error('Failed to load solution variants:', error);
                setSolutionVariants([]);
            } finally {
                setLoading(prev => ({ ...prev, solutionVariants: false }));
            }
        };

        loadSolutionVariants();
        // Reset downstream selection
        setSelectedSolutionVariant("");
    }, [selectedSolution]);

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

                {/* Solution Variant Selector */}
                <div className="space-y-2 min-w-0">
                    <Label htmlFor="solutionVariant">Solution Variant</Label>
                    <Select 
                        value={selectedSolutionVariant} 
                        onValueChange={handleSolutionVariantChange}
                        disabled={!selectedSolution || loading.solutionVariants}
                    >
                        <SelectTrigger id="solutionVariant" className="w-full">
                            <SelectValue placeholder={
                                !selectedSolution 
                                    ? "Select Solution First" 
                                    : loading.solutionVariants 
                                        ? "Loading..." 
                                        : "Select Solution Variant"
                            } />
                        </SelectTrigger>
                        <SelectContent className="max-w-[300px]">
                            {solutionVariants.map((variant) => (
                                <SelectItem key={variant.id} value={variant.id} className="max-w-[280px]">
                                    <span className="truncate" title={variant.name}>
                                        {variant.name}
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
