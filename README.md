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

## 6. License

MIT © 2024 KMM Lab.
