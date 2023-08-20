const isAuthorized = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (req.user.role == requiredRole) {
      next();
    } else {
      return res.status(403).json({ error: "Forbidden" });
    }
  };
};

module.exports = isAuthorized;
