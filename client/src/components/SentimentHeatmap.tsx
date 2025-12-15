import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, User, Clock } from "lucide-react";

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
      case 'positive': return 'bg-green-100 text-green-800 border-green-200';
      case 'negative': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-orange-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Real-Time Sentiment Heatmap
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No sentiment data available. Staff assessments will appear here.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((staff) => (
              <div key={staff.staffId} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="font-medium">{staff.staffName}</span>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${getRiskColor(staff.riskLevel)}`} />
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">{staff.department}</div>
                  
                  <Badge className={getSentimentColor(staff.currentSentiment)}>
                    {staff.currentSentiment} ({staff.sentimentConfidence}%)
                  </Badge>
                  
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="h-3 w-3" />
                    {staff.shiftOptimization.currentShift}
                  </div>
                  
                  {staff.realTimeNudges.length > 0 && (
                    <div className="text-xs bg-blue-50 p-2 rounded border-l-4 border-blue-400">
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