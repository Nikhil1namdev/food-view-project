import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserRegister from '../pages/auth/UserRegister';
import ChooseRegister from '../pages/auth/ChooseRegister';
import UserLogin from '../pages/auth/UserLogin';
import FoodPartnerRegister from '../pages/auth/FoodPartnerRegister';
import FoodPartnerLogin from '../pages/auth/FoodPartnerLogin';
import Home from '../pages/general/Home';
import Saved from '../pages/general/Saved';
import Layout from '../components/Layout';
import CreateFood from '../pages/food-partner/CreateFood';
import Profile from '../pages/food-partner/Profile';
import ProtectedRoute from '../components/ProtectedRoute';

// =========================================================================
// ROUTING ARCHITECTURE (AppRoutes)
// =========================================================================
// Maps application URLs to specialized views.
// Non-auth routes (Auth gates) are placed globally, while inside-app views
// are grouped under a shared Layout component.
const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                {/* Authentication Portals (Full-screen layouts) */}
                <Route path="/register" element={<ChooseRegister />} />
                <Route path="/user/register" element={<UserRegister />} />
                <Route path="/user/login" element={<UserLogin />} />
                <Route path="/food-partner/register" element={<FoodPartnerRegister />} />
                <Route path="/food-partner/login" element={<FoodPartnerLogin />} />

                {/* Core Application shell with Persistent Left Sidebar/Bottom Nav */}
                <Route element={<Layout />}>
                    {/* Consumer-only feeds */}
                    <Route element={<ProtectedRoute allowedRoles={['user']} />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/saved" element={<Saved />} />
                    </Route>

                    {/* Merchant-only actions */}
                    <Route element={<ProtectedRoute allowedRoles={['partner']} />}>
                        <Route path="/create-food" element={<CreateFood />} />
                    </Route>

                    {/* Shared public views */}
                    <Route path="/food-partner/:id" element={<Profile />} />
                </Route>
            </Routes>
        </Router>
    )
}

export default AppRoutes