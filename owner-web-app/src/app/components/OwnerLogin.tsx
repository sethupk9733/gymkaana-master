import { useState } from "react";
import { Mail, Lock, Chrome, User, Phone, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface OwnerLoginProps {
  onLogin: () => void;
}

export function OwnerLogin({ onLogin }: OwnerLoginProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API
    setTimeout(() => {
      setLoading(false);
      onLogin(); // Proceed to app for both login and signup for now
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-8 text-center">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl mx-auto mb-4 flex items-center justify-center">
            <User className="text-white w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Gymkaana Owner</h1>
          <p className="text-blue-100 text-sm mt-1">
            {isSignUp ? "Join our partner network" : "Manage your fitness business"}
          </p>
        </div>

        {/* Form Section */}
        <div className="px-8 py-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                    <Input
                      type="text"
                      placeholder="John Doe"
                      className="pl-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 bg-gray-50/50"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Phone Number</label>
                  <div className="relative group">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                    <Input
                      type="tel"
                      placeholder="98765 43210"
                      className="pl-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 bg-gray-50/50"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                <Input
                  type="email"
                  placeholder="name@example.com"
                  className="pl-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 bg-gray-50/50"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                <Input
                  type="password"
                  placeholder="At least 6 characters"
                  className="pl-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 bg-gray-50/50"
                  required
                />
              </div>
            </div>

            {!isSignUp && (
              <div className="text-right">
                <button type="button" className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors">
                  Forgot password?
                </button>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11 bg-gray-900 hover:bg-gray-800 text-white font-medium shadow-lg shadow-gray-200 transition-all active:scale-[0.98] mt-2 group"
              disabled={loading}
            >
              {loading ? "Processing..." : (isSignUp ? "Create Account" : "Sign In")}
              {!loading && <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-400">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <Button
                variant="outline"
                type="button"
                className="w-full h-11 bg-white hover:bg-gray-50 border-gray-200 text-gray-700 font-medium transition-all"
              >
                <Chrome size={18} className="mr-2 text-gray-500" />
                Google
              </Button>
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-gray-600">
            {isSignUp ? "Already have an account? " : "Don't have an account? "}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="font-bold text-blue-600 hover:text-blue-700 hover:underline transition-all"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
