const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Loan = require("../models/Loan");
const authMiddleware = require("../middleware/authMiddleware");

// Create a new Stripe Checkout session for loan repayment
router.post("/create-checkout-session", authMiddleware, async (req, res) => {
  const { loanId, amount } = req.body;
  const userId = req.user.id; // assuming JWT middleware extracts the user

  try {
    // Fetch loan to verify ownership and amount
    const loan = await Loan.findOne({ _id: loanId, user: userId });

    console.log("create session loan", loan, loanId, userId);

    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Loan repayment for Loan ID ${loanId}`,
            },
            unit_amount: amount * 100, // Stripe requires amount in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      metadata: {
        loan_id: loanId,
      },
    });

    console.log("session: ", session);

    res.json({ sessionId: session.id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Stripe session creation failed", error });
  }
});

// Endpoint to handle successful payment
router.post("/payment-success", authMiddleware, async (req, res) => {
  const { sessionId } = req.body;
  const userId = req.user.id; // From JWT

  try {
    // Fetch the Stripe session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return res.status(400).json({ message: "Invalid session ID" });
    }

    // Fetch the corresponding loan using metadata or lookup
    const loanId = session.metadata.loan_id;
    console.log("zdfd: ", { loanId }, { session });
    const loan = await Loan.findOne({ _id: loanId, user: userId });

    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    // Find the next pending repayment
    const nextRepayment = loan.repayments.find(r => r.status === "PENDING");

    if (nextRepayment) {
      // Mark repayment as paid
      nextRepayment.status = "PAID";
      await loan.save(); // Save loan to persist changes
    }

    // Check if all repayments are completed, update loan status
    const remainingRepayments = loan.repayments.filter(r => r.status === "PENDING");
    if (remainingRepayments.length === 0) {
      loan.status = "PAID";
      await loan.save();
    }

    return res.status(200).json({ message: "Payment successful and loan updated" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Payment success handling failed", error });
  }
});


const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object;
        // Handle the successful payment, similar to /payment-success
        handleSuccessfulPayment(session);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.json({ received: true });
  }
);

module.exports = router;
