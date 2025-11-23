import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import './Login.css';

function Login() {
    const [formData, setFormData] = useState({
        identifier: '',
        password: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData, 
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try { 
            const response = await authAPI.login(formData);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-title">Login to TrackIt</h2>
                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label>Username or Email</label>
                        <input
                            type="text"
                            name="identifier"
                            value={formData.identifier}
                            onChange={handleChange}
                            required
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label>Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="form-input"
                        />
                    </div>

                    <button 
                        type="submit"
                        disabled={loading}
                        className="submit-button"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p className="redirect-text">
                    Or <Link to="/register" className="redirect-link">create a new account</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;