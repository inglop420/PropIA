
'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Building2, Users, BarChart3, Kanban } from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    href: "/dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
  },
  {
    href: "/dashboard/propiedades",
    icon: Building2,
    label: "Mis Propiedades",
  },
  {
    href: "/dashboard/kanban",
    icon: Kanban,
    label: "CRM Kanban",
  },
  {
    href: "/dashboard/leads",
    icon: Users,
    label: "Leads/Clientes",
  },
  {
    href: "/dashboard/reportes",
    icon: BarChart3,
    label: "Reportes",
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-[#D7CCC8] min-h-[calc(100vh-4rem)] p-4">
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                isActive
                  ? "bg-[#5D4037] text-white"
                  : "text-[#6D4C41] hover:bg-[#F5F5DC]"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
