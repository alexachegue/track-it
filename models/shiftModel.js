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
}

module.exports = ShiftModel;