
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserManagement from '@/components/admin/UserManagement';
import { isAdmin } from '@/utils/authUtils';
import { Loader2 } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminAccess = async () => {
      const adminAccess = await isAdmin();
      
      if (!adminAccess) {
        navigate('/dashboard');
      } else {
        setAuthorized(true);
      }
      
      setLoading(false);
    };

    checkAdminAccess();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Checking permissions...</p>
      </div>
    );
  }

  if (!authorized) {
    return null; // Will redirect via navigate
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <UserManagement />
    </div>
  );
};

export default AdminDashboard;
