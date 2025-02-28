import requests

# Define the API endpoint
API_URL = "http://127.0.0.1:8000/login"  # Update if your backend runs on a different port

# Test user credentials (use valid credentials from your database)
test_user = {
    "email": "aaryamauu@example.com",   # Replace with a real user
    "password": "booboo"       # Replace with the correct password
}

# Make the API request
response = requests.post(API_URL, json=test_user)

# Print the response
if response.status_code == 200:
    data = response.json()
    print("✅ Login successful!")
    print("🔑 Access Token:", data.get("access_token"))
else:
    print("❌ Login failed!")
    print("🔍 Error:", response.json().get("detail"))
