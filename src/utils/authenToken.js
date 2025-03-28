const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) return res.sendStatus(401);
        
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) return res.sendStatus(403);
            req.user = user;
            next();
        })
    } catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
}

module.exports = { authenticateToken };