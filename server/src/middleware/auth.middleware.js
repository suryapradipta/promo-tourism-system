const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authorizationHeader = req.headers["authorization"];

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return res.status(401).json({message: 'Authorization denied, no valid token provided'});
  }

  const token = authorizationHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({message: 'Authorization denied, no token provided'});
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.exp < Date.now() / 1000) {
      return res.status(401).json({message: 'Token has expired'});
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({message: 'Token is not valid'});
  }
};
