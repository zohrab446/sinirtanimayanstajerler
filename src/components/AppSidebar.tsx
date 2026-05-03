import { NavLink, useLocation } from "react-router-dom";
import { Home, Briefcase, FolderKanban, Award, MessageSquare, Settings, Sparkles, Calendar, Activity, Bell, HelpCircle, Video } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const mainItems = [
  { title: "Panel", url: "/dashboard", icon: Home },
  { title: "Projeler", url: "/projects", icon: FolderKanban },
  { title: "Takvim", url: "/dashboard", icon: Calendar },
  { title: "Durumlar", url: "/dashboard", icon: Activity },
  { title: "Bildirimler", url: "/dashboard", icon: Bell },
];

const spaceItems = [
  { title: "Çalışmalarım", url: "/workspaces", icon: Briefcase, dot: "bg-pink-500" },
  { title: "Mesajlar", url: "/messages", icon: MessageSquare, dot: "bg-blue-500" },
  { title: "Sertifikalar", url: "/certificates", icon: Award, dot: "bg-amber-500" },
];

const bottomItems = [
  { title: "Ayarlar", url: "/dashboard", icon: Settings },
  { title: "Yardım", url: "/dashboard", icon: HelpCircle },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();
  const isActive = (path: string) => pathname === path;

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          {!collapsed && <span className="font-bold tracking-wide">PROJECTOR</span>}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>Panel</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>Alanlarım</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {spaceItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-md flex items-center justify-center text-white ${item.dot}`}>
                        <item.icon className="w-3.5 h-3.5" />
                      </span>
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 space-y-2">
        <SidebarMenu>
          {bottomItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <NavLink to={item.url} className="flex items-center gap-3">
                  <item.icon className="h-4 w-4" />
                  {!collapsed && <span>{item.title}</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
