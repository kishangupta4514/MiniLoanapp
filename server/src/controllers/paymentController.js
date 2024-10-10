const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Loan = require('../models/Loan');

exports.createPaymentIntent = async (req, res) => {
    const { loanId, amount } = req.body;

    try {
        // Find the loan
        const loan = await Loan.findById(loanId);
        if (!loan) return res.status(404).json({ msg: 'Loan not found' });

        // Check if there's a pending repayment
        const pendingRepayment = loan.repayments.find(r => r.status === 'PENDING');
        if (!pendingRepayment) return res.status(400).json({ msg: 'No pending repayments' });

        // Create payment intent with Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.ceil(amount * 100), // Convert to cents
            currency: 'usd',
            metadata: { loanId: loan._id.toString(), userId: req.user.id },
        });

        res.status(200).json({
            clientSecret: paymentIntent.client_secret,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// controllers/paymentController.js
exports.stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;

      // Fulfill the payment (update loan repayment status)
      const loanId = paymentIntent.metadata.loanId;

      try {
          const loan = await Loan.findById(loanId);
          const pendingRepayment = loan.repayments.find(r => r.status === 'PENDING');
          if (pendingRepayment) {
              pendingRepayment.status = 'PAID';
              await loan.save();
          }

          // Mark loan as fully paid if all repayments are done
          if (loan.repayments.every(r => r.status === 'PAID')) {
              loan.status = 'PAID';
              await loan.save();
          }
      } catch (err) {
          console.error(err.message);
      }
  }

  res.json({ received: true });
};
