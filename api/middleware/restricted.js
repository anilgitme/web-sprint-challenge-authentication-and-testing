const jwt = require('jsonwebtoken');
const jwtSecret = require('../../config/secrets');

module.exports = (req, res, next) => {
    const token = req.headers.Authorization;
    if (token) {
        jwt.verify(token, jwtSecret, (err, decoded) => {
            if (err) {
                res.status(404).json({ message: 'token required' })
            } else {
                req.decodedJWT = decoded; //saves the token in the req
                next();
            }
        })
    } else {
        res.status(401).json({ message: 'token invalid' })
    }
    // next();
    /*
      IMPLEMENT

      1- On valid token in the Authorization header, call next.

      2- On missing token in the Authorization header,
        the response body should include a string exactly as follows: "token required".

      3- On invalid or expired token in the Authorization header,
        the response body should include a string exactly as follows: "token invalid".
    */
};