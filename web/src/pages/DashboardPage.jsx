import React, { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import api from "../utils/axios";
// import Sidebar from './Sidebar';

const DashboardPage = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        setLoading(true);
        const response = await api.get("/loans", {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("token"),
          },
        });

        console.log(response.status);
        if (response.status !== 200) {
          throw new Error("Failed to fetch loans");
        }

        const data = response.data;
        console.log(data);
        setLoans(data);
      } catch (err) {
        console.log(err);
        setError(err.message);
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, []);

  if (loading) return <Spinner />;
  // if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex">
      {/* <Sidebar /> */}
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-4">Your Loans</h1>
        {loans.length === 0 ? (
          <p>No loans found.</p>
        ) : (
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="border-b border-gray-300 px-4 py-2">Amount</th>
                <th className="border-b border-gray-300 px-4 py-2">
                  Term (Weeks)
                </th>
                <th className="border-b border-gray-300 px-4 py-2">Status</th>
                <th className="border-b border-gray-300 px-4 py-2">
                  Repayment Status
                </th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan) => (
                <tr key={loan._id}>
                  <td className="border-b border-gray-300 px-4 py-2">
                    {loan.amount}
                  </td>
                  <td className="border-b border-gray-300 px-4 py-2">
                    {loan.term}
                  </td>
                  <td className="border-b border-gray-300 px-4 py-2">
                    {loan.status}
                  </td>
                  <td className="border-b border-gray-300 px-4 py-2">
                    {loan.repayments.every(
                      (repayment) => repayment.status === "PAID"
                    )
                      ? "Paid"
                      : "Pending"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
