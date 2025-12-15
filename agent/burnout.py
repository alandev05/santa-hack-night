"""
Burnout risk calculation logic for ElfShift.

Risk Score Formula:
  Risk = recent_hours * 0.3
       + consecutive_days * 0.25
       + task_stress * 0.2
       - breaks_taken * 0.15
       - preference_match * 0.1

Thresholds:
  - Low Risk: 0-3
  - Medium Risk: 4-6
  - High Risk: 7-10
"""

from typing import Literal


def calculate_burnout_risk(
    recent_hours: float,
    consecutive_days: int,
    task_stress: float,
    breaks_taken: int,
    preference_match: bool
) -> dict:
    """
    Calculate burnout risk score for an elf.

    Args:
        recent_hours: Hours worked in the last 7 days (0-60+)
        consecutive_days: Days worked in a row (0-14)
        task_stress: Stress level of assigned task (1-10)
        breaks_taken: Number of breaks taken today (0-5+)
        preference_match: Whether assignment matches elf's preference

    Returns:
        dict with score (0-10) and risk level ('low', 'medium', 'high')
    """
    # Normalize inputs
    hours_factor = min(recent_hours / 50, 1.0)  # Normalize to 0-1 (50 hours = max)
    days_factor = min(consecutive_days / 7, 1.0)  # Normalize to 0-1 (7 days = max)
    stress_factor = task_stress / 10  # Already 1-10, normalize to 0-1
    breaks_factor = min(breaks_taken / 4, 1.0)  # Normalize to 0-1 (4 breaks = max benefit)
    pref_factor = 1.0 if preference_match else 0.0

    # Calculate weighted score (0-1 scale)
    raw_score = (
        hours_factor * 0.30 +
        days_factor * 0.25 +
        stress_factor * 0.20 -
        breaks_factor * 0.15 -
        pref_factor * 0.10
    )

    # Scale to 0-10 and clamp
    score = max(0, min(10, raw_score * 10))

    # Determine risk level
    if score < 4:
        level = "low"
    elif score < 7:
        level = "medium"
    else:
        level = "high"

    return {
        "score": round(score, 2),
        "level": level
    }


def get_risk_level(score: float) -> Literal["low", "medium", "high"]:
    """Get risk level from a score."""
    if score < 4:
        return "low"
    elif score < 7:
        return "medium"
    else:
        return "high"
