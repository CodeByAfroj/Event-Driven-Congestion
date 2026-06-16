def generate_plan(
    risk,
    optimization,
    historical_stats,
    recommendations
):

    return f"""
Traffic Operations Briefing

Risk Level: {risk}

Recommended Officers:
{optimization['officers']}

Recommended Barricades:
{optimization['barricades']}

Diversion Required:
{optimization['diversion']}

Historical Incidents:
{historical_stats['total_events']}

Average Duration:
{historical_stats['average_duration']} minutes

Peak Hour:
{historical_stats['peak_hour']}

Recommended Actions:

{chr(10).join(recommendations['actions'])}
"""