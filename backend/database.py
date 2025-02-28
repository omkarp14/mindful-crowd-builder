from fastapi import FastAPI
from postgrest import Client
import os

# Initialize FastAPI
app = FastAPI()

# Supabase credentials
SUPABASE_URL = "https://cffiattcpldtkaeiwtfa.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmZmlhdHRjcGxkdGthZWl3dGZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2NzAxNzAsImV4cCI6MjA1NjI0NjE3MH0.1ed8Ch7JpYetSRG_-336CZUP05DVNRGWL84yCoiE9b0"

# ✅ Initialize Supabase Client with headers
client = Client(f"{SUPABASE_URL}/rest/v1", headers={"apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}"})

# Function to return the Supabase client
def get_db():
    return client
