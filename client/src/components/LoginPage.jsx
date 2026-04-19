import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
    const { login, register } = useAuth();
    const [isRegister, setIsRegister] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isRegister) {
                if (!form.name.trim()) {
                    setError('Name is required');
                    setLoading(false);
                    return;
                }
                await register(form.name, form.email, form.password);
            } else {
                await login(form.email, form.password);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-header">
                    <div className="login-icon">🛰️</div>
                    <h1 className="login-title">Intelligence Fusion</h1>
                    <p className="login-subtitle">Multi-Source Geospatial Platform</p>
                </div>

                <div className="login-tabs">
                    <button
                        className={`login-tab ${!isRegister ? 'login-tab--active' : ''}`}
                        onClick={() => { setIsRegister(false); setError(''); }}
                    >
                        Sign In
                    </button>
                    <button
                        className={`login-tab ${isRegister ? 'login-tab--active' : ''}`}
                        onClick={() => { setIsRegister(true); setError(''); }}
                    >
                        Register
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    {isRegister && (
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="Enter your name"
                                autoComplete="name"
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Enter your email"
                            required
                            autoComplete="email"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className="form-input"
                            placeholder={isRegister ? 'Min 6 characters' : 'Enter your password'}
                            required
                            minLength={isRegister ? 6 : undefined}
                            autoComplete={isRegister ? 'new-password' : 'current-password'}
                        />
                    </div>

                    {error && <div className="login-error">{error}</div>}

                    <button
                        type="submit"
                        className="login-submit"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="spinner" />
                        ) : isRegister ? (
                            'Create Account'
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                <div className="login-footer">
                    {isRegister
                        ? 'Already have an account? '
                        : "Don't have an account? "}
                    <button
                        className="login-switch"
                        onClick={() => { setIsRegister(!isRegister); setError(''); }}
                    >
                        {isRegister ? 'Sign In' : 'Register'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
