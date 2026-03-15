import { FolderKanban, Plus, X } from "lucide-react";

const ProjectForm = ({ data, onChange }) => {
  const handleAdd = () => {
    onChange([...data, { name: "", type: "", description: "" }]);
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
            Projects
          </h3>
          <p className="text-sm text-gray-500">Add your project details here</p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors text-sm"
        >
          <Plus className="size-4" />
          Add Project
        </button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <FolderKanban className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No projects added yet.</p>
          <p>Click "Add Project" to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((project, index) => (
            <div key={index} className="border border-gray-300 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-md font-medium text-gray-900">
                  {project.name || "Project Name"}
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
                value={project.name || ""}
                onChange={(e) => handleChange(index, "name", e.target.value)}
                placeholder="Project Name"
                className="w-full mb-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm"
              />
              <input
                type="text"
                value={project.type || ""}
                onChange={(e) => handleChange(index, "type", e.target.value)}
                placeholder="Project Type (optional)"
                className="w-full mb-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm"
              />
              <textarea
                value={project.description || ""}
                onChange={(e) => handleChange(index, "description", e.target.value)}
                placeholder="Describe your project, your contribution, and outcomes..."
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

export default ProjectForm;