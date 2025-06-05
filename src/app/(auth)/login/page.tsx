"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useState, FormEvent } from "react";
import Image from "next/image";

interface FormErrors {
  username?: string;
  password?: string;
}

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

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
    <div className="min-h-screen flex flex-col">
      {/* Notification Banner */}
      <div className="bg-[#0A4DA2] text-white p-3">
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
      <div className="flex flex-grow">
        {/* Left Side - Login */}
        <div className="w-1/2 bg-gray-50 p-8 flex items-center justify-center">
          <div className="w-full max-w-md">
            <Card className="bg-white shadow-sm">
              <CardContent className="p-6 space-y-6">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                  <Image
                    src="/novazure-logo.png"
                    alt="NovAzure"
                    width={200}
                    height={80}
                    priority
                    className="h-12 w-auto"
                  />
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Username Input */}
                  <div>
                    <label className="block text-sm mb-1 text-gray-700">Username</label>
                    <Input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className={`w-full border rounded ${
                        errors.username ? "border-red-500" : "border-gray-200"
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
                    <label className="block text-sm mb-1 text-gray-700">Password</label>
                    <Input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className={`w-full border rounded ${
                        errors.password ? "border-red-500" : "border-gray-200"
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
                    className="w-full bg-[#0A4DA2] hover:bg-[#083d82] text-white"
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
                      className="h-4 w-4 border-gray-300 text-[#0A4DA2]"
                    />
                    <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-600">
                      Remember me
                    </label>
                  </div>

                  {/* Links */}
                  <div className="flex justify-between text-sm">
                    <Link href="/forgot-password" className="text-[#0A4DA2] hover:text-[#083d82]">
                      Forgot Your Password?
                    </Link>
                    <Link href="/custom-domain" className="text-[#0A4DA2] hover:text-[#083d82]">
                      Use Custom Domain
                    </Link>
                  </div>

                  {/* Divider */}
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">or</span>
                    </div>
                  </div>

                  {/* Email Login Button */}
                  <Button
                    type="button"
                    className="w-full flex items-center justify-center bg-[#0A4DA2] hover:bg-[#083d82] text-white"
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
                    className="text-sm text-[#0A4DA2] hover:text-[#083d82] hover:underline"
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
            <h1 className="text-4xl font-bold text-[#0A4DA2]">
              Join the NovAzure Ecosystem
            </h1>
            
            <p className="text-xl text-gray-700">
              Empower Your Team With Smart AI-Driven Features.
            </p>

            {/* Mission Statement Box */}
            <div className="bg-[#0A4DA2] text-white rounded-2xl p-8 transform hover:scale-[1.01] transition-all duration-300 shadow-lg">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M13 10V3L4 14h7v7l9-11h-7z" 
                    />
                  </svg>
                  <h2 className="text-2xl font-semibold">Empowering Sustainable Innovation</h2>
                </div>
                
                <p className="text-lg text-blue-50">
                  We empower energy, mobility, and tech companies to scale sustainable solutions through:
                </p>

                <div className="flex justify-between items-center pt-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-white/10 rounded-full p-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-lg">Innovation</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="bg-white/10 rounded-full p-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-lg">Digital Transformation</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="bg-white/10 rounded-full p-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-lg">Strategy Consulting</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Register Button */}
            <Button 
              className="w-full bg-[#0A4DA2] hover:bg-[#083d82] text-white text-xl py-6 rounded-xl flex items-center justify-center gap-2 transform hover:scale-[1.02] transition-all duration-300"
            >
              Register now
              <svg
                className="w-6 h-6"
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

      {/* Footer */}
      <footer className="bg-[#0A4DA2] text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Offerings Column */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Offerings</h3>
              <ul className="space-y-2">
                <li><Link href="https://www.google.com" className="hover:text-gray-300">Start-ups & Scale-ups</Link></li>
                <li><Link href="https://www.google.com" className="hover:text-gray-300">Investors</Link></li>
                <li><Link href="https://www.google.com" className="hover:text-gray-300">Corporates</Link></li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="https://www.google.com" className="hover:text-gray-300">About Us</Link></li>
                <li><Link href="https://www.google.com" className="hover:text-gray-300">Customer Stories</Link></li>
                <li><Link href="https://www.google.com" className="hover:text-gray-300">Clients & Partners</Link></li>
                <li><Link href="https://www.google.com" className="hover:text-gray-300">News & Events</Link></li>
                <li><Link href="https://www.google.com" className="hover:text-gray-300">Contact Us</Link></li>
              </ul>
            </div>

            {/* Newsletter Signup */}
            <div className="md:col-span-2">
              <h3 className="text-xl font-semibold mb-4">Sign up to get the latest news and insights</h3>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter Your Email Address Here"
                  className="flex-grow px-4 py-2 rounded text-black"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button className="bg-white text-[#0A4DA2] px-6 py-2 rounded hover:bg-gray-100">
                  Submit
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="mt-8 pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <Image
                src="/novazure-logo.png"
                alt="NovAzure Logo"
                width={180}
                height={60}
                className="h-12 w-auto brightness-0 invert"
                priority
              />
              <span className="text-sm">© 2025 NovAzure</span>
              <Link href="https://www.google.com" className="text-sm hover:text-gray-300">Legal</Link>
              <span>|</span>
              <Link href="https://www.google.com" className="text-sm hover:text-gray-300">Privacy Policy</Link>
            </div>

            <div className="flex gap-4 items-center">
              {/* Social Links */}
              <Link href="mailto:contact@novazure.com" className="hover:text-gray-300">
                <span className="sr-only">Email</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </Link>
              <Link href="https://www.google.com" className="hover:text-gray-300">
                <span className="sr-only">Twitter</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </Link>
              <Link href="https://www.google.com" className="hover:text-gray-300">
                <span className="sr-only">LinkedIn</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </Link>
              <button 
                onClick={scrollToTop}
                className="bg-white text-[#0A4DA2] p-2 rounded-full hover:bg-gray-100"
                aria-label="Scroll to top"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}