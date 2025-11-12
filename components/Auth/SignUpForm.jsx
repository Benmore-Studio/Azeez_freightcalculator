"use client";

import React, { useState } from "react";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { Truck, Users, ClipboardList, Check } from "lucide-react";
import { Input, Button, Card } from "@/components/ui";
import Link from "next/link";
import OnboardingModal from "@/components/Onboarding/OnboardingModal";

export default function SignUpForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const userTypes = [
    { value: "owner-operator", label: "Owner Operator", icon: Truck },
    { value: "fleet-manager", label: "Fleet Manager", icon: Users },
    { value: "dispatcher", label: "Dispatcher", icon: ClipboardList },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain uppercase, lowercase, and number";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // User type validation
    if (!formData.userType) {
      newErrors.userType = "Please select your role";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // TODO: Replace with actual API call in T7
    // Simulating API call
    setTimeout(() => {
      console.log("Sign up data:", formData);
      // Account created successfully - trigger onboarding modal
      setIsSubmitting(false);
      setShowOnboarding(true);
    }, 1500);
  };

  const handleOnboardingClose = () => {
    setShowOnboarding(false);
    // TODO: Redirect to dashboard in T7 when backend is ready
    console.log("Onboarding closed - would redirect to dashboard");
  };

  return (
    <Card className="w-full bg-white shadow-lg border-2 border-gray-200">
      <div className="p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Your Account</h1>
          <p className="text-sm text-gray-600">
            Join thousands of trucking professionals using our platform
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <Input
            label="Full Name"
            type="text"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            icon={<FaUser />}
            error={errors.name}
          />

          {/* Email */}
          <Input
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            icon={<FaEnvelope />}
            error={errors.email}
          />

          {/* Password */}
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            icon={<FaLock />}
            error={errors.password}
            helperText={!errors.password ? "Must be 8+ chars with uppercase, lowercase & number" : ""}
          />

          {/* Confirm Password */}
          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
            icon={<FaLock />}
            error={errors.confirmPassword}
          />

          {/* User Type Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              I am a...
            </label>
            <div className="grid grid-cols-1 gap-3">
              {userTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleInputChange("userType", type.value)}
                    className={`flex items-center gap-3 p-4 border-2 rounded-lg transition-all ${
                      formData.userType === type.value
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${
                      formData.userType === type.value
                        ? "bg-blue-100"
                        : "bg-gray-100"
                    }`}>
                      <IconComponent
                        size={20}
                        className={formData.userType === type.value ? "text-blue-600" : "text-gray-600"}
                      />
                    </div>
                    <span className="font-medium text-gray-900">{type.label}</span>
                    {formData.userType === type.value && (
                      <Check size={20} className="ml-auto text-blue-600" />
                    )}
                  </button>
                );
              })}
            </div>
            {errors.userType && (
              <p className="text-sm text-red-600 mt-2">{errors.userType}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </Button>

          {/* Terms */}
          <p className="text-xs text-gray-500 text-center">
            By signing up, you agree to our{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>
          </p>

          {/* Sign In Link */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/auth/signin" className="text-blue-600 font-semibold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </div>

      {/* Onboarding Modal */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={handleOnboardingClose}
        initialData={{
          name: formData.name,
          email: formData.email,
          userType: formData.userType,
        }}
      />
    </Card>
  );
}
