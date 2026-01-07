"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui";
import { FaBars, FaTimes } from "react-icons/fa";
import { Truck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  // Only show navigation links when authenticated
  const navLinks = isAuthenticated
    ? [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/rate-calculator", label: "Calculator" },
      ]
    : [];

  return (
    <nav className="w-full h-16 bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex justify-between items-center">
        {/* Left: Logo + Nav Links */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 flex-shrink-0 bg-orange-500 rounded-xl flex items-center justify-center shadow-sm">
              <Truck className="text-white" size={22} />
            </div>
            <div>
              <p className="text-slate-900 font-bold text-lg tracking-tight">Cargo Credible</p>
            </div>
          </Link>

          {/* Navigation Links - Desktop (only when logged in) */}
          {navLinks.length > 0 && (
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-orange-100 text-orange-700"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Auth Buttons + Mobile Menu */}
        <div className="flex items-center gap-3">
          {/* Auth Buttons - Desktop */}
          <div className="hidden sm:flex items-center gap-3">
            {isAuthenticated ? (
              // Logged-in: Show user name and link to dashboard
              <Link href="/dashboard">
                <Button
                  size="sm"
                  variant="secondary"
                  className="border-slate-300 text-slate-700 hover:bg-slate-100"
                >
                  {user?.name || "Dashboard"}
                </Button>
              </Link>
            ) : (
              // Anonymous: Sign In + Sign Up buttons
              <>
                <Link href="/auth/signin">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button
                    size="sm"
                    className="bg-orange-500 hover:bg-orange-600 text-white transition-colors shadow-sm"
                  >
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <div className="px-4 py-4 space-y-2">
            {/* Mobile Nav Links (only when logged in) */}
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                    isActive
                      ? "bg-orange-100 text-orange-700"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Mobile Auth Buttons */}
            {!isAuthenticated && (
              <div className="pt-4 space-y-2 border-t border-slate-200">
                <Link href="/auth/signin" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    size="md"
                    variant="secondary"
                    className="w-full border-slate-300 text-slate-700"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    size="md"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    Get Started Free
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
