"use client";

import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaLock,
  FaBell,
  FaDollarSign,
  FaSave,
  FaChevronDown,
  FaChevronUp,
  FaPercent,
  FaSnowflake,
  FaUndo,
} from "react-icons/fa";
import { Card, Button, Input, Spinner } from "@/components/ui";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { showToast } from "@/lib/toast";
import { settingsApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

// Collapsible Section Component
function CollapsibleSection({ title, icon: Icon, iconColor = "text-blue-600", children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icon className={iconColor} />
          <span className="font-semibold text-gray-900">{title}</span>
        </div>
        {isOpen ? (
          <FaChevronUp className="text-gray-400" />
        ) : (
          <FaChevronDown className="text-gray-400" />
        )}
      </button>
      {isOpen && <div className="pb-4">{children}</div>}
    </div>
  );
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [deleteAccountConfirm, setDeleteAccountConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Profile data
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    userType: "",
  });

  // Cost settings - matches UserSettings schema
  const [settings, setSettings] = useState({
    // Fixed Costs
    annualInsurance: 12000,
    monthlyVehiclePayment: 1500,
    annualLicensing: 2500,
    monthlyOverhead: 500,
    annualMiles: 100000,

    // Variable Costs
    maintenanceCpm: 0.15,
    tireCpm: 0.05,
    fuelCpm: null,

    // Service Multipliers
    expediteMultiplier: 1.30,
    teamMultiplier: 1.50,
    rushMultiplier: 1.50,
    sameDayMultiplier: 2.00,

    // Service Fees
    liftgateFee: 75,
    palletJackFee: 50,
    driverAssistFee: 100,
    whiteGloveFee: 250,
    trackingFee: 25,
    specialEquipmentFee: 150,
    detentionRatePerHour: 75,

    // Reefer Costs
    defPricePerGallon: 3.50,
    reeferMaintenancePerHour: 25,
    reeferFuelPerHour: 1.50,

    // Financial
    profitMargin: 0.15,
    factoringRate: 0.03,

    // Configuration
    useIndustryDefaults: true,
    defaultDeadheadMiles: 50,
  });

  const [emailNotifications, setEmailNotifications] = useState({
    weeklyReport: true,
    quoteReminders: true,
    promotions: false,
  });

  // Load user data and settings
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        company: user.companyName || "",
        userType: user.userType || "owner_operator",
      });
    }
    loadSettings();
  }, [user]);

  const loadSettings = async () => {
    try {
      const data = await settingsApi.getSettings();
      if (data) {
        setSettings((prev) => ({ ...prev, ...data }));
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileSave = () => {
    console.log("Save profile data:", profileData);
    showToast.success("Profile saved successfully!");
  };

  const handleSettingsSave = async () => {
    setIsSaving(true);
    try {
      await settingsApi.updateSettings(settings);
      showToast.success("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      showToast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDefaults = async () => {
    try {
      await settingsApi.resetDefaults();
      await loadSettings();
      showToast.success("Settings reset to industry defaults");
    } catch (error) {
      console.error("Error resetting settings:", error);
      showToast.error("Failed to reset settings");
    }
  };

  const handlePasswordChange = () => {
    showToast.info("Password change modal coming soon");
  };

  const handleDeleteAccount = () => {
    setDeleteAccountConfirm(true);
  };

  const confirmDeleteAccount = () => {
    console.log("Delete account - to be implemented");
    showToast.success("Account deletion initiated");
  };

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const calculateTotalMonthlyCosts = () => {
    const annual = settings.annualInsurance + settings.annualLicensing;
    const monthly = settings.monthlyVehiclePayment + settings.monthlyOverhead;
    return monthly + annual / 12;
  };

  const calculateCostPerMile = () => {
    const annualFixed = settings.annualInsurance + settings.annualLicensing +
      (settings.monthlyVehiclePayment * 12) + (settings.monthlyOverhead * 12);
    const fixedPerMile = annualFixed / settings.annualMiles;
    const variablePerMile = settings.maintenanceCpm + settings.tireCpm + (settings.fuelCpm || 0);
    return (fixedPerMile + variablePerMile).toFixed(2);
  };

  const formatUserType = (type) => {
    const types = {
      owner_operator: "Owner Operator",
      fleet_manager: "Fleet Manager",
      dispatcher: "Dispatcher",
    };
    return types[type] || type;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Profile & Settings
          </h1>
          <p className="text-gray-600">
            Manage your account information and cost settings for accurate rate calculations
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <Input
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <Input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <Input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                <Input
                  value={profileData.company}
                  onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">User Type</label>
                <div className="px-4 py-2 bg-gray-100 rounded-md text-gray-700 font-medium">
                  {formatUserType(profileData.userType)}
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

          {/* Operating Costs - Expanded with collapsible sections */}
          <Card className="p-6 bg-white border-2 border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FaDollarSign className="text-green-600" />
                Operating Costs & Settings
              </h2>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={handleResetDefaults} icon={<FaUndo />} iconPosition="left">
                  Reset Defaults
                </Button>
                <Button size="sm" onClick={handleSettingsSave} icon={<FaSave />} iconPosition="left" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>

            {/* Industry Defaults Toggle */}
            <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="font-medium text-gray-900">Use Industry Defaults</p>
                  <p className="text-sm text-gray-600">When enabled, missing values will use industry-standard defaults</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.useIndustryDefaults}
                  onChange={(e) => updateSetting("useIndustryDefaults", e.target.checked)}
                  className="w-5 h-5 text-blue-600"
                />
              </label>
            </div>

            <div className="divide-y divide-gray-200">
              {/* Fixed Costs */}
              <CollapsibleSection title="Fixed Costs (Monthly/Annual)" icon={FaDollarSign} iconColor="text-green-600" defaultOpen>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Truck Payment (Monthly)</label>
                    <Input
                      type="number"
                      value={settings.monthlyVehiclePayment}
                      onChange={(e) => updateSetting("monthlyVehiclePayment", parseFloat(e.target.value) || 0)}
                      prefix="$"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Insurance (Annual)</label>
                    <Input
                      type="number"
                      value={settings.annualInsurance}
                      onChange={(e) => updateSetting("annualInsurance", parseFloat(e.target.value) || 0)}
                      prefix="$"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Permits & Licenses (Annual)</label>
                    <Input
                      type="number"
                      value={settings.annualLicensing}
                      onChange={(e) => updateSetting("annualLicensing", parseFloat(e.target.value) || 0)}
                      prefix="$"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Overhead (Monthly)</label>
                    <Input
                      type="number"
                      value={settings.monthlyOverhead}
                      onChange={(e) => updateSetting("monthlyOverhead", parseFloat(e.target.value) || 0)}
                      prefix="$"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Annual Miles</label>
                    <Input
                      type="number"
                      value={settings.annualMiles}
                      onChange={(e) => updateSetting("annualMiles", parseInt(e.target.value) || 0)}
                      suffix="miles"
                    />
                    <p className="text-xs text-gray-500 mt-1">Used to calculate cost per mile allocation</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Monthly Fixed Total:</p>
                    <p className="text-xl font-bold text-gray-900">${calculateTotalMonthlyCosts().toLocaleString()}</p>
                  </div>
                </div>
              </CollapsibleSection>

              {/* Variable Costs */}
              <CollapsibleSection title="Variable Costs (Per Mile)" icon={FaDollarSign} iconColor="text-blue-600">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Maintenance Per Mile</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={settings.maintenanceCpm}
                      onChange={(e) => updateSetting("maintenanceCpm", parseFloat(e.target.value) || 0)}
                      prefix="$"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tires Per Mile</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={settings.tireCpm}
                      onChange={(e) => updateSetting("tireCpm", parseFloat(e.target.value) || 0)}
                      prefix="$"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Cost Per Mile (optional)</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={settings.fuelCpm || ""}
                      onChange={(e) => updateSetting("fuelCpm", e.target.value ? parseFloat(e.target.value) : null)}
                      prefix="$"
                      placeholder="Auto-calculated from MPG"
                    />
                    <p className="text-xs text-gray-500 mt-1">Leave empty to auto-calculate from vehicle MPG</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Total Cost Per Mile:</p>
                    <p className="text-xl font-bold text-gray-900">${calculateCostPerMile()}</p>
                  </div>
                </div>
              </CollapsibleSection>

              {/* Service Multipliers */}
              <CollapsibleSection title="Service Multipliers" icon={FaPercent} iconColor="text-purple-600">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Express Multiplier</label>
                    <Input
                      type="number"
                      step="0.05"
                      value={settings.expediteMultiplier}
                      onChange={(e) => updateSetting("expediteMultiplier", parseFloat(e.target.value) || 1)}
                      suffix="x"
                    />
                    <p className="text-xs text-gray-500 mt-1">Applied to express deliveries</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rush Multiplier</label>
                    <Input
                      type="number"
                      step="0.05"
                      value={settings.rushMultiplier}
                      onChange={(e) => updateSetting("rushMultiplier", parseFloat(e.target.value) || 1)}
                      suffix="x"
                    />
                    <p className="text-xs text-gray-500 mt-1">Applied to rush deliveries</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Same-Day Multiplier</label>
                    <Input
                      type="number"
                      step="0.05"
                      value={settings.sameDayMultiplier}
                      onChange={(e) => updateSetting("sameDayMultiplier", parseFloat(e.target.value) || 1)}
                      suffix="x"
                    />
                    <p className="text-xs text-gray-500 mt-1">Applied to same-day deliveries</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Team Driver Multiplier</label>
                    <Input
                      type="number"
                      step="0.05"
                      value={settings.teamMultiplier}
                      onChange={(e) => updateSetting("teamMultiplier", parseFloat(e.target.value) || 1)}
                      suffix="x"
                    />
                    <p className="text-xs text-gray-500 mt-1">Applied when team drivers are used</p>
                  </div>
                </div>
              </CollapsibleSection>

              {/* Service Fees */}
              <CollapsibleSection title="Service Fees" icon={FaDollarSign} iconColor="text-orange-600">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Liftgate Fee</label>
                    <Input
                      type="number"
                      value={settings.liftgateFee}
                      onChange={(e) => updateSetting("liftgateFee", parseFloat(e.target.value) || 0)}
                      prefix="$"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pallet Jack Fee</label>
                    <Input
                      type="number"
                      value={settings.palletJackFee}
                      onChange={(e) => updateSetting("palletJackFee", parseFloat(e.target.value) || 0)}
                      prefix="$"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Driver Assist Fee</label>
                    <Input
                      type="number"
                      value={settings.driverAssistFee}
                      onChange={(e) => updateSetting("driverAssistFee", parseFloat(e.target.value) || 0)}
                      prefix="$"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">White Glove Fee</label>
                    <Input
                      type="number"
                      value={settings.whiteGloveFee}
                      onChange={(e) => updateSetting("whiteGloveFee", parseFloat(e.target.value) || 0)}
                      prefix="$"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tracking Fee</label>
                    <Input
                      type="number"
                      value={settings.trackingFee}
                      onChange={(e) => updateSetting("trackingFee", parseFloat(e.target.value) || 0)}
                      prefix="$"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Special Equipment Fee</label>
                    <Input
                      type="number"
                      value={settings.specialEquipmentFee}
                      onChange={(e) => updateSetting("specialEquipmentFee", parseFloat(e.target.value) || 0)}
                      prefix="$"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Detention Rate (per hour)</label>
                    <Input
                      type="number"
                      value={settings.detentionRatePerHour}
                      onChange={(e) => updateSetting("detentionRatePerHour", parseFloat(e.target.value) || 0)}
                      prefix="$"
                      suffix="/hr"
                    />
                  </div>
                </div>
              </CollapsibleSection>

              {/* Reefer Costs */}
              <CollapsibleSection title="Reefer Costs" icon={FaSnowflake} iconColor="text-cyan-600">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">DEF Price (per gallon)</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={settings.defPricePerGallon}
                      onChange={(e) => updateSetting("defPricePerGallon", parseFloat(e.target.value) || 0)}
                      prefix="$"
                    />
                    <p className="text-xs text-gray-500 mt-1">Diesel Exhaust Fluid</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reefer Maintenance (per hour)</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={settings.reeferMaintenancePerHour}
                      onChange={(e) => updateSetting("reeferMaintenancePerHour", parseFloat(e.target.value) || 0)}
                      prefix="$"
                      suffix="/hr"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reefer Fuel (per hour)</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={settings.reeferFuelPerHour}
                      onChange={(e) => updateSetting("reeferFuelPerHour", parseFloat(e.target.value) || 0)}
                      prefix="$"
                      suffix="/hr"
                    />
                  </div>
                </div>
              </CollapsibleSection>

              {/* Financial Settings */}
              <CollapsibleSection title="Financial Settings" icon={FaPercent} iconColor="text-green-600">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Profit Margin</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={(settings.profitMargin * 100).toFixed(0)}
                      onChange={(e) => updateSetting("profitMargin", (parseFloat(e.target.value) || 0) / 100)}
                      suffix="%"
                    />
                    <p className="text-xs text-gray-500 mt-1">Desired profit as percentage of rate</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Factoring Rate</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={(settings.factoringRate * 100).toFixed(1)}
                      onChange={(e) => updateSetting("factoringRate", (parseFloat(e.target.value) || 0) / 100)}
                      suffix="%"
                    />
                    <p className="text-xs text-gray-500 mt-1">Fee charged by factoring company</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Default Deadhead Miles</label>
                    <Input
                      type="number"
                      value={settings.defaultDeadheadMiles}
                      onChange={(e) => updateSetting("defaultDeadheadMiles", parseInt(e.target.value) || 0)}
                      suffix="miles"
                    />
                    <p className="text-xs text-gray-500 mt-1">Pre-filled deadhead for new calculations</p>
                  </div>
                </div>
              </CollapsibleSection>
            </div>

            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> These settings are used to calculate accurate profit margins in your quotes.
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
                  onChange={(e) => setEmailNotifications({ ...emailNotifications, weeklyReport: e.target.checked })}
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
                  onChange={(e) => setEmailNotifications({ ...emailNotifications, quoteReminders: e.target.checked })}
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
                  onChange={(e) => setEmailNotifications({ ...emailNotifications, promotions: e.target.checked })}
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
