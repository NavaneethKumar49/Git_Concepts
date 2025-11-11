import { useState } from 'react';
import LoginForm from './components/LoginForm.jsx';
import './App.css';
import developerImage from './images/image.png';

function App() {
  const [authState, setAuthState] = useState({ status: 'idle' });

  const handleLogin = async (credentials) => {
    setAuthState({ status: 'submitting' });

    try {
      const response = await fakeAuthenticate(credentials);
      setAuthState({ status: 'success', user: response.user });
    } catch (error) {
      setAuthState({ status: 'error', message: error.message });
    }
  };

  return (
    <div className="app-shell">
      <div className="background-symbols" aria-hidden="true">
        <span className="background-symbol background-symbol--one">✦</span>
        <span className="background-symbol background-symbol--two">✶</span>
        <span className="background-symbol background-symbol--three">✺</span>
      </div>
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <linearGradient id="star-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>
      </svg>
      <div className="left-side-content">
        <div className="image-bubble">
          <img 
            src={developerImage} 
            alt="Developer illustration" 
            className="bubble-image"
          />
        </div>
      </div>
      <h1 className="background-heading">
        <svg className="logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="url(#star-gradient)" stroke="#f59e0b" strokeWidth="1.5" strokeLinejoin="round"/>
        </svg>
        స్వాగతం సుస్వాగతం
        <svg className="logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="url(#star-gradient)" stroke="#f59e0b" strokeWidth="1.5" strokeLinejoin="round"/>
        </svg>
      </h1>
      <div className="panel">
        {authState.status === 'success' ? (
          <SuccessState user={authState.user} onReset={() => setAuthState({ status: 'idle' })} />
        ) : (
          <LoginForm onSubmit={handleLogin} status={authState.status} errorMessage={authState.message} />
        )}
      </div>
    </div>
  );
}

const fakeAuthenticate = ({ email, password }) =>
  new Promise((resolve, reject) => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    setTimeout(() => {
      if (trimmedEmail === 'admin@example.com' && trimmedPassword === 'letmein!') {
        resolve({ user: { name: 'Admin User', email: trimmedEmail } });
      } else {
        reject(new Error('Invalid email or password. Try admin@example.com / letmein!'));
      }
    }, 1000);
  });

function SuccessState({ user, onReset }) {
  return (
    <div className="success-state">
      <h1>Welcome back</h1>
      <p>You are logged in as {user.email}.</p>
      <button type="button" onClick={onReset}>
        Log out
      </button>
    </div>
  );
}

export default App;

