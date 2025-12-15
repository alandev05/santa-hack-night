"""
FastAPI server for ElfShift AI agent.
Provides endpoints for schedule generation and auto-rotation.
"""

import os
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

from runner import generate_schedule_with_agent, auto_rotate_with_agent

app = FastAPI(
    title="ElfShift Agent API",
    description="AI-powered shift scheduling for Santa's workshop",
    version="1.0.0"
)

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5000", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request/Response models
class Elf(BaseModel):
    id: str
    name: str
    skills: List[str]
    preferences: List[str]
    recentHours: float
    consecutiveDays: int
    lastBreak: str
    breaksTaken: int


class Station(BaseModel):
    id: str
    name: str
    staffNeeded: int
    stressLevel: float


class Order(BaseModel):
    id: str
    quantity: int
    priority: str
    requiredStations: List[str]


class ScheduleRequest(BaseModel):
    orders: List[Order]
    elves: List[Elf]
    stations: List[Station]


class RotateRequest(BaseModel):
    elfId: str
    elfName: str
    elves: List[Elf]


class ScheduleResponse(BaseModel):
    success: bool
    schedule: Optional[list] = None
    alerts: Optional[list] = None
    summary: Optional[str] = None
    error: Optional[str] = None


class RotateResponse(BaseModel):
    success: bool
    message: str
    rotation: Optional[dict] = None
    slackNotified: bool = False


# Health check
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "elfshift-agent"}


# Generate schedule
@app.post("/generate-schedule", response_model=ScheduleResponse)
async def api_generate_schedule(request: ScheduleRequest):
    """
    Generate an optimized shift schedule using AI.

    Takes today's orders, available elves, and station needs,
    and returns assignments with burnout risk analysis.
    """
    try:
        # Convert Pydantic models to dicts
        orders = [o.model_dump() for o in request.orders]
        elves = [e.model_dump() for e in request.elves]
        stations = [s.model_dump() for s in request.stations]

        result = await generate_schedule_with_agent(orders, elves, stations)

        return ScheduleResponse(
            success=result.get("success", False),
            schedule=result.get("schedule", []),
            alerts=result.get("alerts", []),
            summary=result.get("summary", "Schedule generated")
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Auto-rotate
@app.post("/auto-rotate", response_model=RotateResponse)
async def api_auto_rotate(request: RotateRequest):
    """
    Automatically rotate an at-risk elf with a suitable partner.

    Finds the best elf to swap with based on:
    - Lower burnout risk
    - Compatible skills
    - Recent break history
    """
    try:
        elves = [e.model_dump() for e in request.elves]

        result = await auto_rotate_with_agent(
            request.elfId,
            request.elfName,
            elves
        )

        return RotateResponse(
            success=result.get("success", False),
            message=result.get("message", ""),
            rotation=result.get("rotation"),
            slackNotified=result.get("slackNotified", False)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
