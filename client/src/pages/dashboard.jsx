import React, { useEffect, useState } from "react";
import {
  PlusIcon,
  UploadIcon,
  Trash2Icon,
  FilePenLineIcon,
  XIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const STORAGE_KEY = "resumes";

const Dashboard = () => {
  const navigate = useNavigate();

  const pastelColors = [
    "bg-pink-200",
    "bg-blue-200",
    "bg-green-200",
    "bg-yellow-200",
    "bg-purple-200",
    "bg-orange-200",
  ];

  const [allResumes, setAllResumes] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [resumeName, setResumeName] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);

  /* 🔁 LOAD FROM LOCAL STORAGE */
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) {
      setAllResumes(JSON.parse(stored));
    } else {
      const initial = [
        { id: 1, title: "John Doe Resume" },
        { id: 2, title: "Anita Sharma Resume" },
      ];
      setAllResumes(initial);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    }
  }, []);

  /* 💾 SAVE TO LOCAL STORAGE */
  const saveResumes = (resumes) => {
    setAllResumes(resumes);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resumes));
  };

  /* ➕ CREATE */
  const createResume = () => {
    if (!resumeName.trim()) return;

    const newId = Date.now();
    const updated = [
      ...allResumes,
      { id: newId, title: resumeName.trim() },
    ];

    saveResumes(updated);
    setResumeName("");
    setShowCreateModal(false);
    navigate(`/app/builder/${newId}`);
  };

  /* 📤 UPLOAD */
  const uploadResume = () => {
    if (!resumeName.trim() || !uploadedFile) return;

    const newId = Date.now();
    const updated = [
      ...allResumes,
      {
        id: newId,
        title: resumeName.trim(),
        fileName: uploadedFile.name,
      },
    ];

    saveResumes(updated);
    setResumeName("");
    setUploadedFile(null);
    setShowUploadModal(false);
    navigate(`/app/builder/${newId}`);
  };

  /* ❌ DELETE */
  const deleteResume = (id) => {
    const updated = allResumes.filter((r) => r.id !== id);
    saveResumes(updated);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-10">
      <h1 className="text-3xl font-semibold mb-2">Dashboard</h1>
      <p className="text-gray-300 mb-8">
        Create a new resume or improve an existing one
      </p>

      {/* ACTIONS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl mb-10">
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-4 p-6 rounded-xl bg-gray-800 hover:bg-gray-700"
        >
          <PlusIcon size={22} />
          <div>
            <p className="font-medium">Create Resume</p>
            <p className="text-sm text-gray-300">
              Build a resume from scratch
            </p>
          </div>
        </button>

        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-4 p-6 rounded-xl bg-gray-800 hover:bg-gray-700"
        >
          <UploadIcon size={22} />
          <div>
            <p className="font-medium">Upload Existing</p>
            <p className="text-sm text-gray-300">
              Upload PDF / DOC resume
            </p>
          </div>
        </button>
      </div>

      {/* RESUMES */}
      <div className="grid grid-cols-2 sm:flex flex-wrap gap-4">
        {allResumes.map((resume, index) => {
          const color = pastelColors[index % pastelColors.length];

          return (
            <div
              key={resume.id}
              onClick={() => navigate(`/app/builder/${resume.id}`)}
              className={`relative w-full sm:max-w-36 h-48 rounded-lg ${color} text-gray-900 flex flex-col items-center justify-center gap-2 cursor-pointer hover:scale-105 transition`}
            >
              <FilePenLineIcon className="size-7" />
              <p className="text-sm font-medium text-center px-2">
                {resume.title}
              </p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteResume(resume.id);
                }}
                className="absolute top-2 right-2 p-1 rounded-full bg-black/30 hover:bg-red-600"
              >
                <Trash2Icon size={14} className="text-white" />
              </button>
            </div>
          );
        })}
      </div>

      {/* CREATE MODAL */}
      {showCreateModal && (
        <Modal
          title="Create Resume"
          resumeName={resumeName}
          setResumeName={setResumeName}
          onClose={() => setShowCreateModal(false)}
          onSubmit={createResume}
          submitText="Create"
        />
      )}

      {/* UPLOAD MODAL */}
      {showUploadModal && (
        <Modal
          title="Upload Resume"
          resumeName={resumeName}
          setResumeName={setResumeName}
          onClose={() => setShowUploadModal(false)}
          onSubmit={uploadResume}
          submitText="Upload"
          extra={
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setUploadedFile(e.target.files[0])}
              className="w-full text-sm text-gray-300"
            />
          }
        />
      )}
    </div>
  );
};

/* MODAL */
const Modal = ({
  title,
  resumeName,
  setResumeName,
  onClose,
  onSubmit,
  submitText,
  extra,
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div
      className="absolute inset-0 bg-black/60"
      onClick={onClose}
    />
    <div className="relative z-10 w-full max-w-md rounded-2xl bg-gray-800 p-6">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <button onClick={onClose}>
          <XIcon size={18} />
        </button>
      </div>

      <input
        value={resumeName}
        onChange={(e) => setResumeName(e.target.value)}
        placeholder="Enter resume name"
        className="w-full mb-4 px-4 py-2 rounded-lg bg-gray-700"
      />

      {extra}

      <div className="flex justify-end gap-3 mt-6">
        <button onClick={onClose} className="px-4 py-2 bg-gray-700 rounded-lg">
          Cancel
        </button>
        <button onClick={onSubmit} className="px-4 py-2 bg-indigo-600 rounded-lg">
          {submitText}
        </button>
      </div>
    </div>
  </div>
);

export default Dashboard;
