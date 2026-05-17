import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, Lock, UserPlus, AlertCircle } from 'lucide-react';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthCard from '../../components/auth/AuthCard';
import AuthInput from '../../components/auth/AuthInput';
import AuthButton from '../../components/auth/AuthButton';
import { useAuth } from '../../context/AuthContext';

// =========================================================================
// CONSUMER REGISTER REGISTRATION PORTAL (UserRegister)
// =========================================================================
// Handles self-registration for standard platform customers.
// - Supports visual role swapping indicators
// - Direct inline validation and async submit trackers
const UserRegister = () => {
  const navigate = useNavigate();
  const { checkUserAuth } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const firstName = e.target.firstName.value.trim();
    const lastName = e.target.lastName.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();

    if (!firstName || !lastName || !email || !password) {
      setError("Please fill in all registration fields.");
      return;
    }

    try {
      setLoading(true);
      
      const response = await axios.post(
        "http://localhost:3000/api/auth/user/register", 
        {
          fullName: `${firstName} ${lastName}`,
          email,
          password
        },
        { withCredentials: true }
      );

      console.log("Registration success:", response.data);
      
      // Update global context session parameters immediately
      await checkUserAuth();
      
      navigate("/");
    } catch (err) {
      console.error("Registration details failure:", err);
      setError(
        err.response?.data?.message || 
        "Failed to create account. Email may already be registered."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Create account" 
      subtitle="Sign up as consumer to swipe food reels and order now."
    >
      <AuthCard>
        
        {/* Toggle Portal Switcher */}
        <div className="flex items-center justify-between bg-zinc-950/50 border border-zinc-800 p-1 rounded-xl mb-6 select-none text-[10px] font-black tracking-wide">
          <span className="flex-1 text-center py-2 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-lg">
            Consumer User
          </span>
          <Link 
            to="/food-partner/register" 
            className="flex-1 text-center py-2 text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            Food Partner
          </Link>
        </div>

        <form className="flex flex-col space-y-4" onSubmit={handleSubmit} noValidate>
          
          {/* Two Columns Grid for First & Last Names */}
          <div className="grid grid-cols-2 gap-4">
            <AuthInput
              label="First Name"
              id="firstName"
              name="firstName"
              icon={User}
              placeholder="Jane"
              autoComplete="given-name"
              required
            />

            <AuthInput
              label="Last Name"
              id="lastName"
              name="lastName"
              icon={User}
              placeholder="Doe"
              autoComplete="family-name"
              required
            />
          </div>

          {/* Email Input Field */}
          <AuthInput
            label="Email Address"
            id="email"
            name="email"
            type="email"
            icon={Mail}
            placeholder="jane@example.com"
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
            autoComplete="new-password"
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
            <UserPlus className="w-4 h-4 text-white" />
            <span>Create Account</span>
          </AuthButton>

        </form>

        <div className="text-center mt-6 border-t border-white/5 pt-4 text-xs text-neutral-500 font-semibold select-none">
          Already have an account?{' '}
          <Link to="/user/login" className="text-orange-500 hover:text-orange-400 hover:underline">
            Sign In
          </Link>
        </div>

      </AuthCard>
    </AuthLayout>
  );
};

export default UserRegister;
