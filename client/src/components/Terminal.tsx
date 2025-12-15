import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import * as RadixIcons from "@radix-ui/react-icons";

interface TerminalLine {
  type: "command" | "output" | "system" | "success" | "error";
  text: string;
  timestamp?: string;
}

interface TerminalProps {
  context?: "dashboard" | "schedule" | "alerts";
  initialLines?: TerminalLine[];
  showCommands?: boolean;
}

export function Terminal({ context = "dashboard", initialLines, showCommands = true }: TerminalProps) {
  const getDefaultLines = (): TerminalLine[] => {
    if (initialLines) return initialLines;
    
    switch (context) {
      case "schedule":
        return [
          { type: "system", text: "Schedule Monitor v1.0.0", timestamp: new Date().toLocaleTimeString() },
          { type: "output", text: "Monitoring shift assignments...", timestamp: new Date().toLocaleTimeString() },
          { type: "success", text: "✓ Schedule system active", timestamp: new Date().toLocaleTimeString() },
        ];
      case "alerts":
        return [
          { type: "system", text: "Alert Monitor v1.0.0", timestamp: new Date().toLocaleTimeString() },
          { type: "output", text: "Monitoring burnout risks...", timestamp: new Date().toLocaleTimeString() },
          { type: "success", text: "✓ Alert system active", timestamp: new Date().toLocaleTimeString() },
        ];
      default:
        return [
          { type: "system", text: "ElfShift Terminal v1.0.0 - Workshop Management System", timestamp: new Date().toLocaleTimeString() },
          { type: "system", text: "Initializing shift scheduler...", timestamp: new Date().toLocaleTimeString() },
          { type: "output", text: "Connected to workshop database", timestamp: new Date().toLocaleTimeString() },
          { type: "success", text: "✓ System ready", timestamp: new Date().toLocaleTimeString() },
        ];
    }
  };

  const [lines, setLines] = useState<TerminalLine[]>(getDefaultLines());
  const [currentInput, setCurrentInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  const executeCommand = (cmd: string) => {
    if (!cmd.trim()) return;

    // Add command to history
    const newHistory = [...commandHistory, cmd];
    setCommandHistory(newHistory);
    setHistoryIndex(newHistory.length);

    // Add command line
    setLines((prev) => [
      ...prev,
      { type: "command", text: `$ ${cmd}`, timestamp: new Date().toLocaleTimeString() },
    ]);

    // Simulate command execution
    setTimeout(() => {
      const cmdLower = cmd.toLowerCase().trim();
      let response: TerminalLine[] = [];

      if (cmdLower === "help" || cmdLower === "h") {
        response = [
          { type: "output", text: "Available commands:", timestamp: new Date().toLocaleTimeString() },
          { type: "output", text: "  help, h          - Show this help message", timestamp: new Date().toLocaleTimeString() },
          { type: "output", text: "  status           - Show system status", timestamp: new Date().toLocaleTimeString() },
          { type: "output", text: "  elves            - List all elves", timestamp: new Date().toLocaleTimeString() },
          { type: "output", text: "  stations         - List all stations", timestamp: new Date().toLocaleTimeString() },
          { type: "output", text: "  schedule         - View current schedule", timestamp: new Date().toLocaleTimeString() },
          { type: "output", text: "  alerts           - Show burnout alerts", timestamp: new Date().toLocaleTimeString() },
          { type: "output", text: "  clear, cls       - Clear terminal", timestamp: new Date().toLocaleTimeString() },
        ];
      } else if (cmdLower === "status" || cmdLower === "stat") {
        if (context === "schedule") {
          response = [
            { type: "output", text: "Schedule System Status:", timestamp: new Date().toLocaleTimeString() },
            { type: "success", text: "✓ Schedule loaded", timestamp: new Date().toLocaleTimeString() },
            { type: "success", text: "✓ Stations monitored", timestamp: new Date().toLocaleTimeString() },
            { type: "output", text: "View schedule details above", timestamp: new Date().toLocaleTimeString() },
          ];
        } else if (context === "alerts") {
          response = [
            { type: "output", text: "Alert System Status:", timestamp: new Date().toLocaleTimeString() },
            { type: "success", text: "✓ Alert monitoring active", timestamp: new Date().toLocaleTimeString() },
            { type: "success", text: "✓ Risk assessment running", timestamp: new Date().toLocaleTimeString() },
            { type: "output", text: "View alert details below", timestamp: new Date().toLocaleTimeString() },
          ];
        } else {
          response = [
            { type: "output", text: "System Status:", timestamp: new Date().toLocaleTimeString() },
            { type: "success", text: "✓ Database: Connected", timestamp: new Date().toLocaleTimeString() },
            { type: "success", text: "✓ Scheduler: Active", timestamp: new Date().toLocaleTimeString() },
            { type: "success", text: "✓ Monitoring: Enabled", timestamp: new Date().toLocaleTimeString() },
            { type: "output", text: "Last update: " + new Date().toLocaleString(), timestamp: new Date().toLocaleTimeString() },
          ];
        }
      } else if (cmdLower === "elves") {
        response = [
          { type: "output", text: "Loading elf roster...", timestamp: new Date().toLocaleTimeString() },
          { type: "output", text: "Use the dashboard to view detailed elf information.", timestamp: new Date().toLocaleTimeString() },
        ];
      } else if (cmdLower === "stations") {
        response = [
          { type: "output", text: "Workshop Stations:", timestamp: new Date().toLocaleTimeString() },
          { type: "output", text: "  • Wrapping Station", timestamp: new Date().toLocaleTimeString() },
          { type: "output", text: "  • Quality Assurance", timestamp: new Date().toLocaleTimeString() },
          { type: "output", text: "  • Assembly Line", timestamp: new Date().toLocaleTimeString() },
        ];
      } else if (cmdLower === "schedule") {
        if (context === "schedule") {
          response = [
            { type: "output", text: "Current shift schedule:", timestamp: new Date().toLocaleTimeString() },
            { type: "output", text: "View detailed timeline on the right.", timestamp: new Date().toLocaleTimeString() },
          ];
        } else {
          response = [
            { type: "output", text: "Current shift schedule:", timestamp: new Date().toLocaleTimeString() },
            { type: "output", text: "View detailed schedule on the Schedule page.", timestamp: new Date().toLocaleTimeString() },
          ];
        }
      } else if (cmdLower === "alerts") {
        if (context === "alerts") {
          response = [
            { type: "output", text: "Checking for burnout alerts...", timestamp: new Date().toLocaleTimeString() },
            { type: "output", text: "View detailed alerts below.", timestamp: new Date().toLocaleTimeString() },
          ];
        } else {
          response = [
            { type: "output", text: "Checking for burnout alerts...", timestamp: new Date().toLocaleTimeString() },
            { type: "output", text: "View detailed alerts on the Alerts page.", timestamp: new Date().toLocaleTimeString() },
          ];
        }
      } else if (cmdLower === "clear" || cmdLower === "cls") {
        setLines([
          { type: "system", text: "Terminal cleared", timestamp: new Date().toLocaleTimeString() },
        ]);
        return;
      } else {
        response = [
          { type: "error", text: `Command not found: ${cmd}`, timestamp: new Date().toLocaleTimeString() },
          { type: "output", text: "Type 'help' for available commands", timestamp: new Date().toLocaleTimeString() },
        ];
      }

      setLines((prev) => [...prev, ...response]);
    }, 300);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executeCommand(currentInput);
      setCurrentInput("");
      setHistoryIndex(commandHistory.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex > 0 ? historyIndex - 1 : 0;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex]);
      } else {
        setHistoryIndex(commandHistory.length);
        setCurrentInput("");
      }
    }
  };

  const getLineColor = (type: TerminalLine["type"]) => {
    switch (type) {
      case "command":
        return "text-foreground";
      case "output":
        return "text-foreground/90";
      case "system":
        return "text-muted-foreground";
      case "success":
        return "text-foreground";
      case "error":
        return "text-destructive";
      default:
        return "text-foreground/80";
    }
  };

  const getLinePrefix = (type: TerminalLine["type"]) => {
    switch (type) {
      case "success":
        return "✓";
      case "error":
        return "✗";
      default:
        return "";
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted border-b border-border p-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-foreground flex items-center space-x-2">
            <RadixIcons.GearIcon className="h-4 w-4" />
            <span>Terminal</span>
          </CardTitle>
          <div className="flex items-center space-x-1">
            <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30"></div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div
          ref={terminalRef}
          className="h-64 bg-background font-mono text-sm overflow-y-auto p-4 space-y-1 terminal-scrollbar"
          style={{
            fontFamily: "'Courier New', 'Monaco', 'Menlo', monospace",
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(255, 255, 255, 0.1) transparent",
          }}
        >
          {lines.map((line, index) => (
            <div
              key={index}
              className={`${getLineColor(line.type)} flex items-start space-x-2`}
            >
              {line.timestamp && (
                <span className="text-muted-foreground text-xs shrink-0">
                  [{line.timestamp}]
                </span>
              )}
              {getLinePrefix(line.type) && (
                <span className="shrink-0">{getLinePrefix(line.type)}</span>
              )}
              <span className="break-words">{line.text}</span>
            </div>
          ))}
          {showCommands && (
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-muted-foreground">$</span>
              <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent text-foreground outline-none border-none font-mono"
                placeholder="Type a command..."
                autoFocus
              />
              <span className="text-muted-foreground terminal-cursor">▊</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

