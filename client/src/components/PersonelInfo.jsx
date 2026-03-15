import React from "react";
import { Mail, User, Phone, MapPin, Briefcase, Linkedin } from "lucide-react";

const PersonelInfoForm = ({ data, onChange, removeBackground, setRemoveBackground }) => {

  const handleChange = (field, value) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  const fields = [
    { key: "fullName", label: "Full Name", icon: User, type: "text", required: true },
    { key: "email", label: "Email Address", icon: Mail, type: "email", required: true },
    { key: "phone", label: "Phone Number", icon: Phone, type: "tel", required: true },
    { key: "location", label: "Location", icon: MapPin, type: "text" },
    { key: "profession", label: "Profession", icon: Briefcase, type: "text" },
    { key: "linkedin", label: "LinkedIn Profile", icon: Linkedin, type: "url" },
    { key: "website", label: "Website", icon: Mail, type: "url" },

  ]

  return (
    <div className="space-y-5">
      <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
      <p className="text-sm text-gray-600">
        Get Started with the personal information
      </p>

      <div className="space-y-5 max-w-xl">
        <div>
          <label htmlFor="imageUpload" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-700 cursor-pointer">
            {data.image ? (
              <img
                src={typeof data.image === "string" ? data.image : URL.createObjectURL(data.image)}
                alt="user-image"
                className="w-16 h-16 rounded-full object-cover ring ring-slate-300 hover:opacity-80"
              />
            ) : (
              <>
                <User className="size-10 p-2.5 border rounded-full" />
                <span className="text-sm font-medium">Upload user image</span>
              </>
            )}

            <input
              id="imageUpload"
              type="file"
              accept="image/jpeg, image/png"
              className="hidden"
              onChange={(e) => handleChange("image", e.target.files[0])}
            />
          </label>

          {typeof data.image === "object" && (
            <div className="flex flex-col gap-1 pt-3 text-sm">
              <p>Remove Background</p>

              <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  onChange={() => setRemoveBackground(prev => !prev)}
                  checked={removeBackground}
                />

                <div className="w-9 h-5 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors duration-200"></div>

                <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4"></span>
              </label>
            </div>
          )}
        </div>

        <div className="space-y-3 w-full">
          {fields.map((field) => {
          const Icon = field.icon;
          return (
            <div key={field.key} className="space-y-1">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <Icon className="size-4" />
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
              </label>
              <input type={field.type} value={data[field.key] || ""} onChange={(e) => handleChange(field.key, e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm"/>
            </div>
          );
        })}
        </div>
      </div>
    </div>
  );
};

export default PersonelInfoForm;