import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";
import Spinner from "../components/Spinner";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const CreateLoanPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await api.post("/loans", data, {
        headers: { "x-auth-token": token },
      });
      navigate("/loans"); // Redirect to loan list after creation
    } catch (err) {
      console.error("Failed to create loan", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Spinner />}
      <div className="max-w-md mx-auto p-6 bg-white shadow-md">
        <h2 className="text-xl mb-4">Create a Loan</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block mb-1">Amount Required (in USD)</label>
            <input
              {...register("amount", { required: "Amount is required" })}
              type="number"
              className="w-full border p-2 rounded"
            />
            {errors.amount && (
              <p className="text-red-500">{errors.amount.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-1">Loan Term (in weeks)</label>
            <input
              {...register("term", { required: "Term is required" })}
              type="number"
              className="w-full border p-2 rounded"
            />
            {errors.term && (
              <p className="text-red-500">{errors.term.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded"
          >
            Create Loan
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateLoanPage;
