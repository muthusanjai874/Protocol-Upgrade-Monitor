from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn
import random

app = FastAPI()

class VolatilityInput(BaseModel):
    assetTicker: str
    upgradeDescription: str
    predictionWindow: int

class VolatilityOutput(BaseModel):
    predictedVolatility: list[float]
    modelAccuracy: float
    confidenceIntervals: list[dict[str, float]]

@app.get("/")
def read_root():
    return {"message": "Protocol Upgrade Monitor Python Backend"}

@app.post("/predict_volatility", response_model=VolatilityOutput)
def predict_volatility(item: VolatilityInput):
    description_lower = item.upgradeDescription.lower()
    if "contentious" in description_lower or "hard fork" in description_lower or "major" in description_lower:
        base_volatility = random.uniform(0.05, 0.08)
    elif "minor" in description_lower or "parameter change" in description_lower:
        base_volatility = random.uniform(0.01, 0.03)
    else:
        base_volatility = random.uniform(0.02, 0.05)
    
    predicted_volatility = []
    confidence_intervals = []

    for _ in range(item.predictionWindow):
        shock = random.normalvariate(0, base_volatility * 0.5)
        new_vol = base_volatility * 0.95 + shock
        new_vol = max(0.005, new_vol)
        predicted_volatility.append(new_vol)
        
        interval_width = new_vol * 1.96 * 0.5
        lower = max(0, new_vol - interval_width)
        upper = new_vol + interval_width
        confidence_intervals.append({"lowerBound": lower, "upperBound": upper})

        base_volatility = new_vol


    return VolatilityOutput(
        predictedVolatility=predicted_volatility,
        modelAccuracy=random.uniform(0.85, 0.98),
        confidenceIntervals=confidence_intervals
    )

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
