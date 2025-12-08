import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from '../components/Navbar';
import './Dashboard.css';
import { API_URL } from '../config';

function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    return (
        <>
            <Navbar />
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h1 className="dashboard-title">Welcome to TrackIt, {user?.username}!</h1>
                    <p className="dashboard-subtitle">Here to help you track your tips and earnings</p>
                </div>

                <div className="dashboard-actions">
                    <button
                        onClick={() => navigate('/add-entry')}
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
                        onClick={() => navigate('/analytics')}
                        className="action-button action-button-analyze"
                    >
                        Compare & Analyze
                    </button>
                </div>
            </div>
        </>
    );
}

export default Dashboard;