import numpy as np
from sklearn.ensemble import IsolationForest, RandomForestRegressor
import joblib
import os

MODEL_DIR = os.path.dirname(__file__)

class OceanML:
    def __init__(self):
        self.anomaly_detector = IsolationForest(contamination=0.05, random_state=42)
        self.abundance_predictor = RandomForestRegressor(n_estimators=100, random_state=42)
        self._train_dummy_models()

    def _train_dummy_models(self):
        # 1. Train Anomaly Detector (Temperature, Salinity, DO, pH)
        # Normal ranges: Temp 25-30, Salinity 33-36, DO 4-7, pH 7.8-8.4
        normal_data = np.random.normal(loc=[28, 34.5, 5.5, 8.1], scale=[1, 0.5, 0.5, 0.1], size=(1000, 4))
        anomalies = np.random.normal(loc=[35, 40, 2, 7.0], scale=[2, 2, 0.5, 0.3], size=(50, 4))
        X_train = np.vstack([normal_data, anomalies])
        self.anomaly_detector.fit(X_train)

        # 2. Train Abundance Predictor
        # Targets: abundance correlates loosely with temperature and salinity
        X_abund = np.random.normal(loc=[28, 34.5], scale=[2, 1], size=(500, 2))
        # abundance = 1000 - 50 * (temp-28)^2 - 100 * (salinity-34.5)^2 + noise
        y_abund = 1000 - 50 * (X_abund[:, 0] - 28)**2 - 100 * (X_abund[:, 1] - 34.5)**2 + np.random.normal(0, 50, 500)
        y_abund = np.maximum(0, y_abund) # no negative fish
        self.abundance_predictor.fit(X_abund, y_abund)

    def detect_anomaly(self, temperature: float, salinity: float, do: float, ph: float):
        X = np.array([[temperature, salinity, do, ph]])
        pred = self.anomaly_detector.predict(X)[0] # -1 for anomaly, 1 for normal
        score_samples = float(self.anomaly_detector.score_samples(X)[0])
        return {
            "is_anomaly": bool(pred == -1),
            "anomaly_score": score_samples,
            "interpretation": "Critical Anomaly Detected" if pred == -1 else "Normal Parameters"
        }

    def predict_abundance(self, temperature: float, salinity: float):
        X = np.array([[temperature, salinity]])
        prediction = float(self.abundance_predictor.predict(X)[0])
        return {
            "predicted_abundance": round(prediction),
            "confidence_interval": [max(0, round(prediction - 150)), round(prediction + 150)]
        }

    def simulate_edna_alignment(self, sequence: str):
        """Simulates Levenshtein/BLAST style sequence matching"""
        target_seq = "ATGCGTCGATCATGCGAGTCGAGCTAGCTCTAGCTACGATCGTAGCTACGTAGCTACGATCGATC"
        
        # Simple sequence similarity approximation for the wow-factor UI
        matches = sum(1 for a, b in zip(sequence[:len(target_seq)], target_seq) if a == b)
        similarity = matches / max(len(sequence), len(target_seq))
        
        confidence = min(0.99, similarity + 0.15) if similarity > 0.5 else similarity
        
        return {
            "matched_species": "Epinephelus coioides (Orange-spotted grouper)" if confidence > 0.8 else "Unknown/Multiple Matches",
            "match_confidence": round(confidence * 100, 2),
            "alignment_score": matches
        }

ml_engine = OceanML()
