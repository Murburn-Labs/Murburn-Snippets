from fastapi import FastAPI, Body, Request
from fastapi.responses import JSONResponse
from typing import List, Optional
import uvicorn
import json
import numpy as np
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()

# Allow CORS
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dummy data for development
class MockData:
    def __init__(self):
        self.murzymes = {"1A2B": [np.array([1.0, 2.0, 3.0]) for _ in range(4)],
                         "2B3C": [np.array([2.0, 3.0, 4.0]) for _ in range(4)]}
        self.non_murzymes = {"3C4D": [np.array([4.0, 5.0, 6.0]) for _ in range(4)],
                            "4D5E": [np.array([5.0, 6.0, 7.0]) for _ in range(4)]}

        # Sample plot data
        self.tnse_data = {
            "feature_1": [
                {"1A2B": [0.1, 0.2], "2B3C": [0.3, 0.4]},  # murzymes
                {"3C4D": [0.5, 0.6], "4D5E": [0.7, 0.8]}   # non-murzymes
            ],
            "feature_2": [
                {"1A2B": [1.1, 1.2], "2B3C": [1.3, 1.4]},  # murzymes
                {"3C4D": [1.5, 1.6], "4D5E": [1.7, 1.8]}   # non-murzymes
            ],
            "feature_3": [
                {"1A2B": [2.1, 2.2], "2B3C": [2.3, 2.4]},  # murzymes
                {"3C4D": [2.5, 2.6], "4D5E": [2.7, 2.8]}   # non-murzymes
            ],
            "feature_4": [
                {"1A2B": [3.1, 3.2], "2B3C": [3.3, 3.4]},  # murzymes
                {"3C4D": [3.5, 3.6], "4D5E": [3.7, 3.8]}   # non-murzymes
            ],
        }
        self.pca_data = self.tnse_data  # Use same structure for PCA data in development

# Initialize mock data for development
mock_data = MockData()
rawMurzymes = mock_data.murzymes
rawNonMurzymes = mock_data.non_murzymes
TNSE_DATAPOINTS = mock_data.tnse_data
PCA_DATAPOINTS = mock_data.pca_data

# Endpoints
@app.get("/")
async def root():
    return {"message": "Welcome to Murburn Explorer API"}

@app.get("/getAllDatapoints")
def getAllDataPoints() -> dict:
    '''
    Output Structure
    {
    "murzymes": [[key, [v1, v2, v3,v4]], .... ,[keyn, [v1, v2, v3, v4]]],
    "non-murzymes": [[key, [v1, v2, v3,v4]], .... ,[keyn, [v1, v2, v3, v4]]]
    }
    '''
    return {
        "murzymes": [[key, [(list(i) if isinstance(i, np.ndarray) else [0]*50) for i in value]] for key, value in rawMurzymes.items()],
        "non-murzymes": [[k, [(list(j) if isinstance(j, np.ndarray) else [0]*50) for j in v]] for k, v in rawNonMurzymes.items()]
    }

@app.get("/search_datapoint/{search_keyword}")
def searchDataPoint(search_keyword) -> list:
    '''
    datapoints with key values that are similar will be added to a list and sent as response
    Simple key-Word Based Search
    Output: [[k1, [v1, v2, v3, v4], "murzyme"], ... , [kn, [v1, v2, v3, v4], "non-murzyme"]]
    '''
    response = list()
    
    for k_1, v_1 in rawMurzymes.items():
        if search_keyword.casefold() in k_1.casefold():
            response.append([k_1, [(list(vctr) if isinstance(vctr, np.ndarray) else [0]*50) for vctr in v_1], "murzyme"])
    
    for k_2, v_2 in rawNonMurzymes.items():
        if search_keyword.casefold() in k_2.casefold():
            response.append([k_2, [(list(vctr) if isinstance(vctr, np.ndarray) else [0]*50) for vctr in v_2], "non-murzyme"])

    return response

