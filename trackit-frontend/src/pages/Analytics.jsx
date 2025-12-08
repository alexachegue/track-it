import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Analytics.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Analytics = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [analytics, setAnalytics] = useState(null);
  const [showPercentile, setShowPercentile] = useState(false);
  const [optedIn, setOptedIn] = useState(false);
  const [earningsData, setEarningsData] = useState([]);
  const [chartPeriod, setChartPeriod] = useState('day');

  useEffect(() => {
    fetchAnalytics();
    fetchEarningsData('day');

    // Check if user has opted in before
    const opted = localStorage.getItem('percentile_opted_in');
    if (opted === 'true') {
      setOptedIn(true);
      setShowPercentile(true);
    }
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/analytics/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }

      const data = await response.json();
      setAnalytics(data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const fetchEarningsData = async (period) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/analytics/earnings?period=${period}`,
        {
          headers: {Authorization: `Bearer ${token}`}
        }
      );

      if (!response.ok) throw new Error('Failed to fetch earnings data');

      const data = await response.json();

      // Format data for charts
      const formattedData = data.map(item => ({
        period: item.period,
        earnings: parseFloat(item.total_earnings),
        tips: parseFloat(item.total_tips),
        hours: parseFloat(item.total_hours),
        shifts: parseInt(item.shift_count)
      })).reverse();

      setEarningsData(formattedData);
    } catch (err) {
      console.error('Error fetching earnings data:', err);
    }
  };

  const handlePeriodChange = (period) => {
    setChartPeriod(period);
    fetchEarningsData(period);
  };

  const handleOptIn = () => {
    setShowPercentile(true);
    setOptedIn(true);
    localStorage.setItem('percentile_opted_in', 'true');
  };

  const handleOptOut = () => {
    setShowPercentile(false);
    setOptedIn(false);
    localStorage.removeItem('percentile_opted_in');
  };

  // Tooltip for charts
  const CustomToolTip = ({active, payload, label}) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{label}</p>
          {payload.map((entry, index) => {
            // Check if this is a monetary value (earnings, tips) or not (hours, shifts)
            const isMonetary = entry.name === 'Earnings' || entry.name === 'Tips';
            const formattedValue = isMonetary
              ? `$${entry.value.toFixed(2)}`
              : entry.value.toFixed(entry.name === 'Shifts' ? 0 : 1);

            return (
              <p key={index} style={{ color: entry.color }}>
                {entry.name}: {formattedValue}
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="analytics-container">
          <div className="loading">Loading analytics...</div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="analytics-container">
          <div className="error-message">{error}</div>
        </div>
      </>
    );
  }

  if (!analytics || !analytics.statistics || analytics.statistics.total_shifts === '0') {
    return (
      <>
        <Navbar />
        <div className="analytics-container">
          <div className="analytics-header">
            <h1>Compare & Analyze</h1>
          </div>
          <div className="no-data">
            <h3>No Data Available</h3>
            <p>Log some shifts to see your analytics!</p>
            <button className="btn-primary" onClick={() => navigate('/add-entry')}>
              Log Your First Shift
            </button>
          </div>
        </div>
      </>
    );
  }

  const { statistics, bestShift, worstShift, percentile } = analytics;

  return (
    <>
      <Navbar />
      <div className="analytics-container">
        <div className="analytics-header">
          <h1>Compare & Analyze</h1>
        </div>

        {/* Summary Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon"><i className="bi bi-bar-chart-fill"></i></div>
            <div className="stat-content">
              <h3>Total Earnings</h3>
              <p className="stat-value">${parseFloat(statistics.total_earnings).toFixed(2)}</p>
              <span className="stat-label">All time</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon"><i className="bi bi-person-walking"></i></div>
            <div className="stat-content">
              <h3>Total Shifts</h3>
              <p className="stat-value">{statistics.total_shifts}</p>
              <span className="stat-label">{parseFloat(statistics.total_hours).toFixed(1)} hours worked</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon"><i className="bi bi-cash-coin"></i></div>
            <div className="stat-content">
              <h3>Avg Tips/Shift</h3>
              <p className="stat-value">${parseFloat(statistics.avg_tips_per_shift).toFixed(2)}</p>
              <span className="stat-label">Per shift average</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon"><i className="bi bi-clock-history"></i></div>
            <div className="stat-content">
              <h3>Avg Tips/Hour</h3>
              <p className="stat-value">${parseFloat(statistics.avg_tips_per_hour).toFixed(2)}</p>
              <span className="stat-label">Hourly average</span>
            </div>
          </div>
        </div>

        {/* Best & Worst Shifts */}
        <div className="best-worst-section">
          <h2>Performance Highlights</h2>
          <div className="best-worst-grid">
              {/* Best Shift */}
            {bestShift && (
              <div className="highlight-card best">
                <div className="highlight-header">
                  <span className="highlight-icon"><i className="bi bi-award"></i></span>
                  <h3>Best Shift</h3>
                </div>
                <div className="highlight-content">
                  <div className="highlight-date">
                    {new Date(bestShift.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                  <div className="highlight-amount">
                    ${parseFloat(bestShift.total_earned).toFixed(2)}
                  </div>
                  <div className="highlight-details">
                    <div className="detail-item">
                      <span>Hours:</span>
                      <span>{bestShift.hours_worked} hrs</span>
                    </div>
                    <div className="detail-item">
                      <span>Tips:</span>
                      <span>${(parseFloat(bestShift.cash_tips) + parseFloat(bestShift.credit_tips)).toFixed(2)}</span>
                    </div>
                    <div className="detail-item">
                      <span>Tips/Hour:</span>
                      <span>${((parseFloat(bestShift.cash_tips) + parseFloat(bestShift.credit_tips)) / bestShift.hours_worked).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Worst Shift */}
            {worstShift && (
              <div className="highlight-card worst">
                <div className="highlight-header">
                  <span className="highlight-icon"><i className="bi bi-graph-down-arrow"></i></span>
                  <h3>Lowest Shift</h3>
                </div>
                <div className="highlight-content">
                  <div className="highlight-date">
                    {new Date(worstShift.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                  <div className="highlight-amount">
                    ${parseFloat(worstShift.total_earned).toFixed(2)}
                  </div>
                  <div className="highlight-details">
                    <div className="detail-item">
                      <span>Hours:</span>
                      <span>{worstShift.hours_worked} hrs</span>
                    </div>
                    <div className="detail-item">
                      <span>Tips:</span>
                      <span>${(parseFloat(worstShift.cash_tips) + parseFloat(worstShift.credit_tips)).toFixed(2)}</span>
                    </div>
                    <div className="detail-item">
                      <span>Tips/Hour:</span>
                      <span>${((parseFloat(worstShift.cash_tips) + parseFloat(worstShift.credit_tips)) / worstShift.hours_worked).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Charts and Peer Comparison Side by Side */}
        <div className="charts-peer-section">
          {/* LEFT: Charts Section */}
          <div className="charts-section">
            <div className="section-header">
              <h2><i className="bi bi-graph-up"></i> Earnings Trends</h2>
              <div className="period-selector">
                <button
                  className={chartPeriod === 'day' ? 'active' : ''}
                  onClick={() => handlePeriodChange('day')}
                >
                  Daily
                </button>
                <button
                  className={chartPeriod === 'week' ? 'active' : ''}
                  onClick={() => handlePeriodChange('week')}
                >
                  Weekly
                </button>
                <button
                  className={chartPeriod === 'month' ? 'active' : ''}
                  onClick={() => handlePeriodChange('month')}
                >
                  Monthly
                </button>
              </div>
            </div>

            {/* Earnings Line Chart */}
            <div className="chart-card">
              <h3>Total Earnings Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={earningsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip content={<CustomToolTip />} />
                  <Legend />
                  <Line type="monotone" dataKey="earnings" stroke="#60abb0" strokeWidth={2} name="Earnings" />
                  <Line type="monotone" dataKey="tips" stroke="#4caf50" strokeWidth={2} name="Tips" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Hours & Shifts Bar Chart */}
            <div className="chart-card">
              <h3>Hours Worked & Shift Count</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={earningsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip content={<CustomToolTip />} />
                  <Legend />
                  <Bar dataKey="hours" fill="#ffb6d8ff" name="Hours Worked" />
                  <Bar dataKey="shifts" fill="#9a89c6ff" name="Shifts" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* RIGHT: Peer Comparison Section */}
          <div className="peer-section">
            <h2><i className="bi bi-people-fill"></i> Peer Comparison</h2>

            {!optedIn ? (
              <div className="opt-in-card">
                <div className="opt-in-icon"><i className="bi bi-people-fill"></i></div>
                <h3>Compare Your Performance</h3>
                <p>See how your earnings compare to other TrackIt users!</p>
                <p className="opt-in-note">
                  Your data is anonymous and only used to calculate percentiles.
                </p>
                <button className="btn-opt-in" onClick={handleOptIn}>
                  Opt In to See Comparison
                </button>
              </div>
            ) : (
              <div className="percentile-card">
                <div className="percentile-content">
                  <div className="percentile-value">
                    <i className="bi bi-arrow-up"></i>Top {100 - percentile.percentile}%
                  </div>
                  <p className="percentile-description">
                    You're earning more than <strong>{percentile.percentile}%</strong> of TrackIt users
                  </p>
                  <div className="percentile-details">
                    <div className="detail-row">
                      <span>Your Total Earnings:</span>
                      <span className="detail-value">${parseFloat(percentile.user_total).toFixed(2)}</span>
                    </div>
                    <div className="detail-row">
                      <span>Users Below You:</span>
                      <span className="detail-value">{percentile.users_below} users</span>
                    </div>
                    <div className="detail-row">
                      <span>Total Users:</span>
                      <span className="detail-value">{percentile.total_users} users</span>
                    </div>
                  </div>
                  <div className="percentile-bar">
                    <div
                      className="percentile-fill"
                      style={{ width: `${percentile.percentile}%` }}
                    ></div>
                  </div>
                </div>
                <button className="btn-opt-out" onClick={handleOptOut}>
                  Opt Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Analytics;