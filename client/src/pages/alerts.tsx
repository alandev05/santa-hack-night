import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  AlertTriangle,
  RefreshCw,
  CheckCircle,
  ArrowLeftRight,
  Clock,
  TrendingUp
} from "lucide-react";
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
      <div className="min-h-screen bg-white">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            <Skeleton className="h-8 w-64" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <Skeleton className="h-24 w-full" />
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
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Burnout Alerts</h2>
              <p className="text-slate-600">Monitor and resolve elf burnout risks</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="destructive" className="text-sm px-3 py-1">
                {highRiskAlerts.length} High Risk
              </Badge>
              <Badge variant="secondary" className="text-sm px-3 py-1 bg-red-100 text-red-700">
                {mediumRiskAlerts.length} Medium Risk
              </Badge>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-red-600 font-medium">High Risk Elves</p>
                    <p className="text-3xl font-bold text-red-700">{highRiskAlerts.length}</p>
                  </div>
                  <AlertTriangle className="h-10 w-10 text-red-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-red-600 font-medium">Medium Risk Elves</p>
                    <p className="text-3xl font-bold text-red-700">{mediumRiskAlerts.length}</p>
                  </div>
                  <TrendingUp className="h-10 w-10 text-red-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 font-medium">Resolved Today</p>
                    <p className="text-3xl font-bold text-green-700">{resolvedAlerts.length}</p>
                  </div>
                  <CheckCircle className="h-10 w-10 text-green-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Unresolved Alerts */}
          {unresolvedAlerts.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                  Active Burnout Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {unresolvedAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg border-2 ${
                      alert.riskLevel === 'high'
                        ? 'border-red-300 bg-red-100'
                        : 'border-red-200 bg-red-50'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="font-semibold text-lg">{alert.elfName}</span>
                          <Badge
                            variant={alert.riskLevel === 'high' ? 'destructive' : 'secondary'}
                            className={alert.riskLevel === 'high' ? '' : 'bg-red-500'}
                          >
                            {alert.riskLevel.toUpperCase()} RISK
                          </Badge>
                          <Badge variant="outline" className="font-mono">
                            Score: {alert.riskScore.toFixed(1)}/10
                          </Badge>
                        </div>
                        <p className="text-sm text-red-700">
                          {alert.message}
                        </p>
                        <div className="mt-2 flex items-center text-sm text-slate-600">
                          <Clock className="h-4 w-4 mr-1" />
                          Suggested: {alert.suggestedAction}
                        </div>
                      </div>
                      <Button
                        onClick={() => autoRotateMutation.mutate(alert.id)}
                        disabled={autoRotateMutation.isPending}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        {autoRotateMutation.isPending ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Rotating...
                          </>
                        ) : (
                          <>
                            <ArrowLeftRight className="w-4 h-4 mr-2" />
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
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
                  <h3 className="text-xl font-semibold text-green-800 mb-2">All Clear!</h3>
                  <p className="text-green-600">No active burnout alerts. All elves are working within safe parameters.</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Resolved Alerts */}
          {resolvedAlerts.length > 0 && (
            <Card className="opacity-75">
              <CardHeader>
                <CardTitle className="text-lg flex items-center text-slate-600">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                  Resolved Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {resolvedAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="font-medium text-slate-700">{alert.elfName}</span>
                      <span className="text-sm text-slate-500">Risk was {alert.riskScore.toFixed(1)}</span>
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-300">
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
              <div className="bg-slate-100 rounded-lg p-4 font-mono text-sm">
                <p className="text-slate-700 mb-2">Risk Score = </p>
                <ul className="space-y-1 ml-4 text-slate-600">
                  <li>+ recent_hours × 0.30</li>
                  <li>+ consecutive_days × 0.25</li>
                  <li>+ task_stress × 0.20</li>
                  <li>- breaks_taken × 0.15</li>
                  <li>- preference_match × 0.10</li>
                </ul>
                <div className="mt-4 flex items-center space-x-4 text-sm">
                  <span className="flex items-center">
                    <span className="w-3 h-3 rounded bg-green-500 mr-2"></span>
                    Low: 0-3
                  </span>
                  <span className="flex items-center">
                    <span className="w-3 h-3 rounded bg-orange-500 mr-2"></span>
                    Medium: 4-6
                  </span>
                  <span className="flex items-center">
                    <span className="w-3 h-3 rounded bg-red-500 mr-2"></span>
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
