"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useState, FormEvent } from "react";

interface FormErrors {
  username?: string;
  password?: string;
}

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }
    
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // Here you would typically make an API call
      console.log(formData);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Notification Banner */}
      <div className="bg-blue-700 text-white p-3">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm">
            Now you can log in using your email address instead of a username. Click the Log In with Email button.{" "}
            <Link href="/learn-more" className="underline hover:text-blue-200">
              Learn more
            </Link>
            .
          </p>
        </div>
      </div>

      {/* Split Screen Container */}
      <div className="flex min-h-[calc(100vh-48px)]">
        {/* Left Side - Login */}
        <div className="w-1/2 bg-gray-50 p-8 flex items-center justify-center">
          <div className="w-full max-w-md">
            <Card className="bg-white shadow-sm">
              <CardContent className="p-6 space-y-6">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                  <div className="text-4xl font-bold text-blue-600">
                    Nov<span className="text-cyan-500">Azure</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Username Input */}
                  <div>
                    <label className="block text-sm mb-1">Username</label>
                    <Input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className={`w-full border rounded ${
                        errors.username ? "border-red-500" : ""
                      }`}
                    />
                    {errors.username && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.username}
                      </p>
                    )}
                  </div>

                  {/* Password Input */}
                  <div>
                    <label className="block text-sm mb-1">Password</label>
                    <Input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className={`w-full border rounded ${
                        errors.password ? "border-red-500" : ""
                      }`}
                    />
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Login Button */}
                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? "Logging in..." : "Log In"}
                  </Button>

                  {/* Remember Me */}
                  <div className="flex items-center">
                    <Checkbox 
                      id="rememberMe" 
                      checked={formData.rememberMe}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, rememberMe: checked as boolean })
                      }
                      className="h-4 w-4"
                    />
                    <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-600">
                      Remember me
                    </label>
                  </div>

                  {/* Links */}
                  <div className="flex justify-between text-sm text-blue-600">
                    <Link href="/forgot-password" className="hover:underline">
                      Forgot Your Password?
                    </Link>
                    <Link href="/custom-domain" className="hover:underline">
                      Use Custom Domain
                    </Link>
                  </div>

                  {/* Divider */}
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">or</span>
                    </div>
                  </div>

                  {/* Email Login Button */}
                  <Button
                    type="button"
                    className="w-full flex items-center justify-center bg-blue-600 text-white"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    Log In with Email
                  </Button>
                </form>

                {/* Try for Free */}
                <div className="text-center mt-6">
                  <span className="text-sm text-gray-600">Not a customer? </span>
                  <Link 
                    href="/try-free" 
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Try for Free
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Side - Webinar Registration */}
        <div className="w-1/2 bg-white p-8 flex items-center">
          <div className="w-full max-w-2xl mx-auto space-y-6">
            <h1 className="text-4xl font-bold text-[#002D5C]">
              Join the NovAzure Ecosystem
            </h1>
            
            <p className="text-xl text-gray-700">
              Empower Your Team With Smart AI-Driven Features.
            </p>

            {/* Webinar Image */}
            <div className="relative h-80 w-full bg-gradient-to-br from-blue-100 to-cyan-50 rounded-lg flex items-center justify-center">
              <div className="text-6xl font-bold text-blue-600">
                Nov<span className="text-cyan-500">Azure</span>
              </div>
            </div>

            {/* Register Button */}
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-6"
            >
              Register now
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}