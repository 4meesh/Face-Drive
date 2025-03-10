import React, { useState, useEffect } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [driveLink, setDriveLink] = useState('');
  const [referenceImage, setReferenceImage] = useState(null);
  const [matchingImages, setMatchingImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [credentials, setCredentials] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isBackendHealthy, setIsBackendHealthy] = useState(false);

  useEffect(() => {
    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    try {
      const response = await fetch(`${API_URL}/health`);
      setIsBackendHealthy(response.ok);
    } catch (err) {
      setIsBackendHealthy(false);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Image size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setReferenceImage(reader.result);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScan = async () => {
    if (!driveLink || !referenceImage || !credentials) {
      setError('Please provide all required information');
      return;
    }

    if (!driveLink.includes('drive.google.com')) {
      setError('Please enter a valid Google Drive folder link');
      return;
    }

    setLoading(true);
    setError(null);
    setProgress(0);
    setMatchingImages([]);

    try {
      const response = await fetch(`${API_URL}/scan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          drive_link: driveLink,
          reference_image: referenceImage,
          credentials: credentials
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to scan images');
      }

      setMatchingImages(data.matching_images);
      setProgress(100);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Face Drive Scanner</h1>
        {!isBackendHealthy && (
          <div className="backend-warning">
            Warning: Backend service is not responding
          </div>
        )}
      </header>
      <main className="App-main">
        <div className="input-section">
          <div className="input-group">
            <label>Google Drive Folder Link:</label>
            <input
              type="text"
              value={driveLink}
              onChange={(e) => setDriveLink(e.target.value)}
              placeholder="Enter Google Drive folder link"
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <label>Reference Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={loading}
            />
            {referenceImage && (
              <img
                src={referenceImage}
                alt="Reference"
                className="preview-image"
              />
            )}
          </div>

          <div className="auth-section">
            <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  setCredentials(credentialResponse);
                  setError(null);
                }}
                onError={() => {
                  setError('Google authentication failed');
                }}
                scope="https://www.googleapis.com/auth/drive.readonly"
                disabled={loading}
              />
            </GoogleOAuthProvider>
          </div>

          <button
            onClick={handleScan}
            disabled={loading || !isBackendHealthy}
            className="scan-button"
          >
            {loading ? 'Scanning...' : 'Scan Images'}
          </button>

          {loading && (
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="results-section">
          <h2>Matching Images</h2>
          {matchingImages.length === 0 && !loading && !error && (
            <p className="no-results">No matching images found</p>
          )}
          <div className="image-grid">
            {matchingImages.map((imageUrl, index) => (
              <div key={index} className="image-card">
                <img src={imageUrl} alt={`Match ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App; 