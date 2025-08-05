/**
 * AI-Powered Analysis System for Value Calculator Results
 * Intelligently analyzes calculation names and suggests appropriate visualizations
 */

import { formatCurrency, formatPercentage } from "./formatters";

// AI Analysis Types
export interface AIAnalysis {
	calculationName: string;
	suggestedVisualizations: VisualizationSuggestion[];
	confidence: number;
	reasoning: string;
	category: string;
	insights: string[];
}

export interface VisualizationSuggestion {
	type: 'pie-chart' | 'bar-chart' | 'line-chart' | 'area-chart' | 'radar-chart' | 'kpi-card' | 'data-table' | 'comparison-chart' | 'trend-chart' | 'distribution-chart';
	title: string;
	description: string;
	confidence: number;
	reasoning: string;
	priority: 'high' | 'medium' | 'low';
}

export interface AIDashboard {
	id: string;
	title: string;
	description: string;
	category: 'financial' | 'operational' | 'environmental' | 'infrastructure' | 'comprehensive';
	visualizations: AIVisualization[];
	priority: number;
	audience: 'executive' | 'analyst' | 'engineer';
}

export interface AIVisualization {
	id: string;
	type: string;
	title: string;
	description: string;
	data: any[];
	config: any;
	insights: string[];
}

// AI Analysis Patterns
const ANALYSIS_PATTERNS = {
	// Financial Patterns
	financial: {
		patterns: [
			{ keywords: ['cost', 'capex', 'opex', 'price', 'expense', 'investment'], category: 'financial' },
			{ keywords: ['roi', 'return', 'profit', 'revenue', 'savings'], category: 'financial' },
			{ keywords: ['budget', 'spending', 'expenditure'], category: 'financial' }
		],
		visualizations: [
			{ type: 'pie-chart', confidence: 0.9, reasoning: 'Cost breakdown visualization' },
			{ type: 'bar-chart', confidence: 0.8, reasoning: 'Cost comparison across categories' },
			{ type: 'kpi-card', confidence: 0.7, reasoning: 'Key financial metrics' }
		]
	},
	
	// Operational Patterns
	operational: {
		patterns: [
			{ keywords: ['power', 'energy', 'efficiency', 'performance', 'utilization'], category: 'operational' },
			{ keywords: ['capacity', 'throughput', 'output', 'productivity'], category: 'operational' },
			{ keywords: ['maintenance', 'uptime', 'availability', 'reliability'], category: 'operational' }
		],
		visualizations: [
			{ type: 'bar-chart', confidence: 0.9, reasoning: 'Performance metrics comparison' },
			{ type: 'line-chart', confidence: 0.8, reasoning: 'Trend analysis over time' },
			{ type: 'radar-chart', confidence: 0.7, reasoning: 'Multi-dimensional performance view' }
		]
	},
	
	// Environmental Patterns
	environmental: {
		patterns: [
			{ keywords: ['carbon', 'co2', 'emission', 'footprint', 'environmental'], category: 'environmental' },
			{ keywords: ['water', 'consumption', 'waste', 'sustainability'], category: 'environmental' },
			{ keywords: ['green', 'renewable', 'clean'], category: 'environmental' }
		],
		visualizations: [
			{ type: 'area-chart', confidence: 0.9, reasoning: 'Environmental impact over time' },
			{ type: 'radar-chart', confidence: 0.8, reasoning: 'Environmental metrics comparison' },
			{ type: 'kpi-card', confidence: 0.7, reasoning: 'Key environmental indicators' }
		]
	},
	
	// Infrastructure Patterns
	infrastructure: {
		patterns: [
			{ keywords: ['rack', 'server', 'infrastructure', 'capacity', 'space'], category: 'infrastructure' },
			{ keywords: ['cooling', 'heating', 'thermal', 'temperature'], category: 'infrastructure' },
			{ keywords: ['network', 'connectivity', 'bandwidth'], category: 'infrastructure' }
		],
		visualizations: [
			{ type: 'bar-chart', confidence: 0.9, reasoning: 'Infrastructure capacity comparison' },
			{ type: 'data-table', confidence: 0.8, reasoning: 'Detailed infrastructure metrics' },
			{ type: 'kpi-card', confidence: 0.7, reasoning: 'Key infrastructure indicators' }
		]
	}
};

