"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui";
import { FaCalculator } from "react-icons/fa";

function Navbar() {
  const pathname = usePathname();

  // For now, we'll treat all users as anonymous (auth will be added later)
  const isAuthenticated = false;

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
    <nav className="w-full h-16 sm:h-20 bg-gray-950 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex justify-between items-center">
        {/* Left: Logo + Nav Links */}
        <div className="flex items-center gap-6 sm:gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity">
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
              <Image
                src="/img/icon.png"
                alt="Cargo Credible Logo"
                fill
                className="object-cover"
              />
            </div>
            <div className="hidden sm:block">
              <p className="text-white font-semibold text-base sm:text-lg">Cargo Credible</p>
              <p className="text-xs sm:text-sm text-gray-400 font-light">Freight Rate Calculator</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                    isActive
                      ? "bg-blue-700 text-white"
                      : "text-gray-300 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right: Auth Buttons or User Menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          {isAuthenticated ? (
            // Logged-in: User Menu (will be implemented with auth)
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                variant="secondary"
                className="border-gray-700 text-white hover:bg-gray-800"
              >
                Username ▼
              </Button>
            </div>
          ) : (
            // Anonymous: Sign In + Sign Up buttons
            <>
              <Link href="/auth/signin">
                <Button
                  size="sm"
                  variant="secondary"
                  className="border-gray-700 text-white hover:bg-gray-800 hover:text-white transition-colors"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button
                  size="sm"
                  className="bg-blue-700 hover:bg-blue-600 text-white transition-colors"
                >
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Navigation (bottom sheet or visible links) */}
      <div className="md:hidden border-t border-gray-800 bg-gray-950">
        <div className="flex justify-around items-center py-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 text-xs font-medium transition-colors flex flex-col items-center gap-1 ${
                  isActive ? "text-blue-400" : "text-gray-400 hover:text-white"
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
