import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { isAuthenticated, logout, getUsername } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect, useCallback } from "react";
import * as RadixIcons from "@radix-ui/react-icons";

export function Header() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [authenticated, setAuthenticated] = useState(() => isAuthenticated());
  const [username, setUsername] = useState<string | null>(() => getUsername());

  // Update auth state function
  const updateAuth = useCallback(() => {
    const authStatus = isAuthenticated();
    const user = getUsername();
    setAuthenticated(authStatus);
    setUsername(user);
  }, []);

  // Check auth state on mount and when location changes
  useEffect(() => {
    updateAuth();
  }, [location, updateAuth]);

  // Listen for auth changes (custom event + storage event)
  useEffect(() => {
    // Check immediately on mount
    updateAuth();
    
    // Listen for custom authchange event (same tab)
    window.addEventListener("authchange", updateAuth);
    // Listen for storage event (other tabs/windows)
    window.addEventListener("storage", updateAuth);
    
    return () => {
      window.removeEventListener("authchange", updateAuth);
      window.removeEventListener("storage", updateAuth);
    };
  }, [updateAuth]);

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: RadixIcons.DashboardIcon },
    { href: "/schedule", label: "Schedule", icon: RadixIcons.CalendarIcon },
    { href: "/alerts", label: "Alerts", icon: RadixIcons.ExclamationTriangleIcon },
  ];

  const handleLogout = () => {
    logout();
    setAuthenticated(false);
    setUsername(null);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    setLocation("/");
  };

  return (
    <header className="bg-card border-b border-border/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Cursor style */}
          <Link href="/">
            <div className="flex items-center space-x-3 cursor-pointer hover:opacity-90 transition-opacity duration-200">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-border/50 shadow-sm hover:shadow-md transition-shadow duration-200">
                <RadixIcons.StarIcon className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground tracking-tight">
                  ElfShift
                </h1>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Workshop Scheduler</p>
              </div>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-2">
            {authenticated ? (
              <>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location === item.href;
                  return (
                    <Link key={item.href} href={item.href}>
                      <Button
                        variant={isActive ? "default" : "outline"}
                        size="sm"
                        className={`rounded-md font-medium ${
                          isActive
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-foreground border-border hover:bg-accent hover:text-accent-foreground"
                        } transition-colors duration-150`}
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {item.label}
                      </Button>
                    </Link>
                  );
                })}
                <div className="flex items-center space-x-2 ml-2 pl-2 border-l border-border">
                  {username && (
                    <span className="text-sm text-muted-foreground font-medium">{username}</span>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="text-foreground border-border hover:bg-accent hover:text-accent-foreground"
                  >
                    <RadixIcons.ExitIcon className="h-4 w-4 mr-1" />
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <Button variant="outline" size="sm" asChild>
                <Link href="/login">
                  <RadixIcons.PersonIcon className="h-4 w-4 mr-2" />
                  Login
                </Link>
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
