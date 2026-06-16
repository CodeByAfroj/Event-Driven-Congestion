import os
import joblib

from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

from preprocess import preprocess
from config import FEATURES, MODEL_PATH


os.makedirs("models", exist_ok=True)


df = preprocess("event.csv")

available_features = [
    col for col in FEATURES
    if col in df.columns
]

print("Using Features:")
print(available_features)

X = df[available_features]
y = df["risk_level"]


categorical_features = [
    "event_type",
    "event_cause",
    "requires_road_closure",
    "priority",
    "corridor",
    "police_station"
]

categorical_features = [
    col for col in categorical_features
    if col in available_features
]

numeric_features = [
    col
    for col in available_features
    if col not in categorical_features
]


preprocessor = ColumnTransformer(
    transformers=[
        (
            "cat",
            OneHotEncoder(
                handle_unknown="ignore"
            ),
            categorical_features
        ),
        (
            "num",
            "passthrough",
            numeric_features
        )
    ]
)


model = Pipeline([
    (
        "preprocessor",
        preprocessor
    ),
    (
        "classifier",
        RandomForestClassifier(
            n_estimators=200,
            random_state=42
        )
    )
])

print("\nCategorical Features:")
print(categorical_features)

print("\nNumeric Features:")
print(numeric_features)

print("\nTarget Distribution:")
print(y.value_counts())

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)


model.fit(
    X_train,
    y_train
)


preds = model.predict(
    X_test
)

print(
    classification_report(
        y_test,
        preds
    )
)

joblib.dump(model, MODEL_PATH)

joblib.dump(
    available_features,
    "models/features.pkl"
)

print(
    f"\nModel saved to {MODEL_PATH}"
)