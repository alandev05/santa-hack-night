"""
Custom tools for the ElfShift Dedalus agent.
These functions can be called by the AI model during scheduling.
"""

from typing import Optional
from burnout import calculate_burnout_risk


def calculate_elf_burnout(
    elf_id: str,
    elf_name: str,
    recent_hours: float,
    consecutive_days: int,
    task_stress: float,
    breaks_taken: int,
    preference_match: bool
) -> dict:
    """
    Calculate burnout risk score for an elf.

    Args:
        elf_id: Unique identifier for the elf
        elf_name: Name of the elf
        recent_hours: Hours worked in the last 7 days
        consecutive_days: Days worked in a row
        task_stress: Stress level of assigned task (1-10)
        breaks_taken: Number of breaks taken today
        preference_match: Whether assignment matches elf's preference

    Returns:
        dict with elf_id, elf_name, score (0-10), level, and recommendation
    """
    result = calculate_burnout_risk(
        recent_hours=recent_hours,
        consecutive_days=consecutive_days,
        task_stress=task_stress,
        breaks_taken=breaks_taken,
        preference_match=preference_match
    )

    # Add recommendation based on risk level
    if result["level"] == "high":
        recommendation = f"URGENT: {elf_name} needs immediate rotation or break"
    elif result["level"] == "medium":
        recommendation = f"{elf_name} should be monitored and considered for lighter duties"
    else:
        recommendation = f"{elf_name} is in good shape for regular assignment"

    return {
        "elf_id": elf_id,
        "elf_name": elf_name,
        "score": result["score"],
        "level": result["level"],
        "recommendation": recommendation
    }


def assign_shift(
    elf_id: str,
    elf_name: str,
    station_id: str,
    station_name: str,
    start_time: str,
    end_time: str,
    burnout_score: float
) -> dict:
    """
    Assign an elf to a station for a time block.

    Args:
        elf_id: Unique identifier for the elf
        elf_name: Name of the elf
        station_id: Unique identifier for the station
        station_name: Name of the station
        start_time: Shift start time (e.g., "08:00")
        end_time: Shift end time (e.g., "12:00")
        burnout_score: Pre-calculated burnout risk score

    Returns:
        Confirmation of assignment
    """
    from burnout import get_risk_level

    return {
        "success": True,
        "assignment": {
            "elf_id": elf_id,
            "elf_name": elf_name,
            "station_id": station_id,
            "station_name": station_name,
            "start_time": start_time,
            "end_time": end_time,
            "burnout_risk": burnout_score,
            "risk_level": get_risk_level(burnout_score)
        },
        "message": f"Assigned {elf_name} to {station_name} from {start_time} to {end_time}"
    }


def rotate_elves(
    elf_a_id: str,
    elf_a_name: str,
    elf_b_id: str,
    elf_b_name: str,
    duration_mins: int = 30
) -> dict:
    """
    Swap two elves' assignments for specified duration to reduce burnout.

    Args:
        elf_a_id: ID of first elf (high burnout)
        elf_a_name: Name of first elf
        elf_b_id: ID of second elf (lower burnout)
        elf_b_name: Name of second elf
        duration_mins: Duration of swap in minutes

    Returns:
        Confirmation of rotation
    """
    return {
        "success": True,
        "rotation": {
            "elf_a": {"id": elf_a_id, "name": elf_a_name},
            "elf_b": {"id": elf_b_id, "name": elf_b_name},
            "duration_mins": duration_mins
        },
        "message": f"Rotated {elf_a_name} with {elf_b_name} for {duration_mins} minutes",
        "slack_message": f"🔄 Auto-rotation: {elf_a_name} swapped with {elf_b_name} for {duration_mins} mins to reduce burnout risk"
    }


def generate_burnout_alert(
    elf_id: str,
    elf_name: str,
    risk_score: float,
    risk_level: str,
    suggested_partner_id: Optional[str] = None,
    suggested_partner_name: Optional[str] = None
) -> dict:
    """
    Generate a burnout alert for an elf.

    Args:
        elf_id: ID of the at-risk elf
        elf_name: Name of the at-risk elf
        risk_score: Calculated risk score
        risk_level: Risk level (medium or high)
        suggested_partner_id: Optional ID of elf to swap with
        suggested_partner_name: Optional name of elf to swap with

    Returns:
        Alert object
    """
    if risk_level == "high":
        message = f"{elf_name} will burn out within 2 hours unless rotated"
    else:
        message = f"{elf_name} is showing early signs of fatigue"

    suggested_action = "Schedule a 15-minute break"
    if suggested_partner_name:
        suggested_action = f"Rotate with {suggested_partner_name} for 30 minutes"

    return {
        "alert": {
            "elf_id": elf_id,
            "elf_name": elf_name,
            "risk_score": risk_score,
            "risk_level": risk_level,
            "message": message,
            "suggested_action": suggested_action,
            "resolved": False
        },
        "slack_message": f"⚠️ Burnout Alert: {message}. Suggested: {suggested_action}"
    }
