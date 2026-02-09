import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const templates = [
  {
    id: "classic",
    name: "Classic",
    description: "Simple and professional",
    previewColor: "bg-white",
  },
  {
    id: "modern",
    name: "Modern",
    description: "Clean with bold headings",
    previewColor: "bg-slate-100",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Light and elegant",
    previewColor: "bg-gray-50",
  },
];

const TemplateSelector = () => {
  const navigate = useNavigate();
  const { resumeId } = useParams();

  const selectTemplate = (templateId) => {
    navigate(`/app/builder/${resumeId}?template=${templateId}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-8 py-10">
      <h1 className="text-3xl font-semibold mb-2">Choose a Template</h1>
      <p className="text-gray-400 mb-8">
        You can change this anytime later
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            onClick={() => selectTemplate(template.id)}
            className="cursor-pointer rounded-xl bg-gray-800 hover:bg-gray-700 transition p-4"
          >
            {/* Preview */}
            <div
              className={`h-48 rounded-lg mb-4 ${template.previewColor} flex items-center justify-center text-gray-800`}
            >
              <span className="text-sm font-semibold">
                {template.name} Preview
              </span>
            </div>

            <h2 className="text-lg font-medium">{template.name}</h2>
            <p className="text-sm text-gray-400">
              {template.description}
            </p>
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate(-1)}
        className="mt-10 text-indigo-400 hover:underline"
      >
        ← Back
      </button>
    </div>
  );
};

export default TemplateSelector;
