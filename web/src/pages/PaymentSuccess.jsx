import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import api from "../utils/axios";

const PaymentSuccessPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const finalizePayment = async () => {
      const sessionId = new URLSearchParams(window.location.search).get(
        "session_id"
      );

      if (!sessionId) return;

      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        await api.post(
          "/stripe/payment-success",
          { sessionId },
          { headers: { "x-auth-token": token } }
        );
        navigate("/dashboard"); // Redirect to dashboard after successful repayment
      } catch (error) {
        console.error("Payment confirmation failed", error);
      } finally {
        setLoading(false);
      }
    };

    finalizePayment();
  }, [navigate]);

  return (
    <>
      {loading && <Spinner />}
      <div className="text-center mt-20">
        <h1 className="text-2xl font-bold text-green-500">
          Payment Successful!
        </h1>
        <p>
          Thank you for your payment. Your loan repayment will be updated
          shortly.
        </p>
      </div>
    </>
  );
};

export default PaymentSuccessPage;
