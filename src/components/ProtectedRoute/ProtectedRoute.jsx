import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ThreeDots } from 'react-loader-spinner';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ThreeDots visible={true} height="80" width="80" color="#3B82F6" radius="9" ariaLabel="three-dots-loading" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute; 