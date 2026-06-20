import os
import json
from groq import Groq

def simulate(risk, historical_stats):
    avg_duration = historical_stats.get("average_duration", 30)
    total_events = historical_stats.get("total_events", 0)
    road_closure_rate = historical_stats.get("road_closure_rate", 0)

    # Hardcoded Fallback Logic
    base_delay = avg_duration
    frequency_factor = min(total_events / 1000, 5)
    closure_factor = (road_closure_rate / 10)
    delay = base_delay + frequency_factor + closure_factor
    
    if risk == "High":
        delay *= 1.3
    elif risk == "Medium":
        delay *= 1.1

    fallback_simulation = [
        {"scenario": "No Action", "delay_minutes": round(delay, 1), "reduction": "0%"},
        {"scenario": "Officer Deployment", "delay_minutes": round(delay * 0.75, 1), "reduction": "25%"},
        {"scenario": "Diversion Strategy", "delay_minutes": round(delay * 0.55, 1), "reduction": "45%"},
        {"scenario": "Full Response Plan", "delay_minutes": round(delay * 0.35, 1), "reduction": "65%"}
    ]

    groq_api_key = os.environ.get("GROQ_API_KEY")
    if groq_api_key and groq_api_key != "your_groq_api_key_here":
        try:
            client = Groq(api_key=groq_api_key)
            prompt = f"""
Based on the following data, estimate the expected traffic delay (in minutes) and the percentage reduction for 4 different response scenarios.
Risk Level: {risk}
Average Historical Duration: {avg_duration} minutes
Total Historical Similar Events: {total_events}
Historical Road Closure Rate: {road_closure_rate}%

The 4 scenarios are: "No Action", "Officer Deployment", "Diversion Strategy", and "Full Response Plan".

Output ONLY a JSON array with this exact schema:
[
  {{ "scenario": "No Action", "delay_minutes": <float>, "reduction": "<string e.g. '0%'>" }},
  {{ "scenario": "Officer Deployment", "delay_minutes": <float>, "reduction": "<string>" }},
  ...
]
            """
            
            chat_completion = client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are a traffic simulation AI. Always output strict JSON arrays."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model="llama-3.1-8b-instant",
                temperature=0.2,
            )
            
            response_text = chat_completion.choices[0].message.content.replace("```json", "").replace("```", "").strip()
            ai_data = json.loads(response_text)
            
            if isinstance(ai_data, list) and len(ai_data) == 4:
                return ai_data
            else:
                return fallback_simulation
                
        except Exception as e:
            print(f"Error calling Groq API in simulator: {e}")
            return fallback_simulation
    else:
        return fallback_simulation