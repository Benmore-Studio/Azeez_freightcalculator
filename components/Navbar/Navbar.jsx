"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui";
import { FaCalculator, FaBars, FaTimes } from "react-icons/fa";
import { Truck } from "lucide-react";

function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // For now, we'll treat all users as authenticated for testing (auth will be added later)
  // TODO: Replace with actual auth context in T7
  const isAuthenticated = true;

  const navLinks = isAuthenticated
    ? [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/calculator", label: "Calculator", icon: <FaCalculator size={16} /> },
      ]
    : [
        { href: "/", label: "Home" },
        { href: "/calculator", label: "Calculator", icon: <FaCalculator size={16} /> },
      ];

  return (
    <nav className="w-full h-16 bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex justify-between items-center">
        {/* Left: Logo + Nav Links */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 flex-shrink-0 bg-blue-600 rounded-lg flex items-center justify-center">
              <Truck className="text-white" size={24} />
            </div>
            <div>
              <p className="text-gray-900 font-bold text-lg">Cargo Credible</p>
            </div>
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right: Auth Buttons + Mobile Menu */}
        <div className="flex items-center gap-3">
          {/* Auth Buttons - Desktop */}
          <div className="hidden sm:flex items-center gap-3">
            {isAuthenticated ? (
              // Logged-in: User Menu (will be implemented with auth)
              <Button
                size="sm"
                variant="secondary"
                className="border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Username ▼
              </Button>
            ) : (
              // Anonymous: Sign In + Sign Up buttons
              <>
                <Link href="/auth/signin">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-4 space-y-2">
            {/* Mobile Nav Links */}
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-md text-base font-medium transition-colors ${
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {link.icon}
                    {link.label}
                  </div>
                </Link>
              );
            })}

            {/* Mobile Auth Buttons */}
            {!isAuthenticated && (
              <div className="pt-4 space-y-2 border-t border-gray-200">
                <Link href="/auth/signin" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    size="md"
                    variant="secondary"
                    className="w-full border-gray-300 text-gray-700"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    size="md"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
