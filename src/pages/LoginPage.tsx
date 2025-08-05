import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  ArrowRight,
  Loader2,
  Users,
  Zap,
  BarChart3,
  Globe,
  CheckCircle,
  Star,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const features = [
  {
    icon: Users,
    title: "Smart Lead Generation",
    description:
      "AI-powered lead discovery from LinkedIn with advanced filtering capabilities",
  },
  {
    icon: Zap,
    title: "Automated Workflows",
    description:
      "Set up automated lead generation workflows that run 24/7 in the background",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description:
      "Comprehensive analytics and reporting to track your lead generation performance",
  },
  {
    icon: Globe,
    title: "Multi-Tenant Platform",
    description:
      "Secure, scalable platform designed for teams and organizations of all sizes",
  },
];

export const LoginPage: React.FC = () => {
  const [localLoading, setLocalLoading] = useState(false); // ← your own spinner state
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { verifyIdentity, isAuthenticated, loading, user } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated && user?.permission?.canAccessDashboard) {
      navigate("/dashboard");
    }
  }, [loading, isAuthenticated, user]);

  const handleVerifyIdentity = async () => {
    setLocalLoading(true);
    setError("");

    try {
      const success = await verifyIdentity();
      if (success) {
        console.log("process login");
      } else {
        setError("Authentication failed. Please try again.");
      }
    } catch (error) {
      setError("An error occurred during authentication. Please try again.");
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
      {/* Header */}
      <header className="relative z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">LeadGen Pro</h1>
                <p className="text-xs text-gray-500">Sales Lead Generator</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6 text-sm text-gray-600">
              <span className="flex items-center space-x-1">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Secure Platform</span>
              </span>
              <span className="flex items-center space-x-1">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>GDPR Compliant</span>
              </span>
              <span className="flex items-center space-x-1">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>24/7 Support</span>
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Hero Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                <Star className="w-4 h-4" />
                <span>Trusted by 10,000+ Sales Teams</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Generate
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {" "}
                  Quality Leads{" "}
                </span>
                at Scale
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed">
                The most powerful multi-tenant SAAS platform for automated lead
                generation. Connect with your ideal prospects on LinkedIn using
                AI-powered targeting and automation.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg">
                      <feature.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Login Form */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md">
              {/* Login Card */}
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 backdrop-blur-sm">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Welcome to LeadGen Pro
                  </h2>
                  <p className="text-gray-600">
                    Secure authentication to access your dashboard
                  </p>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <button
                  onClick={handleVerifyIdentity}
                  disabled={localLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 shadow-lg"
                >
                  {localLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5" />
                      <span>Verify Your Identity</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                <div className="mt-6 text-center space-y-2">
                  <p className="text-sm text-gray-500">
                    Secure authentication powered by Keycloak
                  </p>
                  <div className="flex items-center justify-center space-x-4 text-xs text-gray-400">
                    <span className="flex items-center space-x-1">
                      <CheckCircle className="w-3 h-3" />
                      <span>SSL Encrypted</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <CheckCircle className="w-3 h-3" />
                      <span>SOC 2 Compliant</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500 mb-4">
                  New to LeadGen Pro?
                  <span className="text-blue-600 font-medium">
                    {" "}
                    Contact sales for a demo
                  </span>
                </p>
                <div className="flex items-center justify-center space-x-6 text-xs text-gray-400">
                  <span>Free 14-day trial</span>
                  <span>•</span>
                  <span>No credit card required</span>
                  <span>•</span>
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
    </div>
  );
};
