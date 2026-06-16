import pandas as pd


df = pd.read_csv("../training/event.csv")


def normalize(text):

    return (
        str(text)
        .strip()
        .lower()
        .replace(" ", "_")
    )


def get_impact_analysis(event_cause):

    df_copy = df.copy()

    df_copy["event_cause"] = (
        df_copy["event_cause"]
        .apply(normalize)
    )

    event_cause = normalize(
        event_cause
    )

    events = df_copy[
        df_copy["event_cause"] == event_cause
    ]

    if len(events) == 0:

        return {
            "impact_radius_km": 0,
            "estimated_vehicle_impact": 0,
            "affected_junctions": [],
            "center": None,
            "polygon": []
        }

    # Top affected junctions
    top_junctions = (
        events["junction"]
        .value_counts()
        .head(5)
        .index
        .tolist()
    )

    # Hotspot coordinates
    hotspot_points = (
        events.groupby(
            [
                "junction"
            ]
        )
        .agg({
            "latitude": "mean",
            "longitude": "mean"
        })
        .reset_index()
    )

    hotspot_points = hotspot_points[
        hotspot_points["junction"]
        .isin(top_junctions)
    ]

    # Polygon coordinates
    polygon = []

    for _, row in hotspot_points.iterrows():

        polygon.append([
            float(row["latitude"]),
            float(row["longitude"])
        ])

    center_lat = float(
        hotspot_points["latitude"].mean()
    )

    center_lng = float(
        hotspot_points["longitude"].mean()
    )

    # Impact radius
    incident_count = len(events)

    impact_radius_km = round(
        min(
            1 + (incident_count / 3000),
            5
        ),
        2
    )

    # Estimated vehicles affected
    estimated_vehicle_impact = int(
        incident_count * 0.35
    )

    return {

        "event_cause":
            event_cause,

        "historical_incidents":
            int(incident_count),

        "impact_radius_km":
            impact_radius_km,

        "estimated_vehicle_impact":
            estimated_vehicle_impact,

        "affected_junctions":
            top_junctions,

        "center": {

            "latitude":
                center_lat,

            "longitude":
                center_lng
        },

        "polygon":
            polygon
    }