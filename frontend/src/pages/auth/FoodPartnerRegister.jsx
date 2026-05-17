import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Store, User, Phone, Mail, Lock, MapPin, UserPlus, AlertCircle } from 'lucide-react';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthCard from '../../components/auth/AuthCard';
import AuthInput from '../../components/auth/AuthInput';
import AuthButton from '../../components/auth/AuthButton';
import { useAuth } from '../../context/AuthContext';

// =========================================================================
// FOOD PARTNER / MERCHANT REGISTRATION PORTAL (FoodPartnerRegister)
// =========================================================================
// Allows new street food and restaurant owners to onboard their kitchen.
// Includes:
// - Role swap selector gates
// - Two-column inputs grid for Contact and Phone numbers
// - Submit loaders and dynamic error warning blocks
const FoodPartnerRegister = () => {
  const navigate = useNavigate();
  const { checkUserAuth } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const businessName = e.target.businessName.value.trim();
    const contactName = e.target.contactName.value.trim();
    const phone = e.target.phone.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();
    const address = e.target.address.value.trim();

    if (!businessName || !contactName || !phone || !email || !password || !address) {
      setError("Please fill in all registration fields.");
      return;
    }

    try {
      setLoading(true);
      
      const response = await axios.post(
        "http://localhost:3000/api/auth/food-partner/register", 
        {
          name: businessName,
          contactName,
          phone,
          email,
          password,
          address
        },
        { withCredentials: true }
      );

      console.log("Merchant registration success:", response.data);
      
      // Update global context session parameters immediately
      await checkUserAuth();
      
      navigate("/create-food");
    } catch (err) {
      console.error("Merchant registration failure:", err);
      setError(
        err.response?.data?.message || 
        "Failed to create account. Verify business credentials and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Merchant Onboarding" 
      subtitle="Register your kitchen to market recipes and collect orders."
    >
      <AuthCard className="max-w-[420px]">
        
        {/* Toggle Portal Switcher */}
        <div className="flex items-center justify-between bg-zinc-950/50 border border-zinc-800 p-1 rounded-xl mb-6 select-none text-[10px] font-black tracking-wide">
          <Link 
            to="/user/register" 
            className="flex-1 text-center py-2 text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            Consumer User
          </Link>
          <span className="flex-1 text-center py-2 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-lg">
            Food Partner
          </span>
        </div>

        <form className="flex flex-col space-y-3.5" onSubmit={handleSubmit} noValidate>
          
          {/* Business Name Input */}
          <AuthInput
            label="Business / Kitchen Name"
            id="businessName"
            name="businessName"
            icon={Store}
            placeholder="e.g., Tasty Street Bites"
            autoComplete="organization"
            required
          />

          {/* Grid: Contact & Phone */}
          <div className="grid grid-cols-2 gap-3">
            <AuthInput
              label="Contact Name"
              id="contactName"
              name="contactName"
              icon={User}
              placeholder="Jane Doe"
              autoComplete="name"
              required
            />

            <AuthInput
              label="Contact Phone"
              id="phone"
              name="phone"
              type="tel"
              icon={Phone}
              placeholder="+91 90000 00000"
              autoComplete="tel"
              required
            />
          </div>

          {/* Email Input */}
          <AuthInput
            label="Business Email"
            id="email"
            name="email"
            type="email"
            icon={Mail}
            placeholder="business@example.com"
            autoComplete="email"
            required
          />

          {/* Password Input */}
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

          {/* Address Input */}
          <AuthInput
            label="Kitchen Address"
            id="address"
            name="address"
            icon={MapPin}
            placeholder="e.g., 123 Market Street, Block B"
            autoComplete="street-address"
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
          <AuthButton loading={loading} className="mt-2">
            <UserPlus className="w-4 h-4 text-white" />
            <span>Onboard Kitchen</span>
          </AuthButton>

        </form>

        <div className="text-center mt-5 border-t border-white/5 pt-4 text-xs text-neutral-500 font-semibold select-none">
          Already onboarded?{' '}
          <Link to="/food-partner/login" className="text-orange-500 hover:text-orange-400 hover:underline">
            Sign In
          </Link>
        </div>

      </AuthCard>
    </AuthLayout>
  );
};

export default FoodPartnerRegister;
