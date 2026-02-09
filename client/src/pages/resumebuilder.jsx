import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PersonelInfo from "../components/PersonelInfo";
import ResumePreview from "../components/resumePreview";

const Resumebuilder = () => {
  const navigate = useNavigate();

  const [resumeData, setResumeData] = useState({
    template: "classic",
    personalInfo: {
      fullName: "",
      profession: "",
      email: "",
      phone: "",
      location: "",
      address: "",
      website: "",
      linkedin: "",
    },
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* LEFT */}
      <PersonelInfo
        resumeData={resumeData}
        setResumeData={setResumeData}
        navigate={navigate}
      />

      {/* RIGHT */}
      <ResumePreview resumeData={resumeData} />
    </div>
  );
};

export default Resumebuilder;
