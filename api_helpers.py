import numpy as np
import json

# Mock data for development
class MockData:
    def __init__(self):
        self.murzymes = {
            "1A2B": [np.array([1.0, 2.0, 3.0]) for _ in range(4)],
            "2B3C": [np.array([2.0, 3.0, 4.0]) for _ in range(4)],
            "1AKD": [np.array([0.5, 1.5, 2.5]) for _ in range(4)],
            "1BVR": [np.array([1.2, 2.2, 3.2]) for _ in range(4)]
        }
        self.non_murzymes = {
            "3C4D": [np.array([4.0, 5.0, 6.0]) for _ in range(4)],
            "4D5E": [np.array([5.0, 6.0, 7.0]) for _ in range(4)],
            "3A5K": [np.array([3.5, 4.5, 5.5]) for _ in range(4)],
            "4B2N": [np.array([4.2, 5.2, 6.2]) for _ in range(4)]
        }

        # Sample plot data
        self.tnse_data = {
            "feature_1": [
                {"1A2B": [0.1, 0.2], "2B3C": [0.3, 0.4], "1AKD": [0.15, 0.25], "1BVR": [0.35, 0.45]},  # murzymes
                {"3C4D": [0.5, 0.6], "4D5E": [0.7, 0.8], "3A5K": [0.55, 0.65], "4B2N": [0.75, 0.85]}   # non-murzymes
            ],
            "feature_2": [
                {"1A2B": [1.1, 1.2], "2B3C": [1.3, 1.4], "1AKD": [1.15, 1.25], "1BVR": [1.35, 1.45]},  # murzymes
                {"3C4D": [1.5, 1.6], "4D5E": [1.7, 1.8], "3A5K": [1.55, 1.65], "4B2N": [1.75, 1.85]}   # non-murzymes
            ],
            "feature_3": [
                {"1A2B": [2.1, 2.2], "2B3C": [2.3, 2.4], "1AKD": [2.15, 2.25], "1BVR": [2.35, 2.45]},  # murzymes
                {"3C4D": [2.5, 2.6], "4D5E": [2.7, 2.8], "3A5K": [2.55, 2.65], "4B2N": [2.75, 2.85]}   # non-murzymes
            ],
            "feature_4": [
                {"1A2B": [3.1, 3.2], "2B3C": [3.3, 3.4], "1AKD": [3.15, 3.25], "1BVR": [3.35, 3.45]},  # murzymes
                {"3C4D": [3.5, 3.6], "4D5E": [3.7, 3.8], "3A5K": [3.55, 3.65], "4B2N": [3.75, 3.85]}   # non-murzymes
            ],
        }
        self.pca_data = self.tnse_data  # Use same structure for PCA data in development

# Model class for Vineeth Sir's Logic
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

# Helper functions for the API endpoints
def get_all_data_points():
    mock_data = MockData()
    rawMurzymes = mock_data.murzymes
    rawNonMurzymes = mock_data.non_murzymes
    
    return {
        "murzymes": [[key, [(list(i) if isinstance(i, np.ndarray) else [0]*50) for i in value]] for key, value in rawMurzymes.items()],
        "non-murzymes": [[k, [(list(j) if isinstance(j, np.ndarray) else [0]*50) for j in v]] for k, v in rawNonMurzymes.items()]
    }

def search_data_point(search_keyword):
    mock_data = MockData()
    rawMurzymes = mock_data.murzymes
    rawNonMurzymes = mock_data.non_murzymes
    
    response = []
    
    for k_1, v_1 in rawMurzymes.items():
        if search_keyword.casefold() in k_1.casefold():
            response.append([k_1, [(list(vctr) if isinstance(vctr, np.ndarray) else [0]*50) for vctr in v_1], "murzyme"])
    
    for k_2, v_2 in rawNonMurzymes.items():
        if search_keyword.casefold() in k_2.casefold():
            response.append([k_2, [(list(vctr) if isinstance(vctr, np.ndarray) else [0]*50) for vctr in v_2], "non-murzyme"])

    return response

