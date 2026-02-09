import React from "react";

const TEMPLATE_OPTIONS = [
  { id: "classic", label: "Classic – Professional" },
  { id: "modern", label: "Modern – Bold" },
  { id: "minimal", label: "Minimal – Clean" },
  { id: "elegant", label: "Elegant – Serif" },
  { id: "sidebar", label: "Sidebar – Two Column" },
  { id: "compact", label: "Compact – One Page" },
  { id: "creative", label: "Creative – Highlighted" },
  { id: "tech", label: "Tech – Developer" },
  { id: "executive", label: "Executive – Premium" },
];

const PersonelInfo = ({ resumeData, setResumeData, navigate }) => {
  const handleChange = (field, value) => {
    setResumeData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));
  };

  return (
    <div className="w-[420px] bg-gray-800 p-6 overflow-y-auto border-r border-gray-700">
      <button
        onClick={() => navigate("/dashboard")}
        className="text-sm text-blue-400 mb-4 hover:underline"
      >
        ← Back to Dashboard
      </button>

      <h2 className="text-xl font-semibold mb-4">Resume Details</h2>

      {[
        ["fullName", "Full Name"],
        ["profession", "Profession"],
        ["email", "Email"],
        ["phone", "Phone"],
        ["location", "Location"],
        ["address", "Address"],
        ["website", "Personal Website"],
        ["linkedin", "LinkedIn"],
      ].map(([key, label]) => (
        <div key={key} className="mb-3">
          <label className="text-sm text-gray-300">{label}</label>
          <input
            value={resumeData.personalInfo[key]}
            onChange={(e) => handleChange(key, e.target.value)}
            className="w-full mt-1 px-3 py-2 rounded bg-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      ))}

      {/* TEMPLATE SELECTOR */}
      <h3 className="text-lg font-semibold mt-6 mb-2">Select Template</h3>
      <ul className="space-y-2">
        {TEMPLATE_OPTIONS.map((tpl) => (
          <li key={tpl.id}>
            <button
              onClick={() =>
                setResumeData((prev) => ({ ...prev, template: tpl.id }))
              }
              className={`w-full text-left px-3 py-2 rounded ${
                resumeData.template === tpl.id
                  ? "bg-blue-600"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {tpl.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PersonelInfo;
