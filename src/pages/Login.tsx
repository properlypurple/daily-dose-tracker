
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '@/components/auth/LoginForm';
import { getUser } from '@/utils/authUtils';

const Login: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const user = await getUser();
      if (user) {
        navigate('/dashboard');
      }
    };

    checkAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-blue-50">
      <div className="w-full max-w-md p-4">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
