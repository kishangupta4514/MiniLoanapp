const Loan = require("../models/Loan");
const User = require("../models/User");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.createLoan = async (req, res) => {
  const { amount, term } = req.body;
  try {
    const loan = new Loan({
      user: req.user.id,
      amount,
      term,
      startDate: new Date(), 
      status: "PENDING", 
      repayments: generateRepayments(amount, term),
    });
    console.log("create loan loan: ", loan);
    await loan.save();
    res.json(loan);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};


// Controller to approve loans (Admin only)
exports.approveLoan = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);
    console.log("approve loan loan: ", loan)
    if (!loan) return res.status(404).json({ msg: "Loan not found" });

    loan.status = "APPROVED";
    await loan.save();

    res.json(loan);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Controller to get all loans by a user
exports.getLoansByUser = async (req, res) => {
  try {
    const loans = await Loan.find({ user: req.user.id });
    res.json(loans);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Controller to get all loans (Admin only)
exports.getAllLoans = async (req, res) => {
  try {
    const loans = await Loan.find().populate('user', 'name email');
    res.json(loans);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Controller to make repayment
exports.makeRepayment = async (req, res) => {
  const { amount } = req.body;
  try {
    const loan = await Loan.findById(req.params.id);
    if (!loan) return res.status(404).json({ msg: "Loan not found" });

    // Check if loan is approved
    if (loan.status !== "APPROVED") {
      return res
        .status(400)
        .json({ msg: "Loan is not approved for repayment" });
    }

    const nextRepayment = loan.repayments.find((r) => r.status === "PENDING");
    if (!nextRepayment)
      return res.status(400).json({ msg: "All repayments have been made" });

    if (amount < nextRepayment.amount) {
      return res
        .status(400)
        .json({ msg: "Repayment amount is less than required" });
    }

    // Process Stripe payment
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(nextRepayment.amount * 100), // Stripe uses smallest currency unit
      currency: "usd",
      customer: req.user.stripeCustomerId,
      payment_method: req.body.paymentMethodId,
      confirm: true,
    });

    // Mark repayment as paid
    nextRepayment.status = "PAID";
    await loan.save();

    // Check if all repayments are done
    if (loan.repayments.every((r) => r.status === "PAID")) {
      loan.status = "PAID"; // Mark the loan as fully paid
      await loan.save();
    }

    res.json({ msg: "Repayment successful", loan });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

const generateRepayments = (amount, term) => {
  const repayments = [];
  const weeklyAmount = parseFloat((amount / term).toFixed(2));
  const now = new Date();

  for (let i = 1; i <= term; i++) {
    const dueDate = new Date(now);
    dueDate.setDate(now.getDate() + 7 * i); // Set due dates for weekly repayments
    repayments.push({
      date: dueDate, // Set the repayment date
      amount: weeklyAmount,
      status: "PENDING",
    });
  }

  return repayments;
};