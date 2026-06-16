def optimize(risk, historical_stats):

    total_events = historical_stats["total_events"]
    avg_duration = historical_stats["average_duration"]
    closure_rate = historical_stats["road_closure_rate"]

    base_officers = 3

    if risk == "Medium":
        base_officers = 8

    elif risk == "High":
        base_officers = 15

    frequency_bonus = min(
        total_events // 1000,
        5
    )

    duration_bonus = int(
        avg_duration / 60
    )

    officers = (
        base_officers
        + frequency_bonus
        + duration_bonus
    )

    barricades = max(
        1,
        round(
            closure_rate / 20
        )
    )

    diversion = (
        risk != "Low"
        or closure_rate > 30
    )

    return {
        "officers": officers,
        "barricades": barricades,
        "diversion": diversion,
        "reasoning": {
            "historical_events": total_events,
            "avg_duration": avg_duration,
            "road_closure_rate": closure_rate
        }
    }