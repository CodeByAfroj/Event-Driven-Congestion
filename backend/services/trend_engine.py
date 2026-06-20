import pandas as pd

df = pd.read_csv("./event.csv")


def get_trends():

    df["start_datetime"] = pd.to_datetime(
        df["start_datetime"],
        errors="coerce"
    )

    peak_hour = int(
        df["start_datetime"]
        .dt.hour
        .mode()
        .iloc[0]
    )

    peak_day = str(
        df["start_datetime"]
        .dt.day_name()
        .mode()
        .iloc[0]
    )

    top_event_causes = (
        df["event_cause"]
        .value_counts()
        .head(5)
        .to_dict()
    )

    zone_distribution = (
        df["zone"]
        .value_counts()
        .head(5)
        .to_dict()
    )

    return {
        "peak_hour": peak_hour,
        "peak_day": peak_day,
        "top_event_causes": top_event_causes,
        "zone_distribution": zone_distribution
    }