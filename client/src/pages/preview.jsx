import React, { useMemo } from "react";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Download, Share2 } from "lucide-react";
import ResumePreview from "../components/resumePreview";
import { dummyResumeData } from "../assets/assets";

const Preview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { resumeId } = useParams();
  const isPublicRoute = location.pathname.startsWith("/public/");
  const storageKey = `resumeBuilder:resume:${resumeId}`;

  const resumeData = useMemo(() => {
    if (location.state?.resumeData) return location.state.resumeData;

    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        localStorage.removeItem(storageKey);
      }
    }

    return dummyResumeData.find((resume) => resume._id === resumeId) || null;
  }, [location.state, resumeId, storageKey]);

  const handleDownload = () => {
    window.print();
  };

  const handleShare = async () => {
    const publicUrl = `${window.location.origin}/public/preview/${resumeId}`;
    try {
      await navigator.clipboard.writeText(publicUrl);
      window.alert("Public resume link copied to clipboard.");
    } catch {
      window.prompt("Copy this public link:", publicUrl);
    }
  };

  if (!resumeData) {
    return <Navigate to="/not-found" replace />;
  }

  if (isPublicRoute && !resumeData.public) {
    return <Navigate to="/not-found" replace />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-4 flex items-center justify-between gap-3 print:hidden">
        <button
          type="button"
          onClick={() => navigate(`/app/builder/${resumeId}`)}
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to Builder
        </button>

        <div className="flex items-center gap-2">
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
            onClick={handleDownload}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-600 text-white text-sm hover:bg-purple-700 transition-colors"
          >
            <Download className="size-4" />
            Download
          </button>
        </div>
      </div>

      <ResumePreview
        data={resumeData}
        template={resumeData.template}
        accentColor={resumeData.accent_color}
        classes="shadow-sm"
      />
    </div>
  );
};

export default Preview;
