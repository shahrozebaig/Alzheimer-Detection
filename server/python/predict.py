import sys
import json
import joblib
import os
import numpy as np

# Load the trained model (.sav)
model_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../notebooks/model1.sav'))
model = joblib.load(model_path)

# Read input data from Node.js as JSON
input_data = sys.stdin.read()
data = json.loads(input_data)

# Extract values in correct order
features = [
    float(data["age"]),
    float(data["mmse"]),
    float(data["cdr"]),
    float(data["etiv"]),
    float(data["nwbv"]),
    float(data["asf"])
]

# Convert to 2D array for model
input_array = np.array([features])

# Make prediction
prediction = model.predict(input_array)[0]  # Get single value

# Helper function to determine stage and precautions
def determine_alzheimers_stage(mmse, cdr):
    stage = ""
    precautions = []

    mmse = float(mmse)
    cdr = float(cdr)

    if mmse >= 24 and cdr == 0:
        stage = "No Dementia"
        precautions = [
            "Maintain a healthy diet and exercise regularly.",
            "Engage in cognitive activities like reading and puzzles.",
            "Regular health check-ups to monitor cognitive function.",
            "Manage stress through meditation or social interactions.",
            "Ensure good sleep hygiene for brain health.",
        ]
    elif mmse >= 20 and mmse < 24 and cdr == 0.5:
        stage = "Mild Cognitive Impairment (MCI)"
        precautions = [
            "Adopt a brain-healthy lifestyle with a balanced diet.",
            "Engage in memory-enhancing activities like learning new skills.",
            "Regular medical check-ups for early intervention.",
            "Manage other health conditions like diabetes or hypertension.",
            "Stay socially active to maintain mental well-being.",
        ]
    elif mmse >= 10 and mmse < 20 and cdr == 1:
        stage = "Mild Alzheimer's Disease"
        precautions = [
            "Consult a doctor for medical assessment and medication if needed.",
            "Create reminders and schedules to assist daily activities.",
            "Ensure a safe home environment to prevent accidents.",
            "Encourage participation in familiar activities.",
            "Provide emotional and social support for the patient.",
        ]
    elif mmse >= 5 and mmse < 10 and cdr == 2:
        stage = "Moderate Alzheimer's Disease"
        precautions = [
            "Ensure 24/7 supervision for safety and assistance.",
            "Use simple communication and avoid overwhelming the patient.",
            "Modify the home for safety, such as removing hazards.",
            "Encourage physical activities like walking under supervision.",
            "Provide a structured daily routine to reduce confusion.",
        ]
    elif mmse < 5 and cdr == 3:
        stage = "Severe Alzheimer's Disease"
        precautions = [
            "Full-time caregiving and medical supervision required.",
            "Ensure a comfortable and familiar environment.",
            "Monitor for difficulties in swallowing and assist with eating.",
            "Provide skin care and prevent bedsores for bedridden patients.",
            "Use soft lighting and calming sounds to reduce agitation.",
        ]
    else:
        stage = "Unknown Stage"
        precautions = ["Consult a doctor for further evaluation."]

    return stage, precautions

# Determine stage and precautions based on MMSE and CDR
alzheimers_stage, precautions = determine_alzheimers_stage(data["mmse"], data["cdr"])

# Output prediction, stage, and precautions back as JSON
output = {
    "prediction": prediction,
    "stage": alzheimers_stage,
    "precautions": precautions
}

print(json.dumps(output))
sys.stdout.flush()