// AI Analysis Functions
export function analyzeCalculation(calculation: any): AIAnalysis {
	const name = calculation.name.toLowerCase();
	const result = calculation.result;
	const units = calculation.units;
	
	// Determine category and patterns
	let category = 'other';
	let matchedPatterns = [];
	let confidence = 0;
	let reasoning = '';
	
	// Analyze against all patterns
	for (const [cat, pattern] of Object.entries(ANALYSIS_PATTERNS)) {
		for (const p of pattern.patterns) {
			const matchCount = p.keywords.filter(keyword => name.includes(keyword)).length;
			if (matchCount > 0) {
				category = p.category;
				matchedPatterns.push({ pattern: p, matchCount });
				confidence = Math.max(confidence, matchCount / p.keywords.length);
			}
		}
	}
	
	// Generate visualization suggestions
	const suggestions = generateVisualizationSuggestions(name, category, result, units, confidence);
	
	// Generate insights
	const insights = generateInsights(name, result, units, category);
	
	reasoning = `Analysis of "${calculation.name}" suggests ${category} category with ${(confidence * 100).toFixed(0)}% confidence based on keyword matching.`;
	
	return {
		calculationName: calculation.name,
		suggestedVisualizations: suggestions,
		confidence,
		reasoning,
		category,
		insights
	};
}

export function generateVisualizationSuggestions(
	name: string, 
	category: string, 
	result: any, 
	units: string, 
	confidence: number
): VisualizationSuggestion[] {
	const suggestions: VisualizationSuggestion[] = [];
	
	// Get category-specific visualizations
	const categoryPatterns = ANALYSIS_PATTERNS[category as keyof typeof ANALYSIS_PATTERNS];
	if (categoryPatterns) {
		for (const viz of categoryPatterns.visualizations) {
			suggestions.push({
				type: viz.type as any,
				title: generateVisualizationTitle(name, viz.type),
				description: generateVisualizationDescription(name, viz.type, category),
				confidence: viz.confidence * confidence,
				reasoning: viz.reasoning,
				priority: determinePriority(viz.confidence * confidence, category)
			});
		}
	}
	
	// Add universal suggestions based on data characteristics
	if (typeof result === 'number' && result > 0) {
		suggestions.push({
			type: 'kpi-card',
			title: `${name} KPI`,
			description: `Key performance indicator for ${name}`,
			confidence: 0.6,
			reasoning: 'Numeric value suitable for KPI display',
			priority: 'medium'
		});
	}
	
	// Sort by confidence and priority
	return suggestions
		.sort((a, b) => b.confidence - a.confidence)
		.slice(0, 3); // Top 3 suggestions
}

export function generateInsights(name: string, result: any, units: string, category: string): string[] {
	const insights: string[] = [];
	const numericValue = typeof result === 'number' ? result : parseFloat(result);
	
	if (isNaN(numericValue)) {
		insights.push(`Unable to analyze "${name}" - result is not numeric`);
		return insights;
	}
	
	// Category-specific insights
	switch (category) {
		case 'financial':
			if (name.includes('cost') || name.includes('capex') || name.includes('opex')) {
				insights.push(`This represents a ${name.includes('capex') ? 'capital' : 'operational'} expense`);
				if (numericValue > 1000000) {
					insights.push('High-value cost item requiring executive attention');
				}
			}
			if (name.includes('roi') || name.includes('return')) {
				insights.push(`Return on investment analysis shows ${numericValue > 0 ? 'positive' : 'negative'} returns`);
			}
			break;
			
		case 'operational':
			if (name.includes('efficiency') || name.includes('performance')) {
				const efficiency = numericValue;
				if (efficiency > 0.8) {
					insights.push('High efficiency performance');
				} else if (efficiency < 0.5) {
					insights.push('Low efficiency - improvement opportunity identified');
				}
			}
			if (name.includes('power') || name.includes('energy')) {
				insights.push(`Energy consumption metric: ${formatCurrency(numericValue)} ${units || 'units'}`);
			}
			break;
			
		case 'environmental':
			if (name.includes('carbon') || name.includes('co2')) {
				insights.push(`Environmental impact: ${formatCurrency(numericValue)} ${units || 'tons CO2'}`);
			}
			if (name.includes('water')) {
				insights.push(`Water consumption: ${formatCurrency(numericValue)} ${units || 'liters'}`);
			}
			break;
	}
	
	// General insights
	if (numericValue === 0) {
		insights.push('Zero value detected - may indicate missing data or calculation error');
	}
	
	if (numericValue < 0) {
		insights.push('Negative value detected - may indicate cost savings or reduction');
	}
	
	return insights;
}

