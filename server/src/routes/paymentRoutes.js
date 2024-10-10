// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const { createPaymentIntent, stripeWebhook } = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');

console.log(process.env.STRIPE_SECRET_KEY)

router.post('/create-payment-intent', authMiddleware, createPaymentIntent);
router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);


module.exports = router;
