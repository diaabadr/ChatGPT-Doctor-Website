const jwt = require("jsonwebtoken");
const User = require("../Models/user");

const requireAuth = function (req, res, next) {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.SECRET, async (err, decodedToken) => {
      if (err) {
        res.status(403).json({ error: "Please Login" });
      } else {
        const user = await User.findById(decodedToken.id);
        if (!user) {
          res.status(403).json({ error: "Please Login" });
        } else {
          req.userId = user._id;
          next();
        }
      }
    });
  } else {
    res.status(403).json({ error: "Please Login" });
  }
};

module.exports = { requireAuth };
