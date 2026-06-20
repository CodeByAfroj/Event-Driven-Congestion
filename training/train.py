# import os
# import joblib

# from sklearn.compose import ColumnTransformer
# from sklearn.pipeline import Pipeline
# from sklearn.preprocessing import OneHotEncoder
# from sklearn.model_selection import train_test_split
# from sklearn.metrics import classification_report

# from xgboost import XGBClassifier

# from preprocess import preprocess
# from config import FEATURES, MODEL_PATH


# os.makedirs(
#     "models",
#     exist_ok=True
# )

# print("\nLoading Dataset...")

# df = preprocess(
#     "event.csv"
# )

# print(
#     "\nDataset Shape:",
#     df.shape
# )

# available_features = [

#     col
#     for col in FEATURES
#     if col in df.columns
# ]

# print(
#     "\nUsing Features:"
# )

# print(
#     available_features
# )

# X = df[
#     available_features
# ]

# label_map = {
#     "Low": 0,
#     "Medium": 1,
#     "High": 2
# }

# reverse_map = {
#     0: "Low",
#     1: "Medium",
#     2: "High"
# }

# y = (
#     df["risk_level"]
#     .map(label_map)
# )

# print(
#     "\nTarget Distribution:"
# )

# print(
#     df["risk_level"]
#     .value_counts()
# )

# categorical_features = [

#     "event_type",
#     "event_cause",
#     "requires_road_closure",
#     "priority",
#     "corridor",
#     "police_station",
#     "zone",
#     "junction",
#     "veh_type"
# ]

# categorical_features = [

#     col
#     for col in categorical_features
#     if col in available_features
# ]

# numeric_features = [

#     col
#     for col in available_features
#     if col not in categorical_features
# ]

# print(
#     "\nCategorical Features:"
# )

# print(
#     categorical_features
# )

# print(
#     "\nNumeric Features:"
# )

# print(
#     numeric_features
# )

# print(
#     "\nMissing Values:"
# )

# print(
#     X.isnull().sum().sum()
# )

# preprocessor = ColumnTransformer(

#     transformers=[

#         (
#             "cat",

#             OneHotEncoder(
#                 handle_unknown="ignore"
#             ),

#             categorical_features
#         ),

#         (
#             "num",

#             "passthrough",

#             numeric_features
#         )
#     ]
# )

# model = Pipeline([

#     (
#         "preprocessor",
#         preprocessor
#     ),

#     (
#         "classifier",

#         XGBClassifier(

#             n_estimators=500,

#             max_depth=8,

#             learning_rate=0.03,

#             subsample=0.8,

#             colsample_bytree=0.8,

#             objective="multi:softprob",

#             num_class=3,

#             eval_metric="mlogloss",

#             random_state=42
#         )
#     )
# ])

# X_train, X_test, y_train, y_test = train_test_split(

#     X,
#     y,

#     test_size=0.2,

#     stratify=y,

#     random_state=42
# )

# print(
#     "\nTraining Model..."
# )

# model.fit(
#     X_train,
#     y_train
# )

# preds = model.predict(
#     X_test
# )

# decoded_preds = [

#     reverse_map[int(p)]
#     for p in preds
# ]

# decoded_actual = [

#     reverse_map[int(p)]
#     for p in y_test
# ]

# print(
#     "\nClassification Report:\n"
# )

# print(
#     classification_report(
#         decoded_actual,
#         decoded_preds
#     )
# )

# joblib.dump(
#     model,
#     MODEL_PATH
# )

# joblib.dump(
#     available_features,
#     "models/features.pkl"
# )

# print(
#     f"\nModel saved to {MODEL_PATH}"
# )


import joblib

lookup = joblib.load("models/event_lookup.pkl")

print(type(lookup))

first_key = next(iter(lookup))
print("KEY:", first_key)

print("VALUE:", lookup[first_key])