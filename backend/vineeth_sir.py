class Model:
    def __init__(self):
        self.proposal = {
            "ShapeChange": 0,
            "Serial": 0,
            "Complexity": 0,
            "MechanisticSteps": 0,
            "Probability": 0,
            "Intermediates": 0
        }
        self.structural = {
            "ActiveSiteAccess": "limited",
            "SubstrateSize": "small"
        }
        self.experimental = {
            "Selectivity": False,
            "Specificity": False,
            "NonIntStoichiometry": False,
            "KmKd": False,
            "ZerothOrderKinetics": 0
        }

def OccamsRazor(model1, model2):
    """
    Compare two models and return the simpler one
    Returns 1 if model1 is simpler, 2 if model2 is simpler, 0 if they are the same
    """
    # Simple comparison based on proposal values
    model1_complexity = sum(model1.proposal.values())
    model2_complexity = sum(model2.proposal.values())
    
    if model1_complexity < model2_complexity:
        return 1
    elif model2_complexity < model1_complexity:
        return 2
    else:
        return 0

def consistency_check(model):
    """
    Check if the model is consistent with the known facts
    Returns a dictionary with inconsistency score and number of checks made
    """
    inconsistency_score = 0
    checks_made = 0
    
    # Perform various consistency checks based on model properties
    
    # Check 1: If Active Site Access is limited, Substrate Size should be small
    checks_made += 1
    if model.structural["ActiveSiteAccess"] == "limited" and model.structural["SubstrateSize"] == "large":
        inconsistency_score += 1
    
    # Check 2: If Serial is 1, MechanisticSteps should be > 1
    checks_made += 1
    if model.proposal["Serial"] == 1 and model.proposal["MechanisticSteps"] <= 1:
        inconsistency_score += 1
    
    # Check 3: If Complexity is 1, either ShapeChange or Intermediates should be 1
    checks_made += 1
    if model.proposal["Complexity"] == 1 and (model.proposal["ShapeChange"] == 0 and model.proposal["Intermediates"] == 0):
        inconsistency_score += 1
    
    # Check 4: If Specificity is True, Selectivity should also be True
    checks_made += 1
    if model.experimental["Specificity"] == True and model.experimental["Selectivity"] == False:
        inconsistency_score += 1
    
    # Check 5: If ZerothOrderKinetics is 1, KmKd should be False
    checks_made += 1
    if model.experimental["ZerothOrderKinetics"] == 1 and model.experimental["KmKd"] == True:
        inconsistency_score += 1
    
    # Return results
    return {
        "inconsistency_score": inconsistency_score,
        "checks_made": checks_made
    }