import React, { useEffect, useState } from "react";
import {
  PlusIcon,
  UploadCloudIcon,
  Trash2Icon,
  FilePenLineIcon,
  XIcon,
  PencilIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import api from "../configs/api";
import pdfToText from "react-pdftotext";

const splitIntoSections = (text) => {
  const lines = String(text || "")
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.trim());

  const sections = {
    summary: [],
    experience: [],
    education: [],
    skills: [],
    projects: [],
    other: [],
  };

  let active = "other";
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;
    const normalized = line.toLowerCase().replace(/[:\-]/g, "").trim();

    if (/^(professional summary|summary|profile|objective)$/.test(normalized)) {
      active = "summary";
      continue;
    }
    if (/^(work experience|experience|employment|professional experience)$/.test(normalized)) {
      active = "experience";
      continue;
    }
    if (/^(education|academic background|academics)$/.test(normalized)) {
      active = "education";
      continue;
    }
    if (/^(skills|technical skills|core skills|technologies)$/.test(normalized)) {
      active = "skills";
      continue;
    }
    if (/^(projects|project experience|personal projects)$/.test(normalized)) {
      active = "projects";
      continue;
    }

    sections[active].push(line);
  }

  return sections;
};

const parseSkills = (lines = []) => {
  const parts = lines
    .join("\n")
    .split(/[,|;•\u2022\n\t]/g)
    .map((item) => item.trim())
    .filter(Boolean);

  const seen = new Set();
  const skills = [];
  for (const skill of parts) {
    if (skill.length < 2 || skill.length > 40) continue;
    const key = skill.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    skills.push(skill);
    if (skills.length >= 30) break;
  }
  return skills;
};

const extractDateRange = (line = "") => {
  const found = line.match(/(19|20)\d{2}|present|current|now/gi) || [];
  return {
    start: found[0] || "",
    end: found[1] || "",
    isCurrent: /present|current|now/i.test(line),
  };
};

const parseExperience = (lines = []) => {
  const entries = [];
  let current = null;

  const push = () => {
    if (!current) return;
    if (current.position || current.company || current.description) {
      entries.push({ ...current, description: current.description.trim() });
    }
    current = null;
  };

  for (const line of lines) {
    const isRoleLine = /\sat\s/i.test(line) || /\|/.test(line) || /\s-\s/.test(line);
    if (isRoleLine && (!current || current.description)) {
      push();
      current = { company: "", position: "", start_date: "", end_date: "", description: "", is_current: false };
      if (/\sat\s/i.test(line)) {
        const [position, company] = line.split(/\sat\s/i);
        current.position = (position || "").trim();
        current.company = (company || "").trim();
      } else {
        const [left, right] = line.split(/\||\s-\s/);
        current.position = (left || "").trim();
        current.company = (right || "").trim();
      }
    } else {
      if (!current) current = { company: "", position: "", start_date: "", end_date: "", description: "", is_current: false };
      current.description += `${current.description ? " " : ""}${line}`;
    }

    const range = extractDateRange(line);
    if (range.start && current && !current.start_date) {
      current.start_date = range.start;
      current.end_date = range.end;
      current.is_current = range.isCurrent;
    }
  }

  push();
  return entries.slice(0, 6);
};

const parseEducation = (lines = []) => {
  const entries = [];
  for (const line of lines) {
    const year = (line.match(/(19|20)\d{2}/) || [""])[0];
    const degree = (line.match(/(b\.tech|btech|b\.e|be|bsc|b\.sc|msc|m\.sc|mba|phd|high school|secondary|diploma)/i) || [""])[0];
    entries.push({
      institution: line,
      degree,
      field: "",
      graduation_date: year,
      gpa: "",
    });
    if (entries.length >= 4) break;
  }
  return entries;
};

const parseProjects = (lines = []) => {
  const entries = [];
  for (const line of lines) {
    const [name, desc] = line.split(/:|\||\s-\s/);
    entries.push({
      name: (name || line).trim(),
      type: "",
      description: (desc || "").trim(),
    });
    if (entries.length >= 5) break;
  }
  return entries;
};

