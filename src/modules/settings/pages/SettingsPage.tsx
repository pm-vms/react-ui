import React, { useState, useEffect } from "react";
import {
  Save,
  Bell,
  Shield,
  Database,
  Zap,
  Globe,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  RefreshCw,
  Clock,
  Users,
  Target,
  Settings as SettingsIcon,
  Lock,
  Wifi,
  Activity,
  Filter,
  Download,
  Upload,
  Mail,
  Smartphone,
  Monitor,
  Chrome,
  Timer,
  Layers,
  BarChart3,
  TrendingUp,
  Pause,
  Play,
  RotateCcw,
} from "lucide-react";
import apiService from "../services/api";
import { useAuth } from "../contexts/AuthContext";

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    notifications: {
      emailNotifications: true,
      pushNotifications: false,
      workflowUpdates: true,
      dailyReports: true,
      leadAlerts: true,
      systemUpdates: false,
    },
    scraping: {
      rateLimitDelay: 2000,
      maxRetries: 3,
      timeout: 30000,
      batchSize: 50,
      concurrentRequests: 5,
      autoRetry: true,
      respectRobotsTxt: true,
      userAgent: "LinkedIn Sales Navigator Bot v1.0",
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 24,
      ipWhitelist: "",
      encryptData: true,
      auditLogs: true,
    },
    general: {
      timezone: "UTC",
      dateFormat: "MM/DD/YYYY",
      language: "en",
      theme: "light",
      autoSave: true,
    },
    linkedin: {
      cookieStatus: "valid", // 'valid', 'invalid', 'expired'
      lastUpdated: "2025-01-16T10:30:00Z",
      cookieValue: "AQEDAReallyLongCookieValueHere123...",
    },
    advanced: {
      dataRetention: 90,
      exportFormat: "csv",
      apiRateLimit: 1000,
      cacheEnabled: true,
      debugMode: false,
      logLevel: "info",
    },
  });



  const [showCookie, setShowCookie] = useState(true);
  const [cookieInput, setCookieInput] = useState("");
  const [testingCookie, setTestingCookie] = useState(false);
  const [cookieTestResult, setCookieTestResult] = useState<
    "success" | "error" | null
  >(null);
  const [cookieSaved, setCookieSaved] = useState(false); // ✅ New flag for saved status
  const [activeTab, setActiveTab] = useState("linkedin");

  // Add these new state variables near other state definitions
  const [error, setError] = useState("");
  const [isCookieTested, setIsCookieTested] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateCookie = (cookieValue: string): boolean => {
    // Basic validation for LinkedIn li_at cookie format
    return cookieValue.length > 50 && /^[A-Za-z0-9\-_.=]+$/.test(cookieValue);
  };


  const updateSetting = (category: string, key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value,
      },
    }));
  };

  const handleTestCookie = async () => {
    console.log("Testing cookie:1111111111111111111111111");
    setError("");
    setIsCookieTested(false);
    setCookieTestResult(null);
    setCookieSaved(false);

    if (!cookieInput.trim()) {
      setError("Please enter a cookie value first");
      return;
    }

    if (!validateCookie(cookieInput.trim())) {
      setError("Invalid cookie format.");
      setCookieTestResult("error");
      return;
    }

    setLoading(true);
    setTestingCookie(true);
    
    try {
      console.log("Testing cookie:", cookieInput.trim());
      const response = await apiService.testLinkedInCookie(cookieInput.trim());
      console.log("response", response);
      if (response.data?.isVerified) {
        setCookieTestResult("success");
        setIsCookieTested(true);
        setError(""); // clear previous errors
      
        // Update the settings with the new valid cookie
        updateSetting("linkedin", "cookieStatus", "valid");
        updateSetting("linkedin", "cookieValue", cookieInput);
        updateSetting("linkedin", "lastUpdated", new Date().toISOString());
      } else {
        setCookieTestResult("error");
        setError("Cookie validation failed. Please check your cookie value.");
      }
    } catch (error) {
      setCookieTestResult("error");
      setError("Error validating cookie. Try again.");
      console.error("Cookie validation error:", error);
    } finally {
      setLoading(false);
      setTestingCookie(false);
    }
  };

  const handleSave = async () => {
    if (cookieTestResult === "success" && isCookieTested) {
      try {
        // Call API to update the cookie in the database
        const response = await apiService.updateLinkedInCookie( cookieInput.trim(),'valid');
        
        if (response.success) {
          setCookieSaved(true);
          console.log("Settings saved:", settings);
          // You could add a toast notification here if you have a toast library
        } else {
          setCookieSaved(false);
          setError("Failed to save cookie to database.");
          console.error("Cookie save error:", response);
        }
      } catch (err) {
        setCookieSaved(false);
        setError("Error saving cookie. Please try again.");
        console.error("Cookie save error:", err);
      }
    } else {
      setCookieSaved(false);
      setError("Please test the cookie before saving.");
    }
  };

  const tabs = [
    {
      id: "linkedin",
      label: "LinkedIn",
      icon: Chrome,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      id: "scraping",
      label: "Scraping",
      icon: Zap,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
    {
      id: "security",
      label: "Security",
      icon: Shield,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      id: "advanced",
      label: "Advanced",
      icon: SettingsIcon,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
    },
    {
      id: "general",
      label: "General",
      icon: Globe,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "valid":
        return "text-green-600 bg-green-50 border-green-200";
      case "expired":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "invalid":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  // Function to fetch the LinkedIn cookie data when the component mounts
  useEffect(() => {
      const fetchCookieData = async () => {
        try {
          setLoading(true);
          if (user?.id) {
            const response = await apiService.getProfile(user.id);
            
            if (response.success && response.data) {
              const { linkedinCookie, cookieStatus, lastCookieUpdate } = response.data;
              
              // Update the LinkedIn settings with fetched data
              updateSetting("linkedin", "cookieValue", linkedinCookie || "");
              updateSetting("linkedin", "cookieStatus", cookieStatus || "invalid");
              updateSetting("linkedin", "lastUpdated", lastCookieUpdate || new Date().toISOString());
              
              // If there's a valid cookie, update the input field and hide it
              if (linkedinCookie) {
                setCookieInput(linkedinCookie);
                setShowCookie(false); // Hide the cookie value by default for security
              }
            }
          }
        } catch (error) {
          console.error("Failed to fetch cookie data:", error);
          // Keep existing values or set to invalid if fetch fails
          updateSetting("linkedin", "cookieStatus", "invalid");
        } finally {
          setLoading(false);
        }
      };
      fetchCookieData();
    }, []);
   


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-full	 mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Settings
              </h1>
              <p className="text-gray-600">
                Manage your account preferences and application settings
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-full	 mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Left Sidebar - Vertical Tabs */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Categories
                </h2>
              </div>
              <nav className="p-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 mb-1 ${
                      activeTab === tab.id
                        ? `${tab.bgColor} ${tab.borderColor} border-2 ${tab.color} shadow-sm`
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <tab.icon
                      className={`w-5 h-5 ${
                        activeTab === tab.id ? tab.color : "text-gray-400"
                      }`}
                    />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-8">
                {/* LinkedIn Cookie Management */}
                {activeTab === "linkedin" && (
                  <div className="space-y-8">
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                          LinkedIn Integration
                        </h2>
                      </div>

                      {/* Current Status */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Connection Status
                          </h3>
                          <div
                            className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                              settings.linkedin.cookieStatus
                            )}`}
                          >
                            {settings.linkedin.cookieStatus === "valid" && (
                              <Check className="w-4 h-4 inline mr-1" />
                            )}
                            {settings.linkedin.cookieStatus === "expired" && (
                              <Clock className="w-4 h-4 inline mr-1" />
                            )}
                            {settings.linkedin.cookieStatus === "invalid" && (
                              <AlertCircle className="w-4 h-4 inline mr-1" />
                            )}
                            {settings.linkedin.cookieStatus
                              .charAt(0)
                              .toUpperCase() +
                              settings.linkedin.cookieStatus.slice(1)}
                          </div>
                        </div>
                        <p className="text-gray-600 mb-4">
                          Last updated:{" "}
                          {new Date(
                            settings.linkedin.lastUpdated
                          ).toLocaleString()}
                        </p>

                        {settings.linkedin.cookieStatus === "valid" && (
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2 text-green-600">
                              <Wifi className="w-4 h-4" />
                              <span className="text-sm font-medium">
                                Connected to LinkedIn
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 text-blue-600">
                              <Activity className="w-4 h-4" />
                              <span className="text-sm font-medium">
                                Ready for scraping
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Cookie Management */}
                      <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Update LinkedIn Cookie
                        </h3>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              LinkedIn Cookie (li_at)
                            </label>

                            <div className="relative">
                              <textarea
                                value={cookieInput}
                                onChange={(e) => setCookieInput(e.target.value)}
                                placeholder="Paste your LinkedIn cookie here..."
                                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm ${
                                  !showCookie ? "blur-sm" : ""
                                }`}
                                disabled={cookieSaved}
                                rows={4}
                              />
                              <button
                                type="button"
                                onClick={() => setShowCookie(!showCookie)}
                                className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                              >
                                {showCookie ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </div>
                          {/* Status Message */}
                          {cookieTestResult && !cookieSaved && (
                            <div
                              className={`p-4 rounded-lg border ${
                                cookieTestResult === "success"
                                  ? "bg-green-50 border-green-200 text-green-800"
                                  : "bg-red-50 border-red-200 text-red-800"
                              }`}
                            >
                              <div className="flex items-center space-x-2">
                                {cookieTestResult === "success" ? (
                                  <Check className="w-5 h-5" />
                                ) : (
                                  <AlertCircle className="w-5 h-5" />
                                )}
                                <span className="font-medium">
                                  {cookieTestResult === "success"
                                    ? "Cookie is valid and ready to use"
                                    : "Cookie validation failed. Please check your cookie value."}
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Button Group */}
                          <div className="flex space-x-3 mt-4">
                            {/* Show Test Button when not validated or failed */}
                            {(!cookieTestResult ||
                              cookieTestResult === "error") && (
                              <button
                                onClick={handleTestCookie}
                                disabled={!cookieInput.trim() || testingCookie}
                                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                              >
                                {testingCookie ? (
                                  <RefreshCw className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Check className="w-4 h-4" />
                                )}
                                <span>Test Cookie</span>
                              </button>
                            )}

                            {/* Show Save button only if test was success and not already saved */}
                            {cookieTestResult === "success" && !cookieSaved && (
                              <button
                                onClick={handleSave}
                                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Save className="w-5 h-5" />
                                <span>Save Cookie & Process</span>
                              </button>
                            )}
                          </div>

                          {/* Success Message After Save */}
                          {cookieSaved && (
                            <div className="p-4 bg-green-50 border-2 border-green-200 rounded-xl mt-4">
                              <div className="flex items-center space-x-3">
                                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                                <p className="text-sm text-green-600 font-medium">
                                  Cookie saved successfully. You can proceed
                                  with scraping.
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-[21px]">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <RefreshCw className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">
                                Auto-Refresh
                              </h4>
                              <p className="text-sm text-gray-600">
                                Enable automatic cookie refresh
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <Shield className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">
                                Secure Storage
                              </h4>
                              <p className="text-sm text-gray-600">
                                Encrypted cookie storage
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                              <Bell className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">
                                Expiry Alerts
                              </h4>
                              <p className="text-sm text-gray-600">
                                Get notified before expiry
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Scraping Configuration */}
                {activeTab === "scraping" && (
                  <div className="space-y-8">
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                          Scraping Configuration
                        </h2>
                        <button
                          onClick={handleSave}
                          className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
                        >
                          <Save className="w-5 h-5" />
                          <span>Save Settings</span>
                        </button>
                      </div>

                      {/* Performance Settings */}
                      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                          <TrendingUp className="w-5 h-5 text-blue-600" />
                          <span>Performance Settings</span>
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Rate Limit Delay (ms)
                            </label>
                            <input
                              type="number"
                              value={settings.scraping.rateLimitDelay}
                              onChange={(e) =>
                                updateSetting(
                                  "scraping",
                                  "rateLimitDelay",
                                  parseInt(e.target.value)
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Delay between requests
                            </p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Max Retries
                            </label>
                            <input
                              type="number"
                              value={settings.scraping.maxRetries}
                              onChange={(e) =>
                                updateSetting(
                                  "scraping",
                                  "maxRetries",
                                  parseInt(e.target.value)
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Retry failed requests
                            </p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Timeout (ms)
                            </label>
                            <input
                              type="number"
                              value={settings.scraping.timeout}
                              onChange={(e) =>
                                updateSetting(
                                  "scraping",
                                  "timeout",
                                  parseInt(e.target.value)
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Request timeout
                            </p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Batch Size
                            </label>
                            <input
                              type="number"
                              value={settings.scraping.batchSize}
                              onChange={(e) =>
                                updateSetting(
                                  "scraping",
                                  "batchSize",
                                  parseInt(e.target.value)
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Profiles per batch
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Advanced Scraping Options */}
                      <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                          <Layers className="w-5 h-5 text-purple-600" />
                          <span>Advanced Options</span>
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Concurrent Requests
                            </label>
                            <input
                              type="number"
                              value={settings.scraping.concurrentRequests}
                              onChange={(e) =>
                                updateSetting(
                                  "scraping",
                                  "concurrentRequests",
                                  parseInt(e.target.value)
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              User Agent
                            </label>
                            <input
                              type="text"
                              value={settings.scraping.userAgent}
                              onChange={(e) =>
                                updateSetting(
                                  "scraping",
                                  "userAgent",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>

                        <div className="mt-6 space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <label className="text-sm font-medium text-gray-700">
                                Auto Retry Failed Requests
                              </label>
                              <p className="text-xs text-gray-500">
                                Automatically retry failed scraping attempts
                              </p>
                            </div>
                            <input
                              type="checkbox"
                              checked={settings.scraping.autoRetry}
                              onChange={(e) =>
                                updateSetting(
                                  "scraping",
                                  "autoRetry",
                                  e.target.checked
                                )
                              }
                              className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <label className="text-sm font-medium text-gray-700">
                                Respect robots.txt
                              </label>
                              <p className="text-xs text-gray-500">
                                Follow website scraping guidelines
                              </p>
                            </div>
                            <input
                              type="checkbox"
                              checked={settings.scraping.respectRobotsTxt}
                              onChange={(e) =>
                                updateSetting(
                                  "scraping",
                                  "respectRobotsTxt",
                                  e.target.checked
                                )
                              }
                              className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notifications */}
                {activeTab === "notifications" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">
                        Notification Preferences
                      </h2>
                      <button
                        onClick={handleSave}
                        className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
                      >
                        <Save className="w-5 h-5" />
                        <span>Save Settings</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                          <Mail className="w-5 h-5 text-blue-600" />
                          <span>Email Notifications</span>
                        </h3>

                        <div className="space-y-4">
                          {Object.entries(settings.notifications).map(
                            ([key, value]) => (
                              <div
                                key={key}
                                className="flex items-center justify-between"
                              >
                                <div>
                                  <label className="text-sm font-medium text-gray-700 capitalize">
                                    {key.replace(/([A-Z])/g, " $1").trim()}
                                  </label>
                                  <p className="text-xs text-gray-500">
                                    {key === "emailNotifications" &&
                                      "Receive updates via email"}
                                    {key === "pushNotifications" &&
                                      "Browser push notifications"}
                                    {key === "workflowUpdates" &&
                                      "Workflow status changes"}
                                    {key === "dailyReports" &&
                                      "Daily summary reports"}
                                    {key === "leadAlerts" &&
                                      "New lead notifications"}
                                    {key === "systemUpdates" &&
                                      "System maintenance alerts"}
                                  </p>
                                </div>
                                <input
                                  type="checkbox"
                                  checked={value as boolean}
                                  onChange={(e) =>
                                    updateSetting(
                                      "notifications",
                                      key,
                                      e.target.checked
                                    )
                                  }
                                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                          <Smartphone className="w-5 h-5 text-green-600" />
                          <span>Delivery Methods</span>
                        </h3>

                        <div className="space-y-4">
                          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <Mail className="w-5 h-5 text-blue-600" />
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  Email
                                </h4>
                                <p className="text-sm text-gray-600">
                                  anshul.upadhyay@47billion.com
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <Smartphone className="w-5 h-5 text-green-600" />
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  Push Notifications
                                </h4>
                                <p className="text-sm text-gray-600">
                                  Browser notifications enabled
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security */}
                {activeTab === "security" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">
                        Security Settings
                      </h2>
                      <button
                        onClick={handleSave}
                        className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
                      >
                        <Save className="w-5 h-5" />
                        <span>Save Settings</span>
                      </button>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-sm font-medium text-gray-700">
                              Two-Factor Authentication
                            </label>
                            <p className="text-xs text-gray-500">
                              Add an extra layer of security
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            checked={settings.security.twoFactorAuth}
                            onChange={(e) =>
                              updateSetting(
                                "security",
                                "twoFactorAuth",
                                e.target.checked
                              )
                            }
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Session Timeout (hours)
                          </label>
                          <input
                            type="number"
                            value={settings.security.sessionTimeout}
                            onChange={(e) =>
                              updateSetting(
                                "security",
                                "sessionTimeout",
                                parseInt(e.target.value)
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            IP Whitelist
                          </label>
                          <textarea
                            value={settings.security.ipWhitelist}
                            onChange={(e) =>
                              updateSetting(
                                "security",
                                "ipWhitelist",
                                e.target.value
                              )
                            }
                            placeholder="Enter IP addresses separated by commas"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={3}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-sm font-medium text-gray-700">
                              Data Encryption
                            </label>
                            <p className="text-xs text-gray-500">
                              Encrypt stored data
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            checked={settings.security.encryptData}
                            onChange={(e) =>
                              updateSetting(
                                "security",
                                "encryptData",
                                e.target.checked
                              )
                            }
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-sm font-medium text-gray-700">
                              Audit Logs
                            </label>
                            <p className="text-xs text-gray-500">
                              Track user activities
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            checked={settings.security.auditLogs}
                            onChange={(e) =>
                              updateSetting(
                                "security",
                                "auditLogs",
                                e.target.checked
                              )
                            }
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Advanced */}
                {activeTab === "advanced" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">
                        Advanced Settings
                      </h2>
                      <button
                        onClick={handleSave}
                        className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
                      >
                        <Save className="w-5 h-5" />
                        <span>Save Settings</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Data Management
                        </h3>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Data Retention (days)
                            </label>
                            <input
                              type="number"
                              value={settings.advanced.dataRetention}
                              onChange={(e) =>
                                updateSetting(
                                  "advanced",
                                  "dataRetention",
                                  parseInt(e.target.value)
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Export Format
                            </label>
                            <select
                              value={settings.advanced.exportFormat}
                              onChange={(e) =>
                                updateSetting(
                                  "advanced",
                                  "exportFormat",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="csv">CSV</option>
                              <option value="json">JSON</option>
                              <option value="xlsx">Excel</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          System Settings
                        </h3>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              API Rate Limit
                            </label>
                            <input
                              type="number"
                              value={settings.advanced.apiRateLimit}
                              onChange={(e) =>
                                updateSetting(
                                  "advanced",
                                  "apiRateLimit",
                                  parseInt(e.target.value)
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <label className="text-sm font-medium text-gray-700">
                                Cache Enabled
                              </label>
                              <p className="text-xs text-gray-500">
                                Improve performance
                              </p>
                            </div>
                            <input
                              type="checkbox"
                              checked={settings.advanced.cacheEnabled}
                              onChange={(e) =>
                                updateSetting(
                                  "advanced",
                                  "cacheEnabled",
                                  e.target.checked
                                )
                              }
                              className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <label className="text-sm font-medium text-gray-700">
                                Debug Mode
                              </label>
                              <p className="text-xs text-gray-500">
                                Enable detailed logging
                              </p>
                            </div>
                            <input
                              type="checkbox"
                              checked={settings.advanced.debugMode}
                              onChange={(e) =>
                                updateSetting(
                                  "advanced",
                                  "debugMode",
                                  e.target.checked
                                )
                              }
                              className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* General */}
                {activeTab === "general" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">
                        General Settings
                      </h2>
                      <button
                        onClick={handleSave}
                        className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
                      >
                        <Save className="w-5 h-5" />
                        <span>Save Settings</span>
                      </button>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Timezone
                          </label>
                          <select
                            value={settings.general.timezone}
                            onChange={(e) =>
                              updateSetting(
                                "general",
                                "timezone",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="UTC">UTC</option>
                            <option value="EST">Eastern Time</option>
                            <option value="PST">Pacific Time</option>
                            <option value="CST">Central Time</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Date Format
                          </label>
                          <select
                            value={settings.general.dateFormat}
                            onChange={(e) =>
                              updateSetting(
                                "general",
                                "dateFormat",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Language
                          </label>
                          <select
                            value={settings.general.language}
                            onChange={(e) =>
                              updateSetting(
                                "general",
                                "language",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                            <option value="de">German</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Theme
                          </label>
                          <select
                            value={settings.general.theme}
                            onChange={(e) =>
                              updateSetting("general", "theme", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                            <option value="auto">Auto</option>
                          </select>
                        </div>
                      </div>

                      <div className="mt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-sm font-medium text-gray-700">
                              Auto Save
                            </label>
                            <p className="text-xs text-gray-500">
                              Automatically save changes
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            checked={settings.general.autoSave}
                            onChange={(e) =>
                              updateSetting(
                                "general",
                                "autoSave",
                                e.target.checked
                              )
                            }
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};