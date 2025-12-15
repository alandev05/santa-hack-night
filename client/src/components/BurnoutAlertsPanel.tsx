import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import * as RadixIcons from "@radix-ui/react-icons";
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
      case 'medium': return 'bg-accent text-foreground border-border';
      case 'high': return 'bg-accent text-foreground border-border';
      case 'critical': return 'bg-accent text-foreground border-border';
      default: return 'bg-muted text-muted-foreground border-border';
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
          <RadixIcons.ExclamationTriangleIcon className="h-5 w-5" />
          Burnout Risk Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <RadixIcons.PersonIcon className="h-10 w-10 mx-auto mb-2 opacity-50" />
            No burnout alerts. All staff appear to be in good mental health.
          </div>
        ) : (
          <div className="space-y-4">
            {data.map((staff) => (
              <div key={staff.staffId} className={`border rounded-lg p-4 ${getRiskColor(staff.riskLevel)}`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-foreground">{staff.staffName}</h3>
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
                    <div className="text-sm text-foreground">
                      <span className="font-medium">Burnout Probability:</span> {staff.burnoutProbability}%
                    </div>
                    <div className="text-sm text-foreground">
                      <span className="font-medium">Turnover Risk:</span> {staff.predictedTurnoverRisk}%
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-foreground">Recommended Actions:</div>
                    {staff.recommendations.slice(0, 2).map((rec, index) => (
                      <div key={index} className="text-xs bg-secondary/10 p-2 rounded border-l-2 border-secondary text-foreground">
                        {rec}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="border-border">
                    <RadixIcons.CalendarIcon className="h-3 w-3 mr-1" />
                    Schedule Check-in
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="border-border"
                    onClick={() => setLocation(`/all-assessments?staff=${staff.staffId}`)}
                  >
                    <RadixIcons.ArrowDownIcon className="h-3 w-3 mr-1" />
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