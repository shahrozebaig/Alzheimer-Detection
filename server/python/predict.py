from flask import Flask, request, jsonify, send_file, redirect, url_for
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

# User class
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
    return jsonify({
        'message': 'Welcome to Alzheimer Prediction API - Home Page',
        'action': 'Click "Get Started" to go to the Login page'
    })

# "Get Started" button simulation
@app.route('/get-started', methods=['GET'])
def get_started():
    return redirect(url_for('login_page'))

# Login page
@app.route('/login-page', methods=['GET'])
def login_page():
    return jsonify({
        'message': 'This is the Login Page. Submit credentials to /login endpoint.'
    })

# Signup page
@app.route('/signup-page', methods=['GET'])
def signup_page():
    return jsonify({
        'message': 'This is the Signup Page. Submit credentials to /signup endpoint.'
    })

# Help page
@app.route('/help', methods=['GET'])
def help_page():
    return jsonify({
        'message': 'Predictions are made using a trained ML model which processes your input features.',
        'action': 'Press "Back" to return to the Prediction Form page.'
    })

# "Back" button simulation from Help to Prediction Form
@app.route('/back-to-prediction-form', methods=['GET'])
def back_to_prediction_form():
    return jsonify({
        'message': 'Returned to Prediction Form page.'
    })

# Prediction form page
@app.route('/prediction-form-page', methods=['GET'])
@login_required
def prediction_form_page():
    return jsonify({
        'message': 'This is the Prediction Form page. Submit your features to /prediction endpoint.'
    })

# Prediction endpoint
@app.route('/prediction', methods=['POST'])
@login_required
def prediction():
    data = request.get_json()
    features = data.get('features')

    if not features:
        return jsonify({'error': 'Features are required'}), 400

    try:
        prediction_result = model.predict([features])[0]
        mongo.db.predictions.insert_one({
            'user_id': current_user.id,
            'user_email': current_user.email,
            'features': features,
            'result': int(prediction_result),
            'timestamp': datetime.utcnow()
        })
        return jsonify({
            'prediction': int(prediction_result),
            'message': 'Prediction complete. View results at /result endpoint.'
        })
    except Exception as e:
        return jsonify({'error': f'Prediction error: {str(e)}'}), 500

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

# Retrieve results & download PDF
@app.route('/result', methods=['GET'])
@login_required
def get_results():
    results = list(mongo.db.predictions.find({'user_id': current_user.id}, {'_id': 0}))
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

# "Back" button simulation from Result to Prediction Form
@app.route('/back-to-prediction', methods=['GET'])
def back_to_prediction():
    return redirect(url_for('prediction_form_page'))

# "Back to Home" button in Result page
@app.route('/back-to-home', methods=['GET'])
def back_to_home():
    return redirect(url_for('home'))

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

# Logout
@app.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logout successful'})

if __name__ == '__main__':
    app.run(debug=True)
