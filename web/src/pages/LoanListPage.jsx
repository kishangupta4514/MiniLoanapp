import { useState, useEffect } from "react";
import api from "../utils/axios";
import Spinner from "../components/Spinner";

const LoanList = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await api.get("/loans", {
          headers: { "x-auth-token": token },
        });
        console.log(response);
        setLoans(response.data);
      } catch (err) {
        console.error("Failed to fetch loans");
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, []);

  console.log("loans page", loans);

  return (
    <>
      {loading && <Spinner />}
      <div>
        <h1 className="text-2xl font-bold mb-4">Your Loans</h1>
        <ul className="space-y-4">
          {loans.map((loan) => (
            <li key={loan.id} className="border p-4 rounded">
              <p>Loan Amount: ${loan.amount}</p>
              <p>Loan Term: {loan.term} weeks</p>
              <p>Status: {loan.status}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default LoanList;
