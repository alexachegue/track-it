import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { path: '/dashboard', icon: 'bi-house-door-fill', label: 'Home' },
        { path: '/add-entry', icon: 'bi-plus-circle-fill', label: 'Add Entry' },
        { path: '/view-reports', icon: 'bi-book-fill', label: 'Reports' },
        { path: '/analytics', icon: 'bi-bar-chart-fill', label: 'Analytics' }
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav className="navbar-left">
            <div className="nav-items">
                {navItems.map((item) => (
                    <button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                        title={item.label}
                    >
                        <i className={`bi ${item.icon}`}></i>
                    </button>
                ))}
            </div>

            <button
                onClick={handleLogout}
                className="nav-item logout-item"
                title="Logout"
            >
                <i className="bi bi-box-arrow-right"></i>
            </button>
        </nav>
    );
}

export default Navbar;
