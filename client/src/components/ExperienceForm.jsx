import { Plus, Briefcase, X } from "lucide-react";

const ExperienceForm = ({ data, onChange }) => {
  const handleAdd = () => {
    onChange([
      ...data,
      { position: "", company: "", start_date: "", end_date: "", is_current: false, description: "" },
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
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            Experience
          </h3>
          <p className="text-sm text-gray-500">Add your job experience here</p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors text-sm"
        >
          <Plus className="size-4" />
          Add Experience
        </button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No experience added yet.</p>
          <p>Click "Add Experience" to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((experience, index) => (
            <div key={index} className="border border-gray-300 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-md font-medium text-gray-900">
                  {experience.position || "Job Title"}
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
                value={experience.position || ""}
                onChange={(e) => handleChange(index, "position", e.target.value)}
                placeholder="Job Title / Position"
                className="w-full mb-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm"
              />
              <input
                type="text"
                value={experience.company || ""}
                onChange={(e) => handleChange(index, "company", e.target.value)}
                placeholder="Company Name"
                className="w-full mb-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm"
              />
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={experience.start_date || ""}
                  onChange={(e) => handleChange(index, "start_date", e.target.value)}
                  placeholder="Start date (e.g., Jan 2020)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm"
                />
                {!experience.is_current && (
                  <input
                    type="text"
                    value={experience.end_date || ""}
                    onChange={(e) => handleChange(index, "end_date", e.target.value)}
                    placeholder="End date (e.g., Mar 2023)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm"
                  />
                )}
              </div>
              <label className="flex items-center gap-2 mb-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={experience.is_current || false}
                  onChange={(e) => handleChange(index, "is_current", e.target.checked)}
                  className="accent-purple-600"
                />
                Currently working here
              </label>
              <textarea
                value={experience.description || ""}
                onChange={(e) => handleChange(index, "description", e.target.value)}
                placeholder="Describe your responsibilities and achievements..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm resize-none"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExperienceForm;
