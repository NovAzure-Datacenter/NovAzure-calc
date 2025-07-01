import {
	Building2,
	Zap,
	Cpu,
	Monitor,
	Settings,
	Leaf,
	Shield,
	Gauge,
	Wind,
	Droplets,
	Server,
	Wrench,
	Recycle,
	Car,
	Fuel,
} from "lucide-react";


export const iconMap = {
	Building2,
	Zap,
	Cpu,
	Monitor,
	Settings,
	Leaf,
	Shield,
	Gauge,
	Wind,
	Droplets,
	Server,
	Wrench,
	Recycle,
	Car,
	Fuel,
};

// Convert React component to string name
export function iconComponentToString(
	iconComponent: React.ComponentType<{ className?: string }>
): string {
	for (const [name, component] of Object.entries(iconMap)) {
		if (component === iconComponent) {
			return name;
		}
	}
	return "Building2"; 
}

// Convert string name to React component
export function stringToIconComponent(
	iconName: string
): React.ComponentType<{ className?: string }> {
	return iconMap[iconName as keyof typeof iconMap] || Building2;
}


export const iconOptions = [
	{ value: "Building2", label: "Building", icon: Building2 },
	{ value: "Zap", label: "Energy", icon: Zap },
	{ value: "Wind", label: "Cooling", icon: Wind },
	{ value: "Droplets", label: "Water", icon: Droplets },
	{ value: "Server", label: "Server", icon: Server },
	{ value: "Wrench", label: "Tools", icon: Wrench },
	{ value: "Recycle", label: "Recycling", icon: Recycle },
	{ value: "Car", label: "Transport", icon: Car },
	{ value: "Fuel", label: "Fuel", icon: Fuel },
	{ value: "Cpu", label: "Technology", icon: Cpu },
	{ value: "Monitor", label: "Monitoring", icon: Monitor },
	{ value: "Settings", label: "Settings", icon: Settings },
	{ value: "Leaf", label: "Environmental", icon: Leaf },
	{ value: "Shield", label: "Security", icon: Shield },
	{ value: "Gauge", label: "Performance", icon: Gauge },
];