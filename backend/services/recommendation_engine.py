def generate_recommendations(
    risk,
    historical_stats
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
        "peak_hour"
    )

    station = historical_stats.get(
        "most_common_station"
    )

    corridor = historical_stats.get(
        "most_common_corridor"
    )

    recommendations = []

    if risk == "High":

        recommendations.extend([
            "Deploy officers 30 minutes before event start",
            "Enable diversion routes immediately",
            "Issue public advisory notifications",
            "Monitor congestion every 15 minutes"
        ])

    elif risk == "Medium":

        recommendations.extend([
            "Deploy officers at major junctions",
            "Prepare alternate routes",
            "Monitor traffic density"
        ])

    else:

        recommendations.extend([
            "Routine monitoring only"
        ])

    return {
        "critical_corridor": corridor,
        "recommended_station": station,
        "peak_incident_hour": peak_hour,
        "historical_incidents": total_events,
        "average_resolution_time": avg_duration,
        "actions": recommendations
    }