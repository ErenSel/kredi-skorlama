import joblib
import json
import numpy as np
from sklearn.preprocessing import LabelEncoder

# Dosyaları yükle
model = joblib.load("best_model.pkl")
scaler = joblib.load("scaler.pkl")

with open("model_meta.json", "r") as f:
    meta = json.load(f)

feature_names = meta["feature_names"]
cat_cols = meta["cat_cols"]
le_dict = meta["le_dict"]

def predict_credit_risk(input_data: dict) -> dict:
    # Kategorik değişkenleri encode et
    for col in cat_cols:
        value = input_data[col]
        classes = le_dict[col]
        if value in classes:
            input_data[col] = classes.index(value)
        else:
            input_data[col] = 0

    # Feature sırasını koru
    features = [input_data[f] for f in feature_names]
    features = np.array(features).reshape(1, -1)

    # Ölçekle
    features_scaled = scaler.transform(features)

    # Tahmin
    prediction = model.predict(features_scaled)[0]
    probability = model.predict_proba(features_scaled)[0]

    risk_score = round(float(probability[1]) * 100, 1)

    if risk_score < 30:
        decision = "approve"
        decision_tr = "Onaylandı"
    elif risk_score < 60:
        decision = "review"
        decision_tr = "İncelemeye Alındı"
    else:
        decision = "decline"
        decision_tr = "Reddedildi"

    return {
        "risk_score": risk_score,
        "decision": decision,
        "decision_tr": decision_tr,
        "good_probability": round(float(probability[0]) * 100, 1),
        "bad_probability": round(float(probability[1]) * 100, 1)
    }