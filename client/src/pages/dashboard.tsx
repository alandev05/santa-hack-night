import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Terminal } from "@/components/Terminal";
import * as RadixIcons from "@radix-ui/react-icons";
import type { Elf, Station, ShiftAssignment, BurnoutAlert, Order } from "@shared/types";

export default function Dashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: elves, isLoading: elvesLoading } = useQuery<Elf[]>({
    queryKey: ["/api/elves"],
  });

  const { data: stations, isLoading: stationsLoading } = useQuery<Station[]>({
    queryKey: ["/api/stations"],
  });

  const { data: schedule, isLoading: scheduleLoading } = useQuery<ShiftAssignment[]>({
    queryKey: ["/api/schedule"],
  });

  const { data: alerts, isLoading: alertsLoading } = useQuery<BurnoutAlert[]>({
    queryKey: ["/api/alerts"],
  });

  const { data: orders } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
  });

  const generateScheduleMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/schedule/generate", { method: "POST" });
      if (!res.ok) throw new Error("Failed to generate schedule");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/schedule"] });
      queryClient.invalidateQueries({ queryKey: ["/api/alerts"] });
      toast({
        title: "Schedule Generated!",
        description: "AI has created an optimized shift schedule.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate schedule. Please try again.",
        variant: "destructive",
      });
    },
  });

  const isLoading = elvesLoading || stationsLoading || scheduleLoading || alertsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            <Skeleton className="h-8 w-64 bg-muted" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <Skeleton className="h-20 w-full bg-muted" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  const totalElves = elves?.length || 0;
  const elvesOnDuty = schedule?.length || 0;
  const highRiskAlerts = alerts?.filter(a => a.riskLevel === 'high' && !a.resolved).length || 0;
  const totalOrders = orders?.length || 0;

  const getStationIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'wrapping': return RadixIcons.StarIcon;
      case 'qa': return RadixIcons.CheckCircledIcon;
      case 'assembly': return RadixIcons.GearIcon;
      default: return RadixIcons.CubeIcon;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-3xl font-semibold text-foreground tracking-tight">
                Workshop Dashboard
              </h2>
              <p className="text-muted-foreground text-sm mt-1">Santa's Workshop Shift Management</p>
            </div>
            <Button
              onClick={() => generateScheduleMutation.mutate()}
              disabled={generateScheduleMutation.isPending}
              className="text-base"
            >
              {generateScheduleMutation.isPending ? (
                <>
                  <RadixIcons.UpdateIcon className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <RadixIcons.StarIcon className="w-4 h-4 mr-2" />
                  Generate Schedule
                </>
              )}
            </Button>
          </div>

          {/* High Risk Alert Banner - Cursor style */}
          {highRiskAlerts > 0 && (
            <div className="bg-card border border-border rounded-lg p-4 flex items-center space-x-4 shadow-sm">
              <div className="w-10 h-10 rounded-md bg-accent flex items-center justify-center border border-border">
                <RadixIcons.ExclamationTriangleIcon className="h-5 w-5 text-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-foreground font-semibold text-base">
                  {highRiskAlerts} elf{highRiskAlerts > 1 ? 's' : ''} at high burnout risk
                </p>
                <p className="text-muted-foreground text-sm mt-0.5">
                  Check the Alerts page for recommended rotations.
                </p>
              </div>
              <Button variant="outline" size="sm">
                <a href="/alerts">View Alerts</a>
              </Button>
            </div>
          )}

          {/* Stats Cards - Old Mac ad style */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Elves</CardTitle>
                <div className="w-8 h-8 rounded-md bg-accent flex items-center justify-center border border-border">
                  <RadixIcons.PersonIcon className="h-4 w-4 text-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold text-foreground">{totalElves}</div>
                <p className="text-xs text-muted-foreground mt-1">Available for shifts</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">On Duty Now</CardTitle>
                <div className="w-8 h-8 rounded-md bg-accent flex items-center justify-center border border-border">
                  <RadixIcons.ClockIcon className="h-4 w-4 text-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold text-foreground">{elvesOnDuty}</div>
                <p className="text-xs text-muted-foreground mt-1">Currently working</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Burnout Alerts</CardTitle>
                <div className="w-8 h-8 rounded-md bg-accent flex items-center justify-center border border-border">
                  <RadixIcons.ExclamationTriangleIcon className="h-4 w-4 text-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold text-foreground">
                  {highRiskAlerts}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {highRiskAlerts > 0 ? 'Need attention' : 'All clear'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Today's Orders</CardTitle>
                <div className="w-8 h-8 rounded-md bg-accent flex items-center justify-center border border-border">
                  <RadixIcons.CubeIcon className="h-4 w-4 text-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold text-foreground">{totalOrders}</div>
                <p className="text-xs text-muted-foreground mt-1">To fulfill today</p>
              </CardContent>
            </Card>
          </div>

          {/* Station Status and Terminal */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Station Staffing Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {stations?.map((station) => {
                    const Icon = getStationIcon(station.name);
                    const currentStaff = schedule?.filter(s => s.stationId === station.id).length || 0;
                    const isFull = currentStaff >= station.staffNeeded;
                    const isShort = currentStaff < station.staffNeeded;

                    return (
                    <div
                      key={station.id}
                      className={`p-4 rounded-lg border ${
                        isFull ? 'border-border bg-card' :
                        isShort ? 'border-border bg-card' :
                        'border-border bg-card'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Icon className="h-4 w-4 text-foreground" />
                          <h4 className="font-medium text-foreground">{station.name}</h4>
                        </div>
                        <Badge variant={isFull ? "default" : "secondary"}>
                          {currentStaff}/{station.staffNeeded}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Stress Level: {station.stressLevel}/10</span>
                        <span className="text-foreground">
                          {isFull ? 'Fully Staffed' : `Need ${station.staffNeeded - currentStaff} more`}
                        </span>
                      </div>
                    </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Terminal />
          </div>

          {/* Elves Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Elf Roster</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left text-sm font-medium text-muted-foreground pb-3">Name</th>
                      <th className="text-left text-sm font-medium text-muted-foreground pb-3">Skills</th>
                      <th className="text-left text-sm font-medium text-muted-foreground pb-3">Recent Hours</th>
                      <th className="text-left text-sm font-medium text-muted-foreground pb-3">Consecutive Days</th>
                      <th className="text-left text-sm font-medium text-muted-foreground pb-3">Burnout Risk</th>
                    </tr>
                  </thead>
                  <tbody>
                    {elves?.slice(0, 10).map((elf) => (
                      <tr key={elf.id} className="border-b border-border/50">
                        <td className="py-3 text-sm font-medium text-foreground">{elf.name}</td>
                        <td className="py-3">
                          <div className="flex flex-wrap gap-1">
                            {elf.skills.map((skill) => (
                              <Badge key={skill} variant="outline" className="text-xs border-border">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 text-sm text-foreground">{elf.recentHours}h</td>
                        <td className="py-3 text-sm text-foreground">{elf.consecutiveDays} days</td>
                        <td className="py-3">
                          <Badge
                            variant={elf.riskLevel === 'high' ? 'destructive' : elf.riskLevel === 'medium' ? 'secondary' : 'outline'}
                          >
                            {elf.burnoutRisk?.toFixed(1) || 'N/A'} - {elf.riskLevel || 'low'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
