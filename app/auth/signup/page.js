"use client";
import React from "react";
import Navbar from "@/components/Navbar/Navbar";
import SignUpForm from "@/components/Auth/SignUpForm";

export default function SignUpPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <SignUpForm />
        </div>
      </div>
    </>
  );
}
