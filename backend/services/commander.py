def generate_commander_briefing(
    risk,
    historical_stats,
    optimization,
    simulation,
    recommendations
):

    total_events = historical_stats.get(
        "total_events",
        0
    )

    avg_duration = historical_stats.get(
        "average_duration",
        0
    )

    peak_hour = historical_stats.get(
        "peak_hour",
        "Unknown"
    )

    station = recommendations.get(
        "recommended_station",
        "Unknown"
    )

    corridor = recommendations.get(
        "critical_corridor",
        "Unknown"
    )

    best_scenario = simulation[-1]

    briefing = f"""
EVENT AI COMMANDER REPORT

Risk Assessment
---------------
Risk Level: {risk}

Historical Intelligence
-----------------------
Similar Incidents: {total_events}
Average Duration: {avg_duration:.1f} minutes
Peak Incident Hour: {peak_hour}:00

Operational Recommendation
--------------------------
Deploy {optimization['officers']} officers
Install {optimization['barricades']} barricades

Recommended Police Station:
{station}

Critical Corridor:
{corridor}

Expected Outcome
----------------
Using the Full Response Plan:

Expected Delay:
{best_scenario['delay_minutes']} minutes

Expected Reduction:
{best_scenario['reduction']}

Recommended Actions
-------------------
"""

    for action in recommendations["actions"]:
        briefing += f"\n• {action}"

    return {
        "summary": briefing,

        "risk": risk,

        "recommended_station": station,

        "critical_corridor": corridor,

        "officers": optimization["officers"],

        "barricades": optimization["barricades"],

        "expected_delay": best_scenario[
            "delay_minutes"
        ],

        "expected_reduction": best_scenario[
            "reduction"
        ]
    }