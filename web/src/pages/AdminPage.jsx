import React, { useEffect, useState, useContext } from "react";
import api from "../utils/axios";
import Spinner from "../components/Spinner";

const AdminDashboard = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchLoans();
  }, [token]);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const response = await api.get("/loans/all", {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      });
      setLoans(response.data);
    } catch (err) {
      console.error("Error fetching loans", err);
    } finally {
      setLoading(false);
    }
  };

  const approveLoan = async (loanId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      console.log({ token });
      await api.put(
        `/loans/approve/${loanId}`,
        {},
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );
      fetchLoans();
    } catch (err) {
      console.error("Failed to approve loan", err);
    } finally {
      setLoading(false);
    }
  };

  console.log(loans);

  return (
    <>
      {loading && <Spinner />}
      <div>
        <h1 className="text-2xl">Admin Dashboard</h1>
        <h2 className="text-xl">All Loans</h2>
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">User Name</th>
              <th className="border border-gray-300 p-2">User Email</th>
              <th className="border border-gray-300 p-2">Amount</th>
              <th className="border border-gray-300 p-2">Term</th>
              <th className="border border-gray-300 p-2">Status</th>
              <th className="border border-gray-300 p-2">Start Date</th>
              <th className="border border-gray-300 p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => (
              <tr key={loan._id}>
                <td className="border border-gray-300 p-2">
                  {loan.user?.name}
                </td>
                <td className="border border-gray-300 p-2">
                  {loan.user?.email}
                </td>
                <td className="border border-gray-300 p-2">{loan.amount}</td>
                <td className="border border-gray-300 p-2">{loan.term}</td>
                <td className="border border-gray-300 p-2">{loan.status}</td>
                <td className="border border-gray-300 p-2">
                  {new Date(loan.startDate).toLocaleDateString()}
                </td>
                {loan.status === "PENDING" && (
                  <td className="border border-gray-300 p-2 text-center">
                    <button
                      onClick={() => approveLoan(loan._id)}
                      className="bg-green-500 text-white rounded px-2"
                    >
                      Approve
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AdminDashboard;
