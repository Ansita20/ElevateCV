import { Plus, Link2, X } from "lucide-react";

const SUGGESTIONS = ["GitHub", "LeetCode", "Codeforces", "Portfolio", "Twitter"];

const ProfilesForm = ({ data, onChange }) => {
  const handleAdd = (label = "") => {
    onChange([...data, { label, url: "" }]);
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

  const usedLabels = new Set(data.map((item) => (item.label || "").toLowerCase()));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            Links & Profiles
          </h3>
          <p className="text-sm text-gray-500">
            Add clickable links like LeetCode, Codeforces, GitHub, or your portfolio.
          </p>
        </div>
        <button
          type="button"
          onClick={() => handleAdd()}
          className="flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors text-sm"
        >
          <Plus className="size-4" />
          Add Link
        </button>
      </div>

      {SUGGESTIONS.some((s) => !usedLabels.has(s.toLowerCase())) && (
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.filter((s) => !usedLabels.has(s.toLowerCase())).map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => handleAdd(label)}
              className="text-xs px-3 py-1 rounded-full border border-gray-300 text-gray-600 hover:border-purple-400 hover:text-purple-700 transition-colors"
            >
              + {label}
            </button>
          ))}
        </div>
      )}

      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Link2 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No links added yet.</p>
          <p>Click "Add Link" or a suggestion above to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((profile, index) => (
            <div key={index} className="flex items-center gap-2 border border-gray-300 rounded-lg p-3">
              <input
                type="text"
                value={profile.label || ""}
                onChange={(e) => handleChange(index, "label", e.target.value)}
                placeholder="Label (e.g., LeetCode)"
                className="w-40 px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm"
              />
              <input
                type="text"
                value={profile.url || ""}
                onChange={(e) => handleChange(index, "url", e.target.value)}
                placeholder="https://leetcode.com/yourhandle"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm"
              />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="text-red-500 hover:text-red-700 transition-colors shrink-0"
              >
                <X className="size-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfilesForm;
