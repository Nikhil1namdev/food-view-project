import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Lock, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const ChangePassword = () => {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
            toast.error("Please fill in all fields");
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }

        if (formData.newPassword.length < 6) {
            toast.error("New password must be at least 6 characters");
            return;
        }

        try {
            setIsLoading(true);
            const response = await axios.post(
                'http://localhost:5000/api/auth/user/change-password',
                formData,
                { withCredentials: true }
            );
            
            toast.success(response.data.message || "Password changed successfully!");
            setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
            navigate('/feed'); // Redirect to feed after success
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to change password");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4 font-sora">
            <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl">
                
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">Change Password</h1>
                        <p className="text-zinc-400 text-xs mt-1">
                            Update your account password
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    
                    {/* Old Password */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300 ml-1">Current Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                            <input 
                                type={showOld ? "text" : "password"}
                                name="oldPassword"
                                value={formData.oldPassword}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-2xl py-3 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder:text-zinc-600"
                            />
                            <button
                                type="button"
                                onClick={() => setShowOld(!showOld)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                            >
                                {showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {/* New Password */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300 ml-1">New Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                            <input 
                                type={showNew ? "text" : "password"}
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-2xl py-3 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder:text-zinc-600"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNew(!showNew)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                            >
                                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300 ml-1">Confirm New Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                            <input 
                                type={showNew ? "text" : "password"}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
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
                                Updating...
                            </>
                        ) : (
                            'Update Password'
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <Link to="/forgot-password" className="text-xs text-orange-500 hover:text-orange-400 font-semibold transition-colors">
                        Forgot your current password?
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;
