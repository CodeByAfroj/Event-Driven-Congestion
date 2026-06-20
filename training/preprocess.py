import pandas as pd
from sklearn.cluster import KMeans


def load_data(path):

    df = pd.read_csv(path)

    datetime_cols = [
        "start_datetime",
        "end_datetime",
        "resolved_datetime",
        "closed_datetime"
    ]

    for col in datetime_cols:

        if col in df.columns:

            df[col] = pd.to_datetime(
                df[col],
                errors="coerce"
            )

    return df


def create_duration(df):

    df["final_end_time"] = (
        df["resolved_datetime"]
        .fillna(df["closed_datetime"])
        .fillna(df["end_datetime"])
    )

    df["duration_minutes"] = (
        df["final_end_time"]
        - df["start_datetime"]
    ).dt.total_seconds() / 60

    df = df[df["duration_minutes"] > 0]

    df = df[df["duration_minutes"] < 1440]

    return df


def create_risk_level(df):

    def risk(minutes):

        if minutes < 30:
            return "Low"

        elif minutes < 120:
            return "Medium"

        return "High"

    df["risk_level"] = (
        df["duration_minutes"]
        .apply(risk)
    )

    return df


def create_time_features(df):

    df["hour"] = (
        df["start_datetime"]
        .dt.hour
    )

    df["day_of_week"] = (
        df["start_datetime"]
        .dt.dayofweek
    )

    df["month"] = (
        df["start_datetime"]
        .dt.month
    )

    df["is_weekend"] = (
        df["day_of_week"] >= 5
    ).astype(int)

    df["is_peak_hour"] = (
        df["hour"]
        .between(17, 21)
    ).astype(int)

    df["is_night"] = (
        df["hour"]
        .between(20, 23)
    ).astype(int)

    return df


def create_location_features(df):

    df["latitude"] = pd.to_numeric(
        df["latitude"],
        errors="coerce"
    )

    df["longitude"] = pd.to_numeric(
        df["longitude"],
        errors="coerce"
    )

    df["lat_bin"] = (
        df["latitude"]
        .round(2)
    )

    df["lon_bin"] = (
        df["longitude"]
        .round(2)
    )

    location_df = (
        df[["latitude", "longitude"]]
        .fillna(0)
    )

    kmeans = KMeans(
        n_clusters=50,
        random_state=42,
        n_init=10
    )

    df["location_cluster"] = (
        kmeans.fit_predict(location_df)
    )

    return df


def create_frequency_features(df):

    freq_cols = {

        "event_cause":
            "event_cause_freq",

        "corridor":
            "corridor_freq",

        "police_station":
            "station_freq",

        "zone":
            "zone_freq",

        "junction":
            "junction_freq",

        "veh_type":
            "vehicle_freq"
    }

    for col, new_col in freq_cols.items():

        if col in df.columns:

            freq = (
                df[col]
                .fillna("Unknown")
                .value_counts()
            )

            df[new_col] = (
                df[col]
                .fillna("Unknown")
                .map(freq)
                .fillna(0)
            )

    return df


def clean_missing_values(df):

    categorical_cols = [

        "event_type",
        "event_cause",
        "requires_road_closure",
        "priority",
        "corridor",
        "police_station",
        "zone",
        "junction",
        "veh_type"
    ]

    for col in categorical_cols:

        if col in df.columns:

            df[col] = (
                df[col]
                .fillna("Unknown")
                .astype(str)
            )

    numeric_cols = (
        df.select_dtypes(
            include=["number"]
        ).columns
    )

    df[numeric_cols] = (
        df[numeric_cols]
        .fillna(0)
    )

    return df


def preprocess(path):

    df = load_data(path)

    df = create_duration(df)

    df = create_risk_level(df)

    df = create_time_features(df)

    df = create_location_features(df)

    df = create_frequency_features(df)

    df = clean_missing_values(df)

    return df

