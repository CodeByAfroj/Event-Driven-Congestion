import pandas as pd


df = pd.read_csv("../training/event.csv")


def normalize(text):

    return (
        str(text)
        .strip()
        .lower()
        .replace(" ", "_")
    )


def get_similar_events(event_type, event_cause):

    df_copy = df.copy()

    df_copy["event_type"] = (
        df_copy["event_type"]
        .apply(normalize)
    )

    df_copy["event_cause"] = (
        df_copy["event_cause"]
        .apply(normalize)
    )

    event_type = normalize(event_type)
    event_cause = normalize(event_cause)

    print(
        f"Incoming: {event_type} | {event_cause}"
    )

    filtered = df_copy[
        df_copy["event_cause"] == event_cause
    ]

    print(
        f"Historical Matches Found: {len(filtered)}"
    )

    return filtered


def get_event_stats(event_type, event_cause):

    events = get_similar_events(
        event_type,
        event_cause
    )

    total_events = len(events)

    if total_events == 0:

        return {
            "total_events": 0,
            "road_closure_rate": 0,
            "average_duration": 0,
            "peak_hour": None,
            "most_common_corridor": None,
            "most_common_station": None
        }

    road_closure_rate = (
        events["requires_road_closure"]
        .astype(str)
        .str.lower()
        .eq("yes")
        .mean()
    )

    # Duration Calculation
    average_duration = 0

    try:

        events["start_datetime"] = pd.to_datetime(
            events["start_datetime"],
            errors="coerce"
        )

        events["resolved_datetime"] = pd.to_datetime(
            events["resolved_datetime"],
            errors="coerce"
        )

        durations = (
            events["resolved_datetime"]
            - events["start_datetime"]
        ).dt.total_seconds() / 60

        durations = durations.dropna()

        if len(durations) > 0:

            average_duration = round(
                durations.mean(),
                2
            )

    except Exception as e:

        print(
            "Duration calculation error:",
            e
        )

    # Peak Hour
    peak_hour = None

    try:

        events["start_datetime"] = pd.to_datetime(
            events["start_datetime"],
            errors="coerce"
        )

        hours = (
            events["start_datetime"]
            .dt.hour
            .dropna()
        )

        if len(hours) > 0:

            peak_hour = int(
                hours.mode().iloc[0]
            )

    except Exception as e:

        print(
            "Peak hour calculation error:",
            e
        )

    # Most Common Corridor
    most_common_corridor = None

    if (
        "corridor" in events.columns
        and not events["corridor"].dropna().empty
    ):

        most_common_corridor = str(
            events["corridor"]
            .mode()
            .iloc[0]
        )

    # Most Common Police Station
    most_common_station = None

    if (
        "police_station" in events.columns
        and not events["police_station"].dropna().empty
    ):

        most_common_station = str(
            events["police_station"]
            .mode()
            .iloc[0]
        )

    return {
        "total_events": int(total_events),

        "road_closure_rate": float(
            round(
                road_closure_rate * 100,
                2
            )
        ),

        "average_duration": float(
            average_duration
        ),

        "peak_hour": peak_hour,

        "most_common_corridor":
            most_common_corridor,

        "most_common_station":
            most_common_station
    }