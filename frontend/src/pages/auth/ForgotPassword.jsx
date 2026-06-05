import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { toast } from 'react-hot-toast';
import { Mail, ArrowLeft, Loader2 } from 'lucide-react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!email) {
            toast.error("Please enter your email");
            return;
        }

        try {
            setIsLoading(true);
            const response = await api.post('/api/auth/forgot-password', { email });
            toast.success(response.data.message || "Reset link sent to your email!");
            setEmail('');
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4 font-sora">
            <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl">
                
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-zinc-100 mb-3 tracking-tight">Forgot Password</h1>
                    <p className="text-zinc-400 text-sm">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300 ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                            <input 
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder:text-zinc-600"
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3.5 rounded-2xl transition-colors flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Sending Link...
                            </>
                        ) : (
                            'Send Reset Link'
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <Link to="/user/login" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-orange-500 transition-colors font-medium">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Login
                    </Link>
                </div>
                
            </div>
        </div>
    );
};

export default ForgotPassword;
