import React, { useMemo, useState } from "react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import { ArrowLeft, Target, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../configs/api";

const scoreColor = (score) => {
  if (score >= 75) return { ring: "text-green-600", bg: "bg-green-50", border: "border-green-200" };
  if (score >= 50) return { ring: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" };
  return { ring: "text-red-600", bg: "bg-red-50", border: "border-red-200" };
};

const AtsMatch = () => {
  const location = useLocation();
  const { resumeId } = useParams();
  const storageKey = `resumeBuilder:resume:${resumeId}`;
  const token = localStorage.getItem("token");

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
    return null;
  }, [location.state, storageKey]);

  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  if (!resumeData) {
    return <Navigate to="/not-found" replace />;
  }

  const handleCheck = async () => {
    if (!jobDescription.trim()) {
      toast.error("Paste a job description first.");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const { data } = await api.post(
        "/api/ai/ats-match",
        { resumeData, jobDescription },
        { timeout: 45000, headers: { Authorization: `Bearer ${token}` } } // Gemini calls (plus model-fallback retries) routinely exceed the 8s default
      );
      setResult(data);
    } catch (error) {
      const status = error?.response?.status;
      const message =
        status === 429
          ? "Too many AI requests right now — please wait a bit and try again."
          : error?.response?.data?.message || "Could not check ATS match.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const colors = result ? scoreColor(result.matchScore) : null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <Link
        to={`/app/builder/${resumeId}`}
        className="inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition-all"
      >
        <ArrowLeft className="size-4" />
        Back to Resume
      </Link>

      <div className="mt-6 grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="size-5 text-purple-600" />
            <h1 className="text-lg font-semibold text-gray-900">ATS Match Checker</h1>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Paste the job description you're targeting. We'll score how well
            your current resume would match it in an ATS keyword scan, and
            tell you exactly what's missing.
          </p>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the full job description here..."
            rows={14}
            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="button"
            onClick={handleCheck}
            disabled={loading}
            className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition-colors disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Check Match"
            )}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {!result && !loading && (
            <div className="h-full flex items-center justify-center text-sm text-gray-400 text-center px-6">
              Your match score and keyword gaps will show up here.
            </div>
          )}

          {loading && (
            <div className="h-full flex items-center justify-center text-sm text-gray-400">
              Analyzing your resume against the job description...
            </div>
          )}

          {result && !loading && (
            <div>
              <div className={`flex items-center gap-4 p-4 rounded-lg border ${colors.bg} ${colors.border} mb-6`}>
                <div className={`text-4xl font-bold ${colors.ring}`}>{result.matchScore}%</div>
                <div className="text-sm text-gray-600">
                  ATS match score for this resume against the pasted job
                  description.
                </div>
              </div>

              {result.missingKeywords.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Missing keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.missingKeywords.map((kw, i) => (
                      <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {result.matchedKeywords.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Already matched</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.matchedKeywords.map((kw, i) => (
                      <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {result.suggestions.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Suggestions</h3>
                  <ul className="space-y-2">
                    {result.suggestions.map((s, i) => (
                      <li key={i} className="text-sm text-gray-600 flex gap-2">
                        <span className="text-purple-600">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AtsMatch;
