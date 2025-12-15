import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import * as RadixIcons from "@radix-ui/react-icons";

export default function Landing() {
  // Landing page is always accessible (public route)

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center border border-border shadow-sm">
                <RadixIcons.StarIcon className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground tracking-tight">ElfShift</h1>
              </div>
            </div>
            <Button variant="outline" asChild>
              <Link href="/login">
                <RadixIcons.DashboardIcon className="h-4 w-4 mr-2" />
                Login
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-primary rounded-lg flex items-center justify-center border border-border shadow-sm">
                <RadixIcons.StarIcon className="h-10 w-10 text-primary-foreground" />
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold text-foreground tracking-tight mb-6">
              ElfShift
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground mb-4 font-medium">
              Workshop Scheduler
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
              AI-powered shift management for Santa's Workshop. Because even elves need a break (and Santa needs his gifts delivered on time). Optimize assignments, prevent burnout, and keep the workshop running smoother than a reindeer on Christmas Eve.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="text-base px-8 py-6" asChild>
                <Link href="/login">
                  <RadixIcons.DashboardIcon className="h-5 w-5 mr-2" />
                  Get Started
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-base px-8 py-6" asChild>
                <Link href="/login">
                  <RadixIcons.CalendarIcon className="h-5 w-5 mr-2" />
                  View Schedule
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-semibold text-foreground mb-4">
            Built for Efficiency (and Sanity)
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to manage your workshop shifts with precision, care, and maybe a little bit of magic. No more spreadsheets, no more chaos—just smooth operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <Card>
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center border border-border mb-4">
                <RadixIcons.MagicWandIcon className="h-6 w-6 text-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                AI-Powered Scheduling
              </h3>
              <p className="text-muted-foreground">
                Our AI is smarter than a workshop full of elves (no offense, elves). It optimizes shifts based on skills, workload, and burnout risk—because happy elves make better toys.
              </p>
            </CardContent>
          </Card>

          {/* Feature 2 */}
          <Card>
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center border border-border mb-4">
                <RadixIcons.ExclamationTriangleIcon className="h-6 w-6 text-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Burnout Prevention
              </h3>
              <p className="text-muted-foreground">
                Real-time monitoring catches burnout before your elves start muttering about unionizing. We alert you when someone needs a break (or a candy cane).
              </p>
            </CardContent>
          </Card>

          {/* Feature 3 */}
          <Card>
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center border border-border mb-4">
                <RadixIcons.ClockIcon className="h-6 w-6 text-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Real-Time Updates
              </h3>
              <p className="text-muted-foreground">
                Live terminal interface and instant notifications keep you in the loop. Know what's happening in your workshop faster than you can say "Ho ho ho."
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Terminal Preview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-semibold text-foreground mb-4">
            Command-Line Interface
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Monitor and control your workshop with a powerful terminal interface. Because sometimes you need to feel like a hacker while managing toy production.
          </p>
        </div>

        <Card className="max-w-4xl mx-auto">
          <div className="bg-muted border-b border-border p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <RadixIcons.GearIcon className="h-4 w-4 text-foreground" />
                <span className="text-sm font-medium text-foreground">Terminal</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30"></div>
              </div>
            </div>
          </div>
          <div className="bg-background font-mono text-sm p-6 space-y-2 min-h-[200px]">
            <div className="text-foreground/90 flex items-start space-x-2">
              <span className="text-muted-foreground text-xs shrink-0">[10:30:15]</span>
              <span className="break-words">ElfShift Terminal v1.0.0 - Workshop Management System</span>
            </div>
            <div className="text-muted-foreground flex items-start space-x-2">
              <span className="text-muted-foreground text-xs shrink-0">[10:30:16]</span>
              <span className="break-words">Initializing shift scheduler...</span>
            </div>
            <div className="text-foreground/90 flex items-start space-x-2">
              <span className="text-muted-foreground text-xs shrink-0">[10:30:17]</span>
              <span className="break-words">Connected to workshop database</span>
            </div>
            <div className="text-foreground flex items-start space-x-2">
              <span className="text-muted-foreground text-xs shrink-0">[10:30:18]</span>
              <span className="shrink-0">✓</span>
              <span className="break-words">System ready</span>
            </div>
            <div className="flex items-center space-x-2 mt-4">
              <span className="text-muted-foreground">$</span>
              <span className="text-foreground">help</span>
              <span className="text-muted-foreground terminal-cursor">▊</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Stats Section */}
      <div className="bg-muted/30 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-semibold text-foreground mb-2">100%</div>
              <div className="text-muted-foreground">On-Time Delivery</div>
            </div>
            <div>
              <div className="text-4xl font-semibold text-foreground mb-2">24/7</div>
              <div className="text-muted-foreground">Workshop Monitoring</div>
            </div>
            <div>
              <div className="text-4xl font-semibold text-foreground mb-2">AI</div>
              <div className="text-muted-foreground">Powered Optimization</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold text-foreground mb-4">
            Ready to Optimize Your Workshop?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start managing shifts smarter today. Your elves will thank you (and so will Santa when everything runs smoothly on Christmas Eve).
          </p>
          <Button size="lg" className="text-base px-8 py-6" asChild>
            <Link href="/login">
              <RadixIcons.DashboardIcon className="h-5 w-5 mr-2" />
              Login to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

