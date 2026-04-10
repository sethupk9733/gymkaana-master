import { useState } from "react";
import { Mail, Lock, Chrome, User, Phone, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { login } from "../lib/api";

interface AdminLoginProps {
    onLogin: () => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await login({ email: formData.email, password: formData.password });
            const token = res.accessToken || res.token;
            const roles = res.roles || (res.role ? [res.role] : []);
            const isAdmin = roles.includes('admin') || res.role === 'admin';

            if (token) {
                if (!isAdmin) {
                    setError('Access denied: You must be an administrator');
                } else {
                    onLogin();
                }
            } else {
                setError(res.message || 'Login failed');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                {/* Header Section */}
                <div className="bg-black px-8 py-8 text-center">
                    <div className="w-16 h-16 bg-[#A3E635] rounded-xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-[#A3E635]/20">
                        <User className="text-black w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-black italic uppercase tracking-tighter text-white">Gymkaana Admin</h1>
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">
                        System Command Center
                    </p>
                </div>

                {/* Form Section */}
                <div className="px-8 py-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 text-center italic uppercase tracking-tight">
                        Administrative Login
                    </h2>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-medium text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Admin Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={18} />
                                <Input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="admin@gymkaana.com"
                                    className="pl-10 h-11 border-gray-200 focus:border-black focus:ring-black/5 bg-gray-50/50"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={18} />
                                <Input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="••••••••"
                                    className="pl-10 h-11 border-gray-200 focus:border-black focus:ring-black/5 bg-gray-50/50"
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-11 bg-black hover:bg-gray-800 text-white font-bold uppercase tracking-widest text-xs transition-all active:scale-[0.98] mt-2 group"
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Access Portal"}
                            {!loading && <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />}
                        </Button>
                    </form>

                    <div className="mt-8 text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                        Authorized personnel only.<br />All access attempts are logged and monitored.
                    </div>
                </div>
            </div>
        </div>
    );
}
