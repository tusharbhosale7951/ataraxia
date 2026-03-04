import os
import httpx
import asyncio
import logging
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY")
BASE_URL = "https://integrate.api.nvidia.com/v1"  # NVIDIA cloud API base

# System prompt for chat (Seren's personality)
SYSTEM_PROMPT = """
You are Seren, a calm and empathetic AI companion. Your purpose is to help users reduce anxiety, stress, and screen time. Always respond in a warm, gentle tone. Keep responses concise (under 150 words). If the user mentions feeling anxious or depressed, suggest a grounding exercise or a calming activity (like 4-7-8 breathing, a walk, etc.). Encourage offline activities. Never judge. Use simple, soothing language.
"""

async def get_seren_response(user_message: str, history: list = None) -> str:
    """
    Send a message to NVIDIA NIM (Llama 3.1 8B Instruct) and return Seren's response.
    """
    messages = [{"role": "user", "content": SYSTEM_PROMPT}]
    if history:
        for msg in history:
            messages.append({"role": msg["role"], "content": msg["content"]})
    messages.append({"role": "user", "content": user_message})

    payload = {
        "model": "meta/llama-3.1-8b-instruct",  # You can change to any supported model
        "messages": messages,
        "temperature": 0.7,
        "max_tokens": 256,
        "stream": False
    }

    headers = {
        "Authorization": f"Bearer {NVIDIA_API_KEY}",
        "Content-Type": "application/json"
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                f"{BASE_URL}/chat/completions",
                headers=headers,
                json=payload,
                timeout=60.0
            )
            response.raise_for_status()
            result = response.json()
            return result["choices"][0]["message"]["content"]
        except Exception as e:
            logger.error(f"NVIDIA chat error: {e}")
            return "I'm here for you. Would you like to try a quick breathing exercise?"

async def get_insight_from_nvidia(mood_data: list, screen_data: list) -> str:
    """
    Generate a weekly insight using NVIDIA NIM based on mood and screen data.
    """
    prompt = f"""
You are Seren, a calm and empathetic AI companion. Based on the user's last 7 days of mood and screen time data, generate a gentle, encouraging insight (maximum 100 words). Highlight patterns, offer praise for consistency, and suggest small improvements if needed. Use warm language. Avoid clinical terms.

Mood data (date, mood, note):
{mood_data}

Screen time data (date, minutes):
{screen_data}

Insight:
"""
    payload = {
        "model": "meta/llama-3.1-8b-instruct",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.7,
        "max_tokens": 200,
        "stream": False
    }

    headers = {
        "Authorization": f"Bearer {NVIDIA_API_KEY}",
        "Content-Type": "application/json"
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                f"{BASE_URL}/chat/completions",
                headers=headers,
                json=payload,
                timeout=60.0
            )
            response.raise_for_status()
            result = response.json()
            return result["choices"][0]["message"]["content"]
        except Exception as e:
            logger.error(f"NVIDIA insight error: {e}")
            return "Based on your data, you're doing great! Keep logging your moods and taking breaks."