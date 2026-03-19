import React from 'react'
import { Sparkles } from "lucide-react";
import { toast } from 'react-hot-toast';
import api from '../configs/api';

const ProfessionalSummary = ({data, onChange, setResumeData}) => {
  const [isEnhancing, setIsEnhancing] = React.useState(false);

  const fallbackEnhanceSummary = (text) => {
    const clean = String(text || "").replace(/\s+/g, " ").trim();
    if (!clean) return "";
    const base = clean.endsWith(".") ? clean.slice(0, -1) : clean;
    return `${base}. Results-driven professional with strong ownership, collaboration, and problem-solving skills, focused on delivering measurable impact and business value.`;
  };

  const handleEnhanceWithAI = async () => {
    if (!data || !data.trim()) {
      toast.error("Write a summary first, then enhance with AI");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first");
      return;
    }

    try {
      setIsEnhancing(true);
      const { data: response } = await api.post(
        "/api/ai/enhance-pro-sum",
        { userContent: data },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const enhanced = response?.enhancedContent?.trim();
      if (!enhanced) {
        toast.error("AI did not return enhanced summary");
        return;
      }

      onChange(enhanced);
      toast.success("Professional summary enhanced");
    } catch (error) {
      const fallback = fallbackEnhanceSummary(data);
      const providerMessage = error?.response?.data?.message || error?.message || "AI request failed";
      const keyIssue = /leaked|invalid api key|PERMISSION_DENIED|provider error \(403\)/i.test(providerMessage);
      if (fallback) {
        onChange(fallback);
        if (keyIssue) {
          const shown = sessionStorage.getItem("aiKeyWarningShown");
          if (!shown) {
            toast.error("AI key is invalid/leaked. Update GEMINI_API_KEY in server/.env and restart backend. Using local enhancement for now.");
            sessionStorage.setItem("aiKeyWarningShown", "1");
          } else {
            toast("Applied local enhancement.");
          }
        } else {
          toast(`AI unavailable (${providerMessage}). Applied local enhancement.`);
        }
      } else {
        toast.error(providerMessage);
      }
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div>
            <h3 className='flex items-center gap-2 text-lg font-semibols text-gray-900'>Professional Summary</h3>
            <p className='text-sm text-gray-500'>Add summary for your resume here</p>
        </div>
        <button
            type='button'
            onClick={handleEnhanceWithAI}
            disabled={isEnhancing}
            className='flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50'
        >
            <Sparkles className="size-4"/>
            {isEnhancing ? "Enhancing..." : "AI Enhance"}
        </button>
      </div>

        <div className='mt-6'>
            <textarea value={data || ""} rows={7} onChange={(e) => onChange(e.target.value)} className='w-full p-3 px-4 mt-2 border text-sm border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none' placeholder='Write a compelling professional summary that highlights your key strengths and career objectives...'/>
        </div>
        <p className='text-xs text-gray-500 max-w-4/5 mx-auto text-center'>
        Tip: Keep it concise (3-4 sentences) and focus on your most relevant achievements and skills.
        </p>
    </div>
  )
}

export default ProfessionalSummary
