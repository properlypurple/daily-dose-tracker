
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { User } from '@/types/auth';

export { User };

// Handle errors
export const handleError = (error: any, fallbackMessage: string = 'An error occurred') => {
  console.error('Error:', error);
  const message = error?.message || fallbackMessage;
  toast.error(message);
};

// Check if user is authenticated
export const getUser = async (): Promise<User | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;
    
    // Get user profile from users table including role
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (error) throw error;
    
    return data as User;
  } catch (error) {
    handleError(error, 'Failed to get user data');
    return null;
  }
};

// Login with email and password
export const loginUser = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    return data.user;
  } catch (error) {
    handleError(error, 'Login failed');
    return null;
  }
};

// Logout
export const logoutUser = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    toast.success('Successfully logged out');
    return true;
  } catch (error) {
    handleError(error, 'Logout failed');
    return false;
  }
};

// Register a new user (admin only)
export const registerUser = async (email: string, password: string, role: 'admin' | 'user' = 'user') => {
  try {
    // Check if current user is admin
    const currentUser = await getUser();
    if (currentUser?.role !== 'admin') {
      throw new Error('Only admins can register new users');
    }
    
    // Create new user in auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    
    if (error) throw error;
    
    // Insert user into users table with role
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: data.user.id,
        email,
        role,
      });
    
    if (profileError) throw profileError;
    
    toast.success('User registered successfully');
    return data.user;
  } catch (error) {
    handleError(error, 'Registration failed');
    return null;
  }
};

// Check if user is admin
export const isAdmin = async (): Promise<boolean> => {
  const user = await getUser();
  return user?.role === 'admin';
};

// Update user role (admin only)
export const updateUserRole = async (userId: string, role: 'admin' | 'user') => {
  try {
    // Check if current user is admin
    const isCurrentUserAdmin = await isAdmin();
    if (!isCurrentUserAdmin) {
      throw new Error('Only admins can update user roles');
    }
    
    const { error } = await supabase
      .from('users')
      .update({ role })
      .eq('id', userId);
    
    if (error) throw error;
    
    toast.success(`User role updated to ${role}`);
    return true;
  } catch (error) {
    handleError(error, 'Failed to update user role');
    return false;
  }
};

// Delete user (admin only)
export const deleteUser = async (userId: string) => {
  try {
    // Check if current user is admin
    const isCurrentUserAdmin = await isAdmin();
    if (!isCurrentUserAdmin) {
      throw new Error('Only admins can delete users');
    }
    
    // Delete user from auth
    const { error } = await supabase.auth.admin.deleteUser(userId);
    
    if (error) throw error;
    
    toast.success('User deleted successfully');
    return true;
  } catch (error) {
    handleError(error, 'Failed to delete user');
    return false;
  }
};
