import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // console.log("sidebar", user.role)

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="w-64 h-screen bg-gray-800 text-white">
      <div className="p-4">
        <h1 className="text-2xl font-bold">Loan App</h1>
      </div>
      <nav className="mt-4">
        <ul>
          {user && user.role === "customer" && (
            <li className="px-4 py-2">
              <Link to="/dashboard" className="hover:bg-gray-700 block">
                <p className="px-2">Dashboard</p>
              </Link>
            </li>
          )}

          {user?.role === "customer" && (
            <>
              <li className="px-4 py-2">
                <Link to="/loans" className="hover:bg-gray-700 block">
                  <p className="px-2">View Loans</p>
                </Link>
              </li>
              <li className="px-4 py-2">
                <Link to="/create-loan" className="hover:bg-gray-700 block">
                  <p className="px-2">Create Loan</p>
                </Link>
              </li>
              <li className="px-4 py-2">
                <Link to="/repayments" className="hover:bg-gray-700 block">
                  <p className="px-2">Repay Loan</p>
                </Link>
              </li>
            </>
          )}

          {user?.role === "admin" && (
            <li className="px-4 py-2">
              <Link to="/admin" className="hover:bg-gray-700 block">
                <p className="px-2">Admin Dashboard</p>
              </Link>
            </li>
          )}

          {!user ? (
            <>
              <li className="px-4 py-2">
                <Link to="/login" className="hover:bg-gray-700 block">
                  <p className="px-2">Login</p>
                </Link>
              </li>
              <li className="px-4 py-2">
                <Link to="/register" className="hover:bg-gray-700 block">
                  <p className="px-2">Register</p>
                </Link>
              </li>
            </>
          ) : (
            <li className="px-4 py-2">
              <button
                onClick={handleLogout}
                className="hover:bg-red-600 w-full text-left"
              >
                <p className="px-2">Logout</p>
              </button>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;

// Route protection using React Router and JWT token validation.
// Error handling from API responses.
// Session persistence through localStorage to store the token.
// Form validation with React Hook Form.
// Basic loading states to enhance user experience.
// ShadCN for components and styling.
