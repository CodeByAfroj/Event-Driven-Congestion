import os
from groq import Groq

def generate_commander_briefing(risk, historical_stats, optimization, simulation, recommendations):
    total_events = historical_stats.get("total_events", 0)
    avg_duration = historical_stats.get("average_duration", 0)
    peak_hour = historical_stats.get("peak_hour", "Unknown")
    station = recommendations.get("recommended_station", "Unknown")
    corridor = recommendations.get("critical_corridor", "Unknown")
    best_scenario = simulation[-1]

    fallback_briefing = f"""EVENT AI COMMANDER REPORT

Risk Assessment
---------------
Risk Level: {risk}

Historical Intelligence
-----------------------
Similar Incidents: {total_events}
Average Duration: {avg_duration:.1f} minutes
Peak Incident Hour: {peak_hour}:00

Operational Recommendation
--------------------------
Deploy {optimization['officers']} officers
Install {optimization['barricades']} barricades

Recommended Police Station:
{station}

Critical Corridor:
{corridor}

Expected Outcome
----------------
Using the Full Response Plan:
Expected Delay: {best_scenario['delay_minutes']} minutes
Expected Reduction: {best_scenario['reduction']}

Recommended Actions
-------------------"""
    for action in recommendations["actions"]:
        fallback_briefing += f"\n• {action}"

    briefing = fallback_briefing

    groq_api_key = os.environ.get("GROQ_API_KEY")
    if groq_api_key and groq_api_key != "your_groq_api_key_here":
        try:
            client = Groq(api_key=groq_api_key)
            prompt = f"""
You are an AI generating an official, professional Commander Briefing Report for traffic and event management.
Synthesize the following data into a highly readable, urgent, and well-structured markdown report.

Risk Level: {risk}
Similar Incidents: {total_events}
Average Duration: {avg_duration} minutes
Peak Incident Hour: {peak_hour}:00
Operational Needs: Deploy {optimization['officers']} officers, {optimization['barricades']} barricades.
Recommended Station: {station}
Critical Corridor: {corridor}
Expected Outcome: {best_scenario['delay_minutes']} minutes of delay with {best_scenario['reduction']} reduction using Full Response Plan.
Recommended Actions: {', '.join(recommendations['actions'])}

The output should be the raw text/markdown of the briefing. Do NOT wrap it in a JSON object.
            """
            
            chat_completion = client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are a professional traffic management AI generating reports."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model="llama-3.1-8b-instant",
                temperature=0.4,
            )
            
            briefing = chat_completion.choices[0].message.content.strip()
            
        except Exception as e:
            print(f"Error calling Groq API in commander: {e}")

    return {
        "summary": briefing,
        "risk": risk,
        "recommended_station": station,
        "critical_corridor": corridor,
        "officers": optimization["officers"],
        "barricades": optimization["barricades"],
        "expected_delay": best_scenario["delay_minutes"],
        "expected_reduction": best_scenario["reduction"]
    }
