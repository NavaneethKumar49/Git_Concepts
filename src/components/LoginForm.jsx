import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

const validators = {
  email: (value) => {
    if (!value) return 'Email is required';
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(value) ? '' : 'Enter a valid email address';
  },
  password: (value) => {
    if (!value) return 'Password is required';
    if (value.length < 8) return 'Password must be at least 8 characters';
    return '';
  }
};

function LoginForm({ onSubmit, status, errorMessage }) {
  const [formValues, setFormValues] = useState({ email: '', password: '' });
  const [touched, setTouched] = useState({ email: false, password: false });
  const [showPassword, setShowPassword] = useState(false);

  const fieldErrors = useMemo(
    () => ({
      email: validators.email(formValues.email),
      password: validators.password(formValues.password)
    }),
    [formValues]
  );

  const isFormValid = !fieldErrors.email && !fieldErrors.password;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setTouched({ email: true, password: true });

    if (isFormValid) {
      onSubmit({ ...formValues });
    }
  };

  useEffect(() => {
    if (status === 'success') {
      setFormValues({ email: '', password: '' });
      setTouched({ email: false, password: false });
      setShowPassword(false);
    }
  }, [status]);

  return (
    <form className="login-form" onSubmit={handleSubmit} noValidate>
      <header className="login-form__header">
        <h1>Sign in to your account</h1>
        <p>Please enter your details to continue.</p>
      </header>

      <div className="form-field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={formValues.email}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={Boolean(fieldErrors.email && touched.email)}
          aria-describedby="email-error"
          disabled={status === 'submitting'}
        />
        {touched.email && fieldErrors.email && (
          <span id="email-error" role="alert" className="field-error">
            {fieldErrors.email}
          </span>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="password">Password</label>
        <div className="password-field">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="********"
            value={formValues.password}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(fieldErrors.password && touched.password)}
            aria-describedby="password-error"
            disabled={status === 'submitting'}
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        {touched.password && fieldErrors.password && (
          <span id="password-error" role="alert" className="field-error">
            {fieldErrors.password}
          </span>
        )}
      </div>

      {errorMessage && status === 'error' && (
        <div className="form-alert" role="alert">
          {errorMessage}
        </div>
      )}

      <button type="submit" className="submit-button" disabled={!isFormValid || status === 'submitting'}>
        {status === 'submitting' ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  status: PropTypes.oneOf(['idle', 'submitting', 'success', 'error']).isRequired,
  errorMessage: PropTypes.string
};

LoginForm.defaultProps = {
  errorMessage: ''
};

export default LoginForm;

