import { Mail, Phone, MapPin, Linkedin, Globe, Link2 } from "lucide-react";
import { getDensity } from "./density";

const normalizeUrl = (value) => {
    const trimmed = String(value || "").trim();
    if (!trimmed) return "";
    return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
};

const ClassicTemplate = ({ data, accentColor, spacing }) => {
    const d = getDensity(spacing);
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        if (!/^\d{4}-\d{2}$/.test(dateStr)) return dateStr;
        const [year, month] = dateStr.split("-");
        return new Date(year, month - 1).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short"
        });
    };

    return (
        <div className={`max-w-4xl mx-auto ${d.padding} bg-white text-gray-800 ${d.lineHeight}`}>
            {/* Header */}
            <header className={`text-center ${d.headerGap} pb-6 border-b-2`} style={{ borderColor: accentColor }}>
                <h1 className="text-3xl font-bold mb-2" style={{ color: accentColor }}>
                    {data.personal_info?.full_name || "Your Name"}
                </h1>

                <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
                    {data.personal_info?.email && (
                        <a href={`mailto:${data.personal_info.email}`} className="flex items-center gap-1 hover:underline">
                            <Mail className="size-4" />
                            <span>{data.personal_info.email}</span>
                        </a>
                    )}
                    {data.personal_info?.phone && (
                        <a href={`tel:${data.personal_info.phone.replace(/[^+\d]/g, "")}`} className="flex items-center gap-1 hover:underline">
                            <Phone className="size-4" />
                            <span>{data.personal_info.phone}</span>
                        </a>
                    )}
                    {data.personal_info?.location && (
                        <div className="flex items-center gap-1">
                            <MapPin className="size-4" />
                            <span>{data.personal_info.location}</span>
                        </div>
                    )}
                    {data.personal_info?.linkedin && (
                        <a href={normalizeUrl(data.personal_info.linkedin)} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline">
                            <Linkedin className="size-4" />
                            <span className="break-all">{data.personal_info.linkedin}</span>
                        </a>
                    )}
                    {data.personal_info?.website && (
                        <a href={normalizeUrl(data.personal_info.website)} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline">
                            <Globe className="size-4" />
                            <span className="break-all">{data.personal_info.website}</span>
                        </a>
                    )}
                    {(data.profiles || []).filter((p) => p?.url).map((p, i) => (
                        <a key={i} href={normalizeUrl(p.url)} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline">
                            <Link2 className="size-4" />
                            <span className="break-all">{p.label || p.url}</span>
                        </a>
                    ))}
                </div>
            </header>

            {/* Professional Summary */}
            {data.professional_summary && (
                <section className={d.gap}>
                    <h2 className="text-xl font-semibold mb-3" style={{ color: accentColor }}>
                        PROFESSIONAL SUMMARY
                    </h2>
                    <p className={`text-gray-700 ${d.lineHeight}`}>{data.professional_summary}</p>
                </section>
            )}

            {/* Experience */}
            {data.experience && data.experience.length > 0 && (
                <section className={d.gap}>
                    <h2 className="text-xl font-semibold mb-4" style={{ color: accentColor }}>
                        PROFESSIONAL EXPERIENCE
                    </h2>

                    <div className={d.entryGap}>
                        {data.experience.map((exp, index) => (
                            <div key={index} className="border-l-3 pl-4" style={{ borderColor: accentColor }}>
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                                        <p className="text-gray-700 font-medium">{exp.company}</p>
                                    </div>
                                    <div className="text-right text-sm text-gray-600">
                                        <p>{formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}</p>
                                    </div>
                                </div>
                                {exp.link && (
                                    <a href={normalizeUrl(exp.link)} target="_blank" rel="noreferrer" className="text-xs underline" style={{ color: accentColor }}>
                                        {exp.link_label || "View Certificate"}
                                    </a>
                                )}
                                {exp.description && (
                                    <div className={`text-gray-700 ${d.lineHeight} whitespace-pre-line`}>
                                        {exp.description}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Projects */}
            {data.project && data.project.length > 0 && (
                <section className={d.gap}>
                    <h2 className="text-xl font-semibold mb-4" style={{ color: accentColor }}>
                        PROJECTS
                    </h2>

                    <ul className={d.entryGap}>
                        {data.project.map((proj, index) => (
                            <div key={index} className="flex justify-between items-start border-l-3 border-gray-300 pl-6">
                                <div>
                                    <li className="font-semibold text-gray-800 ">
                                        {proj.name}
                                        {proj.link && (
                                            <a href={normalizeUrl(proj.link)} target="_blank" rel="noreferrer" className="ml-2 text-xs underline font-normal" style={{ color: accentColor }}>
                                                {proj.link_label || "Link"}
                                            </a>
                                        )}
                                    </li>
                                    <p className="text-gray-600">{proj.description}</p>
                                </div>
                            </div>
                        ))}
                    </ul>
                </section>
            )}

            {/* Education */}
            {data.education && data.education.length > 0 && (
                <section className={d.gap}>
                    <h2 className="text-xl font-semibold mb-4" style={{ color: accentColor }}>
                        EDUCATION
                    </h2>

                    <div className={d.entryGap}>
                        {data.education.map((edu, index) => (
                            <div key={index} className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-gray-900">
                                        {edu.degree} {edu.field && `in ${edu.field}`}
                                    </h3>
                                    <p className="text-gray-700">{edu.institution}</p>
                                    {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
                                </div>
                                <div className="text-sm text-gray-600">
                                    <p>{formatDate(edu.graduation_date)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills */}
            {data.skills && data.skills.length > 0 && (
                <section className={d.gap}>
                    <h2 className="text-xl font-semibold mb-4" style={{ color: accentColor }}>
                        CORE SKILLS
                    </h2>

                    <div className="flex gap-4 flex-wrap">
                        {data.skills.map((skill, index) => (
                            <div key={index} className="text-gray-700">
                                • {skill}
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}

export default ClassicTemplate;