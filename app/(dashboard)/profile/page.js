"use client";

import React, { useState } from "react";
import { FaUser, FaEnvelope, FaPhone, FaBuilding, FaLock, FaBell, FaDollarSign, FaSave } from "react-icons/fa";
import { Card, Button, Input } from "@/components/ui";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { showToast } from "@/lib/toast";

export default function ProfilePage() {
  const [deleteAccountConfirm, setDeleteAccountConfirm] = useState(false);

  // Mock data - will be replaced with actual data from backend/auth
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    company: "Doe Trucking LLC",
    userType: "Owner Operator",
  });

  const [costData, setCostData] = useState({
    fixedCosts: {
      truckPayment: 1500,
      insurance: 800,
      permits: 200,
    },
    variableCosts: {
      fuelPerMile: 0.85,
      maintenancePerMile: 0.15,
      tiresPerMile: 0.05,
    },
  });

  const [emailNotifications, setEmailNotifications] = useState({
    weeklyReport: true,
    quoteReminders: true,
    promotions: false,
  });

  const handleProfileSave = () => {
    console.log("Save profile data:", profileData);
    // TODO: Save to backend
    showToast.success("Profile saved successfully!");
  };

  const handleCostSave = () => {
    console.log("Save cost data:", costData);
    // TODO: Save to backend
    showToast.success("Cost settings saved successfully!");
  };

  const handlePasswordChange = () => {
    showToast.info("Password change modal coming soon");
    // TODO: Open change password modal
  };

  const handleDeleteAccount = () => {
    setDeleteAccountConfirm(true);
  };

  const confirmDeleteAccount = () => {
    console.log("Delete account - to be implemented");
    showToast.success("Account deletion initiated");
    // TODO: Implement account deletion
  };

  const calculateTotalMonthlyCosts = () => {
    return Object.values(costData.fixedCosts).reduce((sum, cost) => sum + cost, 0);
  };

  const calculateCostPerMile = () => {
    const variableTotal = Object.values(costData.variableCosts).reduce((sum, cost) => sum + cost, 0);
    const monthlyFixed = calculateTotalMonthlyCosts();
    const estimatedMilesPerMonth = 10000; // TODO: Make this configurable
    const fixedPerMile = monthlyFixed / estimatedMilesPerMonth;
    return (fixedPerMile + variableTotal).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Profile & Settings
          </h1>
          <p className="text-gray-600">
            Manage your account information and preferences
          </p>
        </div>

        <div className="space-y-6">
          {/* Personal Information */}
          <Card className="p-6 bg-white border-2 border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FaUser className="text-blue-600" />
                Personal Information
              </h2>
              <Button size="sm" onClick={handleProfileSave} icon={<FaSave />} iconPosition="left">
                Save Changes
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <Input
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <Input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <Input
                  value={profileData.company}
                  onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  User Type
                </label>
                <div className="px-4 py-2 bg-gray-100 rounded-md text-gray-700 font-medium">
                  {profileData.userType}
                </div>
              </div>
            </div>
          </Card>

          {/* Security */}
          <Card className="p-6 bg-white border-2 border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
              <FaLock className="text-blue-600" />
              Security
            </h2>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 mb-1">Password</p>
                <p className="text-sm text-gray-600">Last changed 30 days ago</p>
              </div>
              <Button size="sm" variant="outline" onClick={handlePasswordChange}>
                Change Password
              </Button>
            </div>
          </Card>

          {/* Operating Costs */}
          <Card className="p-6 bg-white border-2 border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FaDollarSign className="text-green-600" />
                Operating Costs
              </h2>
              <Button size="sm" onClick={handleCostSave} icon={<FaSave />} iconPosition="left">
                Save Changes
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Fixed Costs */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Fixed Monthly Costs</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Truck Payment
                    </label>
                    <Input
                      type="number"
                      value={costData.fixedCosts.truckPayment}
                      onChange={(e) =>
                        setCostData({
                          ...costData,
                          fixedCosts: { ...costData.fixedCosts, truckPayment: parseFloat(e.target.value) },
                        })
                      }
                      prefix="$"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Insurance
                    </label>
                    <Input
                      type="number"
                      value={costData.fixedCosts.insurance}
                      onChange={(e) =>
                        setCostData({
                          ...costData,
                          fixedCosts: { ...costData.fixedCosts, insurance: parseFloat(e.target.value) },
                        })
                      }
                      prefix="$"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Permits & Licenses
                    </label>
                    <Input
                      type="number"
                      value={costData.fixedCosts.permits}
                      onChange={(e) =>
                        setCostData({
                          ...costData,
                          fixedCosts: { ...costData.fixedCosts, permits: parseFloat(e.target.value) },
                        })
                      }
                      prefix="$"
                    />
                  </div>

                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-sm text-gray-600">Total Monthly Fixed:</p>
                    <p className="text-xl font-bold text-gray-900">
                      ${calculateTotalMonthlyCosts().toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Variable Costs */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Variable Costs (Per Mile)</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fuel Cost Per Mile
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      value={costData.variableCosts.fuelPerMile}
                      onChange={(e) =>
                        setCostData({
                          ...costData,
                          variableCosts: { ...costData.variableCosts, fuelPerMile: parseFloat(e.target.value) },
                        })
                      }
                      prefix="$"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Maintenance Per Mile
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      value={costData.variableCosts.maintenancePerMile}
                      onChange={(e) =>
                        setCostData({
                          ...costData,
                          variableCosts: { ...costData.variableCosts, maintenancePerMile: parseFloat(e.target.value) },
                        })
                      }
                      prefix="$"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tires Per Mile
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      value={costData.variableCosts.tiresPerMile}
                      onChange={(e) =>
                        setCostData({
                          ...costData,
                          variableCosts: { ...costData.variableCosts, tiresPerMile: parseFloat(e.target.value) },
                        })
                      }
                      prefix="$"
                    />
                  </div>

                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-sm text-gray-600">Total Cost Per Mile:</p>
                    <p className="text-xl font-bold text-gray-900">
                      ${calculateCostPerMile()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> These costs are used to calculate accurate profit margins in your quotes.
                Update them regularly to ensure accurate rate calculations.
              </p>
            </div>
          </Card>

          {/* Email Notifications */}
          <Card className="p-6 bg-white border-2 border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
              <FaBell className="text-blue-600" />
              Email Notifications
            </h2>

            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="font-medium text-gray-900">Weekly Reports</p>
                  <p className="text-sm text-gray-600">Get a weekly summary of your quotes and profits</p>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotifications.weeklyReport}
                  onChange={(e) =>
                    setEmailNotifications({ ...emailNotifications, weeklyReport: e.target.checked })
                  }
                  className="w-5 h-5 text-blue-600"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="font-medium text-gray-900">Quote Reminders</p>
                  <p className="text-sm text-gray-600">Reminders for saved quotes and calculations</p>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotifications.quoteReminders}
                  onChange={(e) =>
                    setEmailNotifications({ ...emailNotifications, quoteReminders: e.target.checked })
                  }
                  className="w-5 h-5 text-blue-600"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="font-medium text-gray-900">Promotions & Updates</p>
                  <p className="text-sm text-gray-600">News about new features and promotions</p>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotifications.promotions}
                  onChange={(e) =>
                    setEmailNotifications({ ...emailNotifications, promotions: e.target.checked })
                  }
                  className="w-5 h-5 text-blue-600"
                />
              </label>
            </div>
          </Card>

          {/* Danger Zone */}
          <Card className="p-6 bg-red-50 border-2 border-red-200">
            <h2 className="text-xl font-bold text-red-900 mb-4">Danger Zone</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-red-900 mb-1">Delete Account</p>
                <p className="text-sm text-red-700">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
              </div>
              <Button size="sm" variant="danger" onClick={handleDeleteAccount}>
                Delete Account
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Delete Account Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteAccountConfirm}
        onClose={() => setDeleteAccountConfirm(false)}
        onConfirm={confirmDeleteAccount}
        title="Delete Account"
        message="Are you sure you want to permanently delete your account? All your data, quotes, and vehicles will be lost. This action cannot be undone."
        confirmText="Delete My Account"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}
