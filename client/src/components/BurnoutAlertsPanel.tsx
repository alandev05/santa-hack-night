import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Users, TrendingDown, Calendar } from "lucide-react";
import { useLocation } from "wouter";

interface BurnoutAlertsProps {
  data: Array<{
    staffId: number;
    staffName: string;
    riskLevel: 'medium' | 'high' | 'critical';
    burnoutProbability: number;
    interventionUrgency: 'low' | 'moderate' | 'urgent';
    recommendations: string[];
    predictedTurnoverRisk: number;
  }>;
}

export default function BurnoutAlertsPanel({ data }: BurnoutAlertsProps) {
  const [, setLocation] = useLocation();
  
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return 'destructive';
      case 'moderate': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Burnout Risk Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
            No burnout alerts. All staff appear to be in good mental health.
          </div>
        ) : (
          <div className="space-y-4">
            {data.map((staff) => (
              <div key={staff.staffId} className={`border rounded-lg p-4 ${getRiskColor(staff.riskLevel)}`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">{staff.staffName}</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant={getUrgencyColor(staff.interventionUrgency)}>
                      {staff.interventionUrgency}
                    </Badge>
                    <Badge className={getRiskColor(staff.riskLevel)}>
                      {staff.riskLevel} risk
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium">Burnout Probability:</span> {staff.burnoutProbability}%
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Turnover Risk:</span> {staff.predictedTurnoverRisk}%
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Recommended Actions:</div>
                    {staff.recommendations.slice(0, 2).map((rec, index) => (
                      <div key={index} className="text-xs bg-white/70 p-2 rounded border-l-2 border-blue-400">
                        {rec}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Calendar className="h-3 w-3 mr-1" />
                    Schedule Check-in
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setLocation(`/all-assessments?staff=${staff.staffId}`)}
                  >
                    <TrendingDown className="h-3 w-3 mr-1" />
                    View History
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}