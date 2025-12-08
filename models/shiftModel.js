const pool = require('./db');

class ShiftModel {
    // Get all shifts of a user
    static async getAllShifts(userId) {
        const result = await pool.query(
            `SELECT *,
            (hours_worked * hourly_wage + cash_tips + credit_tips) AS total_earned FROM shifts WHERE user_id = $1 ORDER BY date DESC`,
            [userId]
        );
        return result.rows;
    }

    // Get shift by id
    static async getShiftById(id, userId) {
        const result = await pool.query(
            `SELECT *, 
            (hours_worked * hourly_wage + cash_tips + credit_tips) AS total_earned FROM shifts WHERE id = $1 AND user_id = $2`,
            [id, userId]
        );
        return result.rows[0];
    }

    // Create new shift
    static async createShift(shiftData, userId){
        const { date, hours_worked, cash_tips, credit_tips, hourly_wage } = shiftData;

        const result = await pool.query(
            `INSERT INTO shifts (date, hours_worked, cash_tips, credit_tips, hourly_wage, user_id)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [date, hours_worked, cash_tips, credit_tips, hourly_wage, userId]
        );
        return result.rows[0];
    }

    // Update shift
    static async updateShift(id, shiftData, userId){
        const { date, hours_worked, cash_tips, credit_tips, hourly_wage } = shiftData;

        const result = await pool.query(
            `UPDATE shifts
            SET date = $1, hours_worked = $2, cash_tips = $3, credit_tips = $4, hourly_wage = $5 WHERE id = $6 AND user_id = $7 RETURNING *`,
            [date, hours_worked, cash_tips, credit_tips, hourly_wage, id, userId]
        );
        return result.rows[0];
    }

    // Delete shift 
    static async deleteShift(id, userId) {
        const result = await pool.query(
            `DELETE FROM shifts WHERE id = $1 and user_id = $2 RETURNING *`,
            [id, userId]
        );
        return result.rows[0];
    }

    // Get stats for a user
    static async getStatistics(userId, startDate = null, endDate = null) {
        let query = `
            SELECT 
                COUNT(*) as total_shifts,
                COALESCE(SUM(hours_worked), 0) as total_hours,
                COALESCE(SUM(cash_tips), 0) as total_cash_tips,
                COALESCE(SUM(credit_tips), 0) as total_credit_tips,
                COALESCE(SUM(cash_tips + credit_tips), 0) as total_tips,
                COALESCE(SUM(hours_worked * hourly_wage), 0) as total_wages,
                COALESCE(SUM(hours_worked * hourly_wage + cash_tips + credit_tips), 0) as total_earnings,
                COALESCE(AVG(cash_tips + credit_tips), 0) as avg_tips_per_shift,
                COALESCE(AVG((cash_tips + credit_tips) / NULLIF(hours_worked, 0)), 0) as avg_tips_per_hour,
                COALESCE(MAX(cash_tips + credit_tips), 0) as best_tips,
                COALESCE(MIN(cash_tips + credit_tips), 0) as worst_tips
            FROM shifts
            WHERE user_id = $1
        `;

        const params = [userId];
        let paramCount = 1;

        if (startDate) {
            paramCount++;
            query += ` AND date >= $${paramCount}`;
            params.push(startDate);
        }

        if (endDate) {
            paramCount++;
            query += ` AND date <= $${paramCount}`;
            params.push(endDate);
        }

        const result = await pool.query(query, params);
        return result.rows[0];
    }

    // Get best performing shift
    static async getBestShift(userId) {
        const result = await pool.query(
            `SELECT *, 
            (hours_worked * hourly_wage + cash_tips + credit_tips) AS total_earned
            FROM shifts WHERE user_id = $1 ORDER BY total_earned DESC LIMIT 1`,
            [userId]
        );
        return result.rows[0];
    }

    // Get worst performing shift
    static async getWorstShift(userId) {
        const result = await pool.query(
            `SELECT *,
            (hours_worked * hourly_wage + cash_tips + credit_tips) AS total_earned
            FROM shifts WHERE user_id = $1 ORDER BY total_earned ASC LIMIT 1`,
            [userId]
        );
        return result.rows[0];
    }

    // Get earnings by time period (for charts)
    static async getEarningsByPeriod(userId, period = 'day', startDate = null, endDate = null) {
        let dateFormat;
        
        switch(period) {
            case 'day':
                dateFormat = 'YYYY-MM-DD';
                break;
            case 'week':
                dateFormat = 'IYYY-IW';
                break;
            case 'month':
                dateFormat = 'YYYY-MM';
                break;
            default:
                dateFormat = 'YYYY-MM-DD';
        }

        let query = `
            SELECT 
                TO_CHAR(date, '${dateFormat}') as period,
                COUNT(*) as shift_count,
                COALESCE(SUM(hours_worked), 0) as total_hours,
                COALESCE(SUM(cash_tips + credit_tips), 0) as total_tips,
                COALESCE(SUM(hours_worked * hourly_wage + cash_tips + credit_tips), 0) as total_earnings
            FROM shifts WHERE user_id = $1`
        ;

        const params = [userId];
        let paramCount = 1;

        if (startDate) {
            paramCount++;
            query += ` AND date >= $${paramCount}`;
            params.push(startDate);
        }

        if (endDate) {
            paramCount++;
            query += ` AND date <= $${paramCount}`;
            params.push(endDate);
        }

        query += ` GROUP BY period ORDER BY period DESC`;

        const result = await pool.query(query, params);
        return result.rows;
    }

    // Get user's percentile ranking (for user comparison)
    static async getUserPercentile(userId) {
        // Get total earnings for this user
        const userStats = await pool.query(
            `SELECT COALESCE(SUM(hours_worked * hourly_wage + cash_tips + credit_tips), 0) as total_earnings
            FROM shifts
            WHERE user_id = $1`,
            [userId]
        );

        const userTotal = parseFloat(userStats.rows[0].total_earnings);

        // Count how many users have lower total earnings
        const percentileQuery = await pool.query(
            `SELECT COUNT(DISTINCT user_id) as users_below
            FROM (
                SELECT user_id, SUM(hours_worked * hourly_wage + cash_tips + credit_tips) as total
                FROM shifts
                GROUP BY user_id
                HAVING SUM(hours_worked * hourly_wage + cash_tips + credit_tips) < $1
            ) as user_totals`,
            [userTotal]
        );

        // Count total number of users with shifts
        const totalUsersQuery = await pool.query(
            `SELECT COUNT(DISTINCT user_id) as total_users
            FROM shifts`
        );

        const usersBelow = parseInt(percentileQuery.rows[0].users_below);
        const totalUsers = parseInt(totalUsersQuery.rows[0].total_users);

        // Calculate percentile
        const percentile = totalUsers > 1 ? Math.round((usersBelow / (totalUsers - 1)) * 100) : 0;

        return {
            user_total: userTotal,
            users_below: usersBelow,
            total_users: totalUsers,
            percentile: percentile
        };
    }

    // Get recent shifts
    static async getRecentShifts(userId, limit = 5) {
        const result = await pool.query(
            `SELECT *, 
            (hours_worked * hourly_wage + cash_tips + credit_tips) AS total_earned
            FROM shifts
            WHERE user_id = $1
            ORDER BY date DESC
            LIMIT $2`,
            [userId, limit]
        );
        return result.rows;
    }
}

module.exports = ShiftModel;