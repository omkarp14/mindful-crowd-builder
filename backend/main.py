from fastapi import FastAPI, HTTPException, Depends
from database import get_db
from models import UserRegister, UserLogin, pwd_context
from fastapi.middleware.cors import CORSMiddleware
import uuid
import jwt
import datetime

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite frontend URL
        "http://127.0.0.1:5173",  # Alternative frontend URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Secret Key for JWT Token
SECRET_KEY = "63c2d430e2fc6d12e7824ec0efadc1ed794d7ebd029d415504f785270f3279ff"
ALGORITHM = "HS256"


# API to get all users from Supabase
@app.get("/users")
async def get_users():
    db = get_db()
    try:
        users = await db.from_("users").select("*").execute()

        # ✅ Debugging: Print response before returning
        print("Supabase Response (GET /users):", users)

        if not users or users == {}:  # If Supabase returns empty or None
            return {"message": "No users found"}

        return users

    except Exception as e:
        print("Error fetching users:", str(e))
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


# ✅ User Registration API
@app.post("/register")
async def register_user(user: UserRegister):
    db = get_db()
    try:
        # ✅ Hash the password before storing
        user.hash_password()
        user_id = str(uuid.uuid4())

        result = await db.from_("users").insert([{
            "id": user_id,
            "full_name": user.full_name,
            "email": user.email,
            "password": user.password,  # Store hashed password
            "address": user.address,
            "post_code": user.post_code,
            "country": user.country
        }]).execute()

        return {"message": "User registered successfully!", "user": result}

    except Exception as e:
        print("Error registering user:", str(e))
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.post("/login")
async def login(user: UserLogin):
    db = get_db()
    try:
        # ✅ Execute the query and extract the data
        response = await db.from_("users").select("*").eq("email", user.email).execute()
        users = response.data  # Extract the list of users

        if not users:  # If no user is found
            raise HTTPException(status_code=400, detail="Invalid email or password")

        db_user = users[0]  # Get the first matching user

        # ✅ Verify the password
        if not pwd_context.verify(user.password, db_user["password"]):
            raise HTTPException(status_code=400, detail="Invalid email or password")

        # ✅ Generate JWT Token
        payload = {
            "sub": db_user["id"],
            "exp": datetime.datetime.utcnow() + datetime.timedelta(days=1)
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

        # ✅ Return "Login Successful" message
        return {
            "message": "Login successful!",
            "access_token": token,
            "token_type": "bearer"
        }

    except Exception as e:
        print("Error logging in user:", str(e))
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    
@app.get("/")
async def root():
    return {"message": "Welcome to my API!"}

'''
'{
  "full_name": "Omkar Patil",
  "email": "omkar@example.com",
  "password": "mysecurepassword",
  "address": "123 London Street",
  "post_code": "E14 5AB",
  "country": "UK"
}'
'''