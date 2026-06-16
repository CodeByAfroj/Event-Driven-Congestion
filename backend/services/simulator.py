def simulate(
    risk,
    historical_stats
):

    avg_duration = historical_stats.get(
        "average_duration",
        30
    )

    total_events = historical_stats.get(
        "total_events",
        0
    )

    road_closure_rate = historical_stats.get(
        "road_closure_rate",
        0
    )

    # Base delay derived from history
    base_delay = avg_duration

    # Frequency impact
    frequency_factor = min(
        total_events / 1000,
        5
    )

    # Closure impact
    closure_factor = (
        road_closure_rate / 10
    )

    delay = (
        base_delay
        + frequency_factor
        + closure_factor
    )

    # Risk multiplier
    if risk == "High":
        delay *= 1.3

    elif risk == "Medium":
        delay *= 1.1

    return [

        {
            "scenario": "No Action",
            "delay_minutes": round(
                delay,
                1
            ),
            "reduction": "0%"
        },

        {
            "scenario": "Officer Deployment",
            "delay_minutes": round(
                delay * 0.75,
                1
            ),
            "reduction": "25%"
        },

        {
            "scenario": "Diversion Strategy",
            "delay_minutes": round(
                delay * 0.55,
                1
            ),
            "reduction": "45%"
        },

        {
            "scenario": "Full Response Plan",
            "delay_minutes": round(
                delay * 0.35,
                1
            ),
            "reduction": "65%"
        }

    ]