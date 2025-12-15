import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Terminal } from "@/components/Terminal";
import * as RadixIcons from "@radix-ui/react-icons";
import type { BurnoutAlert } from "@shared/types";

export default function Alerts() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: alerts, isLoading } = useQuery<BurnoutAlert[]>({
    queryKey: ["/api/alerts"],
  });

  const autoRotateMutation = useMutation({
    mutationFn: async (alertId: string) => {
      const res = await fetch(`/api/alerts/${alertId}/resolve`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to auto-rotate");
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/alerts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/schedule"] });
      toast({
        title: "Rotation Complete!",
        description: data.message || "Elves have been swapped and Slack has been notified.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to perform rotation. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            <Skeleton className="h-8 w-64 bg-muted" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <Skeleton className="h-24 w-full bg-muted" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  const unresolvedAlerts = alerts?.filter(a => !a.resolved) || [];
  const resolvedAlerts = alerts?.filter(a => a.resolved) || [];
  const highRiskAlerts = unresolvedAlerts.filter(a => a.riskLevel === 'high');
  const mediumRiskAlerts = unresolvedAlerts.filter(a => a.riskLevel === 'medium');

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-3xl font-semibold text-foreground">Burnout Alerts</h2>
              <p className="text-muted-foreground text-sm mt-1">Monitor and resolve elf burnout risks</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="destructive" className="text-sm px-3 py-1">
                {highRiskAlerts.length} High Risk
              </Badge>
              <Badge variant="secondary" className="text-sm px-3 py-1">
                {mediumRiskAlerts.length} Medium Risk
              </Badge>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">High Risk Elves</p>
                    <p className="text-3xl font-semibold text-foreground">{highRiskAlerts.length}</p>
                  </div>
                  <RadixIcons.ExclamationTriangleIcon className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Medium Risk Elves</p>
                    <p className="text-3xl font-semibold text-foreground">{mediumRiskAlerts.length}</p>
                  </div>
                  <RadixIcons.ArrowUpIcon className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Resolved Today</p>
                    <p className="text-3xl font-semibold text-foreground">{resolvedAlerts.length}</p>
                  </div>
                  <RadixIcons.CheckCircledIcon className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Terminal Monitor */}
          <Terminal context="alerts" />

          {/* Unresolved Alerts */}
          {unresolvedAlerts.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center text-foreground">
                  <RadixIcons.ExclamationTriangleIcon className="h-5 w-5 mr-2 text-foreground" />
                  Active Burnout Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {unresolvedAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg border border-border bg-card`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="font-semibold text-lg text-foreground">{alert.elfName}</span>
                          <Badge
                            variant={alert.riskLevel === 'high' ? 'destructive' : 'secondary'}
                          >
                            {alert.riskLevel.toUpperCase()} RISK
                          </Badge>
                          <Badge variant="outline" className="font-mono border-border">
                            Score: {alert.riskScore.toFixed(1)}/10
                          </Badge>
                        </div>
                        <p className="text-sm text-foreground">
                          {alert.message}
                        </p>
                        <div className="mt-2 flex items-center text-sm text-muted-foreground">
                          <RadixIcons.ClockIcon className="h-4 w-4 mr-1" />
                          Suggested: {alert.suggestedAction}
                        </div>
                      </div>
                      <Button
                        onClick={() => autoRotateMutation.mutate(alert.id)}
                        disabled={autoRotateMutation.isPending}
                      >
                        {autoRotateMutation.isPending ? (
                          <>
                            <RadixIcons.UpdateIcon className="w-4 h-4 mr-2 animate-spin" />
                            Rotating...
                          </>
                        ) : (
                          <>
                            <RadixIcons.ReloadIcon className="w-4 h-4 mr-2" />
                            Auto-Rotate
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : (
            <Card className="border-secondary/30 bg-secondary/5">
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <RadixIcons.CheckCircledIcon className="h-12 w-12 mx-auto mb-4 text-secondary" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">All Clear!</h3>
                  <p className="text-muted-foreground">No active burnout alerts. All elves are working within safe parameters.</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Resolved Alerts */}
          {resolvedAlerts.length > 0 && (
            <Card className="opacity-75 border-border">
              <CardHeader>
                <CardTitle className="text-lg flex items-center text-muted-foreground">
                      <RadixIcons.CheckCircledIcon className="h-5 w-5 mr-2 text-secondary" />
                  Resolved Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {resolvedAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-3 rounded-lg border border-border bg-muted flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <RadixIcons.CheckCircledIcon className="h-5 w-5 text-secondary" />
                      <span className="font-medium text-foreground">{alert.elfName}</span>
                      <span className="text-sm text-muted-foreground">Risk was {alert.riskScore.toFixed(1)}</span>
                    </div>
                    <Badge variant="outline" className="text-secondary border-secondary/30">
                      Resolved
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Burnout Risk Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Burnout Risk Formula</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded-lg p-4 font-mono text-sm border border-border">
                <p className="text-foreground mb-2">Risk Score = </p>
                <ul className="space-y-1 ml-4 text-muted-foreground">
                  <li>+ recent_hours × 0.30</li>
                  <li>+ consecutive_days × 0.25</li>
                  <li>+ task_stress × 0.20</li>
                  <li>- breaks_taken × 0.15</li>
                  <li>- preference_match × 0.10</li>
                </ul>
                <div className="mt-4 flex items-center space-x-4 text-sm text-foreground">
                  <span className="flex items-center">
                    <span className="w-3 h-3 rounded bg-secondary mr-2"></span>
                    Low: 0-3
                  </span>
                  <span className="flex items-center">
                    <span className="w-3 h-3 rounded bg-accent mr-2"></span>
                    Medium: 4-6
                  </span>
                  <span className="flex items-center">
                    <span className="w-3 h-3 rounded bg-primary mr-2"></span>
                    High: 7-10
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
