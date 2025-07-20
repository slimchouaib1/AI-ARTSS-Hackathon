from flask import session
from werkzeug.security import generate_password_hash, check_password_hash
from pymongo import MongoClient

client = MongoClient("mongodb+srv://sarra:sarra123@cluster0.19tqig2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client.chemo_app
users_collection = db.users

def register_user(username, password):
    if users_collection.find_one({"username": username}):
        return False, "Username already exists"
    hashed = generate_password_hash(password)
    users_collection.insert_one({"username": username, "password": hashed})
    return True, "User registered successfully"

def login_user(username, password):
    user = users_collection.find_one({"username": username})
    if not user:
        return False, "User not found"
    if not check_password_hash(user['password'], password):
        return False, "Incorrect password"
    session['user'] = username
    return True, "Logged in successfully"
