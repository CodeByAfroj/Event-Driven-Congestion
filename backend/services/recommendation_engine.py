import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

def generate_recommendations(
    risk,
    historical_stats,
    optimization=None,
    simulation=None
):

    total_events = historical_stats.get(
        "total_events",
        0
    )

    avg_duration = historical_stats.get(
        "average_duration",
        0
    )

    peak_hour = historical_stats.get(
        "peak_hour"
    )

    station = historical_stats.get(
        "most_common_station"
    )

    corridor = historical_stats.get(
        "most_common_corridor"
    )

    recommendations = []

    groq_api_key = os.environ.get("GROQ_API_KEY")
    if groq_api_key and groq_api_key != "your_groq_api_key_here":
        try:
            client = Groq(api_key=groq_api_key)
            prompt = f"""
Based on the following data for an upcoming event, provide 3 to 5 specific, actionable recommendations for event/traffic management.
Risk Level: {risk}
Total Historical Events: {total_events}
Average Resolution Time: {avg_duration} minutes
Peak Incident Hour: {peak_hour}
Most Common Station: {station}
Most Common Corridor: {corridor}
"""
            if optimization:
                prompt += f"\nOptimization Data: {optimization}"
            if simulation:
                prompt += f"\nSimulation Data: {simulation}"
                
            prompt += """

Important rules:
1. If the "Most Common Corridor" is "Non-corridor", it means the event is not located on a specific major corridor. Do NOT refer to "Non-corridor" as a place name. 
2. Use the Optimization and Simulation data (if provided) to back up your recommendations (e.g. mentioning delay reduction percentages).
3. Return your response ONLY as a JSON array of strings. Do not include any markdown formatting or explanations.
Example:
["Deploy 8 officers to Yelahanka station", "Implement Full Response Plan to reduce delays by 65%", "Enable diversion routes near the station"]
            """
            
            chat_completion = client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are an AI traffic and event management assistant. Always reply with a strict JSON array of strings."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model="llama-3.1-8b-instant",
                temperature=0.3,
            )
            
            response_text = chat_completion.choices[0].message.content
            # Strip potential markdown formatting if the model still includes it
            response_text = response_text.replace("```json", "").replace("```", "").strip()
            
            recommendations = json.loads(response_text)
            
            # Ensure it's a list
            if not isinstance(recommendations, list):
                recommendations = ["Routine monitoring", "Failed to parse AI response correctly"]
                
        except Exception as e:
            print(f"Error calling Groq API: {e}")
            recommendations = [f"Fallback: Routine monitoring only (AI Error: {str(e)})"]
    else:
        # Fallback if no API key is provided
        if risk == "High":
            recommendations = [
                "Deploy officers 30 minutes before event start",
                "Enable diversion routes immediately",
                "Issue public advisory notifications",
                "Monitor congestion every 15 minutes"
            ]
        elif risk == "Medium":
            recommendations = [
                "Deploy officers at major junctions",
                "Prepare alternate routes",
                "Monitor traffic density"
            ]
        else:
            recommendations = [
                "Routine monitoring only"
            ]

    # Clean up the output to be more intelligent
    critical_corridor = corridor if corridor != "Non-corridor" else None

    return {
        "critical_corridor": critical_corridor,
        "recommended_station": station,
        "peak_incident_hour": peak_hour,
        "historical_incidents": total_events,
        "average_resolution_time": avg_duration,
        "actions": recommendations
    }