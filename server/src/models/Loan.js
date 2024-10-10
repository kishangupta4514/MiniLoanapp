const mongoose = require('mongoose');

const RepaymentSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    amount: { type: Number, required: true },
    status: { type: String, default: 'PENDING' } // 'PENDING' or 'PAID'
});

const LoanSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    term: { type: Number, required: true },
    startDate: { type: Date, required: true },
    repayments: [RepaymentSchema],
    status: { type: String, default: 'PENDING' } // 'PENDING', 'APPROVED', 'PAID'
});

module.exports = mongoose.model('Loan', LoanSchema);