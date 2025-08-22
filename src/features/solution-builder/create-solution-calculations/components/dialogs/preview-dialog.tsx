import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PreviewDialogProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
}

export default function PreviewDialog({
	isOpen,
	onOpenChange,
}: PreviewDialogProps) {
	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="min-w-[80vh] max-h-[80vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Preview</DialogTitle>
				</DialogHeader>
				
				<Tabs defaultValue="cascade" className="w-full">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="cascade">Cascade</TabsTrigger>
						<TabsTrigger value="nodes">Nodes</TabsTrigger>
					</TabsList>
					
					<TabsContent value="cascade" className="mt-6">
						<Card>
							<CardHeader>
								<CardTitle>Cascade View</CardTitle>
							</CardHeader>
							<CardContent>
								
							</CardContent>
						</Card>
					</TabsContent>
					
					<TabsContent value="nodes" className="mt-6">
						<Card>
							<CardHeader>
								<CardTitle>Nodes View</CardTitle>
							</CardHeader>
							<CardContent>
							
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	);
}
