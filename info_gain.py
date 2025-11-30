import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder
import math

# ------------------------------
# Load the Excel Data
# ------------------------------
df = pd.read_excel("Data_CM.xlsx", sheet_name="Sheet1")

# Extract enzyme name, features, and label
enzyme_names = df.iloc[:, 0]       # Column A
label = df.iloc[:, -1]             # Column V
features = df.iloc[:, 1:-1]        # Columns B to U → indices 1 to 20 → relative to features: 0 to 19

# ------------------------------
# Define Feature Categories (corrected ranges)
# ------------------------------
structure_idx = list(range(0, 5))         # B–F → indices 0–4
theoretical_idx = list(range(5, 10))      # G–K → indices 5–9
experimental_idx = list(range(10, 20))    # L–U → indices 10–19

categories = {
    "Structure": structure_idx,
    "Theoretical": theoretical_idx,
    "Experimental": experimental_idx
}

# ------------------------------
# Encode the Output Class
# ------------------------------
le_label = LabelEncoder()
y_encoded = le_label.fit_transform(label)

# ------------------------------
# Define Entropy and Information Gain Functions
# ------------------------------
def entropy(y):
    values, counts = np.unique(y, return_counts=True)
    probs = counts / len(y)
    return -np.sum([p * math.log2(p) for p in probs if p > 0])

def information_gain(X_col, y):
    unique_vals = np.unique(X_col)
    weighted_entropy = 0
    for val in unique_vals:
        subset_y = y[X_col == val]
        weight = len(subset_y) / len(y)
        weighted_entropy += weight * entropy(subset_y)
    return entropy(y) - weighted_entropy

# ------------------------------
# Calculate Information Gain
# ------------------------------
entropy_before_split = entropy(y_encoded)

results = [f"Information Gain before split\t-\t{entropy_before_split:.6f}"]
results.append("Feature\tCategory\tInformation Gain")

le_feat = LabelEncoder()

for category, indices in categories.items():
    for idx in indices:
        feature_name = features.columns[idx]
        col = features[feature_name]

        # Encode categorical data if necessary
        if col.dtype == 'object':
            col_encoded = le_feat.fit_transform(col)
        else:
            col_encoded = col.astype(int)

        ig = information_gain(col_encoded, y_encoded)
        results.append(f"{feature_name}\t{category}\t{ig:.6f}")

# ------------------------------
# Save Results to File
# ------------------------------
with open("result_InfoGain.txt", "w") as f:
    f.write("\n".join(results))

print(" Information Gain written to 'result_InfoGain.txt'")

