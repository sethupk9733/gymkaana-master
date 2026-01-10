import { Mail, Lock, Chrome } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface OwnerLoginProps {
  onLogin: () => void;
}

export function OwnerLogin({ onLogin }: OwnerLoginProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b-2 border-gray-300 px-6 py-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-300 rounded-lg mx-auto mb-3"></div>
          <h1 className="text-xl">Gymkaana Owner</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your gyms</p>
        </div>
      </div>

      {/* Login Form */}
      <div className="flex-1 px-6 py-8">
        <h2 className="text-lg mb-6">Login to your account</h2>

        <div className="space-y-4">
          {/* Email/Phone Input */}
          <div>
            <label className="block text-sm mb-2 text-gray-600">Email or Phone</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="Enter email or phone"
                className="pl-10 h-12 border-2 border-gray-300"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm mb-2 text-gray-600">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="password"
                placeholder="Enter password"
                className="pl-10 h-12 border-2 border-gray-300"
              />
            </div>
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <button className="text-sm text-gray-600 underline">Forgot password?</button>
          </div>

          {/* Login Button */}
          <Button onClick={onLogin} className="w-full h-12 bg-gray-900 text-white hover:bg-gray-800 mt-2">
            Login
          </Button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-sm text-gray-500">OR</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Continue with Google */}
          <Button
            variant="outline"
            className="w-full h-12 border-2 border-gray-300 bg-white hover:bg-gray-50"
          >
            <Chrome size={18} className="mr-2" />
            Continue with Google
          </Button>
        </div>

        {/* Sign Up Link */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <button className="underline text-gray-900">Sign up</button>
          </p>
        </div>
      </div>
    </div>
  );
}