def get_tnse_plot_for_feature_n(feature_number):
    mock_data = MockData()
    TNSE_DATAPOINTS = mock_data.tnse_data
    
    try:
        feature_key = f"feature_{feature_number}"
        if feature_key not in TNSE_DATAPOINTS:
            return {"ERROR_MESSAGE": "NO SUCH FEATURE FOUND"}
            
        featureChose = TNSE_DATAPOINTS[feature_key]
        murz, non_murz = featureChose[0], featureChose[1]

        murz_x, murz_y = [i[0] for i in murz.values()], [j[1] for j in murz.values()]
        non_murz_x, non_murz_y = [i[0] for i in non_murz.values()], [j[1] for j in non_murz.values()]

        return {
            "murzymes_x": murz_x,
            "murzymes_y": murz_y,
            "non_murzymes_x": non_murz_x,
            "non_murzymes_y": non_murz_y,
        }
    except Exception as e:
        return {
            "ERROR_MESSAGE": f"Error processing request: {str(e)}"
        }

def get_pca_plot_for_feature_n(feature_number):
    mock_data = MockData()
    PCA_DATAPOINTS = mock_data.pca_data
    
    try:
        feature_key = f"feature_{feature_number}"
        if feature_key not in PCA_DATAPOINTS:
            return {"ERROR_MESSAGE": "NO SUCH FEATURE FOUND"}
            
        featureChose = PCA_DATAPOINTS[feature_key]
        murz, non_murz = featureChose[0], featureChose[1]

        murz_x, murz_y = [i[0] for i in murz.values()], [j[1] for j in murz.values()]
        non_murz_x, non_murz_y = [i[0] for i in non_murz.values()], [j[1] for j in non_murz.values()]

        return {
            "murzymes_x": murz_x,
            "murzymes_y": murz_y,
            "non_murzymes_x": non_murz_x,
            "non_murzymes_y": non_murz_y,
        }
    except Exception as e:
        return {
            "ERROR_MESSAGE": f"Error processing request: {str(e)}"
        }

def compare_models(params):
    # Extract model parameters
    model1_params = {k: v for k, v in params.items() if k.startswith('A')}
    model2_params = {k: v for k, v in params.items() if k.startswith('B')}
    
    # Count complexity scores
    model1_score = sum([
        params.get('AShapeChange', 0), params.get('ASerial', 0), 
        params.get('AComplexity', 0), params.get('AMechanisticSteps', 0), 
        params.get('AProbability', 0), params.get('AIntermediates', 0)
    ])
    
    model2_score = sum([
        params.get('BShapeChange', 0), params.get('BSerial', 0), 
        params.get('BComplexity', 0), params.get('BMechanisticSteps', 0), 
        params.get('BProbability', 0), params.get('BIntermediates', 0)
    ])
    
    # Determine which model is simpler
    if model1_score < model2_score:
        simpler_model = "Model 1"
    elif model2_score < model1_score:
        simpler_model = "Model 2"
    else:
        simpler_model = "Both Models are of Same Similarity"
    
    # Calculate consistency scores (for demo purposes)
    # In a real implementation, this would be based on actual science
    model1_inconsistency = 2 if params.get('AShapeChange', 0) == 1 and params.get('AActiveSiteAccess', 0) == 1 else 0
    model1_inconsistency += 1 if params.get('AComplexity', 0) == 1 and params.get('ASelectivity', 0) == 0 else 0
    model1_inconsistency += 1 if params.get('ASerial', 0) == 1 and params.get('ASpecificity', 0) == 0 else 0
    model1_inconsistency += 1 if params.get('AMechanisticSteps', 0) > 2 and params.get('ANonIntStoichiometry', 0) == 0 else 0
    
    model2_inconsistency = 2 if params.get('BShapeChange', 0) == 1 and params.get('BActiveSiteAccess', 0) == 1 else 0
    model2_inconsistency += 1 if params.get('BComplexity', 0) == 1 and params.get('BSelectivity', 0) == 0 else 0
    model2_inconsistency += 1 if params.get('BSerial', 0) == 1 and params.get('BSpecificity', 0) == 0 else 0
    model2_inconsistency += 1 if params.get('BMechanisticSteps', 0) > 2 and params.get('BNonIntStoichiometry', 0) == 0 else 0
    
    # Return the analysis results
    return {
        "SimplerModel": simpler_model,
        "Model 1": {"inconsistency_score": model1_inconsistency, "checks_made": 5},
        "Model 2": {"inconsistency_score": model2_inconsistency, "checks_made": 5},
    }