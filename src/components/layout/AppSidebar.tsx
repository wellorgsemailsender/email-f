import { 
  LayoutDashboard, 
  Send, 
  MessageSquare, 
  FileText, 
  LogOut,
  Mail,
  Users,
  UserX,
  AlertTriangle
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const navigationItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "New Campaign", url: "/campaigns/new", icon: Send },
  { title: "Response Management", url: "/responses", icon: MessageSquare },
  { title: "Email Templates", url: "/templates", icon: FileText },
  { title: "Subscribers", url: "/subscribers", icon: Users },
  { title: "Unsubscribers", url: "/unsubscribers", icon: UserX },
  { title: "Failed Emails", url: "/failed-emails", icon: AlertTriangle },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";
  const { logout } = useAuth();

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary text-primary-foreground font-medium shadow-sm" 
      : "text-foreground hover:bg-accent hover:text-accent-foreground transition-colors";

  const handleLogout = () => {
    logout();
  };

  return (
    <Sidebar className={collapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarContent className="bg-card border-r border-border">{/* Better visibility with solid background */}
        {/* Logo/Brand */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Mail className="w-4 h-4 text-primary-foreground" />
            </div>
            {!collapsed && (
              <div className="text-left">
                <h2 className="font-bold text-lg text-foreground">EmailCampaign</h2>
                <p className="text-xs text-muted-foreground">Pro</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup className="flex-1 px-2">
          <SidebarGroupLabel className="text-foreground font-semibold mb-4 px-2">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {navigationItems.map((item) => {
                const isItemActive = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="w-full justify-start h-11">
                      <NavLink 
                        to={item.url} 
                        className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                          isItemActive 
                            ? "bg-primary text-primary-foreground font-semibold shadow-sm" 
                            : "text-foreground/80 hover:text-foreground hover:bg-accent/50 font-medium"
                        }`}
                      >
                        <item.icon className="w-5 h-5 shrink-0" />
                        {!collapsed && <span className="ml-3">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Logout Button */}
        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            size={collapsed ? "icon" : "default"}
            onClick={handleLogout}
            className="w-full justify-start text-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span className="ml-3">Logout</span>}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}