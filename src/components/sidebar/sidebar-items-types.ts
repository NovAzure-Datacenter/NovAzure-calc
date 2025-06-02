import { LucideIcon } from "lucide-react";
import { FC } from "react";

export interface SubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  description?: string;
  items?: SubItem[];
}

export interface SidebarItem {
  title: string;
  icon: LucideIcon;
  component?: FC;
  isActive?: boolean;
  url?: string;
  items?: SubItem[];
}

export interface Project {
  name: string;
  url: string;
  icon: LucideIcon;
}

export interface Team {
  name: string;
  logo: LucideIcon;
  plan: "Free" | "Startup" | "Enterprise";
}

export interface BuyerSidebarStructure {
  items: SidebarItem[];
  projects: Project[];
}

export type DefaultItem = {
  title: string;
  icon: LucideIcon;
  url: string;
} 