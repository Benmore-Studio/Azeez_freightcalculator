"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Calculator,
  FileText,
  Truck,
  Trophy,
  User,
  LogOut,
  X,
  Menu
} from "lucide-react";
import SidebarItem from "./SidebarItem";
import { useAuth } from "@/context/AuthContext";
import { showToast } from "@/lib/toast";

export default function Sidebar({ className = "" }) {
  const router = useRouter();
  const { logout, user } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await logout();
      showToast.success("Signed out successfully");
      router.push("/");
    } catch (error) {
      console.error("Sign out error:", error);
      router.push("/");
    }
  };

  const navigationItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/rate-calculator", icon: Calculator, label: "Calculator" },
    { href: "/quotes", icon: FileText, label: "Quotes" },
    { href: "/vehicles", icon: Truck, label: "Vehicles" },
    { href: "/rewards", icon: Trophy, label: "Rewards" },
  ];

  const bottomItems = [
    { href: "/profile", icon: User, label: "Profile" },
  ];

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Truck className="text-white" size={24} />
          </div>
          <div>
            <p className="text-gray-900 font-bold text-lg">Cargo Credible</p>
          </div>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigationItems.map((item) => (
          <SidebarItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
          />
        ))}
      </nav>

      {/* Bottom Navigation */}
      <div className="p-4 border-t border-gray-200 space-y-1">
        {bottomItems.map((item) => (
          <SidebarItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
          />
        ))}
        <SidebarItem
          icon={LogOut}
          label="Sign Out"
          onClick={handleSignOut}
        />
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 bg-white border-2 border-gray-200 rounded-lg shadow-md hover:bg-gray-50 transition-colors"
        aria-label="Open menu"
      >
        <Menu size={24} className="text-gray-700" />
      </button>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex lg:flex-col fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 ${className}`}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="lg:hidden fixed inset-0 bg-gray-900/30 backdrop-blur-sm z-40"
            onClick={() => setIsMobileOpen(false)}
          />

          {/* Sidebar Drawer */}
          <aside className="lg:hidden flex flex-col fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-50 shadow-2xl">
            {/* Close Button */}
            <div className="flex justify-end p-4">
              <button
                onClick={() => setIsMobileOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close menu"
              >
                <X size={24} className="text-gray-700" />
              </button>
            </div>

            <SidebarContent />
          </aside>
        </>
      )}
    </>
  );
}
