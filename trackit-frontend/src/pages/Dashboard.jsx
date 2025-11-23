import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import './Dashboard.css';

function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1 className="dashboard-title">Welcome to TrackIt, {user?.username}!</h1>
                <p className="dashboard-subtitle">Here to help you track your tips and earnings</p>
            </div>

            <div className="dashboard-actions">
                <button 
                    onClick={() => navigate('/add-shift')}
                    className="action-button action-button-add"    
                >
                    Add New Entry
                </button>

                <button
                    onClick={() => navigate('/view-reports')}
                    className="action-button action-button-reports"
                >
                    View Reports
                </button>

                <button
                    onClick={() => alert('Compare & Analyze - Coming Soon...')}
                    className="action-button action-button-disabled"
                    disabled
                >
                    Compare & Analyze
                    <span className="coming-soon">Comming Soon</span>
                </button>
            </div>

            <button
                onClick={handleLogout}
                className="logout-button"
                >
                    Logout
            </button>

        </div>
    );
}

export default Dashboard;