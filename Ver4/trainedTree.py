import pandas as pd
import numpy as np
from sklearn.tree import DecisionTreeClassifier
from sklearn.preprocessing import LabelEncoder
import joblib  # 🔁 NEW: for saving models

# ------------------------------
# Load the Data
# ------------------------------
df = pd.read_excel("Data_CM.xlsx", sheet_name="Sheet1")

enzyme_names = df.iloc[:, 0]
label = df.iloc[:, -1]
features = df.iloc[:, 1:-1]

# ------------------------------
# Define Feature Categories
# ------------------------------
structure_idx = list(range(0, 5))
theoretical_idx = list(range(5, 7))
experimental_idx = list(range(7, 20))

categories = {
    "Structure": structure_idx,
    "Theoretical": theoretical_idx,
    "Experimental": experimental_idx
}

# ------------------------------
# Encode the Label
# ------------------------------
le_label = LabelEncoder()
y_encoded = le_label.fit_transform(label)

# ------------------------------
# Safe Encoding Helper
# ------------------------------
def safe_label_encoding(column):
    le = LabelEncoder()
    encoded = le.fit_transform(column)
    reverse_map = dict(zip(range(len(le.classes_)), le.classes_))
    return encoded, reverse_map

# ------------------------------
# Generate C-style If-Else Tree
# ------------------------------
def generate_if_else_code(tree, feature_names, label_encoder, reverse_maps):
    tree_ = tree.tree_
    feature_name = [
        feature_names[i] if i != -2 else "undefined!"
        for i in tree_.feature
    ]

    def recurse(node, depth):
        indent = "    " * depth
        if tree_.feature[node] != -2:
            name = feature_name[node]
            threshold = tree_.threshold[node]
            threshold = int(threshold + 0.5)

            if name in reverse_maps:
                val = reverse_maps[name].get(threshold, f"<UNK_{threshold}>")
                left = recurse(tree_.children_left[node], depth + 1)
                right = recurse(tree_.children_right[node], depth + 1)
                return (
                    f'{indent}if (strcmp({name}, "{val}") == 0) {{\n'
                    f'{left}\n{indent}}} else {{\n{right}\n{indent}}}'
                )
            else:
                left = recurse(tree_.children_left[node], depth + 1)
                right = recurse(tree_.children_right[node], depth + 1)
                return (
                    f"{indent}if ({name} <= {threshold}) {{\n"
                    f"{left}\n{indent}}} else {{\n{right}\n{indent}}}"
                )
        else:
            value = np.argmax(tree_.value[node])
            class_name = label_encoder.inverse_transform([value])[0]
            return f'{indent}return "{class_name}";'

    return recurse(0, 0)

# ------------------------------
# Train Trees and Generate Output
# ------------------------------
output_lines = []

for category, indices in categories.items():
    X = features.iloc[:, indices].copy()
    reverse_maps = {}

    for col in X.columns:
        if X[col].dtype == "object":
            X[col], rev_map = safe_label_encoding(X[col])
            reverse_maps[col] = rev_map

    clf = DecisionTreeClassifier(random_state=42)
    clf.fit(X, y_encoded)

    # 🔁 Save trained model
    model_filename = f"model_{category}.pkl"
    joblib.dump(clf, model_filename)

    # Generate code
    code = generate_if_else_code(clf, list(X.columns), le_label, reverse_maps)
    output_lines.append(f"// Category: {category}")
    output_lines.append("const char* predict(...) {")
    output_lines.append(code)
    output_lines.append("}")
    output_lines.append("=" * 60)

# ------------------------------
# Save C-style Code to File
# ------------------------------
with open("result_C_code.txt", "w") as f:
    f.write("\n".join(output_lines))

print("✅ C-code generated and models saved as model_<Category>.pkl")

