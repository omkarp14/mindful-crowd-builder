import openai
import os
from fastapi import APIRouter

router = APIRouter()

openai.api_key = os.getenv("OPENAI_API_KEY")

@router.post("/ai/suggestions")
def generate_ai_suggestions(prompt: str):
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "system", "content": "You are an AI assistant."}, {"role": "user", "content": prompt}]
    )
    return {"suggestions": response["choices"][0]["message"]["content"]}
