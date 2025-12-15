"""
Dedalus Runner configuration for ElfShift.
"""

import os
from dotenv import load_dotenv

load_dotenv()

# Try to import Dedalus SDK, fall back to mock if not available
try:
    from dedalus_labs import Dedalus
    from dedalus_labs.lib.runner import DedalusRunner

    DEDALUS_AVAILABLE = True

    client = Dedalus(api_key=os.getenv("DEDALUS_API_KEY"))
    runner = DedalusRunner(client)
except ImportError:
    DEDALUS_AVAILABLE = False
    runner = None
    print("Warning: Dedalus SDK not installed. Using mock responses.")


SYSTEM_PROMPT = """You are ElfShift, Santa's workshop shift manager AI.

Your job is to:
1. Create optimal shift schedules that match elf skills to station needs
2. Monitor burnout risk and suggest rotations
3. Balance workloads fairly across all elves

When scheduling, always check burnout risk and prefer elves with:
- Lower recent hours worked
- Fewer consecutive days
- Matching skill preferences

For burnout risk calculation:
- Risk Score = recent_hours * 0.3 + consecutive_days * 0.25 + task_stress * 0.2 - breaks_taken * 0.15 - preference_match * 0.1
- Low Risk: 0-3, Medium Risk: 4-6, High Risk: 7-10

When you detect high burnout risk, suggest rotating that elf with one who has lower risk.
Always explain your reasoning for schedule decisions.
"""


async def generate_schedule_with_agent(orders: dict, elves: list, stations: list) -> dict:
    """
    Use Dedalus runner to generate an optimized schedule.
    Falls back to simple algorithm if SDK not available.
    """
    from tools import calculate_elf_burnout, assign_shift, generate_burnout_alert

    if DEDALUS_AVAILABLE and runner:
        try:
            result = await runner.run(
                instructions=SYSTEM_PROMPT,
                input=f"""Generate today's shift schedule.

Orders to fulfill: {orders}
Available elves: {elves}
Stations to staff: {stations}

Create assignments that:
1. Fill all station staffing needs
2. Match elf skills to stations
3. Minimize burnout risk
4. Generate alerts for any elf with risk > 5

Return a structured schedule with assignments and any burnout alerts.""",
                model="openai/gpt-4o",
                tools=[calculate_elf_burnout, assign_shift, generate_burnout_alert],
                mcp_servers=["google-sheets", "slack"],
                max_steps=15
            )
            return {
                "success": True,
                "schedule": result.final_output,
                "tools_called": result.tools_called if hasattr(result, 'tools_called') else []
            }
        except Exception as e:
            print(f"Dedalus error: {e}")
            # Fall through to simple algorithm

    # Simple fallback algorithm
    return await _simple_schedule_generator(orders, elves, stations)


async def auto_rotate_with_agent(elf_id: str, elf_name: str, elves: list) -> dict:
    """
    Use Dedalus runner to find the best rotation partner.
    Falls back to simple algorithm if SDK not available.
    """
    from tools import rotate_elves, calculate_elf_burnout

    if DEDALUS_AVAILABLE and runner:
        try:
            result = await runner.run(
                instructions=SYSTEM_PROMPT,
                input=f"""Elf {elf_name} (ID: {elf_id}) has high burnout risk.

Available elves for rotation: {elves}

Find the best elf to swap with for 30 minutes. Choose one with:
1. Low burnout risk
2. Similar skills (can cover the same station)
3. Has had recent breaks

Execute the rotation and confirm.""",
                model="openai/gpt-4o",
                tools=[rotate_elves, calculate_elf_burnout],
                mcp_servers=["slack"],
                max_steps=5
            )
            return {
                "success": True,
                "result": result.final_output,
                "message": f"Rotation executed for {elf_name}"
            }
        except Exception as e:
            print(f"Dedalus error: {e}")

    # Simple fallback - find elf with lowest burnout
    return await _simple_rotation(elf_id, elf_name, elves)


