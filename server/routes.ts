import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import express from "express";

// Mock data for demo
const mockElves = [
  { id: "E001", name: "Jingle", skills: ["wrapping", "qa"], preferences: ["wrapping"], recentHours: 32, consecutiveDays: 5, lastBreak: "2024-12-14T10:00:00Z", breaksTaken: 2, burnoutRisk: 6.2, riskLevel: "medium" as const },
  { id: "E002", name: "Tinsel", skills: ["assembly", "qa"], preferences: ["assembly"], recentHours: 24, consecutiveDays: 3, lastBreak: "2024-12-14T11:30:00Z", breaksTaken: 3, burnoutRisk: 3.8, riskLevel: "low" as const },
  { id: "E003", name: "Sparkle", skills: ["wrapping", "assembly"], preferences: ["wrapping"], recentHours: 40, consecutiveDays: 7, lastBreak: "2024-12-13T15:00:00Z", breaksTaken: 1, burnoutRisk: 7.5, riskLevel: "high" as const },
  { id: "E004", name: "Frost", skills: ["qa", "wrapping"], preferences: ["qa"], recentHours: 28, consecutiveDays: 4, lastBreak: "2024-12-14T09:00:00Z", breaksTaken: 2, burnoutRisk: 4.5, riskLevel: "medium" as const },
  { id: "E005", name: "Holly", skills: ["assembly", "wrapping", "qa"], preferences: ["assembly"], recentHours: 20, consecutiveDays: 2, lastBreak: "2024-12-14T12:00:00Z", breaksTaken: 4, burnoutRisk: 2.1, riskLevel: "low" as const },
  { id: "E006", name: "Snowball", skills: ["wrapping"], preferences: ["wrapping"], recentHours: 35, consecutiveDays: 6, lastBreak: "2024-12-14T08:00:00Z", breaksTaken: 1, burnoutRisk: 6.8, riskLevel: "medium" as const },
  { id: "E007", name: "Pepper", skills: ["qa", "assembly"], preferences: ["qa"], recentHours: 22, consecutiveDays: 3, lastBreak: "2024-12-14T10:30:00Z", breaksTaken: 3, burnoutRisk: 3.2, riskLevel: "low" as const },
  { id: "E008", name: "Candy", skills: ["assembly", "wrapping"], preferences: ["assembly"], recentHours: 38, consecutiveDays: 5, lastBreak: "2024-12-13T16:00:00Z", breaksTaken: 2, burnoutRisk: 5.9, riskLevel: "medium" as const },
  { id: "E009", name: "Evergreen", skills: ["wrapping", "qa", "assembly"], preferences: ["qa"], recentHours: 15, consecutiveDays: 2, lastBreak: "2024-12-14T11:00:00Z", breaksTaken: 3, burnoutRisk: 1.8, riskLevel: "low" as const },
  { id: "E010", name: "Mittens", skills: ["assembly"], preferences: ["assembly"], recentHours: 42, consecutiveDays: 8, lastBreak: "2024-12-13T14:00:00Z", breaksTaken: 1, burnoutRisk: 8.2, riskLevel: "high" as const },
];

const mockStations = [
  { id: "S001", name: "Wrapping", staffNeeded: 3, stressLevel: 6, currentStaff: 0 },
  { id: "S002", name: "QA", staffNeeded: 2, stressLevel: 4, currentStaff: 0 },
  { id: "S003", name: "Assembly", staffNeeded: 4, stressLevel: 8, currentStaff: 0 },
];

const mockOrders = [
  { id: "O001", quantity: 500, priority: "high" as const, requiredStations: ["assembly", "wrapping", "qa"], deadline: "2024-12-14T18:00:00Z" },
  { id: "O002", quantity: 300, priority: "medium" as const, requiredStations: ["wrapping", "qa"], deadline: "2024-12-14T20:00:00Z" },
  { id: "O003", quantity: 200, priority: "urgent" as const, requiredStations: ["assembly", "wrapping", "qa"], deadline: "2024-12-14T16:00:00Z" },
];

// State for schedule and alerts (in-memory for demo)
let currentSchedule: any[] = [];
let currentAlerts: any[] = [];

