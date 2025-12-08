import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './EditEntry.css';
import { API_URL } from '../config';

const EditShift = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        date: '',
        hours_worked: '',
        cash_tips: '',
        credit_tips: '',
        hourly_wage: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchShift();
    }, [id]);

    const fetchShift = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/shifts/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if(!response.ok){
                throw new Error('Failed to fetch shift');
            }

            const shift = await response.json();

            // Format date
            const formattedDate = new Date(shift.date).toISOString().split('T')[0];

            setFormData({
                date: formattedDate,
                hours_worked: shift.hours_worked,
                cash_tips: shift.cash_tips,
                credit_tips: shift.credit_tips,
                hourly_wage: shift.hourly_wage
            });
        } catch (err) {
            console.error('Error fetching shit:', err);
            setError('Failed to load shift details');
        } finally { setLoading(false); }
    };

    const calculateEarnings = () => {
        const hours = parseFloat(formData.hours_worked) || 0;
        const cash = parseFloat(formData.cash_tips) || 0;
        const credit = parseFloat(formData.credit_tips) || 0;
        const wage = parseFloat(formData.hourly_wage) || 0;
        
        const totalTips = cash + credit;
        const totalWages = hours * wage;
        const totalEarnings = totalTips + totalWages;
        
        return {
            totalTips: totalTips.toFixed(2),
            totalWages: totalWages.toFixed(2),
            totalEarnings: totalEarnings.toFixed(2),
            avgPerHour: hours > 0 ? (totalTips / hours).toFixed(2) : '0.00'
        };
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess('');

        if(!formData.date) {
            setError('Please select a date');
            setSaving(false);
            return;
        }

        if (!formData.hours_worked || parseFloat(formData.hours_worked) <= 0) {
            setError('Please enter hours worked');
            setSaving(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');

            const shiftData = {
                date: formData.date,
                hours_worked: parseFloat(formData.hours_worked),
                cash_tips: parseFloat(formData.cash_tips) || 0,
                credit_tips: parseFloat(formData.credit_tips) || 0,
                hourly_wage: parseFloat(formData.hourly_wage) || 0
            };

            const response = await fetch(`${API_URL}/shifts/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(shiftData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to update shift');
            }

            setSuccess('Shift updated successfully!');
            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);
        } catch (err) {
            console.error('Error updating shift: ', err);
            setError(err.message || 'Failed to update shift. Please try again.');
        } finally { setSaving(false); }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this shift? This action cannot be undone.')) {
            return;
        }

        setDeleting(true);
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`${API_URL}/shifts/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to delete shift');
            }

            setSuccess('Shift deleted successfully!');
            setTimeout(() => {
                navigate('/view-reports');
            }, 1500);
        } catch (err) {
            console.error('Error deleting shift:', err);
            setError(err.message || 'Failed to delete shift. Please try again.');
        } finally { setDeleting(false); }
    };

    if (loading) {
        return (
            <div className="edit-shift-contianer">
                <div className="loading">Loading shift...</div>
            </div>
        );
    }

    const earnings = calculateEarnings();

    return (
        <div className="edit-shift-container">
            <div className="edit-shift-card">
                <div className="card-header">
                    <h2>Edit Shift</h2>
                </div>

                <form onSubmit={handleSubmit} className="edit-shift-form">
                    {error && <div className="alert alert-error">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}

                    <div className="form-fields">
                        <div className="form-group">
                            <label htmlFor="date">
                            Date <span className="required">*</span>
                            </label>
                            <input
                                type="date"
                                id="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                max={new Date().toISOString().split('T')[0]}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="hours_worked">
                            Hours Worked <span className="required">*</span>
                            </label>
                            <input
                                type="number"
                                id="hours_worked"
                                name="hours_worked"
                                value={formData.hours_worked}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="hourly_wage">Hourly Wage ($)</label>
                            <input
                                type="number"
                                id="hourly_wage"
                                name="hourly_wage"
                                value={formData.hourly_wage}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                            <label htmlFor="cash_tips">Cash Tips ($)</label>
                            <input
                                type="number"
                                id="cash_tips"
                                name="cash_tips"
                                value={formData.cash_tips}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                            />
                            </div>

                            <div className="form-group">
                            <label htmlFor="credit_tips">Credit Card Tips ($)</label>
                            <input
                                type="number"
                                id="credit_tips"
                                name="credit_tips"
                                value={formData.credit_tips}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                            />
                            </div>
                        </div>
                    </div>

                    <div className="summary-section">
                        <div className="earnings-preview">
                            <h3>Updated Shift Summary</h3>
                            <div className="earnings-grid">
                            <div className="earning-item">
                                <span className="label">Total Tips:</span>
                                <span className="value">${earnings.totalTips}</span>
                            </div>
                            <div className="earning-item">
                                <span className="label">Wages:</span>
                                <span className="value">${earnings.totalWages}</span>
                            </div>
                            <div className="earning-item">
                                <span className="label">Tips/Hour:</span>
                                <span className="value">${earnings.avgPerHour}</span>
                            </div>
                            <div className="earning-item total">
                                <span className="label">Total Earnings:</span>
                                <span className="value">${earnings.totalEarnings}</span>
                            </div>
                            </div>
                        </div>
                    </div>

                    <div className="button-group">
                        <button
                        type="button"
                        className="btn-danger"
                        onClick={handleDelete}
                        disabled={saving || deleting}
                        >
                        {deleting ? 'Deleting...' : 'Delete'}
                        </button>
                        <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => navigate('/view-reports')}
                        disabled={saving || deleting}
                        >
                        Cancel
                        </button>
                        <button
                        type="submit"
                        className="btn-primary"
                        disabled={saving || deleting}
                        >
                        {saving ? 'Updating...' : 'Update Shift'}
                        </button>

                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditShift;