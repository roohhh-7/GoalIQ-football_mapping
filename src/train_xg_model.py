import os
import pandas as pd
import numpy as np
import xgboost as xgb
import pickle
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, roc_auc_score, confusion_matrix

def train_model():
    print("=== Training XGBoost xG Model ===")
    
    # 1. Load Data
    input_file = '../data/modeling_shots.csv'
    if not os.path.exists(input_file):
        input_file = 'data/modeling_shots.csv' # Try root relative
        
    df = pd.read_csv(input_file)
    print(f"Loaded {len(df)} shots.")
    
    # 2. Select Features for Training
    # We will use distance, angle, body part, play pattern, and pressure
    features = ['distance_to_goal', 'shooting_angle', 'shot_body_part', 'play_pattern', 'under_pressure']
    target = 'is_goal'
    
    X_raw = df[features]
    y = df[target]
    
    # 3. Feature Encoding (One-Hot Encoding for categorical)
    # XGBoost handles numeric features. We must convert categorical text.
    print("Applying One-Hot Encoding...")
    X = pd.get_dummies(X_raw, columns=['shot_body_part', 'play_pattern'])
    
    # Ensure boolean columns are integers (0/1) for XGBoost
    X = X.astype(int, errors='ignore')
    # some columns like distance are float, keep them float
    for col in X.columns:
        if X[col].dtype == 'bool':
            X[col] = X[col].astype(int)
            
    # Save the feature names so we know exactly what columns the model expects
    feature_names = X.columns.tolist()
    
    # 4. Train/Test Split (80% training, 20% testing)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    print(f"Training set: {len(X_train)} shots. Testing set: {len(X_test)} shots.")
    
    # 5. Train XGBoost Classifier
    print("Training XGBoost Classifier...")
    model = xgb.XGBClassifier(
        n_estimators=100,
        max_depth=4,
        learning_rate=0.1,
        objective='binary:logistic',
        eval_metric='logloss',
        random_state=42
    )
    
    model.fit(X_train, y_train)
    
    # 6. Evaluation
    print("Evaluating Model on Test Set...")
    # Predict probabilities (for xG)
    y_pred_proba = model.predict_proba(X_test)[:, 1]
    # Predict hard classes (0 or 1) using 0.5 threshold
    y_pred = model.predict(X_test)
    
    auc = roc_auc_score(y_test, y_pred_proba)
    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred, zero_division=0)
    rec = recall_score(y_test, y_pred, zero_division=0)
    
    print(f"ROC-AUC: {auc:.4f}")
    print(f"Accuracy: {acc:.4f}")
    
    # Output to report
    os.makedirs('../data', exist_ok=True)
    report_path = '../data/model_evaluation.txt'
    if not os.path.exists('../data'):
        report_path = 'data/model_evaluation.txt'
        
    with open(report_path, 'w') as f:
        f.write("=== XGBoost xG Model Evaluation ===\n")
        f.write(f"Test Set Size: {len(y_test)}\n\n")
        f.write(f"ROC-AUC Score: {auc:.4f} (Quality of probabilities)\n")
        f.write(f"Accuracy: {acc:.4f}\n")
        f.write(f"Precision: {prec:.4f}\n")
        f.write(f"Recall: {rec:.4f}\n")
        f.write("\nFeatures Used:\n")
        for fn in feature_names:
            f.write(f"- {fn}\n")
            
    # 7. Save Model and feature list
    print("Saving model to disk...")
    os.makedirs('../models', exist_ok=True)
    model_path = '../models/xg_model.pkl'
    if not os.path.exists('../models'):
        os.makedirs('models', exist_ok=True)
        model_path = 'models/xg_model.pkl'
        
    # We save both the model and the expected feature names!
    model_data = {
        'model': model,
        'features': feature_names
    }
    
    with open(model_path, 'wb') as f:
        pickle.dump(model_data, f)
        
    print(f"Model successfully saved to {model_path}!")
    print(f"Evaluation report saved to {report_path}!")

if __name__ == "__main__":
    train_model()
