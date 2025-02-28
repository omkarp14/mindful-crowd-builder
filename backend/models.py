from pydantic import BaseModel
from passlib.context import CryptContext

# Hashing context for passwords
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserRegister(BaseModel):
    full_name: str
    email: str
    password: str
    address: str
    post_code: str
    country: str

    def hash_password(self):
        self.password = pwd_context.hash(self.password)

class UserLogin(BaseModel):
    email: str
    password: str
