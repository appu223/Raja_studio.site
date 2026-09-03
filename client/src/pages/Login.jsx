import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import './Login.css';

export default function Login() {
  const [rolePersona, setRolePersona] = useState('admin');
  const [email, setEmail] = useState('admin@rajastudio.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [panel, setPanel] = useState('login');
  const [registration, setRegistration] = useState({ full_name: '', email: '', password: '', phone: '', city: '' });
  const [notice, setNotice] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handlePersona = (persona, mail) => {
    setRolePersona(persona);
    setEmail(mail);
    setPassword('password123');
    setError('');
    setNotice('');
    setShowPassword(false);
  };

  const handleRegistrationChange = (e) => {
    setRegistration((current) => ({ ...current, [e.target.name]: e.target.value }));
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    setError('');
    setNotice('');
    setSubmitting(true);
    try {
      await api.post('/auth/register-customer', registration);
      setEmail(registration.email);
      setPassword('');
      setPanel('login');
      setNotice('Account created. Sign in to open your client portal.');
      setRegistration({ full_name: '', email: '', password: '', phone: '', city: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create your account');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const user = await login(email, password);
      const role = user.role || user.role_name;

      // Smart routing according to verified role
      if (role === 'Customer') {
        navigate('/customer/dashboard', { replace: true });
      } else if (role === 'Photographer') {
        navigate('/photographer/dashboard', { replace: true });
      } else if (role === 'Editor') {
        navigate('/editor/dashboard', { replace: true });
      } else {
        navigate('/admin/dashboard', { replace: true }); // Admin & Manager
      }
    } catch (err) {
      setError(err.response?.data?.message || (err.request ? 'Unable to reach the studio server. Please check that the API is running.' : 'Invalid credentials'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page d-flex align-items-center justify-content-center min-vh-100 bg-light p-3">
      <div className="login-card card border-0 shadow-sm">
        <div className="card-body p-4 p-sm-5">
          <button type="button" className="login-back btn btn-link btn-sm text-decoration-none px-0" onClick={() => navigate('/')}>
            <i className="bi bi-arrow-left me-1"></i>Back to landing page
          </button>
          <div className="login-header text-center mb-4">
            <div className="login-logo bg-primary text-white rounded-3 d-inline-flex align-items-center justify-content-center mb-2">
              <i className="bi bi-camera-fill"></i>
            </div>
            <h4 className="fw-bold mb-1">RAJA STUDIO</h4>
            <p className="text-muted small">Unified Studio & Client Portal</p>
          </div>

          {/* 4-Way Quick Role Switcher */}
          {panel === 'login' && <div className="login-personas row g-1 mb-4">
            <div className="col-3">
              <button
                type="button"
                className={`btn btn-sm w-100 py-2 ${rolePersona === 'admin' ? 'btn-primary' : 'btn-light border'}`}
                style={{ fontSize: '0.75rem' }}
                onClick={() => handlePersona('admin', 'admin@rajastudio.com')}
              >
                <i className="bi bi-shield-lock d-block mb-1 fs-6"></i>Admin
              </button>
            </div>
            <div className="col-3">
              <button
                type="button"
                className={`btn btn-sm w-100 py-2 ${rolePersona === 'photographer' ? 'btn-warning text-dark' : 'btn-light border'}`}
                style={{ fontSize: '0.75rem' }}
                onClick={() => handlePersona('photographer', 'photo@rajastudio.com')}
              >
                <i className="bi bi-camera d-block mb-1 fs-6"></i>Camera
              </button>
            </div>
            <div className="col-3">
              <button
                type="button"
                className={`btn btn-sm w-100 py-2 ${rolePersona === 'editor' ? 'btn-info text-dark' : 'btn-light border'}`}
                style={{ fontSize: '0.75rem' }}
                onClick={() => handlePersona('editor', 'editor@rajastudio.com')}
              >
                <i className="bi bi-scissors d-block mb-1 fs-6"></i>Editor
              </button>
            </div>
            <div className="col-3">
              <button
                type="button"
                className={`btn btn-sm w-100 py-2 ${rolePersona === 'customer' ? 'btn-success' : 'btn-light border'}`}
                style={{ fontSize: '0.75rem' }}
                onClick={() => handlePersona('customer', 'darvin@gmail.com')}
              >
                <i className="bi bi-person-heart d-block mb-1 fs-6"></i>Client
              </button>
            </div>
          </div>}

          {error && (
            <div className="login-error alert alert-danger py-2 px-3 small d-flex align-items-center mb-3">
              <i className="bi bi-exclamation-circle-fill me-2"></i>
              <div>{error}</div>
            </div>
          )}
          {notice && <div className="alert alert-success py-2 px-3 small login-error">{notice}</div>}

          {panel === 'login' ? <form className="login-form" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small fw-semibold">Email Address</label>
              <input
                type="email"
                className="form-control"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="form-label small fw-semibold">Password</label>
              <div className="login-password-field">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="button" className="login-password-toggle" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'} title={showPassword ? 'Hide password' : 'Show password'}>
                  <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold" disabled={submitting}>
              {submitting ? 'Authenticating...' : `Sign In as ${rolePersona.toUpperCase()}`}
            </button>
          </form> : <form className="login-form" onSubmit={handleRegistration}>
            <div className="mb-3">
              <label className="form-label small fw-semibold">Full Name</label>
              <input name="full_name" type="text" className="form-control" required value={registration.full_name} onChange={handleRegistrationChange} />
            </div>
            <div className="mb-3">
              <label className="form-label small fw-semibold">Email Address</label>
              <input name="email" type="email" className="form-control" required value={registration.email} onChange={handleRegistrationChange} />
            </div>
            <div className="row g-3 mb-3">
              <div className="col-7">
                <label className="form-label small fw-semibold">Phone</label>
                <input name="phone" type="tel" className="form-control" required value={registration.phone} onChange={handleRegistrationChange} />
              </div>
              <div className="col-5">
                <label className="form-label small fw-semibold">City</label>
                <input name="city" type="text" className="form-control" value={registration.city} onChange={handleRegistrationChange} />
              </div>
            </div>
            <div className="mb-4">
              <label className="form-label small fw-semibold">Password</label>
              <div className="login-password-field">
                <input name="password" type={showPassword ? 'text' : 'password'} minLength="8" className="form-control" required value={registration.password} onChange={handleRegistrationChange} />
                <button type="button" className="login-password-toggle" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'} title={showPassword ? 'Hide password' : 'Show password'}>
                  <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </button>
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold" disabled={submitting}>
              {submitting ? 'Creating Account...' : 'Create Customer Account'}
            </button>
          </form>}

          <button type="button" className="btn btn-link btn-sm w-100 mt-3 text-decoration-none" onClick={() => { setPanel(panel === 'login' ? 'register' : 'login'); setError(''); setNotice(''); }}>
            {panel === 'login' ? 'New client? Create an account' : 'Already have an account? Sign in'}
          </button>

        </div>
      </div>
    </div>
  );
}