import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Spinner from "../components/Spinner";
import api from "../utils/axios";

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loginError, setLoginError] = useState("");
  const { login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await api.post("/auth/login", data);
      console.log(response);
      const newData = login(response.data.token); // Store JWT in AuthContext
      if (newData.role === "customer") {
        navigate("/dashboard"); // Redirect after successful login
      } else if (newData.role === "admin") navigate("/admin");
    } catch (err) {
      console.log(err);
      if (err.response.status === 400) {
        setLoginError(`Incorrect credentials`);
      } else {
        setLoginError(`Error while login: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Spinner />}
      <div className="max-w-md mx-auto p-6 bg-white shadow-md">
        <h2 className="text-xl mb-4">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block mb-1">Email</label>
            <input
              {...register("email", { required: "Email is required" })}
              type="email"
              className="w-full border p-2 rounded"
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-1">Password</label>
            <input
              {...register("password", { required: "Password is required" })}
              type="password"
              className="w-full border p-2 rounded"
            />
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>
          {loginError && <p className="text-red-500">{loginError}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded"
          >
            Login
          </button>
        </form>
      </div>
    </>
  );
};

export default LoginPage;
