"use client";

import { useState } from "react";
import { Plus, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import type { Technology } from "../types";

interface CreateTechnologyDialogProps {
	onCreate: (technology: Technology) => void;
}

export function CreateTechnologyDialog({ onCreate }: CreateTechnologyDialogProps) {
	const [open, setOpen] = useState(false);
	const [name, setName] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.trim()) return;

		const newTechnology: Technology = {
			name: name.trim(),
			icon: Building2, 
		};

		onCreate(newTechnology);
		setOpen(false);
		resetForm();
	};

	const resetForm = () => {
		setName("");
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
			<Button variant="outline" size="sm" className="text-xs">
					<Plus className="h-4 w-4 mr-2" />
					New Technology
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Create New Technology</DialogTitle>
					<DialogDescription>
						Add a new technology that can be associated with industries.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<Label htmlFor="tech-name">Technology Name</Label>
						<Input
							id="tech-name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="Enter technology name..."
							required
						/>
					</div>
					<DialogFooter>
						<Button type="button" variant="outline" onClick={() => setOpen(false)}>
							Cancel
						</Button>
						<Button type="submit" disabled={!name.trim()}>
							Create Technology
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
} 