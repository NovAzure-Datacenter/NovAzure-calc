import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { WIDGET_TYPES, WidgetType, WidgetConfig } from "@/features/value-calculator/utils/widgets";
import { useState } from "react";
import { Settings, Trash2 } from "lucide-react";

interface PreviewDialogProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
}

export default function PreviewDialog({
	isOpen,
	onOpenChange,
}: PreviewDialogProps) {
	const [selectedWidgets, setSelectedWidgets] = useState<WidgetConfig[]>([]);

	const handleWidgetSelect = (widgetType: WidgetType) => {
		const widgetInfo = WIDGET_TYPES[widgetType];
		const newWidget: WidgetConfig = {
			id: `${widgetType}-${Date.now()}`,
			type: widgetType,
			title: widgetInfo.name,
			description: widgetInfo.description,
			dataSource: {
				calculations: [],
				parameters: []
			},
			displayOptions: {
				...widgetInfo.defaultConfig.displayOptions
			},
			position: widgetInfo.defaultConfig.position || { x: 0, y: 0, w: 6, h: 2 },
			isVisible: true
		};
		setSelectedWidgets(prev => [...prev, newWidget]);
	};

	const handleWidgetRemove = (widgetId: string) => {
		setSelectedWidgets(prev => prev.filter(widget => widget.id !== widgetId));
	};

	const handleWidgetConfigure = (widgetId: string) => {
		// TODO: Implement widget configuration dialog
		console.log('Configure widget:', widgetId);
	};

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="min-w-[80vh] max-h-[80vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Preview</DialogTitle>
				</DialogHeader>
				
				{/* Widget Carousel Header */}
				<div className="mb-6">
					<h3 className="text-sm font-medium mb-2">Available Widgets</h3>
					<p className="text-xs text-muted-foreground mb-3">
						Select a widget from the carousel below to add it to your dashboard. You can then configure and customize each widget.
					</p>
					<ScrollArea className="w-full">
						<div className="flex gap-3 pb-2">
							{Object.entries(WIDGET_TYPES).map(([type, widgetInfo]) => {
								const IconComponent = widgetInfo.icon;
								return (
									<Button
										key={type}
										variant="outline"
										size="sm"
										className="flex-shrink-0 flex items-center gap-2 min-w-[140px]"
										onClick={() => handleWidgetSelect(type as WidgetType)}
									>
										<IconComponent className="h-4 w-4" />
										<span className="text-xs">{widgetInfo.name}</span>
									</Button>
								);
							})}
						</div>
						<ScrollBar orientation="horizontal" />
					</ScrollArea>
				</div>

				{/* Selected Widgets Card */}
				<Card>
					<CardHeader>
						<CardTitle className="text-sm font-medium">
							Selected Widgets ({selectedWidgets.length})
						</CardTitle>
					</CardHeader>
					<CardContent>
						{selectedWidgets.length === 0 ? (
							<div className="text-center py-8 text-gray-500">
								No widgets selected. Click on widgets above to add them.
							</div>
						) : (
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
								{selectedWidgets.map((widget) => (
									<div
										key={widget.id}
										className="relative p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
									>
										{/* Widget Action Buttons */}
										<div className="absolute top-2 right-2 z-10 flex items-center gap-1">
											<Button
												variant="secondary"
												size="sm"
												onClick={() => handleWidgetConfigure(widget.id)}
												className="h-6 w-6 p-0"
											>
												<Settings className="h-3 w-3" />
											</Button>
											<Button
												variant="destructive"
												size="sm"
												onClick={() => handleWidgetRemove(widget.id)}
												className="h-6 w-6 p-0"
											>
												<Trash2 className="h-3 w-3" />
											</Button>
										</div>

										{/* Widget Content */}
										<div className="flex items-center gap-3 pr-16">
											{(() => {
												const IconComponent = WIDGET_TYPES[widget.type].icon;
												return <IconComponent className="h-5 w-5 text-muted-foreground" />;
											})()}
											<div className="flex-1 min-w-0">
												<div className="font-medium text-sm truncate">{widget.title}</div>
												<div className="text-xs text-muted-foreground line-clamp-2">
													{widget.description}
												</div>
											</div>
										</div>

										{/* Widget Type Badge */}
										<div className="mt-3">
											<Badge variant="secondary" className="text-xs">
												{widget.type}
											</Badge>
										</div>
									</div>
								))}
							</div>
						)}
					</CardContent>
				</Card>
			</DialogContent>
		</Dialog>
	);
}
