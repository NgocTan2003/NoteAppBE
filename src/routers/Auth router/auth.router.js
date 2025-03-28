const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../../models/user.model');
const router = express.Router();
const { authenticateToken } = require('../../utils/authenToken');

// signup
router.post('/create-account', async (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
        return res.status(400).json({ error: true, message: 'FullName, Email, Password is required' });
    }

    const isUser = await User.findOne({ email });

    if (isUser) {
        return res.json({ error: true, message: 'Email already exists' });
    }

    const user = new User({ fullName, email, password });
    await user.save();

    const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '36000m' });

    return res.json({ error: false, user, accessToken, message: 'Account created successfully' });
});

// login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: true, message: 'Email and Password are required' });
    }

    const userInfo = await User.findOne({ email });

    if (!userInfo || userInfo.password !== password) {
        return res.status(400).json({ error: true, message: 'Invalid credentials' });
    }

    const accessToken = jwt.sign({ user: userInfo }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '36000m' });

    return res.json({ error: false, accessToken, email, message: 'Login successful' });
});

// get user
router.get('/get-user', authenticateToken, async (req, res) => {
    const { user } = req.user;

    const isUser = await User.findOne({ _id: user._id });
    if (!isUser) {
        return res.status(404).json({ error: true, message: 'User not found' });
    }

    return res.json({
        user: {
            _id: isUser._id,
            fullName: isUser.fullName,
            email: isUser.email,
            createOn: isUser.createOn
        },
        message: 'Get user successfully'
    });
});

module.exports = router;