export function generateVisualizationTitle(name: string, type: string): string {
	const cleanName = name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
	
	switch (type) {
		case 'pie-chart':
			return `${cleanName} Breakdown`;
		case 'bar-chart':
			return `${cleanName} Comparison`;
		case 'line-chart':
			return `${cleanName} Trends`;
		case 'area-chart':
			return `${cleanName} Over Time`;
		case 'radar-chart':
			return `${cleanName} Analysis`;
		case 'kpi-card':
			return `${cleanName} KPI`;
		case 'data-table':
			return `${cleanName} Details`;
		default:
			return cleanName;
	}
}

export function generateVisualizationDescription(name: string, type: string, category: string): string {
	switch (type) {
		case 'pie-chart':
			return `Shows the distribution and proportions of ${name.toLowerCase()} across different categories`;
		case 'bar-chart':
			return `Compares ${name.toLowerCase()} values across different categories or time periods`;
		case 'line-chart':
			return `Displays trends and patterns in ${name.toLowerCase()} over time`;
		case 'area-chart':
			return `Shows cumulative ${name.toLowerCase()} and its progression over time`;
		case 'radar-chart':
			return `Multi-dimensional view of ${name.toLowerCase()} across different metrics`;
		case 'kpi-card':
			return `Key performance indicator for ${name.toLowerCase()}`;
		case 'data-table':
			return `Detailed tabular view of ${name.toLowerCase()} data`;
		default:
			return `Visualization of ${name.toLowerCase()}`;
	}
}

export function determinePriority(confidence: number, category: string): 'high' | 'medium' | 'low' {
	if (confidence > 0.8) return 'high';
	if (confidence > 0.5) return 'medium';
	return 'low';
}

// Dashboard Generation
export function generateAIDashboards(calculations: any[], parameters: any[]): AIDashboard[] {
	const dashboards: AIDashboard[] = [];
	
	// Analyze all calculations
	const analyses = calculations.map(analyzeCalculation);
	
	// Group by category
	const categoryGroups = analyses.reduce((groups, analysis) => {
		if (!groups[analysis.category]) {
			groups[analysis.category] = [];
		}
		groups[analysis.category].push(analysis);
		return groups;
	}, {} as Record<string, AIAnalysis[]>);
	
	// Generate category-specific dashboards
	for (const [category, analyses] of Object.entries(categoryGroups)) {
		if (analyses.length > 0) {
			const dashboard = createCategoryDashboard(category, analyses);
			dashboards.push(dashboard);
		}
	}
	
	// Generate comprehensive dashboard
	if (calculations.length > 0) {
		const comprehensiveDashboard = createComprehensiveDashboard(analyses);
		dashboards.push(comprehensiveDashboard);
	}
	
	return dashboards.sort((a, b) => b.priority - a.priority);
}

