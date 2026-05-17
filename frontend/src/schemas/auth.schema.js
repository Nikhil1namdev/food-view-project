import { z } from 'zod';

// =========================================================================
// REUSABLE ZOD VALIDATION SCHEMAS FOR BYTEBITE AUTHENTICATION
// =========================================================================
// Defines robust client-side validation rules for Consumers and Merchants.
// Prevents incorrect API payload transmission and provides sub-second feedback.

// 1. Consumer (User) Login Validation Schema
export const UserLoginSchema = z.object({
  email: z
    .string()
    .min(1, "Email address is required.")
    .email("Please provide a valid email address (e.g., name@example.com)."),
  password: z
    .string()
    .min(1, "Password is required.")
    .min(6, "Password must contain at least 6 characters.")
});

// 2. Consumer (User) Registration Validation Schema
export const UserRegisterSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required.")
    .max(50, "First name cannot exceed 50 characters."),
  lastName: z
    .string()
    .min(1, "Last name is required.")
    .max(50, "Last name cannot exceed 50 characters."),
  email: z
    .string()
    .min(1, "Email address is required.")
    .email("Please provide a valid email address."),
  password: z
    .string()
    .min(1, "Password is required.")
    .min(6, "Password must contain at least 6 characters."),
  confirmPassword: z
    .string()
    .min(1, "Please confirm your password.")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match. Please verify passwords.",
  path: ["confirmPassword"] // Attaches error directly to confirmPassword field
});

// 3. Merchant (Food Partner) Login Validation Schema
export const FoodPartnerLoginSchema = z.object({
  email: z
    .string()
    .min(1, "Email address is required.")
    .email("Please provide a valid email address."),
  password: z
    .string()
    .min(1, "Password is required.")
    .min(6, "Password must contain at least 6 characters.")
});

// 4. Merchant (Food Partner) Onboarding Schema
export const FoodPartnerRegisterSchema = z.object({
  businessName: z
    .string()
    .min(1, "Business or kitchen name is required.")
    .min(2, "Business name must contain at least 2 characters."),
  contactName: z
    .string()
    .min(1, "Primary contact owner name is required."),
  phone: z
    .string()
    .min(1, "Business phone number is required.")
    .regex(/^[+]?[0-9]{10,14}$/, "Please provide a valid phone number (10 to 14 digits)."),
  email: z
    .string()
    .min(1, "Business email address is required.")
    .email("Please provide a valid email address."),
  password: z
    .string()
    .min(1, "Password is required.")
    .min(6, "Password must contain at least 6 characters."),
  address: z
    .string()
    .min(1, "Physical merchant kitchen address is required.")
    .min(5, "Address must contain at least 5 characters.")
});
