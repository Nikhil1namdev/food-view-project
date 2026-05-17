import React from 'react';
import { Link } from 'react-router-dom';
import { User, Store } from 'lucide-react';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthCard from '../../components/auth/AuthCard';
import AuthOptionCard from '../../components/auth/AuthOptionCard';

// =========================================================================
// REGISTER ROLE SELECTION PORTAL (ChooseRegister)
// =========================================================================
// Allows new visitors to declare their registration path:
// - Normal User (Standard customer ordering reels)
// - Food Partner (Merchant uploading reels)
const ChooseRegister = () => {
  return (
    <AuthLayout 
      title="Create an account" 
      subtitle="Join ByteBite as a consumer or merchant to get started."
    >
      <AuthCard>
        
        <header className="mb-6 text-center">
          <h2 className="text-base font-black text-white">Join ByteBite</h2>
          <p className="text-xs text-neutral-400 font-medium mt-1">
            Pick how you want to join our platform.
          </p>
        </header>

        <div className="flex flex-col space-y-4">
          
          {/* Normal User CTA Option */}
          <AuthOptionCard
            title="Register as Consumer"
            description="Swipe reels, save favorite spots, and order delicious meals near you."
            to="/user/register"
            icon={User}
          />

          {/* Food Partner CTA Option */}
          <AuthOptionCard
            title="Register as Merchant"
            description="Upload viral food reels, market street food recipes, and scale your kitchen."
            to="/food-partner/register"
            icon={Store}
          />

        </div>

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

export default ChooseRegister;
