import pandas as pd
import numpy as np
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from sklearn.preprocessing import LabelEncoder

# ------------------------------
# 1. Load the Data
# ------------------------------
file_path = "Data_CM.xlsx"
sheet_name = "Sheet1"

df = pd.read_excel(file_path, sheet_name=sheet_name)

# Extract enzyme names, features, and label
enzyme_names = df.iloc[:, 0]       # Column A
label = df.iloc[:, -1]             # Column V
features = df.iloc[:, 1:-1]        # Columns B to U (indices 1 to 20)

# ------------------------------
# 2. Define Feature Categories (relative to features DataFrame)
# ------------------------------
structure_idx = list(range(0, 5))        # B–F → indices 0–4
theoretical_idx = list(range(5, 10))     # G–K → indices 5–9
experimental_idx = list(range(10, 20))   # L–U → indices 10–19

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
    prec_list = []   # store [prec0, prec1]
    rec_list = []    # store [rec0, rec1]
    f1_list = []     # store [f1_0, f1_1]
    split_details = []
    feature_importance_sum = np.zeros(len(indices))

    for i in range(20):  # 20 train-test splits
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

        # Metrics
        acc = accuracy_score(y_test, y_pred)
        prec = precision_score(y_test, y_pred, average=None, zero_division=0)
        rec = recall_score(y_test, y_pred, average=None, zero_division=0)
        f1 = f1_score(y_test, y_pred, average=None, zero_division=0)

        acc_list.append(acc)
        prec_list.append(prec)
        rec_list.append(rec)
        f1_list.append(f1)

        split_details.append(
            f"  Split {i+1}: Accuracy = {acc:.4f}, "
            f"Precision: C0 = {prec[0]:.4f}, C1 = {prec[1]:.4f}, "
            f"Recall: C0 = {rec[0]:.4f}, C1 = {rec[1]:.4f}, "
            f"F1: C0 = {f1[0]:.4f}, C1 = {f1[1]:.4f}"
        )

        # Feature importances
        feature_importance_sum += clf.feature_importances_

    # Average metrics
    avg_acc = np.mean(acc_list)
    avg_prec_class0 = np.mean([p[0] for p in prec_list])
    avg_prec_class1 = np.mean([p[1] for p in prec_list])
    avg_rec_class0 = np.mean([r[0] for r in rec_list])
    avg_rec_class1 = np.mean([r[1] for r in rec_list])
    avg_f1_class0 = np.mean([f[0] for f in f1_list])
    avg_f1_class1 = np.mean([f[1] for f in f1_list])

    avg_importances = feature_importance_sum / 20
    feature_names = features.columns[indices]

    # Store results in output list
    results.append(f"Category: {category}")
    results.append(f"Average Accuracy over 20 splits: {avg_acc:.4f}")
    results.append(f"Average Precision - Class 0: {avg_prec_class0:.4f}")
    results.append(f"Average Precision - Class 1: {avg_prec_class1:.4f}")
    results.append(f"Average Recall - Class 0: {avg_rec_class0:.4f}")
    results.append(f"Average Recall - Class 1: {avg_rec_class1:.4f}")
    results.append(f"Average F1-Score - Class 0: {avg_f1_class0:.4f}")
    results.append(f"Average F1-Score - Class 1: {avg_f1_class1:.4f}")
    results.append("Per Split Metrics (Accuracy, Precision, Recall, F1):")
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

print("All results (Accuracy, Precision, Recall, F1 for each class) saved to 'results.txt'")

