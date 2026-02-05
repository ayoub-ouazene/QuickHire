import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedAccountType }) {
  const { isAuthenticated, loading, accountType } = useAuth();


  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {

    return <Navigate to="/SignIn" replace />;
  }

  // If allowedAccountType is specified, check if user has correct account type
  if (allowedAccountType && accountType !== allowedAccountType) {
    console.log('Wrong account type, redirecting to correct home');
    if (accountType === 'user') {
      return <Navigate to="/User/Home" replace />;
    } else if (accountType === 'company') {
      return <Navigate to="/Company/Home" replace />;
    }
  }

  return children;
}