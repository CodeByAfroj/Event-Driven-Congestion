import pandas as pd

df = pd.read_csv("./event.csv")


def get_hotspots(top_n=15):

    hotspot_df = (
        df.groupby(
            [
                "junction",
                "zone"
            ]
        )
        .agg({
            "latitude": "mean",
            "longitude": "mean"
        })
        .reset_index()
    )

    counts = (
        df.groupby(
            [
                "junction",
                "zone"
            ]
        )
        .size()
        .reset_index(
            name="incident_count"
        )
    )

    hotspot_df = hotspot_df.merge(
        counts,
        on=[
            "junction",
            "zone"
        ]
    )

    hotspot_df = hotspot_df.sort_values(
        "incident_count",
        ascending=False
    ).head(top_n)

    return hotspot_df.to_dict(
        orient="records"
    )