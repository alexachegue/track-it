const ShiftModel = require('../models/shiftModel');

class AnalyticsController {
    // Get comprehensive analytics dashboard data
    static async getDashboardAnalytics(req, res) {
        try {
            const userId = req.userId;
            const { startDate, endDate } = req.query;

            // Get all analytics data
            const [
                statistics,
                bestShift,
                worstShift,
                recentShifts,
                percentile
            ] = await Promise.all([
                ShiftModel.getStatistics(userId, startDate, endDate),
                ShiftModel.getBestShift(userId),
                ShiftModel.getWorstShift(userId),
                ShiftModel.getRecentShifts(userId, 5),
                ShiftModel.getUserPercentile(userId)
            ]);

            res.json({
                statistics,
                bestShift,
                worstShift,
                recentShifts,
                percentile
            });
        } catch (err) {
            console.error('Error getting analytics:', err);
            res.status(500).json({ error: 'Server error' });
        }
    }

    // Get statistics
    static async getStatistics(req, res) {
        try {
            const userId = req.userId;
            const { startDate, endDate } = req.query;

            const statistics = await ShiftModel.getStatistics(userId, startDate, endDate);
            res.json(statistics);
        } catch (err) {
            console.error('Error getting statistics:', err);
            res.status(500).json({ error: 'Server error' });
        }
    }

    // Get best and worst shifts
    static async getBestWorstShifts(req, res) {
        try {
            const userId = req.userId;

            const [bestShift, worstShift] = await Promise.all([
                ShiftModel.getBestShift(userId),
                ShiftModel.getWorstShift(userId)
            ]);

            res.json({ bestShift, worstShift });
        } catch (err) {
            console.error('Error getting best/worst shifts:', err);
            res.status(500).json({ error: 'Server error' });
        }
    }

    // Get user percentile for peer comparison
    static async getPercentile(req, res) {
        try {
            const userId = req.userId;
            const percentile = await ShiftModel.getUserPercentile(userId);
            res.json(percentile);
        } catch (err) {
            console.error('Error getting percentile:', err);
            res.status(500).json({ error: 'Server error' });
        }
    }

    // Get earnings by period (for charts)
    static async getEarningsByPeriod(req, res) {
        try {
            const userId = req.userId;
            const { period = 'day', startDate, endDate } = req.query;

            const earnings = await ShiftModel.getEarningsByPeriod(
                userId, 
                period, 
                startDate, 
                endDate
            );

            res.json(earnings);
        } catch (err) {
            console.error('Error getting earnings by period:', err);
            res.status(500).json({ error: 'Server error' });
        }
    }
}

module.exports = AnalyticsController;
