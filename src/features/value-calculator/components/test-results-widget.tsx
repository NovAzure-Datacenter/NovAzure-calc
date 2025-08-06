"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
	Plus, 
	Settings, 
	Eye, 
	EyeOff, 
	Download, 
	Share2, 
	RefreshCw,
	Grid,
	BarChart3,
	PieChart as PieChartIcon,
	Target,
	Activity,
	TrendingUp,
	Info,
	X,
	Edit3,
	Trash2,
	Copy,
	Maximize2,
	Minimize2
} from "lucide-react";
import { 
	WidgetConfig, 
	WidgetType, 
	WIDGET_TYPES, 
	createWidget, 
	renderWidget,
	categorizeData,
	DataSource,
	extractNumericValue
} from "../utils/widgets";
import { formatCurrency } from "../utils/formatters";

/**
 * TestResultsWidget - Dynamic Widget Dashboard
 * Allows users to create, configure, and manage custom dashboard widgets
 */
export default function TestResultsWidget({ solutionData }: { solutionData: any }) {
	const [widgets, setWidgets] = useState<WidgetConfig[]>([]);
	const [isEditing, setIsEditing] = useState(false);
	const [showAddWidget, setShowAddWidget] = useState(false);
	const [selectedWidgetType, setSelectedWidgetType] = useState<WidgetType>('kpi-card');
	const [newWidgetTitle, setNewWidgetTitle] = useState('');
	const [editingWidget, setEditingWidget] = useState<WidgetConfig | null>(null);

	// Process solution data into widget-compatible format
	const processedData: DataSource = useMemo(() => {
		if (!solutionData) return { calculations: [], parameters: [] };

		return {
			calculations: solutionData.calculations?.map((calc: any) => ({
				name: calc.name,
				result: calc.result,
				units: calc.units,
				category: calc.category
			})) || [],
			parameters: solutionData.parameters?.map((param: any) => ({
				name: param.name,
				test_value: param.test_value,
				units: param.unit,
				category: param.category
			})) || [],
			derived: []
		};
	}, [solutionData]);

	// Categorize available data
	const categorizedData = useMemo(() => categorizeData(processedData), [processedData]);

	// Generate suggested widgets based on available data
	const suggestedWidgets = useMemo(() => {
		const suggestions: Array<{ type: WidgetType; title: string; dataSource: any }> = [];

		// Financial widgets
		if (categorizedData.financial.length > 0) {
			suggestions.push({
				type: 'kpi-card',
				title: 'Financial Overview',
				dataSource: { calculations: ['cost', 'capex', 'opex'] }
			});
			suggestions.push({
				type: 'pie-chart',
				title: 'Cost Breakdown',
				dataSource: { calculations: ['cost', 'capex', 'opex'] }
			});
		}

		// Operational widgets
		if (categorizedData.operational.length > 0) {
			suggestions.push({
				type: 'bar-chart',
				title: 'Performance Metrics',
				dataSource: { calculations: ['power', 'energy', 'efficiency'] }
			});
		}

		// Environmental widgets
		if (categorizedData.environmental.length > 0) {
			suggestions.push({
				type: 'radar-chart',
				title: 'Environmental Impact',
				dataSource: { calculations: ['carbon', 'water', 'emission'] }
			});
		}

		// Data table for all metrics
		if (processedData.calculations.length > 0 || processedData.parameters.length > 0) {
			suggestions.push({
				type: 'data-table',
				title: 'All Metrics',
				dataSource: { calculations: [], parameters: [] }
			});
		}

		return suggestions;
	}, [categorizedData, processedData]);

	// Add new widget
	const handleAddWidget = () => {
		if (!newWidgetTitle.trim()) return;

		// Auto-select relevant data sources based on widget type
		const initialDataSource: { calculations: string[]; parameters: string[] } = { calculations: [], parameters: [] };
		
		if (selectedWidgetType === 'kpi-card') {
			// For KPI cards, select the first available calculation
			const firstCalculation = processedData.calculations.find(calc => extractNumericValue(calc.result) > 0);
			if (firstCalculation) {
				initialDataSource.calculations = [firstCalculation.name];
			}
		} else if (selectedWidgetType === 'pie-chart' || selectedWidgetType === 'bar-chart') {
			// For charts, select financial calculations
			const financialCalculations = processedData.calculations.filter(calc => 
				calc.name.toLowerCase().includes('cost') || 
				calc.name.toLowerCase().includes('capex') || 
				calc.name.toLowerCase().includes('opex')
			);
			initialDataSource.calculations = financialCalculations.slice(0, 3).map(calc => calc.name);
		} else if (selectedWidgetType === 'data-table') {
			// For data tables, select all available data
			initialDataSource.calculations = processedData.calculations.map(calc => calc.name);
			initialDataSource.parameters = processedData.parameters.map(param => param.name);
		}

		const newWidget = createWidget(selectedWidgetType, newWidgetTitle, initialDataSource);

		setWidgets(prev => [...prev, newWidget]);
		setNewWidgetTitle('');
		setShowAddWidget(false);
	};

	// Delete widget
	const handleDeleteWidget = (widgetId: string) => {
		setWidgets(prev => prev.filter(w => w.id !== widgetId));
	};

	// Update widget configuration
	const handleWidgetConfigChange = (widgetId: string, updates: Partial<WidgetConfig>) => {
		console.log('Updating widget:', widgetId, 'with updates:', updates);
		setWidgets(prev => prev.map(w => 
			w.id === widgetId ? { ...w, ...updates } : w
		));
	};

	// Toggle widget visibility
	const handleToggleWidgetVisibility = (widgetId: string) => {
		setWidgets(prev => prev.map(w => 
			w.id === widgetId ? { ...w, isVisible: !w.isVisible } : w
		));
	};

	// Auto-generate initial widgets if none exist
	useEffect(() => {
		if (widgets.length === 0 && suggestedWidgets.length > 0) {
			const initialWidgets = suggestedWidgets.slice(0, 3).map(suggestion => 
				createWidget(suggestion.type, suggestion.title, suggestion.dataSource)
			);
			setWidgets(initialWidgets);
		}
	}, [widgets.length, suggestedWidgets]);

	if (!solutionData) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="text-center">
					<Info className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
					<p className="text-muted-foreground">No solution data available</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Dashboard Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">
						{solutionData.solution_name || "Solution Analysis"}
					</h1>
					<p className="text-gray-600">
						{solutionData.solution_description || "Dynamic dashboard with customizable widgets"}
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => setIsEditing(!isEditing)}
					>
						{isEditing ? <EyeOff className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
						{isEditing ? 'View' : 'Edit'}
					</Button>
					<Button variant="outline" size="sm">
						<Download className="h-4 w-4" />
					</Button>
					<Button variant="outline" size="sm">
						<Share2 className="h-4 w-4" />
					</Button>
				</div>
			</div>

			{/* Widget Controls */}
			{isEditing && (
				<div className="bg-gray-50 rounded-lg p-4">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-lg font-medium">Dashboard Controls</h3>
						<Dialog open={showAddWidget} onOpenChange={setShowAddWidget}>
							<DialogTrigger asChild>
								<Button size="sm">
									<Plus className="h-4 w-4 mr-2" />
									Add Widget
								</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Add New Widget</DialogTitle>
								</DialogHeader>
								<div className="space-y-4">
									<div>
										<Label>Widget Type</Label>
										<Select value={selectedWidgetType} onValueChange={(value: WidgetType) => setSelectedWidgetType(value)}>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{Object.entries(WIDGET_TYPES).map(([type, info]) => (
													<SelectItem key={type} value={type}>
														<div className="flex items-center gap-2">
															<info.icon className="h-4 w-4" />
															{info.name}
														</div>
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
									<div>
										<Label>Widget Title</Label>
										<Input
											value={newWidgetTitle}
											onChange={(e) => setNewWidgetTitle(e.target.value)}
											placeholder="Enter widget title"
										/>
									</div>
									<div className="flex justify-end gap-2">
										<Button variant="outline" onClick={() => setShowAddWidget(false)}>
											Cancel
										</Button>
										<Button onClick={handleAddWidget}>
											Add Widget
										</Button>
									</div>
								</div>
							</DialogContent>
						</Dialog>
					</div>

					{/* Available Data Summary */}
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						{Object.entries(categorizedData).map(([category, items]) => (
							<div key={category} className="text-center">
								<div className="text-2xl font-bold text-blue-600">{items.length}</div>
								<div className="text-sm text-gray-600 capitalize">{category}</div>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Widget Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{widgets.filter(w => w.isVisible).map((widget) => (
					<div key={widget.id} className="relative">
						{isEditing && (
							<div className="absolute top-2 right-2 z-10 flex items-center gap-1">
								<Button
									variant="secondary"
									size="sm"
									onClick={() => handleToggleWidgetVisibility(widget.id)}
								>
									<EyeOff className="h-3 w-3" />
								</Button>
								<Button
									variant="secondary"
									size="sm"
									onClick={() => setEditingWidget(widget)}
								>
									<Settings className="h-3 w-3" />
								</Button>
								<Button
									variant="destructive"
									size="sm"
									onClick={() => handleDeleteWidget(widget.id)}
								>
									<Trash2 className="h-3 w-3" />
								</Button>
							</div>
						)}
						{renderWidget(widget, processedData, { isEditing })}
					</div>
				))}
			</div>

			{/* Empty State */}
			{widgets.filter(w => w.isVisible).length === 0 && (
				<div className="flex items-center justify-center h-64">
					<div className="text-center">
						<Grid className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
						<p className="text-muted-foreground">No widgets configured</p>
						<p className="text-sm text-gray-500 mt-2">
							Click "Add Widget" to start building your dashboard
						</p>
					</div>
				</div>
			)}

			{/* Widget Configuration Dialog */}
			{editingWidget && (
				<Dialog open={!!editingWidget} onOpenChange={() => setEditingWidget(null)}>
					<DialogContent className="max-w-2xl">
						<DialogHeader>
							<DialogTitle>Configure Widget: {editingWidget.title}</DialogTitle>
						</DialogHeader>
						<div className="space-y-4">
							<div>
								<Label>Widget Title</Label>
								<Input
									value={editingWidget.title}
									onChange={(e) => handleWidgetConfigChange(editingWidget.id, { title: e.target.value })}
								/>
							</div>
							<div>
								<Label>Data Sources</Label>
								<div className="grid grid-cols-2 gap-4 mt-2">
									<div>
										<Label className="text-sm">Calculations</Label>
										<div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-2">
											{processedData.calculations.map(calc => {
												const isSelected = editingWidget.dataSource.calculations?.includes(calc.name);
												return (
													<div key={calc.name} className="flex items-center space-x-2">
														<input
															type="checkbox"
															id={`calc-${calc.name}`}
															checked={isSelected}
															onChange={(e) => {
																const currentCalculations = editingWidget.dataSource.calculations || [];
																const updatedCalculations = e.target.checked
																	? [...currentCalculations, calc.name]
																	: currentCalculations.filter(name => name !== calc.name);
																handleWidgetConfigChange(editingWidget.id, {
																	dataSource: {
																		...editingWidget.dataSource,
																		calculations: updatedCalculations
																	}
																});
															}}
															className="rounded"
														/>
														<label htmlFor={`calc-${calc.name}`} className="text-sm cursor-pointer">
															{calc.name}
														</label>
													</div>
												);
											})}
										</div>
									</div>
									<div>
										<Label className="text-sm">Parameters</Label>
										<div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-2">
											{processedData.parameters.map(param => {
												const isSelected = editingWidget.dataSource.parameters?.includes(param.name);
												return (
													<div key={param.name} className="flex items-center space-x-2">
														<input
															type="checkbox"
															id={`param-${param.name}`}
															checked={isSelected}
															onChange={(e) => {
																const currentParameters = editingWidget.dataSource.parameters || [];
																const updatedParameters = e.target.checked
																	? [...currentParameters, param.name]
																	: currentParameters.filter(name => name !== param.name);
																handleWidgetConfigChange(editingWidget.id, {
																	dataSource: {
																		...editingWidget.dataSource,
																		parameters: updatedParameters
																	}
																});
															}}
															className="rounded"
														/>
														<label htmlFor={`param-${param.name}`} className="text-sm cursor-pointer">
															{param.name}
														</label>
													</div>
												);
											})}
										</div>
									</div>
								</div>
							</div>
							
							{/* Selected Data Preview */}
							<div>
								<Label className="text-sm font-medium">Selected Data Preview</Label>
								<div className="mt-2 space-y-2">
									{editingWidget.dataSource.calculations && editingWidget.dataSource.calculations.length > 0 && (
										<div>
											<div className="text-xs font-medium text-gray-600 mb-1">Calculations:</div>
											<div className="flex flex-wrap gap-1">
												{editingWidget.dataSource.calculations.map(calcName => {
													const calc = processedData.calculations.find(c => c.name === calcName);
													return (
														<Badge key={calcName} variant="secondary" className="text-xs">
															{calcName}: {calc ? formatCurrency(extractNumericValue(calc.result)) : 'N/A'}
														</Badge>
													);
												})}
											</div>
										</div>
									)}
									{editingWidget.dataSource.parameters && editingWidget.dataSource.parameters.length > 0 && (
										<div>
											<div className="text-xs font-medium text-gray-600 mb-1">Parameters:</div>
											<div className="flex flex-wrap gap-1">
												{editingWidget.dataSource.parameters.map(paramName => {
													const param = processedData.parameters.find(p => p.name === paramName);
													return (
														<Badge key={paramName} variant="outline" className="text-xs">
															{paramName}: {param ? formatCurrency(extractNumericValue(param.test_value)) : 'N/A'}
														</Badge>
													);
												})}
											</div>
										</div>
									)}
									{(!editingWidget.dataSource.calculations || editingWidget.dataSource.calculations.length === 0) &&
									 (!editingWidget.dataSource.parameters || editingWidget.dataSource.parameters.length === 0) && (
										<div className="text-sm text-gray-500 italic">
											No data sources selected. Select calculations or parameters above.
										</div>
									)}
								</div>
							</div>
							
							<div className="flex justify-end gap-2">
								<Button variant="outline" onClick={() => setEditingWidget(null)}>
									Cancel
								</Button>
								<Button onClick={() => setEditingWidget(null)}>
									Save Changes
								</Button>
							</div>
						</div>
					</DialogContent>
				</Dialog>
			)}
		</div>
	);
}
