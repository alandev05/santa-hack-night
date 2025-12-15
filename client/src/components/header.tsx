import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Snowflake, Calendar, AlertTriangle, LayoutDashboard } from "lucide-react";

export function Header() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/schedule", label: "Schedule", icon: Calendar },
    { href: "/alerts", label: "Alerts", icon: AlertTriangle },
  ];

  return (
    <header className="bg-red-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-3 cursor-pointer hover:opacity-90 transition-opacity">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Snowflake className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">ElfShift</h1>
                <p className="text-xs text-white/80">Workshop Scheduler</p>
              </div>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    size="sm"
                    className={`${
                      isActive
                        ? "bg-white text-red-700"
                        : "text-white hover:bg-white/20"
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
