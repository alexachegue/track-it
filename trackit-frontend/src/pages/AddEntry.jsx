import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './AddEntry.css';

const AddEntry = () => {
    const navigate = useNavigate();
    const [formData, setFormData]  = useState({
        date: new Date().toISOString().split('T')[0],
        hours_worked: '',
        cash_tips: '',
        credit_tips: '',
        hourly_wage: localStorage.getItem('saved_hourly_wage') || ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

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

        // Save hourly wage to localStorage when user changes it
        if (name === 'hourly_wage' && value) {
            localStorage.setItem('saved_hourly_wage', value);
        }

        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (!formData.date){
            setError('Please select a date');
            setLoading(false);
            return;
        }

        if(!formData.hours_worked || parseFloat(formData.hours_worked) <= 0){
            setError('Please enter hours worked');
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');

            const shiftData = {
                date: formData.date,
                hours_worked: parseFloat(formData.hours_worked),
                cash_tips: formData.cash_tips ? parseFloat(formData.cash_tips) : 0,
                credit_tips: formData.credit_tips ? parseFloat(formData.credit_tips) : 0,
                hourly_wage: formData.hourly_wage ? parseFloat(formData.hourly_wage) : 0
            };

            const response = await fetch('http://localhost:3000/api/shifts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(shiftData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create shift');
            }

            setSuccess('Shift logged successfully!');

            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);
        } catch (err) {
            console.error('Error creating shift: ', err);
            setError(err.message || 'Failed to log shift. Please try again');
        } finally {setLoading(false);}
    };
    const earnings = calculateEarnings();

    return (
        <>
            <Navbar />
            <div className="add-entry-container">
                <div className="add-entry-card">
                    <div className="card-header">
                    <h2>Log New Shift</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="add-entry-form">
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
                            <label htmlFor="hours_worked">Hours Worked <span className="required">*</span></label>
                            <input
                                type="number"
                                id="hours_worked"
                                name="hours_worked"
                                value={formData.hours_worked}
                                onChange={handleChange}
                                min="0"
                                step="0.1"
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
                            <h3>Shift Summary</h3>
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
                        className="btn-secondary"
                        onClick={() => navigate('/dashboard')}
                        disabled={loading}
                        >
                        Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Log Shift'}
                        </button>
                    </div>
                </form>
                </div>
            </div>
        </>
    );
};

export default AddEntry;