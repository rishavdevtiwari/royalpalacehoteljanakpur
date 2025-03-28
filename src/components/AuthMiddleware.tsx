
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface AuthMiddlewareProps {
  children: React.ReactNode;
}

const AuthMiddleware: React.FC<AuthMiddlewareProps> = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // For login and register pages, redirect to appropriate page if already logged in
    if (location.pathname === '/login' || location.pathname === '/register') {
      if (user) {
        // Redirect admin to dashboard, regular users to home
        if (isAdmin) {
          navigate('/dashboard');
        } else {
          navigate('/');
        }
      }
    }
    
    // For protected routes, redirect to login if not logged in
    const protectedRoutes = ['/dashboard', '/booking', '/bookings', '/profile'];
    if (protectedRoutes.some(route => location.pathname.startsWith(route)) && !user && !loading) {
      navigate('/login', { state: { from: location } });
    }
    
    // For admin routes, redirect to home if not admin
    const adminRoutes = ['/dashboard'];
    if (adminRoutes.some(route => location.pathname.startsWith(route)) && !isAdmin && !loading) {
      navigate('/');
    }
  }, [location.pathname, user, loading, navigate, isAdmin]);

  return <>{children}</>;
};

export default AuthMiddleware;