@app.get("/tnse_plot_feature/{feature_number}")
def getTnsePlotForFeatureN(feature_number: int) -> dict:
    """
    feature number can be one among[1, 2, 3, 4]
    response will be all points of x and y of muzymes and non-murzymes of the given plot
    """
    try:
        feature_key = f"feature_{feature_number}"
        if feature_key not in TNSE_DATAPOINTS:
            return {"ERROR MESSAGE": "NO SUCH FEATURE FOUND"}
            
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
            "ERROR MESSAGE": f"Error processing request: {str(e)}"
        } 

@app.get("/pca_plot_feature/{feature_number}")
def getPcaPlotForFeatureN(feature_number: int) -> dict:
    """
    feature number can be one among[1, 2, 3, 4]
    response will be all points of x and y of muzymes and non-murzymes of the given plot
    """
    try:
        feature_key = f"feature_{feature_number}"
        if feature_key not in PCA_DATAPOINTS:
            return {"ERROR MESSAGE": "NO SUCH FEATURE FOUND"}
            
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
            "ERROR MESSAGE": f"Error processing request: {str(e)}"
        }

@app.post("/vineeth_sirs_logic")
def vineethSirsLogic(
    AShapeChange: int = Body(...), # 0 or 1
    ASerial: int = Body(...), # 0 or 1
    AComplexity: int = Body(...), # 0 or 1
    AMechanisticSteps: int = Body(...), # whole number count
    AProbability: int = Body(...), # 0 or 1
    AIntermediates: int = Body(...), # 0 or 1
    AActiveSiteAccess: int = Body(...), # limited or un-limited 0, 1
    ASelectivity: int = Body(...), # False, True 0, 1
    ASpecificity: int = Body(...), # False, True, 0, 1
    ANonIntStoichiometry: int = Body(...), # False, True, 0, 1
    ASubstrateSize: int = Body(...), # small, large, 0, 1
    AKmKd: int = Body(...), # False, True 0, 1
    AZerothOrderKinetics: int = Body(...), # 0, 1
    BShapeChange: int = Body(...), # 0 or 1
    BSerial: int = Body(...), # 0 or 1
    BComplexity: int = Body(...), # 0 or 1
    BMechanisticSteps: int = Body(...), # whole number count
    BProbability: int = Body(...), # 0 or 1
    BIntermediates: int = Body(...), # 0 or 1
    BActiveSiteAccess: int = Body(...), # limited or un-limited 0, 1
    BSelectivity: int = Body(...), # False, True 0, 1
    BSpecificity: int = Body(...), # False, True, 0, 1
    BNonIntStoichiometry: int = Body(...), # False, True, 0, 1
    BSubstrateSize: int = Body(...), # small, large, 0, 1
    BKmKd: int = Body(...), # False, True 0, 1
    BZerothOrderKinetics: int = Body(...) # 0, 1
):
    # For development, returning a sample response
    # In production, would integrate with the vineeth_sir module
    
    # Mock comparison logic
    model1_score = sum([
        AShapeChange, ASerial, AComplexity, AMechanisticSteps, 
        AProbability, AIntermediates, AActiveSiteAccess, ASelectivity,
        ASpecificity, ANonIntStoichiometry, ASubstrateSize, AKmKd, 
        AZerothOrderKinetics
    ])
    
    model2_score = sum([
        BShapeChange, BSerial, BComplexity, BMechanisticSteps, 
        BProbability, BIntermediates, BActiveSiteAccess, BSelectivity,
        BSpecificity, BNonIntStoichiometry, BSubstrateSize, BKmKd, 
        BZerothOrderKinetics
    ])
    
    if model1_score < model2_score:
        simpler_model = "Model 1"
    elif model2_score < model1_score:
        simpler_model = "Model 2"
    else:
        simpler_model = "Both Models are of Same Similarity"
    
    return {
        "SimplerModel": simpler_model,
        "Model 1": {"inconsistency_score": 13 - model1_score, "checks_made": 13},
        "Model 2": {"inconsistency_score": 13 - model2_score, "checks_made": 13},
    }

if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)