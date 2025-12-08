import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { shiftAPI } from '../services/api';
import Navbar from '../components/Navbar';
import './ViewReports.css';

function ViewReports() {
    const [shifts, setShifts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchShifts();
    }, []);

    const fetchShifts = async () => {
        try {
            setLoading(true);
            const response = await shiftAPI.getAllShifts();
            setShifts(response.data);
            setError('');
        } catch(err) {
            console.error('Error fetching shifts:', err);
            setError('Failed to load shifts');
        } finally { setLoading(false); }
    };

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="reports-container">
                    <div className="loading-message">Loading your shifts...</div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="reports-container">
                <div className="reports-header">
                    <h1 className="reports-title">Your Shift History</h1>
                </div>
                {error && <div className="error-message">{error}</div>}

                    {shifts.length === 0 ? (
                    <div className="no-shifts-message">
                        <p>No shifts recorded yet.</p>
                        <p>Add you first shift to start tracking!</p>
                    </div>
                ) : (
                        <div className="shifts-section">
                        <h2 className="section-title">All Shifts ({shifts.length})</h2>

                            <div className="shifts-grid">
                            {shifts.map((shift) => (
                                    <div key={shift.id} className="shift-card">
                                    <div className="shift-date">
                                        {formatDate(shift.date)}
                                    </div>

                                        <div className="shift-details">
                                        <div className="shift-detail-row">
                                            <span className="detail-label">Hours Worked:</span>
                                            <span className="detail-value">{shift.hours_worked} hrs</span>
                                        </div>

                                        <div className="shift-detail-row">
                                            <span className="detail-label">Hourly Wage:</span>
                                            <span className="detail-value">${parseFloat(shift.hourly_wage).toFixed(2)}/hr</span>
                                        </div>

                                        <div className="shift-detail-row">
                                            <span className="detail-label">Cash Tips:</span>
                                            <span className="detail-value">${parseFloat(shift.cash_tips).toFixed(2)}</span>
                                        </div>

                                        <div className="shift-detail-row">
                                            <span className="detail-label">Credit Tips:</span>
                                            <span className="detail-value">${parseFloat(shift.credit_tips).toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <div className="shift-total">
                                        <span className="total-label">Total for This Shift:</span>
                                        <span className="total-value">${parseFloat(shift.total_earned).toFixed(2)}</span>
                                    </div>

                                    <div className="shift-actions">
                                        <button
                                            onClick={() => navigate(`/edit-shift/${shift.id}`)}
                                            className="edit-button"
                                        >
                                            Edit Shift
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default ViewReports;