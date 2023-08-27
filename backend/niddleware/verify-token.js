const JWT = require("jsonwebtoken");

const Logger = require("../utils/logger");

const AuthMiddleware = (req, res, next) => {
  const roles = ["admin", "restaurant", "company", "rider"];
  try {
    const token =
      req.body.token || req.query.token || req.headers["x-access-token"];

    if (!token) {
      return res
        .status(402)
        .send({ success: false, error: "Not Authenticated" });
    }

    const decoded = JWT.verify(token, process.env.TOKEN_KEY);
    
    if (!roles.includes(decoded.role)) {
      return res.status(402).send({ success: false, error: "Not Authorized" });
    }
    req.user = decoded;
  } catch (error) {
    console.log(`402 | middleware(verify-token).js | ${error}`);
    return res
      .status(402)
      .send({ success: false, error: "Token Expired/Invalid" });
  }
  return next();
};

module.exports = { AuthMiddleware };
