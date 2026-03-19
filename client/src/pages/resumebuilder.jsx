import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import ProfessionalSummary from "../components/ProfessionalSummary";
import PersonelInfoForm from "../components/PersonelInfo";
import TemplateSelector from "../components/TemplateSelector";
import ColorChange from "../components/colorChange";
import ResumePreview from "../components/resumePreview";
import { toast } from "react-hot-toast";
import api from "../configs/api";
import {
  ArrowLeft,
  User,
  FileText,
  Briefcase,
  GraduationCap,
  FolderIcon,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Eye,
  Globe,
  Share2
} from "lucide-react";
import ExperienceForm from "../components/ExperienceForm";
import EducationForm from "../components/EducationForm";
import ProjectForm from "../components/ProjectForm";
import SkillsForm from "../components/SkillsForm";

const Resumebuilder = () => {
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [removeBackground, setRemoveBackground] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const { resumeId } = useParams();
  const storageKey = `resumeBuilder:resume:${resumeId}`;
  const token = localStorage.getItem("token");

  const [resumeData, setResumeData] = useState({
    _id: '',
    title: '',
    personel_Info: {},
    professional_summary: "",
    experience: [],
    education: [],
    project: [],
    skills: [],
    template: "classic",
    accent_color: "#3B82F6",
    public: false,
  });

  const toBuilderShape = (resume) => ({
    ...resume,
    personel_Info: {
      fullName: resume.personal_info?.full_name || "",
      email: resume.personal_info?.email || "",
      phone: resume.personal_info?.phone || "",
      location: resume.personal_info?.location || "",
      profession: resume.personal_info?.profession || "",
      linkedin: resume.personal_info?.linkedin || "",
      website: resume.personal_info?.website || "",
      image: resume.personal_info?.image || null,
    },
  });

  const toApiShape = (data) => ({
    title: data.title || "Untitled Resume",
    professional_summary: data.professional_summary || "",
    experience: data.experience || [],
    education: data.education || [],
    project: data.project || [],
    skills: data.skills || [],
    template: data.template || "classic",
    accent_color: data.accent_color || "#3B82F6",
    public: !!data.public,
    personal_info: {
      full_name: data.personel_Info?.fullName || "",
      email: data.personel_Info?.email || "",
      phone: data.personel_Info?.phone || "",
      location: data.personel_Info?.location || "",
      profession: data.personel_Info?.profession || "",
      linkedin: data.personel_Info?.linkedin || "",
      website: data.personel_Info?.website || "",
      image: typeof data.personel_Info?.image === "string" ? data.personel_Info.image : "",
    },
  });

  const loadExistingResume = async (id) => {
    if (!token || !id) return;
    try {
      setIsLoading(true);
      const { data } = await api.get(`/api/resumes/get/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const resume = data?.resume;
      if (!resume) {
        toast.error("Resume not found");
        return;
      }
      const builderData = toBuilderShape(resume);
      setResumeData(builderData);
      localStorage.setItem(storageKey, JSON.stringify(builderData));
      document.title = resume.title || "Resume Builder";
    } catch (error) {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          setResumeData(JSON.parse(saved));
        } catch {
          localStorage.removeItem(storageKey);
        }
      }
      toast.error(error?.response?.data?.message || "Unable to load resume");
    } finally {
      setIsLoading(false);
    }
  };

  const sections = [
    { id: "personel_Info", title: "Personel Info", icon: User },
    { id: "summary", title: "Professional Summary", icon: FileText },
    { id: "experience", title: "Experience", icon: Briefcase },
    { id: "education", title: "Education", icon: GraduationCap },
    { id: "project", title: "Project", icon: FolderIcon },
    { id: "skills", title: "Skills", icon: Sparkles },
  ];

  useEffect(() => {
    if (resumeId) {
      loadExistingResume(resumeId);
    }
  }, [resumeId]);

  useEffect(() => {
    if (!resumeId) return;
    localStorage.setItem(storageKey, JSON.stringify(resumeData));
  }, [resumeId, resumeData, storageKey]);

  useEffect(() => {
    if (!resumeId || !token || isLoading) return;

    const timer = setTimeout(async () => {
      try {
        setIsSaving(true);
        const payload = toApiShape(resumeData);

        const imageFile = resumeData.personel_Info?.image;
        if (imageFile && typeof imageFile !== "string") {
          const formData = new FormData();
          formData.append("resumeId", resumeId);
          formData.append("resumeData", JSON.stringify(payload));
          formData.append("removeBackground", String(removeBackground));
          formData.append("image", imageFile);

          const { data: response } = await api.put("/api/resumes/update", formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          });

          const savedImage = response?.resume?.personal_info?.image;
          if (savedImage) {
            setResumeData((prev) => {
              if (prev.personel_Info?.image === savedImage) return prev;
              return {
                ...prev,
                personel_Info: {
                  ...prev.personel_Info,
                  image: savedImage,
                },
              };
            });
          }
        } else {
          const { data: response } = await api.put(
            "/api/resumes/update",
            {
              resumeId,
              resumeData: payload,
              removeBackground,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          const savedImage = response?.resume?.personal_info?.image;
          if (savedImage) {
            setResumeData((prev) => {
              if (prev.personel_Info?.image === savedImage) return prev;
              return {
                ...prev,
                personel_Info: {
                  ...prev.personel_Info,
                  image: savedImage,
                },
              };
            });
          }
        }
      } catch (error) {
        console.log(error?.response?.data?.message || error.message);
      } finally {
        setIsSaving(false);
      }
    }, 700);

    return () => clearTimeout(timer);
  }, [resumeData, resumeId, token, removeBackground, isLoading]);

  const handleOpenPreview = () => {
    navigate(`/preview/${resumeId}`, { state: { resumeData } });
  };

  const handleDone = () => {
    navigate("/app");
  };

  const handleShare = async () => {
    if (!resumeData.public) {
      window.alert("Enable Public View before sharing the resume link.");
      return;
    }

    const publicUrl = `${window.location.origin}/public/preview/${resumeId}`;
    try {
      await navigator.clipboard.writeText(publicUrl);
      window.alert("Public resume link copied to clipboard.");
    } catch {
      window.prompt("Copy this public link:", publicUrl);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Link
  to="/app"
  className="inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition-all"
>
  <ArrowLeft className="size-4" />
  Back to Dashboard
</Link>

      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="relative lg:col-span-5 rounded-lg overflow-visible">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-1">
                <hr className="absolute top-0 left-0 right-0 border-2 border-gray-200"/>
                <hr className="absolute top-0 left-0 h-1 bg-gradient-to-r from-green-500 to-green-600 border-none transition-all duration-2000" style={{width: `${activeSectionIndex * 100 / (sections.length - 1)} %`}}/>

                <div className="flex justify-between items-center mb-6 border-b border-gray-300 py-1">
                  <div>
                    <TemplateSelector selectedTemplate={resumeData.template} onChange={(template) => setResumeData(prev => ({...prev, template}))} />
                  </div>
                  <div>
                    <ColorChange
                      selectedColor={resumeData.accent_color}
                      onChange={(accent_color) => setResumeData((prev) => ({ ...prev, accent_color }))}
                    />
                  </div>
                  <div className="flex items-center">
                    {activeSectionIndex !== 0 && (
                      <button onClick={() => setActiveSectionIndex((prevIndex) => Math.max(prevIndex - 1, 0))} className= "flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all" disabled={activeSectionIndex === 0}>
                        <ChevronLeft className= "size-4"/> Previous
                        </button>
                    )}
                    <button onClick={() => setActiveSectionIndex((prevIndex) => Math.min(prevIndex + 1, sections.length - 1))} className= {`flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all ${activeSectionIndex === sections.length - 1 ? 'opacity-50' : ''}`} disabled={activeSectionIndex === sections.length - 1}>
                        Next <ChevronRight className= "size-4"/>
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                    {sections[activeSectionIndex]?.id === "personel_Info" && (
                      <PersonelInfoForm data={resumeData.personel_Info} onChange={(data) => setResumeData(prev => ({...prev, personel_Info: data}))} removeBackground={removeBackground} setRemoveBackground={setRemoveBackground} />
                    )}
                    {sections[activeSectionIndex]?.id === "summary" && (
                      <ProfessionalSummary
                        data={resumeData.professional_summary}
                        onChange={(data) => setResumeData((prev) => ({ ...prev, professional_summary: data }))}
                        setResumeData={setResumeData}
                      />
                    )}
                    {sections[activeSectionIndex]?.id === "experience" && (
                      <ExperienceForm
                        data={resumeData.experience}
                        onChange={(data) => setResumeData((prev) => ({ ...prev, experience: data }))}
                        setResumeData={setResumeData}
                      />
                    )}
                    {sections[activeSectionIndex]?.id === "education" && (
                      <EducationForm
                        data={resumeData.education}
                        onChange={(data) => setResumeData((prev) => ({ ...prev, education: data }))}
                      />
                    )}
                    {sections[activeSectionIndex]?.id === "project" && (
                      <ProjectForm
                        data={resumeData.project}
                        onChange={(data) => setResumeData((prev) => ({ ...prev, project: data }))}
                      />
                    )}
                    {sections[activeSectionIndex]?.id === "skills" && (
                      <SkillsForm
                        data={resumeData.skills}
                        onChange={(data) => setResumeData((prev) => ({ ...prev, skills: data }))}
                      />
                    )}
                </div>
            </div>
          </div>
          <div className="lg:col-span-7 max-lg:mt-6">
            <div className="mb-3 flex items-center justify-end gap-2">
              {isSaving && <span className="text-xs text-slate-500">Saving...</span>}
              {isLoading && <span className="text-xs text-slate-500">Loading...</span>}
              <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 bg-white">
                <Globe className="size-4" />
                <span>Public View</span>
                <input
                  type="checkbox"
                  checked={resumeData.public}
                  onChange={(e) => setResumeData((prev) => ({ ...prev, public: e.target.checked }))}
                  className="accent-purple-600"
                />
              </label>
              <button
                type="button"
                onClick={handleShare}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <Share2 className="size-4" />
                Share
              </button>
              <button
                type="button"
                onClick={handleOpenPreview}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-600 text-white text-sm hover:bg-purple-700 transition-colors"
              >
                <Eye className="size-4" />
                Preview
              </button>
              <button
                type="button"
                onClick={handleDone}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-600 text-white text-sm hover:bg-green-700 transition-colors"
              >
                Done
              </button>
            </div>
            <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resumebuilder;

