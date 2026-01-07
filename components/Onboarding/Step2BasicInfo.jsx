"use client";

import React, { useState, useEffect } from "react";
import { FaUser, FaEnvelope, FaPhone, FaBuilding } from "react-icons/fa";
import { Input, Button } from "@/components/ui";

export default function Step2BasicInfo({ initialData, onNext, onPrevious }) {
  const [formData, setFormData] = useState({
    name: initialData.name || "",
    email: initialData.email || "",
    phone: initialData.phone || "",
    company: initialData.company || "",
  });

  const [errors, setErrors] = useState({});

  // Sync when initialData changes (e.g., from signup prefill)
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      name: initialData.name || prev.name,
      email: initialData.email || prev.email,
      phone: initialData.phone || prev.phone,
      company: initialData.company || prev.company,
    }));
  }, [initialData.name, initialData.email, initialData.phone, initialData.company]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (!validateForm()) {
      return;
    }
    onNext(formData);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Basic Information</h3>
        <p className="text-gray-600 text-sm">
          Let's confirm your contact details (some fields may be pre-filled from signup)
        </p>
      </div>

      <div className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          placeholder="John Doe"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          icon={<FaUser />}
          error={errors.name}
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="john@example.com"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          icon={<FaEnvelope />}
          error={errors.email}
          disabled={!!initialData.email}
          helperText={initialData.email ? "Email from signup (cannot be changed here)" : ""}
        />

        <Input
          label="Phone Number"
          type="tel"
          placeholder="(555) 123-4567"
          value={formData.phone}
          onChange={(e) => handleInputChange("phone", e.target.value)}
          icon={<FaPhone />}
          error={errors.phone}
          helperText="We'll use this for important account notifications"
        />

        <Input
          label="Company Name (Optional)"
          type="text"
          placeholder="ABC Trucking LLC"
          value={formData.company}
          onChange={(e) => handleInputChange("company", e.target.value)}
          icon={<FaBuilding />}
          helperText="Leave blank if you're an independent operator"
        />
      </div>

      <div className={`flex pt-4 ${onPrevious ? "justify-between" : "justify-end"}`}>
        {onPrevious && (
          <Button onClick={onPrevious} variant="outline" size="lg">
            Back
          </Button>
        )}
        <Button onClick={handleContinue} size="lg">
          Continue
        </Button>
      </div>
    </div>
  );
}
