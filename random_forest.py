import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier  # Using RF to force multiple features

# Training labels (10 classical + 10 murburn)
train_labels = ['Classical'] * 10 + ['Murburn'] * 10

# Training data (20 features each)
train_data = [
    # Classical
    [0,0,0,1,0,0,1,0,0,1,2,2,1,0,0,0,0,0,0,0], # DNA Replication
    [0,0,1,1,0,1,1,0,0,1,2,2,2,0,0,0,0,0,0,0], # RNA Transcription
    [0,0,0,1,1,0,1,0,0,1,2,2,2,0,0,0,0,0,0,0], # Protein Translation
    [0,0,1,1,0,1,1,0,0,1,2,2,2,0,0,0,0,0,0,0], # DNA Repair
    [0,0,0,1,1,0,1,0,0,1,2,2,2,0,0,0,0,0,0,0], # Proteasome Machinery
    [0,0,0,1,1,0,1,0,0,1,2,2,2,0,0,0,0,0,0,0], # NRPS
    [0,0,0,0,0,0,1,0,0,1,2,2,1,0,0,0,0,0,0,0], # Amylase
    [0,0,0,1,1,0,1,0,0,1,2,2,2,0,0,0,0,0,0,0], # Lipase
    [0,0,0,1,0,0,1,0,0,0,2,2,1,0,0,0,0,0,0,0], # Ligase
    [0,0,0,0,0,0,1,0,0,1,2,2,1,0,0,0,0,0,0,0], # Aldolase
    # Murburn
    [1,0,0,1,0,1,1,1,1,0,1,1,2,1,1,1,1,1,1,1], # CPO
    [1,0,0,1,0,1,1,1,1,0,1,2,2,1,1,1,1,1,1,1], # HRP
    [1,0,0,1,0,1,1,1,1,0,1,2,1,1,1,1,1,1,1,1], # Catalase
    [1,0,0,1,1,1,1,1,1,0,1,2,2,1,1,1,1,1,1,1], # LiP
    [1,0,0,1,0,1,1,1,1,0,1,2,2,1,1,1,1,1,1,1], # LPO
    [1,0,0,1,1,1,1,1,1,1,2,2,2,1,1,1,1,1,1,1], # COX1
    [1,0,0,1,1,1,1,1,1,1,2,2,2,1,1,1,1,1,1,1], # CYP1A2
    [1,0,0,1,1,1,1,1,1,1,2,2,2,1,1,1,1,1,1,1], # CYP2B6
    [1,0,0,1,1,1,1,1,1,1,2,2,2,1,1,1,1,1,1,1], # CYP2C8
    [1,0,0,1,1,1,1,1,1,0,2,2,2,1,1,1,1,1,1,1], # Peroxisome
]

# Test data (17 unknowns)
unknown_data = [
    [0,0,0,1,1,1,1,0,0,1,2,2,2,0,0,0,0,0,0,0], # PDHC
    [0,0,0,1,1,0,1,0,0,1,2,2,2,0,0,0,0,0,0,0], # FAS
    [0,0,0,1,0,0,1,0,0,1,2,2,3,0,0,0,0,0,0,0], # Spliceosome
    [0,0,0,1,1,0,1,0,0,1,2,2,2,0,0,0,0,0,0,0], # PKS
    [0,0,0,1,0,0,1,0,0,1,2,2,1,0,0,0,1,0,0,0], # Ser Prot
    [1,0,0,1,1,1,1,1,1,0,2,2,2,1,1,1,1,1,1,1], # MPO
    [1,0,0,1,0,1,1,1,1,0,2,2,2,1,1,1,1,1,1,1], # CcP
    [1,0,0,1,0,1,1,1,1,0,2,2,2,1,1,1,1,1,1,1], # APO
    [1,0,0,1,1,1,1,1,1,0,2,2,2,1,1,1,1,1,1,1], # TPO
    [1,0,0,1,1,1,1,1,1,0,2,2,3,1,1,1,1,1,1,1], # KatG
    [1,0,0,1,1,1,1,1,1,1,2,2,2,1,1,1,1,1,1,1], # COX2
    [1,0,0,1,1,1,1,1,1,1,2,2,2,1,1,1,1,1,1,1], # CYP2C19
    [1,0,0,1,1,1,1,1,1,1,2,2,2,1,1,1,1,1,1,1], # CYP2D6
    [1,0,0,1,1,1,1,1,1,1,2,2,2,1,1,1,1,1,1,1], # CYP2E1
    [1,0,0,1,1,1,1,1,1,1,2,2,2,1,1,1,1,1,1,1], # CYP3A4
    [1,0,0,1,1,1,1,1,1,1,2,2,2,1,1,1,1,1,1,1], # CYP2C9
    [1,1,1,1,1,1,1,1,1,1,2,2,2,1,1,1,1,1,1,1], # Mitochon
]

test_enzyme_names = [
    "PDHC", "FAS", "Spliceosome", "PKS", "Serine Protease",
    "MPO", "CcP", "APO", "TPO", "KatG",
    "COX2", "CYP2C19", "CYP2D6", "CYP2E1", "CYP3A4", "CYP2C9", "Mitochon"
]

# Train Random Forest classifier to force multiple feature splits
clf = RandomForestClassifier(random_state=42, n_estimators=100)
clf.fit(train_data, train_labels)

# Predict
predictions = clf.predict(unknown_data)

# Feature Importance
feature_importance = clf.feature_importances_

# Map features
features = [
    'Heme', 'Flavin', 'FeS', 'ConstrAccess', 'Subst>Site', 'Redox', 'Exergonic', 'O2Need',
    'DRS', 'Reversible', 'SubstrateSelectivity', 'ProductSpecificity', 'ModulatorDiversity',
    'NonIntegralStoich', 'VariableStoich', 'UnusualKinetics', 'kcat>DiffLimit', 'AtypSubDep',
    'BulkPhaseDep', 'TempDep'
]

# Ranked importance
importance_df = pd.DataFrame({'Parameter': features, 'Importance Score': feature_importance})
importance_df = importance_df.sort_values(by='Importance Score', ascending=False)
importance_df.reset_index(drop=True, inplace=True)

print(importance_df.head(10))  # Top 10 features
for enzyme, classification in zip(test_enzyme_names, predictions):
    print(f"{enzyme}: {classification}")

