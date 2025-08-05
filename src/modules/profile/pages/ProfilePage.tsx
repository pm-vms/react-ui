import React, { useState, useEffect } from "react";
import {
  Camera,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building,
  User,
  Save,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { apiService } from "../services/api";
 
export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [avatarNameSeed, setAvatarNameSeed] = useState("User");
 
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    location: "",
    linkedin_bio: "",
    createdAt: "",
    website: "",
  });
 
  const [errors, setErrors] = useState<Record<string, string>>({});
 
  useEffect(() => {
    const fetchProfile = async () => {
      if (user?.id) {
        const res = await apiService.getProfile(user.id);
        if (res.success && res.data) {
          setFormData({
            name: res.data.name || "",
            email: res.data.email || "",
            company: res.data.company || "",
            phone: res.data.phone || "",
            location: res.data.location || "",
            linkedin_bio: res.data.linkedin_bio || "",
            website: res.data.website || "",
            createdAt: res.data.createdAt || new Date().toISOString(),
          });
          setAvatarNameSeed(res.data.name || "User"); // 👈 set initial avatar name
        }
      }
    };
    fetchProfile();
  }, [user]);
 
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // clear error on change
  };
 
  const validate = () => {
    const newErrors: Record<string, string> = {};
 
    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    }
 
    const digitOnly = formData.phone.replace(/\D/g, "");
    if (digitOnly.length !== 10) {
      newErrors.phone = "Phone number must contain exactly 10 digits.";
    }
 
    if (
      formData.website &&
      !/^https?:\/\/(localhost(:\d+)?|[\w.-]+\.[a-z]{2,})(\/.*)?$/i.test(
        formData.website
      )
    ) {
      newErrors.website =
        "Website must start with http:// or https:// and be a valid URL (e.g. https://example.com).";
    }
 
    if (formData.linkedin_bio.length > 1000) {
      newErrors.linkedin_bio = "Bio must be under 1000 characters.";
    }
 
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSave = async () => {
    if (!validate()) return;
    try {
      const { name, company, phone, location, linkedin_bio, website } =
        formData;
      const payload = { name, company, phone, location, linkedin_bio, website };
 
      const res = await apiService.updateProfile(user.id, payload);
 
      if (res.success) {
        console.log("Profile updated:", res.data);
        setIsEditing(false);
        setAvatarNameSeed(formData.name || "User"); // 👈 update avatar seed after save
      } else {
        console.error("Update failed:", res.message);
      }
    } catch (err) {
      console.error("Error saving profile", err);
    }
  };
 
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
        <p className="text-gray-600">
          Manage your personal information and account settings
        </p>
      </div>
 
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 text-center">
            <img
              src={
                user?.avatar ||
                `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                  avatarNameSeed
                )}`
              }
              alt="Profile"
              className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-gray-200"
            />
            <h2 className="text-xl font-semibold text-gray-900 mt-4">
              {formData.name}
            </h2>
            <p className="text-gray-600">{user?.role}</p>
            <div className="mt-3 text-sm text-gray-600">
              <div>
                <Building className="inline w-4 h-4 mr-1" /> {formData.company}
              </div>
              <div>
                <Mail className="inline w-4 h-4 mr-1" /> {formData.email}
              </div>
              <div>
                <Calendar className="inline w-4 h-4 mr-1" /> Joined{" "}
                {new Date(formData.createdAt || "").toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
 
        {/* Editable Info */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between border-b pb-4 mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Personal Information
            </h2>
            {/* <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-blue-600 hover:text-blue-700"
            >
              {isEditing ? "Cancel" : "Edit"}
            </button> */}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                isEditing
                  ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {isEditing ? "Cancel" : "Edit"}
            </button>
          </div>
 
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {["name", "company", "phone", "location", "website"].map(
              (field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    type="text"
                    name={field}
                    value={formData[field as keyof typeof formData]}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
                  />
                  {errors[field] && (
                    <p className="text-sm text-red-600 mt-1">{errors[field]}</p>
                  )}
                </div>
              )
            )}
 
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
              />
            </div>
          </div>
 
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              name="linkedin_bio"
              value={formData.linkedin_bio}
              onChange={handleInputChange}
              rows={4}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
            />
            {errors.linkedin_bio && (
              <p className="text-sm text-red-600 mt-1">{errors.linkedin_bio}</p>
            )}
          </div>
 
          {isEditing && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2"
              >
                <Save className="w-5 h-5" />
                <span>Save Changes</span>
              </button>
            </div>
          )}
        </div>
      </div>
 
      {/* Account Statistics (unchanged) */}
      {/* Account Statistics */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Leads</p>
              <p className="text-2xl font-bold text-gray-900">12,847</p>
            </div>
          </div>
        </div>
 
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Campaigns</p>
              <p className="text-2xl font-bold text-gray-900">24</p>
            </div>
          </div>
        </div>
 
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <MapPin className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">87%</p>
            </div>
          </div>
        </div>
 
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Phone className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Hours Saved</p>
              <p className="text-2xl font-bold text-gray-900">342</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};