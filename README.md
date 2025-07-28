# Murburn-Concept
## A minimalist rule-based + ML toolkit to decide “Is this protein a murzyme?" and much more...

Repository root:  
```
murzyme-predictor/
├── README.md                 ← you are here
├── kmm_paper_reprised.ipynb  # rule-based model / Occam & consistency checks
├── random_forest.py          # 20-feature RF classifier
└── data/
    └── (training / test splits, when released)
```

---

## 1. What is a murzyme?

| Classical enzyme | Murzyme |
|------------------|---------|
| Highly specific active site, lock-and-key | Diffuse, solvent-exposed redox site |
| Michaelis-Menten kinetics | Zeroth-order or non-saturable kinetics |
| Defined stoichiometry | Variable / non-integral stoichiometry |
| Rarely exceeds diffusion limit | k<sub>cat</sub> ≫ 10⁹ M⁻¹s⁻¹ |
| Little substrate promiscuity | Broad substrate spectrum |

---

## 2. Quick start

### 2.1 Rule-based triage (`kmm_paper_reprised.ipynb`)
The notebook lets you encode any protein as a `Model()` object and run two orthogonal checks:

| Check | Purpose |
|-------|---------|
| **Occam’s Razor** | Penalises mechanistic complexity (shape change, long-distance OSET, etc.). Returns the simpler model. |
| **Consistency Check** | Flags logical clashes (e.g. limited access **+** poor selectivity, K<sub>m</sub> < K<sub>d</sub>, …). |

Minimal usage:
```python
from kmm_paper_reprised import Model, OccamsRazor, consistency_check

m = Model()
m.structural["ActiveSiteAccess"] = "limited"
m.experimental["Selectivity"]    = False
...
print(consistency_check(m))   # (#failures, #checks)
```

### 2.2 ML classifier (`random_forest.py`)
A 20-dimensional binary/ordinal feature vector is fed to a Random-Forest (n_estimators=100, seed=42).

| Group | Features (abbrev.) |
|-------|--------------------|
| Structural | Heme, Flavin, FeS, ConstrAccess, Subst>Site |
| Theoretical | Redox, Exergonic |
| Experimental | O₂Need, DRS, Reversible, SubstrateSelectivity, ProductSpecificity, ModulatorDiversity, NonIntegralStoich, VariableStoich, UnusualKinetics, kcat>DiffLimit, AtypSubDep, BulkPhaseDep, TempDep |

Train & predict in one line:
```bash
python random_forest.py
```
Output:
```
   Parameter  Importance Score
0   kcat>DiffLimit         0.14
1   NonIntegralStoich      0.11
...
PDHC: Classical
MPO: Murburn
...
```

---

## 3. Extending the model

### 3.1 Add new features
Edit the `features` list in `random_forest.py` and append columns to `train_data` / `unknown_data`.  
Retrain:
```python
clf.fit(new_train_data, new_labels)
```

### 3.2 Swap classifier
`sklearn` API compatible—drop-in replacements for `RandomForestClassifier` (e.g. XGBoost, CatBoost) work out-of-the-box.

---
---

# [**Murburn Explorer**](https://github.com/Murburn-Labs/Murburn-Snippets/tree/murburn-software-snippets)

Murburn Explorer is a web-based platform for visualizing and analyzing protein structures, particularly focusing on the classification of proteins as either Murzymes or Non-Murzymes. The platform allows researchers to explore PCA and t-SNE visualizations, search for specific proteins in the database, and classify new PDB files.

## Features

- **Interactive Visualizations**: PCA and t-SNE plots for murzyme/non-murzyme classification
- **PDB Search**: Search for specific PDB structures in the database
- **Protein Classification**: Upload and classify PDB files as murzymes or non-murzymes
- **Model Comparison**: Compare different enzyme models using Occam's Razor principles
- **Responsive Design**: Access all functionality across desktop and mobile devices

## Prerequisites

Before running the Murburn Explorer, ensure you have the following installed:

- Python 3.8 or higher
- pip (Python package manager)
- Git (optional, for cloning the repository)

## Installation Instructions

### Step 1: Clone or Download the Repository

```bash
# Option 1: Clone using Git
git clone <repository_url>
cd murburn-explorer

# Option 2: Download ZIP and extract
# Navigate to the extracted folder
```

### Step 2: Set Up a Virtual Environment (Recommended)

```bash
# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

### Step 3: Install Dependencies

```bash
# Install required packages
pip install flask gunicorn flask-sqlalchemy psycopg2-binary python-multipart numpy scipy plotly
```

### Step 4: Run the Application

#### Option 1: Direct execution

```bash
python main.py
```

#### Option 2: Using Gunicorn (Linux/macOS)

```bash
gunicorn --bind 0.0.0.0:5000 --reuse-port --reload main:app
```

### Step 5: Access the Application

Open your web browser and navigate to:

```
http://localhost:5000
```

## Application Structure

```
murburn_explorer/
├── css/                  # Global responsive CSS styles
├── images/               # Image assets
├── js/                   # JavaScript files
├── pages/                # Application pages
│   ├── about us/         # About page
│   ├── Classification/   # PDB classification tool
│   ├── contact us/       # Contact information
│   ├── ModelSimilarity/  # Model comparison tool
│   ├── Murzymes Data Bank/ # Database of murzyme structures
│   └── plots/            # Visualization pages
├── pca/                  # PCA data files
├── tnse/                 # t-SNE data files
├── styles/               # CSS styles for specific components
├── main.py               # Main Flask application
└── PROJECT_DOCUMENTATION.txt # Detailed project documentation
```

## API Endpoints

- `/getAllDatapoints` - Returns all murzyme and non-murzyme data points
- `/search_datapoint/<search_keyword>` - Searches for proteins by keyword
- `/tnse_plot_feature/<feature_number>` - Returns t-SNE visualization data
- `/pca_plot_feature/<feature_number>` - Returns PCA visualization data
- `/vineeth_sirs_logic` - Compares models using Occam's Razor
- `/classify_pdb` - Classifies uploaded PDB files

## Troubleshooting

### Port Already in Use

If you see an error like "Port 5000 is in use by another program," try:

```bash
# On Windows, find and kill the process using port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# On macOS/Linux
lsof -i :5000
kill -9 <PID>

# Or simply use a different port by modifying the port in main.py
# Look for app.run(host='0.0.0.0', port=5000, debug=True)
# and change the port number
```

### Database Connection Issues

Ensure the PostgreSQL database is running and the connection string is correct. The application uses the `DATABASE_URL` environment variable for database configuration.

## Mobile Compatibility

This application has been optimized for mobile devices with:
- Responsive layouts for all pages
- Touch-friendly interface elements
- Mobile navigation with hamburger menu
- Scrollable content designed for smaller screens

## Contact

For questions or support, please contact: murburn.concept@gmail.com
