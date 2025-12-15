import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import * as RadixIcons from "@radix-ui/react-icons";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ShiftOptimizationProps {
  data: Array<{
    staffId: number;
    staffName: string;
    currentShift: { start: string; end: string };
    optimalShift: { start: string; end: string };
    confidenceScore: number;
    projectedImprovement: number;
    sentimentByHour: Array<{ hour: number; sentiment: number }>;
  }>;
}

export default function ShiftOptimizationPanel({ data }: ShiftOptimizationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RadixIcons.ClockIcon className="h-5 w-5" />
          Smart Shift Optimization
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No shift optimization data available. Requires sufficient assessment history.
          </div>
        ) : (
          <div className="space-y-6">
            {data.map((staff) => (
              <div key={staff.staffId} className="border border-border rounded-lg p-4 space-y-4 bg-card">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-foreground">{staff.staffName}</h3>
                  <Badge variant={staff.projectedImprovement > 10 ? "default" : "secondary"}>
                    +{staff.projectedImprovement}% improvement
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-foreground">Current Shift</div>
                    <div className="text-sm text-muted-foreground">
                      {staff.currentShift.start} - {staff.currentShift.end}
                    </div>
                    
                    <div className="text-sm font-medium text-foreground">Recommended Shift</div>
                    <div className="text-sm text-secondary font-medium">
                      {staff.optimalShift.start} - {staff.optimalShift.end}
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      Confidence: {staff.confidenceScore}%
                    </div>
                  </div>
                  
                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={staff.sentimentByHour.slice(6, 20)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="hour" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                        <YAxis domain={[1, 5]} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '0.5rem',
                            color: 'hsl(var(--card-foreground))'
                          }} 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="sentiment" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={2}
                          dot={{ r: 2, fill: 'hsl(var(--primary))' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}