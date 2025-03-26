
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";

// Initialize Supabase environment check
const isMissingEnv = 
  !import.meta.env.VITE_SUPABASE_URL || 
  !import.meta.env.VITE_SUPABASE_ANON_KEY;

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    if (isMissingEnv) {
      console.error(
        "Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY"
      );
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {isMissingEnv ? (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-red-50 text-red-600">
              <h1 className="text-2xl font-bold mb-4">Missing Supabase Configuration</h1>
              <p className="mb-2">This application requires Supabase environment variables to be set:</p>
              <pre className="bg-white p-4 rounded shadow mb-4">
                {`VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key`}
              </pre>
              <p>Please follow the instructions in the project README to set up these variables.</p>
            </div>
          ) : (
            <Routes>
              <Route path="/login" element={<Login />} />
              
              <Route path="/" element={<AppLayout />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="history" element={<History />} />
                <Route path="admin" element={<AdminDashboard />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          )}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
