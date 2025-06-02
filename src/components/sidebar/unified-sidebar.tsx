"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { BuyerSidebarStructure } from "./sidebar-items-types";

interface UnifiedSidebarProps extends React.ComponentProps<typeof Sidebar> {
  sidebarTools: BuyerSidebarStructure;
  setActiveTab: (tab: string) => void;
  activeTab: string;
}

function NavMain({
  items,
  setActiveTab,
  activeTab,
}: {
  items: BuyerSidebarStructure["items"];
  setActiveTab: (tab: string) => void;
  activeTab: string;
}) {
  const [openItem, setOpenItem] = React.useState<string | null>(null);
  const activeItems = items.filter((item) => item.isActive !== false);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Tools</SidebarGroupLabel>
      <SidebarMenu>
        {activeItems.map((item) =>
          item.items ? (
            <Collapsible
              key={item.title}
              asChild
              open={openItem === item.title}
              onOpenChange={(isOpen) => {
                setOpenItem(isOpen ? item.title : null);
              }}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && <item.icon className="h-4 w-4" />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 h-4 w-4" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent asChild>
                  <SidebarMenu className="mt-1">
                    {item.items.map((subItem) => (
                      <SidebarMenuItem key={subItem.title}>
                        <SidebarMenuButton
                          onClick={() => setActiveTab(subItem.url)}
                          data-active={activeTab === subItem.url}
                        >
                          {subItem.icon && <subItem.icon className="h-4 w-4" />}
                          <span>{subItem.title}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                onClick={() => item.url && setActiveTab(item.url)}
                data-active={item.url === activeTab}
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}

function NavProjects({ projects }: { projects: BuyerSidebarStructure["projects"] }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((project) => (
          <SidebarMenuItem key={project.name}>
            <SidebarMenuButton>
              {project.icon && <project.icon className="h-4 w-4" />}
              <span>{project.name}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

export function UnifiedSidebar({ sidebarTools, setActiveTab, activeTab, ...props }: UnifiedSidebarProps) {
  return (
    <div className="border-r border-border">
      <Sidebar collapsible="none" variant="sidebar" {...props}>
        <SidebarHeader className="pt-8 px-4">
          <div className="flex items-center gap-3">
            <div className="relative h-14 w-14 overflow-hidden rounded-full border border-border bg-muted">
              <Image
                src="/images/logos/logo-sample.png"
                alt="Company Logo"
                fill
                className="object-cover"
                sizes="(max-width: 40px) 100vw"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold">Lorem Ipsum</span>
            </div>
          </div>
          <Separator className="my-4" />
        </SidebarHeader>

        <SidebarContent>
          <NavMain items={sidebarTools.items} setActiveTab={setActiveTab} activeTab={activeTab} />
          <NavProjects projects={sidebarTools.projects} />
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    </div>
  );
} 