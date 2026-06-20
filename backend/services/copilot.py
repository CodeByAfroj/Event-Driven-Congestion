import os
from groq import Groq

def generate_plan(risk, optimization, historical_stats, recommendations):
    # Hardcoded Fallback Logic
    fallback_plan = f"""Traffic Operations Briefing

Risk Level: {risk}

Recommended Officers: {optimization['officers']}
Recommended Barricades: {optimization['barricades']}
Diversion Required: {optimization['diversion']}

Historical Incidents: {historical_stats['total_events']}
Average Duration: {historical_stats['average_duration']} minutes
Peak Hour: {historical_stats['peak_hour']}

Recommended Actions:
{chr(10).join(recommendations['actions'])}
"""

    plan = fallback_plan

    groq_api_key = os.environ.get("GROQ_API_KEY")
    if groq_api_key and groq_api_key != "your_groq_api_key_here":
        try:
            client = Groq(api_key=groq_api_key)
            prompt = f"""
You are an AI Copilot for traffic operations.
Draft a concise, action-oriented Operations Briefing based on the following data:

Risk Level: {risk}
Recommended Officers: {optimization['officers']}
Recommended Barricades: {optimization['barricades']}
Diversion Required: {optimization['diversion']}
Historical Incidents: {historical_stats['total_events']}
Average Duration: {historical_stats['average_duration']} minutes
Peak Hour: {historical_stats['peak_hour']}
Recommended Actions: {', '.join(recommendations['actions'])}

The output should be the raw text/markdown of the briefing. Keep it punchy and clear.
            """
            
            chat_completion = client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are a professional traffic management AI generating action plans."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model="llama-3.1-8b-instant",
                temperature=0.4,
            )
            
            plan = chat_completion.choices[0].message.content.strip()
            
        except Exception as e:
            print(f"Error calling Groq API in copilot: {e}")

    return plan