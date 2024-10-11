import { useEffect, useState } from "react";
import api from "../utils/axios";
import { loadStripe } from "@stripe/stripe-js";
import Spinner from "../components/Spinner";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUB_KEY);

const RepaymentsPage = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoans = async () => {
      const token = localStorage.getItem("token");
      const response = await api.get("/loans", {
        headers: { "x-auth-token": token },
      });
      const data = response.data
        .filter((loan) => loan.status === "APPROVED")
        .map((loan) => {
          return loan?.repayments.sort((a, b) => a.date > b.date), loan;
        })
        .map((loan) => {
          // console.log(loan)
          return (
            (loan.scheduledRepayment = loan.repayments.find(
              (repayment) => repayment.status === "PENDING"
            )),
            loan
          );
        });

      setLoans(data);
      setLoading(false);
    };

    fetchLoans();
  }, []);

  console.log(loans);

  const handleRepayment = async (loan) => {
    try {
      const stripe = await stripePromise;
      const token = localStorage.getItem("token");

      // Request to create a checkout session for the loan repayment
      const response = await api.post(
        "/stripe/create-checkout-session",
        { loanId: loan._id, amount: loan.scheduledRepayment.amount },
        {
          headers: { "x-auth-token": token },
        }
      );

      // Redirect to Stripe Checkout
      const { sessionId } = response.data;
      const result = await stripe.redirectToCheckout({ sessionId });

      if (result.error) {
        console.error(result.error.message);
      }
    } catch (err) {
      console.error("Repayment failed", err);
    }
  };

  return (
    <>
      {loading && <Spinner />}
      <div className="max-w-md mx-auto p-6 bg-white shadow-md">
        <h2 className="text-xl mb-4">Submit Loan Repayment</h2>
        {loans.length === 0 ? (
          <p>No loans available for repayment</p>
        ) : (
          loans.map((loan) => (
            <div key={loan._id} className="mb-6 p-4 border rounded">
              <h3 className="font-bold">Loan #{loan._id}</h3>
              <p>Amount: {loan.amount}</p>
              <p>Term: {loan.term} weeks</p>
              <div>
                Scheduled Repayment:
                <p>
                  Due Date:{" "}
                  {new Date(loan.scheduledRepayment.date).toLocaleString(
                    "en-IN",
                    { timeZone: "Asia/Kolkata" }
                  )}
                </p>
              </div>

              <button
                onClick={() => handleRepayment(loan)}
                className="w-full bg-blue-500 text-white py-2 rounded"
              >
                Pay ${loan.scheduledRepayment.amount} via Stripe
              </button>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default RepaymentsPage;
