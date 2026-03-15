import React from "react";
import ClassicTemplate from "../assets/templates/ClassicTemplate";
import MinimalTemplate from "../assets/templates/MinimalTemplate";
import MinimalImageTemplate from "../assets/templates/MinimalImageTemplate";
import ModernTemplate from "../assets/templates/ModernTemplate";

const ResumePreview = ({data, template, accentColor, classes = ""}) => {
  const normalizedData = {
    ...data,
    personal_info: data?.personal_info || {
      full_name: data?.personel_Info?.fullName || "",
      email: data?.personel_Info?.email || "",
      phone: data?.personel_Info?.phone || "",
      location: data?.personel_Info?.location || "",
      profession: data?.personel_Info?.profession || "",
      linkedin: data?.personel_Info?.linkedin || "",
      website: data?.personel_Info?.website || "",
      image: data?.personel_Info?.image || null,
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