import joblib
import pandas as pd


model = joblib.load("models/risk_model.pkl")
features = joblib.load("models/features.pkl")


def predict_risk(event_data):

    row = {}

    for feature in features:
        row[feature] = event_data.get(feature)

    df = pd.DataFrame([row])

    prediction = model.predict(df)[0]

    return prediction