import { useState } from 'react';
import LoginForm from './components/LoginForm.jsx';
import './App.css';

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

