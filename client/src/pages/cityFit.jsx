import React, { useMemo, useState } from "react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../configs/api";

const CityFit = () => {
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

  const [homeCity, setHomeCity] = useState(resumeData?.personal_info?.location || "");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);

  if (!resumeData) {
    return <Navigate to="/not-found" replace />;
  }

  const handleFind = async () => {
    setLoading(true);
    setReport(null);
    try {
      const { data } = await api.post(
        "/api/cityfit/match-cities",
        { resumeData, homeCity: homeCity.trim() || undefined },
        { timeout: 20000, headers: { Authorization: `Bearer ${token}` } }
      );
      setReport(data.report);
    } catch (error) {
      const message = error?.response?.data?.message || "Could not find matching cities.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <Link
        to={`/app/builder/${resumeId}`}
        className="inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition-all"
      >
        <ArrowLeft className="size-4" />
        Back to Resume
      </Link>

      <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="size-5 text-purple-600" />
          <h1 className="text-lg font-semibold text-gray-900">Where should I apply?</h1>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          We match your resume's skills and target role against live job market
          data to find which cities have the best opportunities for you,
          starting close to home.
        </p>

        <div className="flex gap-3">
          <input
            type="text"
            value={homeCity}
            onChange={(e) => setHomeCity(e.target.value)}
            placeholder="Your current city (e.g. Gwalior)"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="button"
            onClick={handleFind}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition-colors disabled:opacity-60 whitespace-nowrap"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : "Find Cities"}
          </button>
        </div>

        {report && (
          <div className="mt-8">
            <p className="text-sm text-gray-700 mb-6 bg-purple-50 border border-purple-100 rounded-lg p-4">
              {report.experienceVerdict}
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {report.cities.map((city, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{city.city}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                      {city.tier || "Unranked"}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mb-3">
                    {city.matchingJobs} matching of {city.totalJobs} total jobs
                  </div>
                  {city.topSkills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {city.topSkills.slice(0, 5).map((s, j) => (
                        <span key={j} className="text-xs px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-100">
                          {s.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {report.cities.length === 0 && (
              <div className="text-sm text-gray-400 text-center py-8">
                No matching cities found yet — try adding more skills or a clearer target role to your resume.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CityFit;
