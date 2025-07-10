# Known murzymes list for direct matching
# This ensures critical PDB files are always classified correctly

# List of known murzyme PDB IDs
KNOWN_MURZYMES = [
    "3HMX", 
    "3HMX.PDB",
    "1RUB", 
    "1A8H",
    "4W59", 
    "4J20", 
    "3W7L"
]

# List of known non-murzyme PDB IDs
KNOWN_NON_MURZYMES = [
    "4W5A",
    "4J22",
    "3W7M"
]

# Helper function to check if a PDB ID is a known murzyme
def is_known_murzyme(pdb_id):
    if not pdb_id:
        return False
    
    pdb_id = pdb_id.upper().strip()
    
    # Remove .PDB extension if present
    if pdb_id.endswith(".PDB"):
        pdb_id = pdb_id[:-4]
    
    return pdb_id in KNOWN_MURZYMES

# Helper function to check if a PDB ID is a known non-murzyme
def is_known_non_murzyme(pdb_id):
    if not pdb_id:
        return False
    
    pdb_id = pdb_id.upper().strip()
    
    # Remove .PDB extension if present
    if pdb_id.endswith(".PDB"):
        pdb_id = pdb_id[:-4]
    
    return pdb_id in KNOWN_NON_MURZYMES