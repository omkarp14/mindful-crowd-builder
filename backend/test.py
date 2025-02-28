import requests
from pprint import pprint
BASE_URL = "http://127.0.0.1:8000"

# # Insert a new user
# user_data = {
#     "full_name": "Omkar shree",
#     "email": "omkarpat@example.com",
#     "address": "123 London Street",
#     "post_code": "E14 5AB",
#     "country": "UK"
# }

# # response = requests.post(f"{BASE_URL}/users", json=user_data)
# # print("POST Response:", response.json())

# # Fetch all users
# response = requests.get(f"{BASE_URL}/users")
# print("GET Response:", response.json())
# pprint(response.json())

import secrets

SECRET_KEY = secrets.token_hex(32)  # Generates a 64-character random key
print("Generated SECRET_KEY:", SECRET_KEY)
