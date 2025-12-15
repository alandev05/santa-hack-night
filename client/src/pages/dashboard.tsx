import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  Sparkles,
  Users,
  AlertTriangle,
  Gift,
  Wrench,
  CheckCircle,
  Clock,
  RefreshCw,
  Package
} from "lucide-react";
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
      <div className="min-h-screen bg-white">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            <Skeleton className="h-8 w-64" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <Skeleton className="h-20 w-full" />
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
      case 'wrapping': return Gift;
      case 'qa': return CheckCircle;
      case 'assembly': return Wrench;
      default: return Package;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Workshop Dashboard</h2>
              <p className="text-slate-600">Santa's Workshop Shift Management</p>
            </div>
            <Button
              onClick={() => generateScheduleMutation.mutate()}
              disabled={generateScheduleMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              {generateScheduleMutation.isPending ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Schedule
                </>
              )}
            </Button>
          </div>

          {/* High Risk Alert Banner */}
          {highRiskAlerts > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div className="flex-1">
                <p className="text-red-800 font-medium">
                  {highRiskAlerts} elf{highRiskAlerts > 1 ? 's' : ''} at high burnout risk!
                </p>
                <p className="text-red-600 text-sm">
                  Check the Alerts page for recommended rotations.
                </p>
              </div>
              <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-100">
                <a href="/alerts">View Alerts</a>
              </Button>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-red-200 bg-red-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Elves</CardTitle>
                <Users className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-700">{totalElves}</div>
                <p className="text-xs text-red-600 mt-1">Available for shifts</p>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">On Duty Now</CardTitle>
                <Clock className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-700">{elvesOnDuty}</div>
                <p className="text-xs text-green-600 mt-1">Currently working</p>
              </CardContent>
            </Card>

            <Card className={`border-red-200 ${highRiskAlerts > 0 ? 'bg-red-100' : 'bg-red-50'}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Burnout Alerts</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-700">
                  {highRiskAlerts}
                </div>
                <p className="text-xs text-red-600 mt-1">
                  {highRiskAlerts > 0 ? 'Need attention' : 'All clear'}
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Orders</CardTitle>
                <Package className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-700">{totalOrders}</div>
                <p className="text-xs text-green-600 mt-1">To fulfill today</p>
              </CardContent>
            </Card>
          </div>

          {/* Station Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Station Staffing Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stations?.map((station) => {
                  const Icon = getStationIcon(station.name);
                  const currentStaff = schedule?.filter(s => s.stationId === station.id).length || 0;
                  const isFull = currentStaff >= station.staffNeeded;
                  const isShort = currentStaff < station.staffNeeded;

                  return (
                    <div
                      key={station.id}
                      className={`p-4 rounded-lg border-2 ${
                        isFull ? 'border-green-200 bg-green-50' :
                        isShort ? 'border-orange-200 bg-orange-50' :
                        'border-slate-200 bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Icon className={`h-5 w-5 ${isFull ? 'text-green-600' : 'text-orange-600'}`} />
                          <h4 className="font-semibold">{station.name}</h4>
                        </div>
                        <Badge variant={isFull ? "default" : "secondary"} className={isFull ? 'bg-green-600' : 'bg-orange-500'}>
                          {currentStaff}/{station.staffNeeded}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm text-slate-600">
                        <span>Stress Level: {station.stressLevel}/10</span>
                        <span className={isFull ? 'text-green-600' : 'text-orange-600'}>
                          {isFull ? 'Fully Staffed' : `Need ${station.staffNeeded - currentStaff} more`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Elves Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Elf Roster</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left text-sm font-medium text-slate-600 pb-3">Name</th>
                      <th className="text-left text-sm font-medium text-slate-600 pb-3">Skills</th>
                      <th className="text-left text-sm font-medium text-slate-600 pb-3">Recent Hours</th>
                      <th className="text-left text-sm font-medium text-slate-600 pb-3">Consecutive Days</th>
                      <th className="text-left text-sm font-medium text-slate-600 pb-3">Burnout Risk</th>
                    </tr>
                  </thead>
                  <tbody>
                    {elves?.slice(0, 10).map((elf) => (
                      <tr key={elf.id} className="border-b border-slate-100">
                        <td className="py-3 text-sm font-medium text-slate-900">{elf.name}</td>
                        <td className="py-3">
                          <div className="flex flex-wrap gap-1">
                            {elf.skills.map((skill) => (
                              <Badge key={skill} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 text-sm text-slate-700">{elf.recentHours}h</td>
                        <td className="py-3 text-sm text-slate-700">{elf.consecutiveDays} days</td>
                        <td className="py-3">
                          <Badge
                            className={
                              elf.riskLevel === 'high' ? 'bg-red-100 text-red-700' :
                              elf.riskLevel === 'medium' ? 'bg-orange-100 text-orange-700' :
                              'bg-green-100 text-green-700'
                            }
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
