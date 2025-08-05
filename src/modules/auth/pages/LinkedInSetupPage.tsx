import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Copy,
  Check,
  AlertCircle,
  Chrome,
  Siren as Firefox,
  Monitor,
  Shield,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { apiService } from "../../../services/api";
import { useAuth } from "../services/AuthContext";

const LinkedInSetupPage: React.FC = () => {
  const [cookie, setCookie] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCookie, setShowCookie] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const [accessChecking, setAccessChecking] = useState(true); // Add this
  const { checkAuth, isAuthenticated, user } = useAuth();
  const [isCookieTested, setIsCookieTested] = useState(false);

  // useEffect(() => {
  //   const verifyAccess = async () => {
  //     try {
  //       const res = await apiService.verifyLinkedInAccess();
  //       console.log("res", res);
  //       if (!res?.data?.isAuthenticated) {
  //         // window.location.href = "/login"; // Or use navigate("/login")
  //         navigate("/login");
  //       } else if (res.data?.canAccessDashboard) {
  //         navigate("/dashboard"); // ✅ Already completed setup
  //       } else {
  //         setAccessChecking(false); // Access granted
  //       }
  //     } catch (err) {
  //       // window.location.href = "/login";
  //       navigate("/login");
  //     }
  //   };

  //   verifyAccess();
  // }, []);

  useEffect(() => {
    console.log("user?", user);
    if (!loading) {
      if (!isAuthenticated) {
        navigate("/login");
      } else if (user?.permission?.canAccessDashboard) {
        navigate("/dashboard");
      } else {
        setAccessChecking(false); // Continue on LinkedIn setup
      }
    }
  }, [loading, isAuthenticated, user]);

  const validateCookie = (cookieValue: string): boolean => {
    // Basic validation for LinkedIn li_at cookie format
    return cookieValue.length > 50 && /^[A-Za-z0-9\-_.=]+$/.test(cookieValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isCookieTested) {
      setError("Please test the cookie before submitting.");
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.submitLinkedInCookie(cookie.trim());
      if (response.data?.success) {
        checkAuth(); // Refresh auth state
        navigate("/dashboard");
      } else {
        setError(response.data?.message || "Failed to save cookie.");
      }
    } catch (error) {
      setError("An error occurred while saving the cookie.");
    } finally {
      setLoading(false);
    }
  };

  const handleTestCookie = async () => {
    setError("");
    setIsCookieTested(false);

    if (!cookie.trim()) {
      setError("Please enter a cookie value first");
      return;
    }

    if (!validateCookie(cookie.trim())) {
      setError("Invalid cookie format.");
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.testLinkedInCookie(cookie.trim());
      console.log("response",response)
      if (response.data?.isVerified) {
        setIsCookieTested(true);
        setError(""); // clear previous errors
      } else {
        setError("Cookie validation failed. Please check your cookie value.");
      }
    } catch (error) {
      setError("Error validating cookie. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      id: 1,
      title: "Open LinkedIn",
      description: "Go to LinkedIn.com and make sure you're logged in",
      icon: "🌐",
      action: () => window.open("https://linkedin.com", "_blank"),
    },
    {
      id: 2,
      title: "Open Developer Tools",
      description: 'Press F12 or right-click and select "Inspect"',
      icon: "🔧",
    },
    {
      id: 3,
      title: "Navigate to Application/Storage",
      description: "Find the Application tab (Chrome) or Storage tab (Firefox)",
      icon: "📁",
    },
    {
      id: 4,
      title: "Find Cookies",
      description: "Expand Cookies and click on linkedin.com",
      icon: "🍪",
    },
    {
      id: 5,
      title: "Copy li_at Cookie",
      description: 'Find "li_at" cookie and copy its value',
      icon: "📋",
    },
  ];

  if (accessChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Checking authentication...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <svg
              className="w-12 h-12 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            LinkedIn Integration
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Connect your LinkedIn account to unlock powerful lead generation
            capabilities. Follow our step-by-step guide to securely extract your
            authentication cookie.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Step-by-Step Instructions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Progress Steps */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Setup Steps
                </h2>
                <p className="text-blue-100">Follow these steps in order</p>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {steps.map((step, index) => (
                    <div
                      key={step.id}
                      className={`flex items-start space-x-4 p-4 rounded-xl transition-all duration-300 cursor-pointer ${
                        currentStep === step.id
                          ? "bg-blue-50 border-2 border-blue-200 shadow-md"
                          : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                      }`}
                      onClick={() => setCurrentStep(step.id)}
                    >
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                          currentStep >= step.id
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {currentStep > step.id ? "✓" : step.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {step.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {step.description}
                        </p>
                        {step.action && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              step.action!();
                            }}
                            className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                          >
                            Open LinkedIn →
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Browser Instructions and Cookie Input */}
          <div className="lg:col-span-2 space-y-8">
            {/* <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
                <h2 className="text-2xl font-bold text-white mb-2">Browser Instructions</h2>
                <p className="text-purple-100">Choose your browser for specific steps</p>
              </div>
              
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {browserInstructions.map((browser, index) => (
                    <div key={index} className="group relative overflow-hidden border-2 border-gray-200 rounded-2xl hover:border-gray-300 transition-all duration-300 hover:shadow-lg">
                      <div className={`absolute inset-0 bg-gradient-to-br ${browser.color} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
                      <div className="relative p-6">
                        <div className="flex items-center space-x-3 mb-6">
                          <div className={`p-3 rounded-xl bg-gradient-to-br ${browser.color}`}>
                            <browser.icon className="w-8 h-8 text-white" />
                          </div>
                          <h3 className="text-xl font-bold text-gray-900">{browser.browser}</h3>
                        </div>
                        <ol className="space-y-3">
                          {browser.steps.map((step, stepIndex) => (
                            <li key={stepIndex} className="flex items-start space-x-3">
                              <span className="flex-shrink-0 w-7 h-7 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                                {stepIndex + 1}
                              </span>
                              <span className="text-sm text-gray-700 leading-relaxed">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div> */}

            {/* Visual Guide */}
            {/* <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">What You're Looking For</h3>
                <p className="text-gray-600">Visual guide to finding the li_at cookie</p>
              </div>
              
              <div className="p-8">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border-2 border-dashed border-gray-300">
                  <div className="text-center mb-6">
                    <Monitor className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Developer Tools Preview</h4>
                  </div>
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-inner">
                    <div className="font-mono text-sm space-y-3">
                      <div className="flex items-center space-x-2 text-gray-500">
                        <span>📁</span>
                        <span>Cookies</span>
                      </div>
                      <div className="ml-6 flex items-center space-x-2 text-gray-500">
                        <span>📁</span>
                        <span>https://www.linkedin.com</span>
                      </div>
                      <div className="ml-12 space-y-2">
                        <div className="text-gray-400 py-1">bcookie: AAA...</div>
                        <div className="text-gray-400 py-1">bscookie: v=1...</div>
                        <div className="bg-yellow-100 border-2 border-yellow-300 text-yellow-800 px-3 py-2 rounded-lg font-bold">
                          li_at: AQEDAReallyLongCookieValueHere123...
                        </div>
                        <div className="text-gray-400 py-1">lidc: b=VB...</div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                      Look for the <code className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded font-mono font-bold">li_at</code> cookie and copy its entire value
                    </p>
                  </div>
                </div>
              </div>
            </div> */}

            {/* Cookie Input Form */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6">
                <h3 className="text-2xl font-bold text-white mb-2">
                  Enter Your Cookie
                </h3>
                <p className="text-emerald-100">
                  Paste the li_at cookie value you copied
                </p>
              </div>

              <form onSubmit={handleSubmit} className="p-8">
                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="cookie"
                      className="block text-sm font-bold text-gray-700 mb-3"
                    >
                      LinkedIn Cookie (li_at)
                    </label>
                    <div className="relative">
                      <textarea
                        id="cookie"
                        value={cookie}
                        onChange={(e) => setCookie(e.target.value)}
                        placeholder="AQEDAReallyLongCookieValueHere123..."
                        className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500 focus:border-blue-500 resize-none font-mono text-sm transition-all duration-200"
                        rows={6}
                        required
                        type={showCookie ? "text" : "password"}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCookie(!showCookie)}
                        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showCookie ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 flex items-center space-x-1">
                      <Lock className="w-3 h-3" />
                      <span>
                        The cookie should be a long string of letters, numbers,
                        and symbols
                      </span>
                    </p>
                  </div>

                  {error && (
                    <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                        <p className="text-sm text-red-600 font-medium">
                          {error}
                        </p>
                      </div>
                    </div>
                  )}

                  {isCookieTested && (
                    <div className="p-4 bg-green-50 border-2 border-green-200 rounded-xl mb-2">
                      <div className="flex items-center space-x-3">
                        <Check className="w-6 h-6 text-green-600 flex-shrink-0" />
                        <p className="text-sm text-green-700 font-medium">
                          Cookie is valid. You can proceed to dashboard.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={handleTestCookie}
                      disabled={loading || !cookie.trim()}
                      className="flex-1 bg-gray-100 text-gray-700 font-semibold py-4 px-6 rounded-xl hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      <Check className="w-5 h-5" />
                      <span>Test Cookie</span>
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !cookie.trim()}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <span>Continue to Dashboard</span>
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
                  {/* Security Notice */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Shield className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-green-900 mb-3">
                          Security & Privacy
                        </h4>
                        <ul className="text-sm text-green-800 space-y-2">
                          <li className="flex items-center space-x-2">
                            <Lock className="w-4 h-4" />
                            <span>
                              Your cookie is encrypted and stored securely
                            </span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <Eye className="w-4 h-4" />
                            <span>We only access public LinkedIn data</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <Shield className="w-4 h-4" />
                            <span>GDPR compliant data handling</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <Check className="w-4 h-4" />
                            <span>You can revoke access anytime</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkedInSetupPage;
