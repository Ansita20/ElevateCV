import React from "react";
import ClassicTemplate from "../assets/templates/ClassicTemplate";
import MinimalTemplate from "../assets/templates/MinimalTemplate";
import MinimalImageTemplate from "../assets/templates/MinimalImageTemplate";
import ModernTemplate from "../assets/templates/ModernTemplate";

const ResumePreview = ({data, template, accentColor, classes = ""}) => {
  const livePersonalInfo = data?.personel_Info || {};
  const persistedPersonalInfo = data?.personal_info || {};

  const normalizedData = {
    ...data,
    // Always prefer live form values so preview updates instantly while typing.
    personal_info: {
      full_name: livePersonalInfo.fullName ?? persistedPersonalInfo.full_name ?? "",
      email: livePersonalInfo.email ?? persistedPersonalInfo.email ?? "",
      phone: livePersonalInfo.phone ?? persistedPersonalInfo.phone ?? "",
      location: livePersonalInfo.location ?? persistedPersonalInfo.location ?? "",
      profession: livePersonalInfo.profession ?? persistedPersonalInfo.profession ?? "",
      linkedin: livePersonalInfo.linkedin ?? persistedPersonalInfo.linkedin ?? "",
      website: livePersonalInfo.website ?? persistedPersonalInfo.website ?? "",
      image: livePersonalInfo.image ?? persistedPersonalInfo.image ?? null,
    },
  };

  const renderTemplate = () => {
    switch(template){
      case "modern":
        return <ModernTemplate data = {normalizedData} accentColor = {accentColor} />;

      case "minimal":
        return <MinimalTemplate data = {normalizedData} accentColor = {accentColor} />;  

      case "minimal-image":
        return <MinimalImageTemplate data = {normalizedData} accentColor = {accentColor} />;

      default:
        return <ClassicTemplate data = {normalizedData} accentColor = {accentColor} />;  
    }
  }

  return (
    <div className="w-full bg-gray-100">
      <div id="resume-preview" className={`border border-gray-200 print:shadow-none print:border-none ${classes}`}>
        {renderTemplate()}
      </div>

      <style>
        {`
          @page {
            size: letter;
            margin: 0;
          }
          @media print {
            html, body{
            width: 8.5in;
            height: 11in;
            overflow: hidden;
          }
          body * {
            visibility: hidden;
          }
          #resume-preview, #resume-preview * {
            visibility: visible;
          }
          #resume-preview {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: auto;
            margin: 0;
            padding: 0;
            box-shadow: none !important;
            border: none !important;
          }
        }
      `}
      </style>
    </div>
  );
};

export default ResumePreview;