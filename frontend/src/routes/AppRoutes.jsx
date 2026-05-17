import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserRegister from '../pages/auth/UserRegister';
import ChooseRegister from '../pages/auth/ChooseRegister';
import UserLogin from '../pages/auth/UserLogin';
import FoodPartnerRegister from '../pages/auth/FoodPartnerRegister';
import FoodPartnerLogin from '../pages/auth/FoodPartnerLogin';
import Home from '../pages/general/Home';
import Saved from '../pages/general/Saved';
import LandingPage from '../pages/general/LandingPage';
import Layout from '../components/Layout';
import CreateFood from '../pages/food-partner/CreateFood';
import Profile from '../pages/food-partner/Profile';
import ProtectedRoute from '../components/ProtectedRoute';
import GuestRoute from '../components/GuestRoute';

// =========================================================================
// ROUTING ARCHITECTURE (AppRoutes)
// =========================================================================
// Maps application URLs to specialized views with three security layers:
//
// 1. GUEST ROUTES (GuestRoute wrapper):
//    Login/Register pages wrapped in GuestRoute. If a user is already
//    logged in and tries to visit /user/login, they get auto-redirected
//    to their home page. Prevents double-session confusion.
//
// 2. PROTECTED ROUTES (ProtectedRoute wrapper):
//    Consumer and Partner pages are wrapped with role-specific guards.
//    Unauthenticated users → redirect to /register
//    Wrong role users → redirect to their own home page
//
// 3. PUBLIC ROUTES (no wrapper):
//    Partner profile pages are publicly accessible by anyone (consumers
//    can view a partner's store, partners can view their own dashboard).
//
// Route Map:
// ┌──────────────────────────┬──────────────────────┬──────────────┐
// │ Route                    │ Access               │ Guard        │
// ├──────────────────────────┼──────────────────────┼──────────────┤
// │ /register                │ Guests only          │ GuestRoute   │
// │ /user/register           │ Guests only          │ GuestRoute   │
// │ /user/login              │ Guests only          │ GuestRoute   │
// │ /food-partner/register   │ Guests only          │ GuestRoute   │
// │ /food-partner/login      │ Guests only          │ GuestRoute   │
// │ /                        │ Consumers only       │ Protected    │
// │ /saved                   │ Consumers only       │ Protected    │
// │ /create-food             │ Partners only        │ Protected    │
// │ /food-partner/:id        │ Everyone (public)    │ None         │
// └──────────────────────────┴──────────────────────┴──────────────┘
const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                {/* ── GUEST-ONLY AUTH PORTALS ── */}
                {/* Wrapped in GuestRoute: logged-in users auto-redirect to home */}
                <Route path="/register" element={
                    <GuestRoute><ChooseRegister /></GuestRoute>
                } />
                <Route path="/user/register" element={
                    <GuestRoute><UserRegister /></GuestRoute>
                } />
                <Route path="/user/login" element={
                    <GuestRoute><UserLogin /></GuestRoute>
                } />
                <Route path="/food-partner/register" element={
                    <GuestRoute><FoodPartnerRegister /></GuestRoute>
                } />
                <Route path="/food-partner/login" element={
                    <GuestRoute><FoodPartnerLogin /></GuestRoute>
                } />

                {/* ── PUBLIC LANDING PAGE ── */}
                {/* Independent landing page to capture organic SEO & traffic */}
                <Route path="/" element={<LandingPage />} />

                {/* ── PROTECTED APP SHELL ── */}
                {/* All routes below share the persistent Layout (sidebar + nav) */}
                <Route element={<Layout />}>
                    
                    {/* Consumer-only feeds (role: 'user') */}
                    <Route element={<ProtectedRoute allowedRoles={['user']} />}>
                        <Route path="/feed" element={<Home />} />
                        <Route path="/saved" element={<Saved />} />
                    </Route>

                    {/* Merchant-only actions (role: 'partner') */}
                    <Route element={<ProtectedRoute allowedRoles={['partner']} />}>
                        <Route path="/create-food" element={<CreateFood />} />
                    </Route>

                    {/* Public partner profile (accessible by everyone) */}
                    {/* No ProtectedRoute wrapper: consumers can view stores, */}
                    {/* partners see their own dashboard with owner controls */}
                    <Route path="/food-partner/:id" element={<Profile />} />
                </Route>
            </Routes>
        </Router>
    )
}

export default AppRoutes