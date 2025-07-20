from flask import Flask, request, jsonify
from flask_cors import CORS
from nlp_engine import extract_info
from auth import register_user, login_user
from pymongo import MongoClient
import os
from bson import objectid
from neo4j_service import create_patient_node, get_all_patients
app = Flask(__name__)
CORS(app)
app.secret_key = os.environ.get('SECRET_KEY', 'dev-secret')

client = MongoClient("mongodb+srv://sarra:sarra123@cluster0.19tqig2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client.chemo_app
patients_collection = db.patients


@app.route('/api/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    note = data.get('note', '')

    result = extract_info(note)
    patient_name = result.get("patient")

    # ⚠️ Vérification si le patient existe déjà
    if patients_collection.find_one({"patient": patient_name}):
        return jsonify({
            "warning": f"⚠️ Le patient '{patient_name}' a déjà été diagnostiqué."
        })

    # ✅ Sinon, on enregistre Mongo
    inserted = patients_collection.insert_one(result)
    result["_id"] = str(inserted.inserted_id)

    # ✅ Et on envoie dans Neo4j
    create_patient_node(result)

    return jsonify(result)

@app.route('/api/patients', methods=['GET'])
def get_patients():
    patients = list(patients_collection.find())
    # Convertir tous les ObjectId en string
    for patient in patients:
        patient["_id"] = str(patient["_id"])
    return jsonify(patients)
@app.route('/api/neo4j-patients', methods=['GET'])
def neo4j_patients():
    patients = get_all_patients()
    return jsonify(patients)
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    success, message = login_user(username, password)
    return jsonify({"success": success, "message": message})

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    success, message = register_user(username, password)
    return jsonify({"success": success, "message": message})

if __name__ == '__main__':
    app.run(debug=True)
