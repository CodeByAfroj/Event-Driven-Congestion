from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from schemas import EventInput

from services.predictor import predict_risk
from services.optimizer import optimize
from services.simulator import simulate

from services.engine import get_event_stats

from services.copilot import generate_plan

from services.recommendation_engine import (
    generate_recommendations
)
from services.hotspot_engine import (
    get_hotspots
)
from services.trend_engine import get_trends

from services.commander import (
    generate_commander_briefing
)
from services.impact_engine import (
    get_impact_analysis
)

app = FastAPI(
    title="Event AI Command Center"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.get("/trends")
def trends():
    return get_trends()

@app.get("/hotspots")
def hotspots():

    return {
        "hotspots": get_hotspots()
    }

@app.get("/")
def home():

    return {
        "message": "Event AI Backend Running"
    }


@app.post("/predict")
def predict(event: EventInput):

    event_data = event.dict()

    historical_stats = get_event_stats(
        event.event_type,
        event.event_cause
    )

    risk = predict_risk(
        event_data
    )


    optimization = optimize(
        risk,
        historical_stats
    )

    simulation = simulate(
        risk,
        historical_stats
    )

    recommendations = (
        generate_recommendations(
            risk,
            historical_stats,
            optimization,
            simulation
        )
    )
    impact_analysis = (
    get_impact_analysis(
        event.event_cause
    )
    )

    commander = generate_commander_briefing(
    risk,
    historical_stats,
    optimization,
    simulation,
    recommendations
    )

    plan = generate_plan(
        risk,
    optimization,
    historical_stats,
    recommendations
    )

    print("Risk:", risk)
    print("Historical:", historical_stats)
    print("Optimization:", optimization)
    print("Simulation:", simulation)
    print("Recommendations:", recommendations)

    return {

        "risk": risk,
        "historical_stats":historical_stats,
        "optimization":optimization,
        "simulation": simulation,
        "recommendations": recommendations,
        "plan":plan,
        "commander":commander ,
        "impact_analysis":impact_analysis, 

                  
    }