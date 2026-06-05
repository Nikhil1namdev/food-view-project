import React, { useState } from 'react';
import { api, API_BASE_URL } from '../../lib/api';
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
import { UserLoginSchema } from '../../schemas/auth.schema';

// =========================================================================
// NORMAL CONSUMER LOGIN PORTAL (UserLogin)
// =========================================================================
// Renders dynamic login forms for normal customers using:
// - React Hook Form for performance & zero visual jank
// - Zod schema validation for strict type & length parsing
// - Social login providers integration (Google & GitHub)
const UserLogin = () => {
  const navigate = useNavigate();
  const { checkUserAuth } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(UserLoginSchema),
    mode: "onTouched"
  });

  const onSubmit = async (formData) => {
    setError("");

    try {
      setLoading(true);
      
      const response = await api.post("/api/auth/user/login", formData);

      console.log("Login success:", response.data);
      toast.success("Welcome back to ByteBite! Login successful.");
      
      // Update global context session parameters immediately
      await checkUserAuth();
      
      navigate("/feed");
    } catch (err) {
      console.error("Login failure details:", err);
      const errMsg = err.response?.data?.message || "Incorrect email or password. Please try again.";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/api/auth/google`;
  };

  const handleGithubLogin = () => {
    window.location.href = `${API_BASE_URL}/api/auth/github`;
  };

  return (
    <AuthLayout 
      title="Welcome back" 
      subtitle="Sign in to continue your ByteBite food journey."
    >
      <AuthCard>
        
        <form className="flex flex-col space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          
          {/* Email Input Field */}
          <AuthInput
            label="Email Address"
            id="email"
            type="email"
            icon={Mail}
            placeholder="you@example.com"
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

          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-xs font-semibold text-zinc-400 hover:text-orange-500 transition-colors">
              Forgot password?
            </Link>
          </div>

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

        {/* OAuth SSO Providers Divider */}
        <div className="flex items-center my-5 text-[9px] font-black text-neutral-500 uppercase tracking-widest select-none">
          <hr className="flex-1 border-white/5" />
          <span className="px-3 text-neutral-600">Or continue with</span>
          <hr className="flex-1 border-white/5" />
        </div>

        {/* Social Buttons Matrix */}
        <div className="grid grid-cols-2 gap-3">
          <button 
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="flex items-center justify-center space-x-2 bg-zinc-950/40 border border-zinc-800 hover:border-orange-500/30 hover:bg-zinc-900/60 rounded-2xl py-3 px-4 text-xs font-bold text-zinc-300 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            <span>Google</span>
          </button>

          <button 
            type="button"
            onClick={handleGithubLogin}
            disabled={loading}
            className="flex items-center justify-center space-x-2 bg-zinc-950/40 border border-zinc-800 hover:border-orange-500/30 hover:bg-zinc-900/60 rounded-2xl py-3 px-4 text-xs font-bold text-zinc-300 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
            </svg>
            <span>GitHub</span>
          </button>
        </div>

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
