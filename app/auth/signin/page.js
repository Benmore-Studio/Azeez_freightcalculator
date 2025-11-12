"use client";
import React from "react";
import Navbar from "@/components/Navbar/Navbar";
import SignInForm from "@/components/Auth/SignInForm";

export default function SignInPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <SignInForm />
        </div>
      </div>
    </>
  );
}
