
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Pill, History, Users, LogOut, Menu, X } from 'lucide-react';
import { logoutUser, getUser } from '@/utils/authUtils';
import { cn } from '@/lib/utils';
import ThemeToggle from '@/components/theme/ThemeToggle';

type User = {
  id: string;
  email: string;
  role: string;
};

const Navbar: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUser();
      setUser(userData);
      setIsLoading(false);
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    const success = await logoutUser();
    if (success) {
      navigate('/login');
    }
  };

  const menuItems = [
    {
      path: '/dashboard',
      label: 'Medications',
      icon: <Pill className="mr-2 h-4 w-4" />,
      showFor: ['admin', 'user'],
    },
    {
      path: '/history',
      label: 'History',
      icon: <History className="mr-2 h-4 w-4" />,
      showFor: ['admin', 'user'],
    },
    {
      path: '/admin',
      label: 'Admin',
      icon: <Users className="mr-2 h-4 w-4" />,
      showFor: ['admin'],
    },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.showFor.includes(user?.role as 'admin' | 'user')
  );

  // Close menu when changing routes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  if (isLoading) {
    return <div className="h-16 bg-white/80 backdrop-blur-md border-b flex items-center justify-center">Loading...</div>;
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-background/80 backdrop-blur-md border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/dashboard" className="flex items-center gap-2">
            <Pill className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg">MedTracker</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button 
            className="block"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Desktop menu */}
        <nav className="hidden md:flex items-center gap-6">
          {filteredMenuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center text-sm font-medium transition-colors hover:text-primary",
                location.pathname === item.path 
                  ? "text-primary" 
                  : "text-muted-foreground"
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
          <ThemeToggle />
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLogout}
            className="flex items-center gap-1"
          >
            <LogOut className="h-4 w-4 mr-1" />
            Logout
          </Button>
        </nav>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white/95 dark:bg-background/95 backdrop-blur-md border-b shadow-lg md:hidden animate-in slide-in">
            <nav className="flex flex-col p-4 space-y-3">
              {filteredMenuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center py-2 px-3 text-sm font-medium rounded-md transition-colors",
                    location.pathname === item.path 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="flex items-center justify-start gap-1 py-2 px-3"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
