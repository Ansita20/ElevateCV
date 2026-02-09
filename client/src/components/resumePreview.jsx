import React from "react";

/* ---- SHARED COMPONENTS ---- */

const BaseWrapper = ({ children }) => (
  <div className="bg-white text-gray-900 max-w-3xl mx-auto p-8 shadow-lg">
    {children}
  </div>
);

const Header = ({ p }) => (
  <>
    <h1 className="text-3xl font-bold">{p.fullName || "Your Name"}</h1>
    <p className="text-gray-600">{p.profession}</p>
    <div className="text-sm text-gray-500 mt-2 space-y-1">
      <p>{p.email}</p>
      <p>{p.phone}</p>
      <p>{p.location}</p>
      <p>{p.website}</p>
      <p>{p.linkedin}</p>
    </div>
  </>
);

/* ---- TEMPLATES ---- */

const templates = {
  classic: ({ data }) => (
    <BaseWrapper>
      <Header p={data.personalInfo} />
    </BaseWrapper>
  ),

  modern: ({ data }) => (
    <BaseWrapper>
      <h1 className="text-4xl font-extrabold text-blue-600">
        {data.personalInfo.fullName || "Your Name"}
      </h1>
      <p className="uppercase tracking-wide">
        {data.personalInfo.profession}
      </p>
    </BaseWrapper>
  ),

  minimal: ({ data }) => (
    <BaseWrapper>
      <h1 className="font-semibold">
        {data.personalInfo.fullName || "Your Name"}
      </h1>
    </BaseWrapper>
  ),

  elegant: ({ data }) => (
    <div className="bg-white text-gray-900 max-w-3xl mx-auto p-10 font-serif">
      <Header p={data.personalInfo} />
    </div>
  ),

  sidebar: ({ data }) => (
    <div className="bg-white text-gray-900 max-w-4xl mx-auto grid grid-cols-3 min-h-[600px]">
      <div className="bg-gray-100 p-6">
        <p>{data.personalInfo.email}</p>
        <p>{data.personalInfo.phone}</p>
        <p>{data.personalInfo.location}</p>
      </div>
      <div className="col-span-2 p-8">
        <Header p={data.personalInfo} />
      </div>
    </div>
  ),

  compact: ({ data }) => (
    <BaseWrapper>
      <h1 className="text-lg font-bold">
        {data.personalInfo.fullName || "Your Name"}
      </h1>
    </BaseWrapper>
  ),

  creative: ({ data }) => (
    <BaseWrapper>
      <h1 className="text-4xl text-indigo-600 font-bold">
        {data.personalInfo.fullName || "Your Name"}
      </h1>
    </BaseWrapper>
  ),

  tech: ({ data }) => (
    <BaseWrapper>
      <h1 className="font-mono text-xl">
        {data.personalInfo.fullName || "Your Name"}
      </h1>
    </BaseWrapper>
  ),

  executive: ({ data }) => (
    <div className="bg-white text-gray-900 max-w-3xl mx-auto p-10 shadow-2xl">
      <h1 className="tracking-wide text-3xl font-semibold">
        {data.personalInfo.fullName || "Your Name"}
      </h1>
    </div>
  ),
};

/* ---- MAIN PREVIEW ---- */

const ResumePreview = ({ resumeData }) => {
  const Template = templates[resumeData.template];
  return (
    <div className="flex-1 p-8 bg-gray-900 overflow-auto">
      {Template && <Template data={resumeData} />}
    </div>
  );
};

export default ResumePreview;
