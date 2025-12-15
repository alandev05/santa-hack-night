import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { isAuthenticated, setAuth } from "@/lib/auth";
import * as RadixIcons from "@radix-ui/react-icons";

const CORRECT_USERNAME = "HoHo";
const CORRECT_PASSWORD = "Naughty Santa";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      setLocation("/dashboard");
    }
  }, [setLocation]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Trim whitespace from inputs
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();
    
    if (!trimmedUsername || !trimmedPassword) {
      toast({
        title: "Missing Fields",
        description: "Please enter both username and password.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simulate a brief delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (trimmedUsername === CORRECT_USERNAME && trimmedPassword === CORRECT_PASSWORD) {
      // Store auth using the auth utility (triggers events)
      setAuth(trimmedUsername);
      
      toast({
        title: "Welcome back!",
        description: "Successfully logged in to ElfShift.",
      });

      // Small delay before redirect to show toast
      setTimeout(() => {
        setLocation("/dashboard");
      }, 100);
    } else {
      toast({
        title: "Invalid Credentials",
        description: "Username or password is incorrect. Try again!",
        variant: "destructive",
      });
      setPassword("");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center border border-border shadow-sm">
              <RadixIcons.StarIcon className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl font-semibold text-foreground tracking-tight mb-2">
            ElfShift
          </h1>
          <p className="text-muted-foreground">Workshop Scheduler</p>
        </div>

        {/* Login Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-center">Welcome Back</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={isLoading}
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="bg-background"
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <RadixIcons.UpdateIcon className="h-4 w-4 mr-2 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  <>
                    <RadixIcons.PersonIcon className="h-4 w-4 mr-2" />
                    Login
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-xs text-center text-muted-foreground">
                Need help? Contact Santa's IT department.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Back to Landing */}
        <div className="text-center">
          <Button variant="ghost" onClick={() => setLocation("/")} className="text-sm">
            <RadixIcons.ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}

