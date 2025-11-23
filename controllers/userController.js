const UserModel = require('../models/userModel');
const jwt = require('jsonwebtoken');

class UserController {
    // Register new user
    static async register(req, res) {
        try {
            const { username, email, password } = req.body;

            if(!username || !email || !password) {
                return res.status(400).json({ error: 'All fields are required'});
            }

            // Check if user already exists
            const existingEmail = await UserModel.findByEmailOrUsername(email);
            if(existingEmail) {
                return res.status(400).json({ error: 'Email already exists'});
            }

            const existingUsername = await UserModel.findByEmailOrUsername(username);
            if (existingUsername) {
                return res.status(400).json({ error: 'Username already exists'});
            }

            // Create user
            const user = await UserModel.createUser({ username, email, password });

            // Create token
            const token = jwt.sign(
                {userId: user.id, email: user.email},
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.status(201).json({
                message: 'User created successfully',
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email
                },
                token
            });
        } catch(err) {
            console.error('Error registering user:', err);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    // Login user
    static async login(req, res) {
        try {
            const { identifier, password } = req.body;

            if (!identifier || !password) {
                return res.status(400).json({ error: 'Login incomplete'});
            }

            // Find user by email or username
            const user = await UserModel.findByEmailOrUsername(identifier);
            if(!user) {
                return res.status(401).json({ error: 'Account does not exist'})
            }

            // Verify password
            const isValidPassword = await UserModel.verifyPassword(password, user.password);
            if(!isValidPassword) {
                return res.status(401).json({ error: 'Password does not match account'});
            }

            // Create token
            const token = jwt.sign(
                {userId: user.id, email: user.email, username: user.username },
                process.env.JWT_SECRET,
                {expiresIn: '24h'}
            );

            res.json({
                message: 'Login successful',
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email
                },
                token
            });
        } catch (err) {
            console.error('Error logging in:', err);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    // Get current user
    static async getCurrentUser(req, res) {
        try { 
            const user = await UserModel.findById(req.userId);
            if(!user) {
                return res.status(404).json({ error: 'User not found'});
            }
            res.json(user);
        } catch(err){
            console.error('Error getting user:', err);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = UserController;