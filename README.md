# 🧠 Alzheimer's Detection System

A full-stack web application for early detection of Alzheimer's disease using machine learning and deep learning techniques. This project combines a React frontend, Node.js backend, and Python-based machine learning models to provide an accessible and user-friendly interface for Alzheimer's disease detection. 🚀

## 📁 Project Structure

```
alzheimer-detection/
├── 📱 client/                 # Frontend React application
│   ├── 📦 build/             # Production build files
│   ├── 🌐 public/            # Static files
│   ├── 💻 src/               # React source code
│   ├── 📄 package.json       # Frontend dependencies
│   └── 📖 README.md          # Frontend documentation
│
├── 🔧 server/                 # Backend Node.js application
│   ├── 🐍 python/            # Python ML model integration
│   ├── 🔌 routes/            # API route handlers
│   ├── 📊 models/            # Database models
│   ├── 🛡️ middleware/        # Custom middleware
│   ├── ⚙️ server.js          # Main server file
│   └── 📄 package.json       # Backend dependencies
│
└── 📓 notebooks/             # Jupyter notebooks for ML development
    ├── 📝 training.ipynb     # Model training notebook
    ├── 🤖 model1.sav         # Trained model 1
    ├── 🤖 model2.sav         # Trained model 2
    └── 📊 processed.csv      # Processed dataset
```

## ✨ Features

- 🔐 **User Authentication**: Secure login and registration system
- 📊 **Interactive Dashboard**: User-friendly interface for data input and results visualization
- 🤖 **ML Model Integration**: Multiple trained models for accurate prediction
- ⚡ **Real-time Analysis**: Quick and efficient processing of user inputs
- 📱 **Responsive Design**: Works seamlessly across different devices
- 🔒 **Secure API**: Protected endpoints for data handling

## 🛠️ Technology Stack

### 🌐 Frontend
- ⚛️ React.js
- 🎨 Material-UI
- 🔄 Axios for API calls
- 📈 Chart.js for data visualization

### ⚙️ Backend
- 🟢 Node.js
- 🚂 Express.js
- 🍃 MongoDB
- 🐍 Python (for ML model integration)
- 🧮 TensorFlow/PyTorch (for ML models)

### 🛠️ Development Tools
- 📓 Jupyter Notebooks
- 🔄 Git for version control
- 📦 npm for package management

## 🚀 Getting Started

### 📋 Prerequisites
- 🟢 Node.js (v14 or higher)
- 🐍 Python 3.8+
- 🍃 MongoDB
- 📦 npm or yarn

## 🎥👀 Mp4



https://github.com/user-attachments/assets/d6fa1465-7fa8-422e-b8f5-6e324e7e8f66


    

        

### ⚙️ Installation

1. 📥 Clone the repository:
```bash
git clone https://github.com/yourusername/alzheimer-detection.git
cd alzheimer-detection
```

2. 📦 Install frontend dependencies:
```bash
cd client
npm install
```

3. 📦 Install backend dependencies:
```bash
cd ../server
npm install
```

4. 🐍 Set up Python environment and install dependencies:
```bash
cd python
pip install -r requirements.txt
```

### 🏃‍♂️ Quick Start Guide

1. **Start Backend Server**
```bash
cd server
node server.js
# Server runs on http://localhost:5000
```

2. **Start Frontend Client**
```bash
cd client
npm start
# Client runs on http://localhost:3000
```

3. **Access the Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

Note: Make sure MongoDB is running before starting the servers.

## 🤖 Model Information

The project uses two trained models (`model1.sav` and `model2.sav`) for Alzheimer's detection. These models were developed and trained using the Jupyter notebooks in the `notebooks` directory. The models are integrated into the backend server for real-time predictions. 📊

## 🔒 Security

- 🛡️ All API endpoints are protected with authentication middleware
- 🔐 User data is encrypted and securely stored
- 🔄 Regular security updates and dependency checks
- 🔑 Environment variables for sensitive information

## 🤝 Contributing

1. 🍴 Fork the repository
2. 🌿 Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. 💾 Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. 📤 Push to the branch (`git push origin feature/AmazingFeature`)
5. 🔄 Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details. ⚖️    
