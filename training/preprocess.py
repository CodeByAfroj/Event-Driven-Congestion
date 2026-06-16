import pandas as pd


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

    return df


def preprocess(path):

    df = load_data(path)

    df = create_duration(df)

    df = create_risk_level(df)

    df = create_time_features(df)

    return df