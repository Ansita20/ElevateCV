import { GraduationCap, Plus, X } from "lucide-react";

const EducationForm = ({ data, onChange }) => {
  const handleAdd = () => {
    onChange([
      ...data,
      { institution: "", degree: "", field: "", graduation_date: "", gpa: "" },
    ]);
  };

  const handleRemove = (index) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const handleChange = (index, field, value) => {
    const updated = data.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            Education
          </h3>
          <p className="text-sm text-gray-500">Add your education history</p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors text-sm"
        >
          <Plus className="size-4" />
          Add Education
        </button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <GraduationCap className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No education added yet.</p>
          <p>Click "Add Education" to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((education, index) => (
            <div key={index} className="border border-gray-300 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-md font-medium text-gray-900">
                  {education.degree || "Degree"}
                </h4>
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <X className="size-4" />
                </button>
              </div>

              <input
                type="text"
                value={education.institution || ""}
                onChange={(e) => handleChange(index, "institution", e.target.value)}
                placeholder="Institution"
                className="w-full mb-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm"
              />
              <input
                type="text"
                value={education.degree || ""}
                onChange={(e) => handleChange(index, "degree", e.target.value)}
                placeholder="Degree"
                className="w-full mb-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm"
              />
              <input
                type="text"
                value={education.field || ""}
                onChange={(e) => handleChange(index, "field", e.target.value)}
                placeholder="Field of Study"
                className="w-full mb-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={education.graduation_date || ""}
                  onChange={(e) => handleChange(index, "graduation_date", e.target.value)}
                  placeholder="Graduation date (e.g., May 2023)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm"
                />
                <input
                  type="text"
                  value={education.gpa || ""}
                  onChange={(e) => handleChange(index, "gpa", e.target.value)}
                  placeholder="GPA (optional)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EducationForm;