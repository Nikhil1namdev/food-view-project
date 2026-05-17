import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthCard from '../../components/auth/AuthCard';
import AuthInput from '../../components/auth/AuthInput';
import AuthButton from '../../components/auth/AuthButton';
import { useAuth } from '../../context/AuthContext';

// =========================================================================
// NORMAL CONSUMER LOGIN PORTAL (UserLogin)
// =========================================================================
// Renders dynamic login forms for normal customers.
// Includes:
// - Bouncy GSAP layouts wrapper
// - Dynamic error block alerts
// - Submit load spin tracking
// - AuthContext parity triggers to ensure session reload
const UserLogin = () => {
  const navigate = useNavigate();
  const { checkUserAuth } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();

    if (!email || !password) {
      setError("Please fill in all details.");
      return;
    }

    try {
      setLoading(true);
      
      const response = await axios.post(
        "http://localhost:3000/api/auth/user/login", 
        { email, password }, 
        { withCredentials: true }
      );

      console.log("Login success:", response.data);
      
      // Update global context session parameters immediately
      await checkUserAuth();
      
      navigate("/");
    } catch (err) {
      console.error("Login failure details:", err);
      setError(
        err.response?.data?.message || 
        "Incorrect email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Welcome back" 
      subtitle="Sign in to continue your ByteBite food journey."
    >
      <AuthCard>
        
        <form className="flex flex-col space-y-4" onSubmit={handleSubmit} noValidate>
          
          {/* Email Input Field */}
          <AuthInput
            label="Email Address"
            id="email"
            name="email"
            type="email"
            icon={Mail}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />

          {/* Password Input Field */}
          <AuthInput
            label="Secure Password"
            id="password"
            name="password"
            type="password"
            icon={Lock}
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />

          {/* Dynamic Error alert */}
          {error && (
            <div className="flex items-center space-x-2 bg-red-500/10 border border-red-500/25 p-3.5 rounded-2xl text-[11px] font-bold text-red-400 select-none animate-pulse">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <AuthButton loading={loading}>
            <LogIn className="w-4 h-4 text-white" />
            <span>Sign In</span>
          </AuthButton>

        </form>

        <div className="text-center mt-6 border-t border-white/5 pt-4 text-xs text-neutral-500 font-semibold select-none">
          New here?{' '}
          <Link to="/user/register" className="text-orange-500 hover:text-orange-400 hover:underline">
            Create account
          </Link>
        </div>

      </AuthCard>
    </AuthLayout>
  );
};

export default UserLogin;
