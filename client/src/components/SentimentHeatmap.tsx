import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import * as RadixIcons from "@radix-ui/react-icons";

interface SentimentHeatmapProps {
  data: Array<{
    staffId: number;
    staffName: string;
    department: string;
    currentSentiment: 'positive' | 'neutral' | 'negative';
    sentimentConfidence: number;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    shiftOptimization: {
      currentShift: string;
      recommendedShift: string;
      projectedImprovement: number;
    };
    realTimeNudges: string[];
  }>;
}

export default function SentimentHeatmap({ data }: SentimentHeatmapProps) {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-accent text-foreground border-border';
      case 'negative': return 'bg-accent text-foreground border-border';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-secondary';
      case 'medium': return 'bg-accent';
      case 'high': return 'bg-primary';
      case 'critical': return 'bg-primary';
      default: return 'bg-muted';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RadixIcons.StarIcon className="h-5 w-5" />
          Real-Time Sentiment Heatmap
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No sentiment data available. Staff assessments will appear here.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((staff) => (
              <div key={staff.staffId} className="border border-border rounded-lg p-4 space-y-3 bg-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <RadixIcons.PersonIcon className="h-4 w-4 text-foreground" />
                    <span className="font-medium text-foreground">{staff.staffName}</span>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${getRiskColor(staff.riskLevel)}`} />
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">{staff.department}</div>
                  
                  <Badge className={getSentimentColor(staff.currentSentiment)}>
                    {staff.currentSentiment} ({staff.sentimentConfidence}%)
                  </Badge>
                  
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <RadixIcons.ClockIcon className="h-3 w-3" />
                    {staff.shiftOptimization.currentShift}
                  </div>
                  
                  {staff.realTimeNudges.length > 0 && (
                    <div className="text-xs bg-secondary/10 p-2 rounded border-l-4 border-secondary text-foreground">
                      {staff.realTimeNudges[0]}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}