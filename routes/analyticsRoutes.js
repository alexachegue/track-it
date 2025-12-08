const express = require('express');
const router = express.Router();
const AnalyticsController = require('../controllers/analyticsController');
const authenticateToken = require('../middleware/auth');

router.use(authenticateToken);
router.get('/dashboard', AnalyticsController.getDashboardAnalytics);
router.get('/stats', AnalyticsController.getStatistics);
router.get('/best-worst', AnalyticsController.getBestWorstShifts);
router.get('/percentile', AnalyticsController.getPercentile);
router.get('/earnings', AnalyticsController.getEarningsByPeriod);

module.exports = router;