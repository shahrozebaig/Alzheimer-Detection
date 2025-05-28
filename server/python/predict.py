from flask import Flask, request, jsonify, send_file
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from bson.objectid import ObjectId
import joblib
from fpdf import FPDF
import io
from datetime import datetime

app = Flask(__name__)
app.secret_key = "supersecretkey"
app.config["MONGO_URI"] = "mongodb://localhost:27017/alzheimer_db"

# Initialize extensions
mongo = PyMongo(app)
bcrypt = Bcrypt(app)
login_manager = LoginManager()
login_manager.init_app(app)

# Load trained ML model
model = joblib.load('model1.sav')

# User class for Flask-Login
class User(UserMixin):
    def __init__(self, user_id, email):
        self.id = user_id
        self.email = email

@login_manager.user_loader
def load_user(user_id):
    user_data = mongo.db.users.find_one({"_id": ObjectId(user_id)})
    if user_data:
        return User(str(user_data["_id"]), user_data["email"])
    return None

# Home
@app.route('/', methods=['GET'])
def home():
    return jsonify({'message': 'Welcome to Alzheimer Prediction API'})

# Signup
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    existing_user = mongo.db.users.find_one({'email': email})
    if existing_user:
        return jsonify({'error': 'Email already exists'}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    user_id = mongo.db.users.insert_one({'email': email, 'password': hashed_password}).inserted_id
    return jsonify({'message': 'Signup successful', 'user_id': str(user_id)})

# Login
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    user_data = mongo.db.users.find_one({'email': email})
    if user_data and bcrypt.check_password_hash(user_data['password'], password):
        user = User(str(user_data['_id']), user_data['email'])
        login_user(user)
        return jsonify({'message': 'Login successful'})
    else:
        return jsonify({'error': 'Invalid credentials'}), 401

# Forgot password
@app.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email')

    user_data = mongo.db.users.find_one({'email': email})
    if user_data:
        return jsonify({'message': 'Email exists. Proceed to reset password.'})
    else:
        return jsonify({'error': 'Email not found'}), 404

# Reset password
@app.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    email = data.get('email')
    new_password = data.get('new_password')

    if not email or not new_password:
        return jsonify({'error': 'Email and new password are required'}), 400

    hashed_password = bcrypt.generate_password_hash(new_password).decode('utf-8')
    result = mongo.db.users.update_one({'email': email}, {'$set': {'password': hashed_password}})

    if result.matched_count:
        return jsonify({'message': 'Password reset successful'})
    else:
        return jsonify({'error': 'Email not found'}), 404

# Prediction
@app.route('/prediction', methods=['POST'])
@login_required
def prediction():
    data = request.get_json()
    features = data.get('features')

    if not features:
        return jsonify({'error': 'Features are required'}), 400

    try:
        prediction_result = model.predict([features])[0]

        # Save prediction with timestamp
        mongo.db.predictions.insert_one({
            'user_id': current_user.id,
            'user_email': current_user.email,
            'features': features,
            'result': int(prediction_result),
            'timestamp': datetime.utcnow()
        })

        return jsonify({'prediction': int(prediction_result)})
    except Exception as e:
        return jsonify({'error': f'Prediction error: {str(e)}'}), 500

# Help page – explain how predictions work
@app.route('/help', methods=['GET'])
def help_page():
    return jsonify({
        'message': 'Predictions are made using a trained ML model (model1.sav) which processes your input features and predicts the risk of Alzheimer’s disease.'
    })

# Form submission
@app.route('/form', methods=['POST'])
@login_required
def form_submit():
    data = request.get_json()

    if not data:
        return jsonify({'error': 'No form data provided'}), 400

    mongo.db.forms.insert_one({
        'user_id': current_user.id,
        'user_email': current_user.email,
        'form_data': data,
        'timestamp': datetime.utcnow()
    })

    return jsonify({'message': 'Form data saved'})

# Retrieve results & generate downloadable PDF report
@app.route('/result', methods=['GET'])
@login_required
def get_results():
    results = list(mongo.db.predictions.find({'user_id': current_user.id}, {'_id': 0}))

    # Generate PDF report
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font('Arial', 'B', 16)
    pdf.cell(0, 10, 'Alzheimer Prediction Report', ln=True)
    pdf.ln(10)
    pdf.set_font('Arial', '', 12)

    if not results:
        pdf.cell(0, 10, 'No predictions found.', ln=True)
    else:
        for idx, result in enumerate(results, start=1):
            timestamp_str = result['timestamp'].strftime('%Y-%m-%d %H:%M:%S') if 'timestamp' in result else 'N/A'
            pdf.cell(0, 10, f'Prediction {idx}:', ln=True)
            pdf.cell(0, 10, f'  Features: {result["features"]}', ln=True)
            pdf.cell(0, 10, f'  Result: {result["result"]}', ln=True)
            pdf.cell(0, 10, f'  Timestamp: {timestamp_str}', ln=True)
            pdf.ln(5)

    pdf_output = io.BytesIO()
    pdf.output(pdf_output)
    pdf_output.seek(0)

    return send_file(pdf_output, download_name='alzheimer_report.pdf', as_attachment=True, mimetype='application/pdf')

# Logout
@app.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logout successful'})

if __name__ == '__main__':
    app.run(debug=True)
