const admin = require('../firebase/index');
const User = require('../models/user');

exports.authCheck = async (req, res, next) => {
    const authHeader = req.headers.authtoken;
    try {
        if (!authHeader) {
            return res.status(401).json({ error: 'Authorization header not found' });
        }
        const decodedToken = await admin.auth().verifyIdToken(authHeader);
        console.log(decodedToken);
        req.user = decodedToken;

        next();
    } catch (error) {
        return res.status(401).json({ error: 'Authentication failed' });
    }
};

exports.adminCheck = async (req, res, next) => {
    const { email } = req.user;
    const adminUser = await User.findOne({ email }).exec();
    if (adminUser.role !== 'admin') {
        res.status(403).json({ err: 'Admin resource. Access denied' });
    } else {
        next();
    }
};