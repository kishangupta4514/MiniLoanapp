const roleMiddleware = (role) => (req, res, next) => {
    console.log("zz---------------------------", req.user.role);
    if (req.user.role !== role && req.user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied" });
    }
    next();
  };
  
  module.exports = roleMiddleware;
  