import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from './context/AuthContext';

const Navbar = () => {
    const location = useLocation();
    const { user, logout } = useContext(AuthContext);

    return (
        <nav className="glass-nav">
            <Link to="/" className="nav-logo">CipherSQLStudio</Link>
            <div className="nav-links">
                <Link to="/assignments" className={location.pathname === '/assignments' ? 'active' : ''}>
                    Challenges
                </Link>
                {/* Placeholder for future links */}
                {user && <a href="#" className="disabled">Leaderboard</a>}
            </div>
            <div className="nav-actions">
                {user ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Hi, {user.username}</span>
                        <button onClick={logout} className="btn-secondary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>Logout</button>
                    </div>
                ) : (
                    <Link to="/login" className="btn-secondary">Sign In</Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
