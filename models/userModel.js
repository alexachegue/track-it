const pool = require('./db');
const bcrypt = require('bcrypt');

class UserModel {
    // Create new user
    static async createUser(userData) {
        const { username, email, password } = userData;

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const result = await pool.query(
            `INSERT INTO users (username, email, password)
            VALUES ($1, $2, $3) RETURNING id, username, email, created_at`, 
            [username, email, hashedPassword]
        );
        return result.rows[0];
    }

    // Find user by email or username
    static async findByEmailOrUsername(identifier) {
        const result = await pool.query(
        `SELECT * FROM users WHERE email = $1 OR username = $1`,
            [identifier]
        );
        return result.rows[0];
    }

    // Find user by ID
    static async findById(id) {
        const result = await pool.query(
            `SELECT id, username, email, created_at FROM users WHERE id = $1`,
            [id]
        );
        return result.rows[0];
    }

    // Verify password
    static async verifyPassword(ogPassword, hashedPassword) {
        return await bcrypt.compare(ogPassword, hashedPassword);
    }
}

module.exports = UserModel;