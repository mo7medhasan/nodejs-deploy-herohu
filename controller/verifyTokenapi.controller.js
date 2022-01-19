const jwt = require("jsonwebtoken");

//login or not ==>authenticate
exports.verifyToken = (req, res, next) => {    
    const authHeader = req.headers.authorization;
    if (authHeader) {
        jwt.verify(authHeader, process.env.JWT_SEC, (err, user) => {
            if (err) res.status(403).json("Token is not valid!");
            req.user = user;
            next();
        });
    } else {
        return res.status(401).json("You are not authenticated!");
    }
};
const verifyToken = (req, res, next) => {
    
    const authHeader = req.headers.authorization;
    if (authHeader) {
        jwt.verify(authHeader, process.env.JWT_SEC, (err, user) => {
            if (err) res.status(403).json("Token is not valid!");
            req.user = user;
            next();
        });
    } else {
        return res.status(401).json("You are not authenticated!");
    }
};
//just admin and authorized user can do that
exports.verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin ||req.user.id) {
            next();
        } else {
            res.status(403).json("You are not allowed to do that!");
        }
    });
};

//only admin can do that
exports.verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        } else {
            res.status(403).json("You are not allowed to do that!");
        }
    });
};


// module.exports = {
// verifyTokenAndAuthorization,
// verifyTokenAndAdmin,
// };