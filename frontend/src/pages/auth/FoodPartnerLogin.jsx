import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthCard from '../../components/auth/AuthCard';
import AuthInput from '../../components/auth/AuthInput';
import AuthButton from '../../components/auth/AuthButton';
import { useAuth } from '../../context/AuthContext';
import { FoodPartnerLoginSchema } from '../../schemas/auth.schema';

// =========================================================================
// FOOD PARTNER / MERCHANT LOGIN PORTAL (FoodPartnerLogin)
// =========================================================================
// Renders dynamic forms for kitchen owners using React Hook Form + Zod.
const FoodPartnerLogin = () => {
  const navigate = useNavigate();
  const { checkUserAuth } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(FoodPartnerLoginSchema),
    mode: "onTouched"
  });

  const onSubmit = async (formData) => {
    setError("");

    try {
      setLoading(true);
      
      const response = await axios.post(
        "http://localhost:3000/api/auth/food-partner/login", 
        formData, 
        { withCredentials: true }
      );

      console.log("Merchant login success:", response.data);
      toast.success("Welcome to your kitchen dashboard! Login successful.");
      
      // Update global context session parameters immediately
      await checkUserAuth();
      
      const partnerId = response.data.foodPartner?._id || response.data.user?._id;
      if (partnerId) {
        navigate(`/food-partner/${partnerId}`);
      } else {
        // Fallback if ID is missing in response for some reason
        navigate("/");
      }
    } catch (err) {
      console.error("Merchant login details failure:", err);
      const errMsg = err.response?.data?.message || "Incorrect email or password. Please try again.";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Merchant Portal" 
      subtitle="Sign in to manage recipes and upload food reels."
    >
      <AuthCard>
        
        <form className="flex flex-col space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          
          {/* Email Input Field */}
          <AuthInput
            label="Business Email"
            id="email"
            type="email"
            icon={Mail}
            placeholder="business@example.com"
            autoComplete="email"
            error={errors.email?.message}
            disabled={loading}
            {...register("email")}
          />

          {/* Password Input Field */}
          <AuthInput
            label="Secure Password"
            id="password"
            type="password"
            icon={Lock}
            placeholder="••••••••"
            autoComplete="current-password"
            error={errors.password?.message}
            disabled={loading}
            {...register("password")}
          />

          {/* Dynamic Error alert */}
          {error && (
            <div className="flex items-center space-x-2 bg-red-500/10 border border-red-500/25 p-3.5 rounded-2xl text-[11px] font-bold text-red-400 select-none animate-pulse">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <AuthButton loading={loading} disabled={loading}>
            <LogIn className="w-4 h-4 text-white" />
            <span>Sign In</span>
          </AuthButton>

        </form>

        <div className="text-center mt-6 border-t border-white/5 pt-4 text-xs text-neutral-500 font-semibold select-none">
          New partner?{' '}
          <Link to="/food-partner/register" className="text-orange-500 hover:text-orange-400 hover:underline">
            Create Partner Account
          </Link>
        </div>

      </AuthCard>
    </AuthLayout>
  );
};

export default FoodPartnerLogin;
