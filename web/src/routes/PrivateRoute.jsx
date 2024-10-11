import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, roleRequired }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>; // Show loading while user data is being checked
  }

  if (!user) {
    return <Navigate to="/login" />; // Redirect to login if not authenticated
  }

  if (roleRequired && user.role !== roleRequired) {
    return <Navigate to="/unauthorized" />; // Redirect if user doesn't have required role
  }

  return children;
};

export default PrivateRoute;
