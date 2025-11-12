import { useState, useEffect } from 'react';
import { AuthForm } from './components/AuthForm';
import { ChatPage } from './components/ChatPage';
import axios from 'axios';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated on mount
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      
      if (token) {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const tokenData = JSON.parse(atob(token.split('.')[1]));
          const isExpired = tokenData.exp * 1000 < Date.now();
          
          if (!isExpired) {
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('auth_token');
          }
        } catch (error) {
          localStorage.removeItem('auth_token');
        }
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleAuthSuccess = (token: string) => {
    localStorage.setItem('auth_token', token);
    setIsAuthenticated(true);
  };

  const handleLogout = async() => {
    try {
    await axios.post("https://dooperbackend.sujeet.xyz/auth/logout", {}, { withCredentials: true });
    localStorage.removeItem('auth_token');
    setIsAuthenticated(false);
  } catch (error) {
    console.error("Logout failed:", error);
  }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {!isAuthenticated ? (
        <AuthForm onAuthSuccess={handleAuthSuccess} />
      ) : (
        <ChatPage onLogout={handleLogout} />
      )}
    </div>
  );
}
