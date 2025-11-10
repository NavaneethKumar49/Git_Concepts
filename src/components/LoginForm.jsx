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
  },
  captcha: (value, correctAnswer) => {
    if (!value) return 'Captcha is required';
    if (parseInt(value) !== correctAnswer) return 'Incorrect answer';
    return '';
  }
};

const generateCaptcha = () => {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  return {
    question: `${num1} + ${num2}`,
    answer: num1 + num2
  };
};

function LoginForm({ onSubmit, status, errorMessage }) {
  const [formValues, setFormValues] = useState({ email: '', password: '', captcha: '' });
  const [touched, setTouched] = useState({ email: false, password: false, captcha: false });
  const [showPassword, setShowPassword] = useState(false);
  const [captcha, setCaptcha] = useState(() => generateCaptcha());

  const fieldErrors = useMemo(
    () => ({
      email: validators.email(formValues.email),
      password: validators.password(formValues.password),
      captcha: validators.captcha(formValues.captcha, captcha.answer)
    }),
    [formValues, captcha.answer]
  );

  const isFormValid = !fieldErrors.email && !fieldErrors.password && !fieldErrors.captcha;

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
    setTouched({ email: true, password: true, captcha: true });

    if (isFormValid) {
      onSubmit({ email: formValues.email, password: formValues.password });
    }
  };

  const handleRefreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setFormValues((prev) => ({ ...prev, captcha: '' }));
    setTouched((prev) => ({ ...prev, captcha: false }));
  };

  useEffect(() => {
    if (status === 'success') {
      setFormValues({ email: '', password: '', captcha: '' });
      setTouched({ email: false, password: false, captcha: false });
      setShowPassword(false);
      setCaptcha(generateCaptcha());
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

      <div className="form-field">
        <label htmlFor="captcha">
          Captcha: What is {captcha.question}?
        </label>
        <div className="captcha-field">
          <input
            id="captcha"
            name="captcha"
            type="text"
            inputMode="numeric"
            placeholder="Enter answer"
            value={formValues.captcha}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(fieldErrors.captcha && touched.captcha)}
            aria-describedby="captcha-error"
            disabled={status === 'submitting'}
          />
          <button
            type="button"
            className="refresh-captcha"
            onClick={handleRefreshCaptcha}
            aria-label="Refresh captcha"
            disabled={status === 'submitting'}
          >
            ↻
          </button>
        </div>
        {touched.captcha && fieldErrors.captcha && (
          <span id="captcha-error" role="alert" className="field-error">
            {fieldErrors.captcha}
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

