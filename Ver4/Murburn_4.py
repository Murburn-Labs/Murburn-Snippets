import pandas as pd
import numpy as np
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import LabelEncoder

# ------------------------------
# 1. Load the Data
# ------------------------------
file_path = "Data_CM.xlsx"
sheet_name = "Sheet1"

df = pd.read_excel(file_path, sheet_name=sheet_name)

# Extract enzyme names, features, and label
enzyme_names = df.iloc[:, 0]       # First column (A)
label = df.iloc[:, -1]             # Last column (V)
features = df.iloc[:, 1:-1]        # Columns B to U (i.e., indices 1 to 20)

# ------------------------------
# 2. Define Feature Categories (relative to features DataFrame)
# ------------------------------
structure_idx = list(range(0, 5))        # Columns B–F → indices 1–5 → relative: 0–4
theoretical_idx = list(range(5, 7))      # Columns G–H → relative: 5–6
experimental_idx = list(range(7, 20))    # Columns I–U → relative: 7–19

categories = {
    "Structure": structure_idx,
    "Theoretical": theoretical_idx,
    "Experimental": experimental_idx
}

# ------------------------------
# 3. Encode Labels
# ------------------------------
le_label = LabelEncoder()
y_encoded = le_label.fit_transform(label)

# ------------------------------
# 4. Train and Evaluate Decision Trees
# ------------------------------
results = []

for category, indices in categories.items():
    acc_list = []
    split_details = []
    feature_importance_sum = np.zeros(len(indices))

    for i in range(20):  # 20 train-test splits
        # Select feature subset
        X = features.iloc[:, indices].copy()
        y = y_encoded.copy()

        # Encode categorical features if any
        for col in X.columns:
            if X[col].dtype == 'object':
                le = LabelEncoder()
                X[col] = le.fit_transform(X[col])

        # Train-test split (60:40)
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.4, random_state=i
        )

        # Train Decision Tree
        clf = DecisionTreeClassifier(random_state=42)
        clf.fit(X_train, y_train)
        y_pred = clf.predict(X_test)

        # Accuracy
        acc = accuracy_score(y_test, y_pred)
        acc_list.append(acc)
        split_details.append(f"  Split {i+1}: Accuracy = {acc:.4f}")

        # Accumulate feature importances
        feature_importance_sum += clf.feature_importances_

    # Average results
    avg_acc = np.mean(acc_list)
    avg_importances = feature_importance_sum / 20
    feature_names = features.columns[indices]

    # Store results
    results.append(f"Category: {category}")
    results.append(f"Average Accuracy over 20 splits: {avg_acc:.4f}")
    results.append("Per Split Accuracy:")
    results.extend(split_details)
    results.append("Average Feature Importances:")
    for fname, imp in zip(feature_names, avg_importances):
        results.append(f"  {fname}: {imp:.6f}")
    results.append("=" * 60)

# ------------------------------
# 5. Save Results to File
# ------------------------------
with open("results.txt", "w") as f:
    f.write("\n".join(results))

print("✅ All results saved to 'results.txt'")

