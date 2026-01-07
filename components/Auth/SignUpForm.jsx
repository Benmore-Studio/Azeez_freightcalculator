"use client";

import React, { useState, useMemo } from "react";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { Check, X } from "lucide-react";
import { Input, Button, Card, Spinner, Select } from "@/components/ui";
import { showToast } from "@/lib/toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import OnboardingModal from "@/components/Onboarding/OnboardingModal";

// Password criteria check item component
function PasswordCriteriaItem({ met, label }) {
  return (
    <div className={`flex items-center gap-1.5 text-xs ${met ? "text-green-600" : "text-gray-400"}`}>
      {met ? (
        <Check size={14} className="flex-shrink-0" />
      ) : (
        <X size={14} className="flex-shrink-0" />
      )}
      <span>{label}</span>
    </div>
  );
}

export default function SignUpForm() {
  const router = useRouter();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const userTypeOptions = [
    { value: "owner-operator", label: "Owner Operator" },
    { value: "fleet-manager", label: "Fleet Manager" },
    { value: "dispatcher", label: "Dispatcher" },
  ];

  // Password criteria checks
  const passwordCriteria = useMemo(() => ({
    minLength: formData.password.length >= 8,
    hasUppercase: /[A-Z]/.test(formData.password),
    hasLowercase: /[a-z]/.test(formData.password),
    hasNumber: /\d/.test(formData.password),
  }), [formData.password]);

  const allPasswordCriteriaMet = Object.values(passwordCriteria).every(Boolean);

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

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
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
    } else if (!allPasswordCriteriaMet) {
      newErrors.password = "Password does not meet all requirements";
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

    try {
      // Map frontend userType to backend enum format
      const userTypeMap = {
        "owner-operator": "owner_operator",
        "fleet-manager": "fleet_manager",
        "dispatcher": "dispatcher",
      };

      const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`;

      await register({
        email: formData.email,
        password: formData.password,
        name: fullName,
        userType: userTypeMap[formData.userType] || formData.userType,
      });

      showToast.success("Account created successfully!");
      // Account created successfully - trigger onboarding modal
      setShowOnboarding(true);
    } catch (error) {
      console.error("Sign up error:", error);
      showToast.error(error.message || "Failed to create account");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOnboardingClose = () => {
    setShowOnboarding(false);
    router.push("/dashboard");
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
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              type="text"
              placeholder="John"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              icon={<FaUser />}
              error={errors.firstName}
            />
            <Input
              label="Last Name"
              type="text"
              placeholder="Doe"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              error={errors.lastName}
            />
          </div>

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
          <div>
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              icon={<FaLock />}
              error={errors.password}
            />
            {/* Password Criteria Checklist */}
            {formData.password.length > 0 && (
              <div className="mt-2 grid grid-cols-2 gap-1">
                <PasswordCriteriaItem met={passwordCriteria.minLength} label="8+ characters" />
                <PasswordCriteriaItem met={passwordCriteria.hasUppercase} label="Uppercase letter" />
                <PasswordCriteriaItem met={passwordCriteria.hasLowercase} label="Lowercase letter" />
                <PasswordCriteriaItem met={passwordCriteria.hasNumber} label="Number" />
              </div>
            )}
          </div>

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
          <Select
            label="I am a..."
            placeholder="Select your role"
            value={formData.userType}
            onChange={(e) => handleInputChange("userType", e.target.value)}
            options={userTypeOptions}
            error={errors.userType}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="w-full"
            icon={isSubmitting ? <Spinner size="sm" /> : null}
            iconPosition="left"
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </Button>

          {/* Terms */}
          <p className="text-xs text-gray-500 text-center">
            By signing up, you agree to our Terms of Service and Privacy Policy.
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
          name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
          email: formData.email,
          userType: formData.userType,
        }}
      />
    </Card>
  );
}
