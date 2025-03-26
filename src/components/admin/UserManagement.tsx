
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { updateUserRole, deleteUser } from '@/utils/authUtils';
import type { User } from '@/types/auth';
import { Loader2, UserPlus, UserMinus, Shield, ShieldAlert } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import RegisterForm from '../auth/RegisterForm';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddUser, setShowAddUser] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Convert profile data to User type
      const usersData = await Promise.all(data.map(async (profile) => {
        // Get email from auth if available
        const { data: authData } = await supabase.auth.admin.getUserById(profile.id);
        return {
          id: profile.id,
          email: authData?.user?.email || 'No email',
          role: profile.role,
          created_at: profile.created_at
        } as User;
      }));
      
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'user') => {
    const success = await updateUserRole(userId, newRole);
    if (success) {
      fetchUsers();
    }
  };

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    if (confirm(`Are you sure you want to delete user ${userEmail}?`)) {
      const success = await deleteUser(userId);
      if (success) {
        fetchUsers();
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">User Management</h2>
        <Button 
          onClick={() => setShowAddUser(!showAddUser)}
          className="button-hover"
        >
          {showAddUser ? 'Cancel' : (
            <>
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </>
          )}
        </Button>
      </div>

      {showAddUser && (
        <div className="mb-8">
          <RegisterForm />
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="animate-spin h-8 w-8 text-primary" />
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-muted">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Created
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {user.role === 'admin' ? (
                        <div className="flex items-center gap-1 text-sm font-medium text-primary">
                          <Shield className="h-4 w-4" />
                          Admin
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <ShieldAlert className="h-4 w-4" />
                          User
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRoleChange(
                        user.id, 
                        user.role === 'admin' ? 'user' : 'admin'
                      )}
                    >
                      {user.role === 'admin' ? 'Make User' : 'Make Admin'}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteUser(user.id, user.email)}
                    >
                      <UserMinus className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
