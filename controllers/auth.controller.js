import sql from '../util/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// SIGNUP
export const signup = async (req, res) => {
    try {
        const { name, email, password, isAdmin = false } = req.body;

        const existingUser = await sql`SELECT * FROM users WHERE email = ${email}`;
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await sql`
            INSERT INTO users (name, email, password, is_admin) 
            VALUES (${name}, ${email}, ${hashedPassword}, ${isAdmin}) 
            RETURNING id, name, email, is_admin
        `;
        const user = newUser[0];

        const token = jwt.sign(
            { id: user.id, email: user.email, isAdmin: user.is_admin },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(201).json({
            message: 'User registered successfully',
            user
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// LOGIN
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const userResult = await sql`SELECT * FROM users WHERE email = ${email}`;
        if (userResult.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = userResult[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, isAdmin: user.is_admin },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                isAdmin: user.is_admin
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// LOGOUT
export const logout = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict'
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

// GET CURRENT USER
export const getCurrentUser = (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        res.status(200).json({ user });
    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
