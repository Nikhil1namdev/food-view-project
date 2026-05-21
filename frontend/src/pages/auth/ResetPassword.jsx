import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    const { token } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!password || !confirmPassword) {
            toast.error("Please fill in all fields");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return;
        }

        try {
            setIsLoading(true);
            const response = await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, { password });
            toast.success(response.data.message || "Password reset successfully!");
            navigate('/user/login');
        } catch (error) {
            toast.error(error.response?.data?.message || "Invalid or expired token");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4 font-sora">
            <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl">
                
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-zinc-100 mb-3 tracking-tight">Set New Password</h1>
                    <p className="text-zinc-400 text-sm">
                        Must be at least 6 characters.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    
                    {/* New Password */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300 ml-1">New Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                            <input 
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-2xl py-3 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder:text-zinc-600"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300 ml-1">Confirm Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                            <input 
                                type={showPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-2xl py-3 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder:text-zinc-600"
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3.5 rounded-2xl transition-colors flex items-center justify-center gap-2 mt-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Resetting...
                            </>
                        ) : (
                            'Reset Password'
                        )}
                    </button>
                </form>

            </div>
        </div>
    );
};

export default ResetPassword;
