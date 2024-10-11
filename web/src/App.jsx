import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./routes/PrivateRoute";
import Sidebar from "./components/Sidebar";
import AdminPage from "./pages/AdminPage";
import DashboardPage from "./pages/DashboardPage";
import LoanListPage from "./pages/LoanListPage";
import CreateLoanPage from "./pages/CreateLoanPage";
import RepaymentsPage from "./pages/RepaymentPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PaymentSuccessPage from "./pages/PaymentSuccess";
import PaymentCancelPage from "./pages/PaymentCancel";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="flex w-full h-full">
        <div className="h-full fixed">
          <Sidebar />
        </div>
        <div className="flex-1 p-6 ml-[260px] w-full h-full ">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              }
            />

            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/loans"
              element={
                <PrivateRoute roleRequired="customer">
                  <LoanListPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/create-loan"
              element={
                <PrivateRoute roleRequired="customer">
                  <CreateLoanPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/repayments"
              element={
                <PrivateRoute roleRequired="customer">
                  <RepaymentsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <PrivateRoute roleRequired="admin">
                  <AdminPage />
                </PrivateRoute>
              }
            />
            <Route path="/success" element={<PaymentSuccessPage />} />
            <Route path="/cancel" element={<PaymentCancelPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