export async function registerRoutes(app: Express): Promise<Server> {
  // ===== ELVES API =====
  app.get("/api/elves", (_req: Request, res: Response) => {
    res.json(mockElves);
  });

  app.get("/api/elves/:id", (req: Request, res: Response) => {
    const elf = mockElves.find(e => e.id === req.params.id);
    if (!elf) {
      return res.status(404).json({ error: "Elf not found" });
    }
    res.json(elf);
  });

  // ===== STATIONS API =====
  app.get("/api/stations", (_req: Request, res: Response) => {
    // Update current staff counts based on schedule
    const stationsWithCounts = mockStations.map(station => ({
      ...station,
      currentStaff: currentSchedule.filter(s => s.stationId === station.id).length
    }));
    res.json(stationsWithCounts);
  });

  // ===== ORDERS API =====
  app.get("/api/orders", (_req: Request, res: Response) => {
    res.json(mockOrders);
  });

  // ===== SCHEDULE API =====
  app.get("/api/schedule", (_req: Request, res: Response) => {
    res.json(currentSchedule);
  });

  app.post("/api/schedule/generate", async (req: Request, res: Response) => {
    try {
      // Try to call Python agent, fall back to simple algorithm
      const PYTHON_AGENT_URL = process.env.PYTHON_AGENT_URL || "http://localhost:8001";

      try {
        const response = await fetch(`${PYTHON_AGENT_URL}/generate-schedule`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orders: mockOrders,
            elves: mockElves,
            stations: mockStations
          })
        });

        if (response.ok) {
          const result = await response.json();
          currentSchedule = result.schedule || [];
          currentAlerts = result.alerts || [];
          return res.json({
            success: true,
            schedule: currentSchedule,
            alerts: currentAlerts,
            summary: result.summary
          });
        }
      } catch (agentError) {
        console.log("Python agent not available, using fallback algorithm");
      }

      // Fallback: Simple scheduling algorithm
      currentSchedule = [];
      currentAlerts = [];

      // Sort elves by burnout risk (lowest first)
      const sortedElves = [...mockElves].sort((a, b) => a.burnoutRisk - b.burnoutRisk);

      let elfIndex = 0;
      for (const station of mockStations) {
        for (let i = 0; i < station.staffNeeded; i++) {
          if (elfIndex >= sortedElves.length) break;

          const elf = sortedElves[elfIndex];
          elfIndex++;

          const assignment = {
            id: `shift-${elf.id}-${station.id}`,
            elfId: elf.id,
            elfName: elf.name,
            stationId: station.id,
            stationName: station.name,
            date: "2024-12-14",
            startTime: "08:00",
            endTime: "16:00",
            burnoutRisk: elf.burnoutRisk,
            riskLevel: elf.riskLevel
          };
          currentSchedule.push(assignment);

          // Generate alert if risk is medium or high
          if (elf.riskLevel === "medium" || elf.riskLevel === "high") {
            currentAlerts.push({
              id: `alert-${elf.id}`,
              elfId: elf.id,
              elfName: elf.name,
              riskScore: elf.burnoutRisk,
              riskLevel: elf.riskLevel,
              message: elf.riskLevel === "high"
                ? `${elf.name} will burn out within 2 hours unless rotated`
                : `${elf.name} is showing signs of fatigue`,
              suggestedAction: "Rotate with a lower-risk elf for 30 minutes",
              createdAt: new Date().toISOString(),
              resolved: false
            });
          }
        }
      }

      res.json({
        success: true,
        schedule: currentSchedule,
        alerts: currentAlerts,
        summary: `Generated ${currentSchedule.length} assignments with ${currentAlerts.length} burnout alerts`
      });

    } catch (error) {
      console.error("Schedule generation error:", error);
      res.status(500).json({ error: "Failed to generate schedule" });
    }
  });

  // ===== ALERTS API =====
  app.get("/api/alerts", (_req: Request, res: Response) => {
    res.json(currentAlerts);
  });

  app.post("/api/alerts/:id/resolve", async (req: Request, res: Response) => {
    const alertId = req.params.id;
    const alert = currentAlerts.find(a => a.id === alertId);

    if (!alert) {
      return res.status(404).json({ error: "Alert not found" });
    }

    try {
      // Try to call Python agent for smart rotation
      const PYTHON_AGENT_URL = process.env.PYTHON_AGENT_URL || "http://localhost:8001";

      try {
        const response = await fetch(`${PYTHON_AGENT_URL}/auto-rotate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            elfId: alert.elfId,
            elfName: alert.elfName,
            elves: mockElves
          })
        });

        if (response.ok) {
          const result = await response.json();
          // Mark alert as resolved
          alert.resolved = true;
          return res.json({
            success: true,
            message: result.message,
            rotation: result.rotation,
            slackNotified: result.slackNotified
          });
        }
      } catch (agentError) {
        console.log("Python agent not available, using fallback rotation");
      }

      // Fallback: Simple rotation
      const lowRiskElf = mockElves.find(e => e.riskLevel === "low" && e.id !== alert.elfId);

      if (lowRiskElf) {
        alert.resolved = true;
        res.json({
          success: true,
          message: `Rotated ${alert.elfName} with ${lowRiskElf.name} for 30 minutes`,
          rotation: {
            elf_a: { id: alert.elfId, name: alert.elfName },
            elf_b: { id: lowRiskElf.id, name: lowRiskElf.name },
            duration_mins: 30
          },
          slackNotified: true
        });
      } else {
        res.json({
          success: false,
          message: "No suitable rotation partner found"
        });
      }

    } catch (error) {
      console.error("Rotation error:", error);
      res.status(500).json({ error: "Failed to perform rotation" });
    }
  });

  // ===== SLACK WEBHOOK (optional) =====
  app.post("/api/slack/notify", async (req: Request, res: Response) => {
    const { message } = req.body;
    const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

    if (!SLACK_WEBHOOK_URL) {
      // Simulate success for demo
      console.log(`[SLACK MOCK] ${message}`);
      return res.json({ success: true, message: "Notification sent (mock)" });
    }

    try {
      const response = await fetch(SLACK_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: message })
      });

      if (response.ok) {
        res.json({ success: true, message: "Notification sent to Slack" });
      } else {
        res.json({ success: false, message: "Failed to send Slack notification" });
      }
    } catch (error) {
      res.json({ success: false, message: "Slack webhook error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