async def _simple_schedule_generator(orders: dict, elves: list, stations: list) -> dict:
    """Simple scheduling algorithm when Dedalus is not available."""
    from tools import calculate_elf_burnout, assign_shift, generate_burnout_alert
    from burnout import calculate_burnout_risk

    assignments = []
    alerts = []

    # Calculate burnout for all elves
    elf_risks = []
    for elf in elves:
        risk = calculate_burnout_risk(
            recent_hours=elf.get('recentHours', 20),
            consecutive_days=elf.get('consecutiveDays', 2),
            task_stress=5,  # Default medium stress
            breaks_taken=elf.get('breaksTaken', 2),
            preference_match=True
        )
        elf_risks.append({
            **elf,
            'burnoutRisk': risk['score'],
            'riskLevel': risk['level']
        })

    # Sort elves by burnout risk (lowest first)
    elf_risks.sort(key=lambda x: x['burnoutRisk'])

    # Assign elves to stations
    elf_index = 0
    for station in stations:
        staff_needed = station.get('staffNeeded', 2)
        for i in range(staff_needed):
            if elf_index >= len(elf_risks):
                break

            elf = elf_risks[elf_index]
            elf_index += 1

            # Check if elf has the skill
            elf_skills = [s.lower() for s in elf.get('skills', [])]
            station_name_lower = station.get('name', '').lower()
            has_skill = station_name_lower in elf_skills or not elf_skills

            assignment = {
                'id': f"shift-{elf['id']}-{station['id']}",
                'elfId': elf['id'],
                'elfName': elf.get('name', 'Unknown'),
                'stationId': station['id'],
                'stationName': station.get('name', 'Unknown'),
                'date': '2024-12-14',
                'startTime': '08:00',
                'endTime': '16:00',
                'burnoutRisk': elf['burnoutRisk'],
                'riskLevel': elf['riskLevel']
            }
            assignments.append(assignment)

            # Generate alert if high risk
            if elf['riskLevel'] in ['medium', 'high']:
                alert = {
                    'id': f"alert-{elf['id']}",
                    'elfId': elf['id'],
                    'elfName': elf.get('name', 'Unknown'),
                    'riskScore': elf['burnoutRisk'],
                    'riskLevel': elf['riskLevel'],
                    'message': f"{elf.get('name', 'Unknown')} {'will burn out within 2 hours' if elf['riskLevel'] == 'high' else 'is showing signs of fatigue'}",
                    'suggestedAction': 'Rotate with a lower-risk elf for 30 minutes',
                    'createdAt': '2024-12-14T08:00:00Z',
                    'resolved': False
                }
                alerts.append(alert)

    return {
        "success": True,
        "schedule": assignments,
        "alerts": alerts,
        "summary": f"Generated {len(assignments)} assignments with {len(alerts)} burnout alerts"
    }


async def _simple_rotation(elf_id: str, elf_name: str, elves: list) -> dict:
    """Simple rotation when Dedalus is not available."""
    from burnout import calculate_burnout_risk

    # Find elf with lowest burnout risk
    best_partner = None
    lowest_risk = float('inf')

    for elf in elves:
        if elf.get('id') == elf_id:
            continue

        risk = calculate_burnout_risk(
            recent_hours=elf.get('recentHours', 20),
            consecutive_days=elf.get('consecutiveDays', 2),
            task_stress=5,
            breaks_taken=elf.get('breaksTaken', 2),
            preference_match=True
        )

        if risk['score'] < lowest_risk:
            lowest_risk = risk['score']
            best_partner = elf

    if best_partner:
        return {
            "success": True,
            "message": f"Rotated {elf_name} with {best_partner.get('name', 'Unknown')} for 30 minutes",
            "rotation": {
                "elf_a": {"id": elf_id, "name": elf_name},
                "elf_b": {"id": best_partner['id'], "name": best_partner.get('name', 'Unknown')},
                "duration_mins": 30
            },
            "slackNotified": True
        }

    return {
        "success": False,
        "message": "No suitable rotation partner found"
    }