const buildFallbackResumeData = (resumeText = "") => {
  const text = String(resumeText || "").replace(/\r/g, "");
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const sections = splitIntoSections(text);

  const emailMatch = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  const phoneMatch = text.match(/(?:\+?\d[\d\s\-()]{7,}\d)/);
  const linkedInMatch = text.match(/https?:\/\/(?:www\.)?linkedin\.com\/[\w\-./?=&%]+/i);
  const allUrls = text.match(/https?:\/\/[\w\-._~:/?#[\]@!$&'()*+,;=%]+/gi) || [];
  const website = allUrls.find((url) => !/linkedin\.com/i.test(url)) || "";

  return {
    professional_summary: (sections.summary.length ? sections.summary : sections.other.slice(0, 6)).join(" ").slice(0, 900),
    skills: parseSkills(sections.skills),
    personal_info: {
      image: "",
      full_name: lines.find((line) => /^[a-zA-Z .'-]{3,60}$/.test(line) && !/@|http/i.test(line)) || lines[0] || "",
      profession: lines.find((line) => /(developer|engineer|manager|designer|analyst|consultant|intern)/i.test(line)) || lines[1] || "",
      email: emailMatch?.[0] || "",
      phone: phoneMatch?.[0] || "",
      location: lines.find((line) => /,/.test(line) && !/@|http/i.test(line) && line.length < 80) || "",
      linkedin: linkedInMatch?.[0] || "",
      website,
    },
    experience: parseExperience(sections.experience),
    project: parseProjects(sections.projects),
    education: parseEducation(sections.education),
  };
};

const Dashboard = () => {
  const colors = ["#9333EA", "#3B82F6", "#10B981", "#F59E0B", "#EF4444"];
  const { user } = useSelector((state) => state.auth);
  const [allResumes, setAllResumes] = useState([]);
  const [showCreateResume, setShowCreateResume] = useState(false);
  const [showUploadResume, setShowUploadResume] = useState(false);
  const [title, setTitle] = useState("");
  const [resume, setResume] = useState(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [editResumeId, setEditResumeId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingResume, setIsUploadingResume] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const authHeaders = token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : undefined;

  const loadAllResumes = async () => {
    if (!token) {
      setAllResumes([]);
      return;
    }

    try {
      setIsLoading(true);
      const { data } = await api.get("/api/users/resumes", authHeaders);
      const resumes = Array.isArray(data?.resumes) ? data.resumes : [];
      resumes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      setAllResumes(resumes);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load resumes");
    } finally {
      setIsLoading(false);
    }
  };

  const createResume = async (event) => {
    event.preventDefault();
    if (!title.trim()) return;
    try {
      const { data } = await api.post(
        "/api/resumes/create",
        { title: title.trim() },
        authHeaders
      );
      const createdResume = data?.resume;
      if (!createdResume?._id) {
        toast.error("Failed to create resume");
        return;
      }
      setShowCreateResume(false);
      setTitle("");
      toast.success("Resume created");
      navigate(`/app/builder/${createdResume._id}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to create resume");
    }
  };

  const uploadResume = async (event) => {
    event.preventDefault();
    if (!resume) {
      toast.error("Please select a PDF resume");
      return;
    }

    if (!token) {
      toast.error("Please login first");
      return;
    }

    const isPdf = resume.type === "application/pdf" || resume.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      toast.error("Only PDF resumes are supported right now");
      return;
    }

    try {
      setIsUploadingResume(true);
      const resumeText = await pdfToText(resume);
      if (!resumeText || resumeText.trim().length < 30) {
        toast.error("Could not read enough text from the PDF");
        return;
      }

      const finalTitle = (uploadTitle || resume.name.replace(/\.pdf$/i, "")).trim() || "Imported Resume";
      try {
        const { data } = await api.post(
          "/api/ai/generate-resume",
          { title: finalTitle, resumeText },
          authHeaders
        );

        if (!data?.resumeId) {
          toast.error("Resume import failed");
          return;
        }

        if (data?.importMode === "fallback") {
          toast.success("Resume imported with basic parser. Review and edit extracted fields.");
        } else {
          toast.success("Resume imported successfully");
        }
        setShowUploadResume(false);
        setResume(null);
        setUploadTitle("");
        navigate(`/app/builder/${data.resumeId}`);
      } catch (uploadError) {
        // Fallback path for provider-side 403/no-body errors.
        const parsedFallback = buildFallbackResumeData(resumeText);

        const created = await api.post(
          "/api/resumes/create",
          { title: finalTitle },
          authHeaders
        );
        const resumeId = created?.data?.resume?._id;
        if (!resumeId) {
          throw uploadError;
        }

        await api.put(
          "/api/resumes/update",
          {
            resumeId,
            resumeData: parsedFallback,
            removeBackground: false,
          },
          authHeaders
        );

        toast.success("AI import unavailable (403). Imported with basic parser.");
        setShowUploadResume(false);
        setResume(null);
        setUploadTitle("");
        navigate(`/app/builder/${resumeId}`);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to import resume");
    } finally {
      setIsUploadingResume(false);
    }
  };

  const editTitle = async (event) => {
    event.preventDefault();
    if (!editResumeId || !title.trim()) return;
    try {
      await api.put(
        "/api/resumes/update",
        {
          resumeId: editResumeId,
          resumeData: { title: title.trim() },
        },
        authHeaders
      );
      toast.success("Title updated");
      setEditResumeId("");
      setTitle("");
      loadAllResumes();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update title");
    }
  };

  const deleteResume = async (resumeId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this resume?");
    if (confirmDelete) {
      try {
        await api.delete(`/api/resumes/delete/${resumeId}`, authHeaders);
        toast.success("Resume deleted");
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to delete resume");
      }
      setAllResumes(prev => prev.filter(resume => resume._id !== resumeId));
    }
  };

  useEffect(() => {
    loadAllResumes();
  }, []);

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-2xl font-medium mb-6 bg-gradient-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent sm:hidden">Welcome, {user?.name || "User"}</p>
        <div className="flex gap-4">
          <button onClick={() => setShowCreateResume(true)} className="w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-indigo-500 hover:shadow-lg transition-all duration-300 cursor-pointer">
            <PlusIcon className="size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-indigo-300 to-indigo-500 text-white rounded-full"/>
            <p className="text-sm group-hover:text-indigo-600 transition-all duration-300">
              Create Resume
            </p>
          </button>
          <button onClick={() => setShowUploadResume(true)} className="w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-indigo-500 hover:shadow-lg transition-all duration-300 cursor-pointer">
            <UploadCloudIcon className="size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-indigo-300 to-indigo-500 text-white rounded-full"/>
            <p className="text-sm group-hover:text-indigo-600 transition-all duration-300">
              Upload Resume
            </p>
          </button>
        </div>

        <hr className=" border-slate-300 my-6 sm:w-[305px]" />
      
      <div className="grid grid-cols-2 sm:flex flex-wrap gap-4">
        {isLoading && <p className="text-sm text-slate-500">Loading resumes...</p>}
        {!isLoading && allResumes.length === 0 && (
          <p className="text-sm text-slate-500">No resumes yet. Create one to get started.</p>
        )}
        {allResumes.map((resume, index) =>{ 
          const baseColor = colors[index % colors.length];
          return (
            <button key={index} onClick={() => navigate(`/app/builder/${resume._id}`)} className="relative w-full sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 border group hover:shadow-lg transition-all duration-300 cursor-pointer" style={{background: `linear-gradient(135deg, ${baseColor}10, ${baseColor}40)`, borderColor: baseColor + '40'}}>

                <FilePenLineIcon className="size-7 group-hover:scale-105 transition-all" style={{ color: baseColor }}/>
                <p className="text-sm group-hover:scale-105 transition-all px-2 text-center" style={{color: baseColor}}>{resume.title}</p>
                <p className="absolute bottom-1 text-[11px] text-slate-400 group-hover:text-slate-500 transition-all duration-300 px-2 text-center" style={{color: baseColor + '90'}}>Update on {new Date(resume.updatedAt).toLocaleDateString()}</p>
                <div onClick={e => e.stopPropagation()} className="absolute top-1 right-1 group-hover:flex items-center hidden">
                  <Trash2Icon onClick={() => deleteResume(resume._id)} className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors"/>
                  <PencilIcon onClick={() => {setEditResumeId(resume._id); setTitle(resume.title || '')}} className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors"/>
                </div>
            </button>
          )
      })}
      </div>

      {showCreateResume && (
  <div
    onClick={() => setShowCreateResume(false)}
    className="fixed inset-0 bg-black/70 backdrop-blur-sm z-10 flex items-center justify-center"
  >
    <form
      onSubmit={createResume}
      onClick={(e) => e.stopPropagation()}
      className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
    >
      <h2 className="text-xl font-bold mb-4">Create a Resume</h2>

      <input
        type="text"
        placeholder="Enter Resume Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-4 py-2 mb-4 border rounded focus:border-green-600 focus:outline-none"
        required
      />

      <button
        type="submit"
        className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
      >
        Create Resume
      </button>

      <XIcon
        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
        onClick={() => {
          setShowCreateResume(false);
          setTitle("");
        }}
      />
    </form>
  </div>
)}

      {showUploadResume && (
        <form onSubmit={uploadResume} onClick={() => setShowUploadResume(false)} className="fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center">
          <div onClick={e => e.stopPropagation()} className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6">
            <h2 className="text-xl font-bold mb-4">Upload Resume</h2>
            <input
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setResume(file);
                if (file && !uploadTitle) {
                  setUploadTitle(file.name.replace(/\.pdf$/i, ""));
                }
              }}
              type="file"
              accept=".pdf"
              className="w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600"
              required
            />
            <input
              type="text"
              value={uploadTitle}
              onChange={(e) => setUploadTitle(e.target.value)}
              placeholder="Resume title"
              className="w-full px-4 py-2 mb-4 border rounded focus:border-green-600 focus:outline-none"
              required
            />
            <div>
             <label htmlFor="resume-input" className="block text-sm text-slate-700">
              Select resume file
              <div className="flex flex-col items-center justify-center gap-2 border group text-slate-400 border-slate-400 border-dashed rounded-md p-4 py-10 my-4 hover:border-green-500 hover:text-green-700 cursor-pointer transition-colors">
                {resume ? (
                  <p className="text-green-700">{resume.name}</p>
                ) : (
                  <>
                  <UploadCloudIcon className="size-14 stroke-1"/>
                  <p>Upload resume</p>
                  </>
                )}
              </div>
              </label>
            </div>
            <button disabled={isUploadingResume} className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-60">
              {isUploadingResume ? "Importing..." : "Upload Resume"}
            </button>
            <XIcon className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors" onClick={() => {setShowUploadResume(false); setResume(null); setUploadTitle("");}}/>
          </div>
        </form>
      )
      }

      {editResumeId && (
        <form onSubmit={editTitle} onClick={() => setEditResumeId('')} className="fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center">
          <div onClick={e => e.stopPropagation()} className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6">
            <h2 className="text-xl font-bold mb-4">Edit Resume Title</h2>
            <input onChange={(e) => setTitle(e.target.value)} value={title} type="text" className="w-full px-4 py-2 mb-4 border rounded" required/>
            <button className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">Edit Resume</button>
            <XIcon className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors" onClick={() => {setEditResumeId(''); setTitle('')}}/>
          </div>
        </form>
      )
      }

      </div>
    </div>
  )
};

export default Dashboard;
