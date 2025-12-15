import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Landing from "@/pages/landing";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import Schedule from "@/pages/schedule";
import Alerts from "@/pages/alerts";
import NotFound from "@/pages/not-found";
import { isAuthenticated } from "@/lib/auth";
import { useEffect, useState } from "react";

// Protected Route Component - redirects to login if not authenticated
function ProtectedRoute({ component: Component }: { component: React.ComponentType<any> }) {
  const [, setLocation] = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      const authStatus = isAuthenticated();
      setIsAuth(authStatus);
      setIsChecking(false);
      
      if (!authStatus) {
        // Redirect to login if not authenticated
        setLocation("/login");
      }
    };

    checkAuth();
  }, [setLocation]);

  // Show nothing while checking (prevents flash of content)
  if (isChecking) {
    return null;
  }

  // If not authenticated, redirect will happen via useEffect
  if (!isAuth) {
    return null;
  }

  // Render the protected component
  return <Component />;
}

function AppRouter() {
  return (
    <Switch>
      {/* 
        Route order matters in wouter - more specific routes must come first.
        Routes are matched in order, so specific paths before catch-all.
      */}
      
      {/* Protected routes - require authentication (specific paths first) */}
      <Route path="/dashboard">
        <ProtectedRoute component={Dashboard} />
      </Route>
      <Route path="/schedule">
        <ProtectedRoute component={Schedule} />
      </Route>
      <Route path="/alerts">
        <ProtectedRoute component={Alerts} />
      </Route>
      
      {/* Public routes - accessible without authentication */}
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/">
        <Landing />
      </Route>
      
      {/* 404 - catch-all, must be last */}
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppRouter />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
