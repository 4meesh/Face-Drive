# Face Drive Scanner

A full-stack web application that scans images from a Google Drive folder to find faces matching a reference image.

## Features

- Upload reference images
- Scan Google Drive folders
- Face recognition using face_recognition library
- Modern React frontend
- Flask backend with Google Drive API integration

## Prerequisites

- Python 3.8+
- Node.js 14+
- Google Cloud Project with Drive API enabled
- Google OAuth 2.0 credentials

## Setup

### Backend Setup

1. Create a virtual environment and activate it:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up Google Cloud Project:
   - Create a new project in Google Cloud Console
   - Enable the Google Drive API
   - Create OAuth 2.0 credentials
   - Download the credentials and save as `credentials.json`

4. Run the Flask backend:
```bash
cd backend
python app.py
```

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Update the Google Client ID:
   - Open `src/App.js`
   - Replace `YOUR_GOOGLE_CLIENT_ID` with your actual Google OAuth client ID

3. Start the development server:
```bash
npm start
```

## Usage

1. Open the application in your browser (http://localhost:3000)
2. Enter a Google Drive folder link
3. Upload a reference image
4. Sign in with Google
5. Click "Scan Images" to start the face recognition process
6. View matching images in the results section

## Security Notes

- Never commit your Google credentials
- Keep your API keys secure
- Use environment variables for sensitive data

## License

MIT 