export function createCategoryDashboard(category: string, analyses: AIAnalysis[]): AIDashboard {
	const title = `${category.charAt(0).toUpperCase() + category.slice(1)} Analysis`;
	const visualizations: AIVisualization[] = [];
	
	// Create visualizations based on top suggestions
	const topSuggestions = analyses
		.flatMap(a => a.suggestedVisualizations)
		.sort((a, b) => b.confidence - a.confidence)
		.slice(0, 4);
	
	for (const suggestion of topSuggestions) {
		visualizations.push({
			id: `viz-${Date.now()}-${Math.random()}`,
			type: suggestion.type,
			title: suggestion.title,
			description: suggestion.description,
			data: [], // Will be populated by component
			config: {},
			insights: analyses.flatMap(a => a.insights).slice(0, 3)
		});
	}
	
	return {
		id: `dashboard-${category}-${Date.now()}`,
		title,
		description: `AI-generated ${category} analysis dashboard with ${visualizations.length} visualizations`,
		category: category as any,
		visualizations,
		priority: analyses.reduce((sum, a) => sum + a.confidence, 0) / analyses.length,
		audience: category === 'financial' ? 'executive' : category === 'operational' ? 'analyst' : 'engineer'
	};
}

export function createComprehensiveDashboard(analyses: AIAnalysis[]): AIDashboard {
	const title = "Comprehensive Analysis";
	const visualizations: AIVisualization[] = [];
	
	// Create a mix of different visualization types
	const allSuggestions = analyses
		.flatMap(a => a.suggestedVisualizations)
		.sort((a, b) => b.confidence - a.confidence);
	
	// Ensure variety in visualization types
	const usedTypes = new Set<string>();
	for (const suggestion of allSuggestions) {
		if (usedTypes.size >= 6) break; // Max 6 visualizations
		if (!usedTypes.has(suggestion.type)) {
			usedTypes.add(suggestion.type);
			visualizations.push({
				id: `viz-${Date.now()}-${Math.random()}`,
				type: suggestion.type,
				title: suggestion.title,
				description: suggestion.description,
				data: [],
				config: {},
				insights: analyses.flatMap(a => a.insights).slice(0, 2)
			});
		}
	}
	
	return {
		id: `dashboard-comprehensive-${Date.now()}`,
		title,
		description: "AI-generated comprehensive analysis with multiple visualization types",
		category: 'comprehensive',
		visualizations,
		priority: 0.8,
		audience: 'executive'
	};
}

// AI Recommendations
export function generateAIRecommendations(calculations: any[], parameters: any[]): string[] {
	const recommendations: string[] = [];
	
	// Analyze calculations for patterns
	const analyses = calculations.map(analyzeCalculation);
	
	// Financial recommendations
	const financialAnalyses = analyses.filter(a => a.category === 'financial');
	if (financialAnalyses.length > 0) {
		const totalCost = financialAnalyses
			.filter(a => a.calculationName.toLowerCase().includes('cost'))
			.reduce((sum, a) => sum + (parseFloat(a.calculationName) || 0), 0);
		
		if (totalCost > 0) {
			recommendations.push(`Total cost analysis shows ${formatCurrency(totalCost)} in expenses`);
		}
	}
	
	// Operational recommendations
	const operationalAnalyses = analyses.filter(a => a.category === 'operational');
	if (operationalAnalyses.length > 0) {
		const efficiencyMetrics = operationalAnalyses.filter(a => 
			a.calculationName.toLowerCase().includes('efficiency')
		);
		if (efficiencyMetrics.length > 0) {
			recommendations.push(`${efficiencyMetrics.length} efficiency metrics detected - consider performance optimization`);
		}
	}
	
	// Environmental recommendations
	const environmentalAnalyses = analyses.filter(a => a.category === 'environmental');
	if (environmentalAnalyses.length > 0) {
		recommendations.push(`${environmentalAnalyses.length} environmental impact metrics available for sustainability analysis`);
	}
	
	// General recommendations
	if (calculations.length === 0) {
		recommendations.push("No calculation results available - check data sources and calculation formulas");
	}
	
	if (calculations.some(c => c.result === "Error")) {
		recommendations.push("Some calculations returned errors - review input parameters and formulas");
	}
	
	return recommendations;
}
