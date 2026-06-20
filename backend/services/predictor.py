import joblib
from huggingface_hub import hf_hub_download
import pandas as pd
import numpy as np

# Download model files
model_path = hf_hub_download(
    repo_id="mulaniafroj/eventai",
    filename="risk_model.pkl"
)

features_path = hf_hub_download(
    repo_id="mulaniafroj/eventai",
    filename="features.pkl"
)

# Load model
model = joblib.load(model_path)
features = joblib.load(features_path)


def predict_risk(event_data):
    row = {}

    for feature in features:
        row[feature] = event_data.get(feature)

    df = pd.DataFrame([row])

    prediction = model.predict(df)[0]

    # Convert NumPy types to Python types
    if isinstance(prediction, np.integer):
        prediction = int(prediction)

    elif isinstance(prediction, np.floating):
        prediction = float(prediction)

    elif isinstance(prediction, np.bool_):
        prediction = bool(prediction)

    return prediction