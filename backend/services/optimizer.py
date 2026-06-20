import os
import json
from groq import Groq

def optimize(risk, historical_stats):
    total_events = historical_stats.get("total_events", 0)
    avg_duration = historical_stats.get("average_duration", 0)
    closure_rate = historical_stats.get("road_closure_rate", 0)

    # Hardcoded Fallback Logic
    base_officers = 3
    if risk == "Medium":
        base_officers = 8
    elif risk == "High":
        base_officers = 15

    frequency_bonus = min(total_events // 1000, 5)
    duration_bonus = int(avg_duration / 60)

    fallback_officers = base_officers + frequency_bonus + duration_bonus
    fallback_barricades = max(1, round(closure_rate / 20))
    fallback_diversion = (risk != "Low" or closure_rate > 30)

    groq_api_key = os.environ.get("GROQ_API_KEY")
    if groq_api_key and groq_api_key != "your_groq_api_key_here":
        try:
            client = Groq(api_key=groq_api_key)
            prompt = f"""
Based on the following data, recommend the optimal number of police officers, barricades, and whether a traffic diversion is required for an upcoming event.
Risk Level: {risk}
Total Historical Similar Events: {total_events}
Average Event Duration: {avg_duration} minutes
Historical Road Closure Rate: {closure_rate}%

Output ONLY a JSON object with this exact schema:
{{
    "officers": <integer>,
    "barricades": <integer>,
    "diversion": <boolean>
}}
            """
            
            chat_completion = client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are a traffic optimization AI. Always output strict JSON."
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
            
            officers = int(ai_data.get("officers", fallback_officers))
            barricades = int(ai_data.get("barricades", fallback_barricades))
            diversion = bool(ai_data.get("diversion", fallback_diversion))
            
        except Exception as e:
            print(f"Error calling Groq API in optimizer: {e}")
            officers = fallback_officers
            barricades = fallback_barricades
            diversion = fallback_diversion
    else:
        officers = fallback_officers
        barricades = fallback_barricades
        diversion = fallback_diversion

    return {
        "officers": officers,
        "barricades": barricades,
        "diversion": diversion,
        "reasoning": {
            "historical_events": total_events,
            "avg_duration": avg_duration,
            "road_closure_rate": closure_rate
        }
    }