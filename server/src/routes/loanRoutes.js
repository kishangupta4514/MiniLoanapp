const express = require("express");
const router = express.Router();
const {
  createLoan,
  approveLoan,
  getLoansByUser,
  makeRepayment,
  getAllLoans
} = require("../controllers/loanController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Customer routes
router.post("/", authMiddleware, roleMiddleware("customer"), createLoan);
router.get("/", authMiddleware, roleMiddleware("customer"), getLoansByUser);
router.post(
  "/repayment/:id",
  authMiddleware,
  roleMiddleware("customer"),
  makeRepayment
);

// Admin route for approving loans
router.put(
  "/approve/:id",
  authMiddleware,
  roleMiddleware("admin"),
  approveLoan
);

// Admin route for approving loans
router.get(
  "/all",
  authMiddleware,
  roleMiddleware("admin"),
  getAllLoans
);

module.exports = router;
