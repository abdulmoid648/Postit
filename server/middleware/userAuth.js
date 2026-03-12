const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

const AuthorizeUser = async (req, res, next) => {
    const authToken = req.header('Authorization');

    if (!authToken) {
        return res.status(401).json({ errorOccured: "Authorization error. Please Login" });
    }

    try {
        const data = jwt.verify(authToken, SECRET_KEY);
        req.user = data;
        next();
    } catch (error) {
        return res.status(401).json({ errorOccured: "Authorization token mismatched. Please Login again" });
    }
};

module.exports = {
    AuthorizeUser
};
