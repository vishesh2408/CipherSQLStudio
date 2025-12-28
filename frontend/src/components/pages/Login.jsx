import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Navbar from '../Navbar';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(formData.email, formData.password);
            navigate('/assignments');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div className="page-wrapper">
            <Navbar />
            <div className="container flex-center" style={{ minHeight: '80vh' }}>
                <div className="card" style={{ maxWidth: '400px', width: '100%', padding: '2rem' }}>
                    <h1 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Login</h1>
                    {error && <div className="error-message" style={{ marginBottom: '1rem', color: '#ef4444' }}>{error}</div>}
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            required
                            style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid #334155', background: '#0f172a', color: 'white' }}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                            required
                            style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid #334155', background: '#0f172a', color: 'white' }}
                        />
                        <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>Login</button>
                    </form>
                    <p style={{ marginTop: '1rem', textAlign: 'center', color: '#94a3b8' }}>
                        Don't have an account? <Link to="/signup" style={{ color: '#3b82f6' }}>Sign Up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
