import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Terminal } from "@/components/Terminal";
import * as RadixIcons from "@radix-ui/react-icons";
import type { ShiftAssignment, Station } from "@shared/types";

export default function Schedule() {
  const { data: schedule, isLoading: scheduleLoading } = useQuery<ShiftAssignment[]>({
    queryKey: ["/api/schedule"],
  });

  const { data: stations, isLoading: stationsLoading } = useQuery<Station[]>({
    queryKey: ["/api/stations"],
  });

  const isLoading = scheduleLoading || stationsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            <Skeleton className="h-8 w-64 bg-muted" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <Skeleton className="h-40 w-full bg-muted" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  const getStationIcon = (name: string) => {
    switch (name?.toLowerCase()) {
      case 'wrapping': return RadixIcons.StarIcon;
      case 'qa': return RadixIcons.CheckCircledIcon;
      case 'assembly': return RadixIcons.GearIcon;
      default: return RadixIcons.CubeIcon;
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return 'bg-accent text-foreground border-border';
      case 'medium': return 'bg-muted text-foreground border-border';
      default: return 'bg-card text-foreground border-border';
    }
  };

  const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

  // Group schedule by station
  const scheduleByStation = stations?.map(station => ({
    station,
    assignments: schedule?.filter(s => s.stationId === station.id) || []
  })) || [];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h2 className="text-3xl font-semibold text-foreground">Shift Schedule</h2>
            <p className="text-muted-foreground text-sm mt-1">Today's elf assignments by station</p>
          </div>

          {/* Schedule Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {scheduleByStation.map(({ station, assignments }) => {
              const Icon = getStationIcon(station.name);

              return (
                <Card key={station.id} className="overflow-hidden">
                  <CardHeader className="bg-muted border-b border-border">
                    <CardTitle className="flex items-center space-x-2 text-foreground">
                      <Icon className="h-4 w-4 text-foreground" />
                      <span>{station.name}</span>
                      <Badge variant="secondary" className="ml-auto">
                        {assignments.length}/{station.staffNeeded} elves
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    {assignments.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <RadixIcons.CubeIcon className="h-10 w-10 mx-auto mb-2 opacity-50" />
                        <p>No elves assigned yet</p>
                        <p className="text-sm">Generate a schedule to assign elves</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {assignments.map((assignment) => (
                          <div
                            key={assignment.id}
                            className={`p-3 rounded-lg border ${getRiskColor(assignment.riskLevel)}`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-foreground">{assignment.elfName}</span>
                              <Badge
                                variant="outline"
                                className={getRiskColor(assignment.riskLevel)}
                              >
                                Risk: {assignment.burnoutRisk.toFixed(1)}
                              </Badge>
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <RadixIcons.ClockIcon className="h-4 w-4 mr-1" />
                              {assignment.startTime} - {assignment.endTime}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Terminal and Timeline */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Terminal context="schedule" />
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Timeline View</CardTitle>
              </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                  {/* Time header */}
                  <div className="flex border-b border-border pb-2 mb-4">
                    <div className="w-32 flex-shrink-0 font-medium text-muted-foreground">Station</div>
                    <div className="flex-1 flex">
                      {timeSlots.map((time) => (
                        <div key={time} className="flex-1 text-center text-sm text-muted-foreground">
                          {time}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Station rows */}
                  {scheduleByStation.map(({ station, assignments }) => (
                    <div key={station.id} className="flex items-center mb-3">
                      <div className="w-32 flex-shrink-0 font-medium text-foreground">
                        {station.name}
                      </div>
                      <div className="flex-1 flex relative h-10 bg-muted rounded">
                        {assignments.map((assignment) => {
                          const startHour = parseInt(assignment.startTime.split(':')[0]);
                          const endHour = parseInt(assignment.endTime.split(':')[0]);
                          const startOffset = ((startHour - 8) / 10) * 100;
                          const width = ((endHour - startHour) / 10) * 100;

                          return (
                            <div
                              key={assignment.id}
                              className={`absolute h-8 top-1 rounded ${
                                assignment.riskLevel === 'high' ? 'bg-primary text-primary-foreground' :
                                assignment.riskLevel === 'medium' ? 'bg-secondary text-secondary-foreground' :
                                'bg-accent text-accent-foreground'
                              } flex items-center justify-center text-xs font-medium px-2 truncate`}
                              style={{
                                left: `${startOffset}%`,
                                width: `${width}%`,
                              }}
                              title={`${assignment.elfName} (${assignment.startTime}-${assignment.endTime})`}
                            >
                              {assignment.elfName}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            </Card>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center space-x-6 text-sm text-foreground">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded bg-accent"></div>
              <span>Low Risk</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded bg-secondary"></div>
              <span>Medium Risk</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded bg-primary"></div>
              <span>High Risk</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
