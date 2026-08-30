import { Mail, Phone, MapPin, Linkedin, Globe, Link2 } from "lucide-react";
import { getDensity } from "./density";

// Shared helpers -------------------------------------------------------

const formatDate = (dateStr) => {
    if (!dateStr) return "";
    if (!/^\d{4}-\d{2}$/.test(dateStr)) return dateStr; // already free-text (e.g. "May 2026")
    const [year, month] = dateStr.split("-");
    return new Date(year, month - 1).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short"
    });
};

const normalizeUrl = (value) => {
    const trimmed = String(value || "").trim();
    if (!trimmed) return "";
    return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
};

const displayUrl = (value) => String(value || "").trim().replace(/^https?:\/\/(www\.)?/i, "");

// Splits a description into bullet points: respects manual line breaks if
// present, otherwise falls back to splitting on sentence boundaries so a
// single-paragraph AI description still reads as a clean bulleted list.
const toBullets = (text) => {
    const clean = String(text || "").trim();
    if (!clean) return [];
    const lines = clean.split(/\n+/).map((line) => line.trim()).filter(Boolean);
    if (lines.length > 1) return lines;

    // Protect URLs before sentence-splitting so periods inside them
    // (e.g. "github.com") don't get mistaken for sentence boundaries.
    const urls = [];
    const withPlaceholders = clean.replace(/https?:\/\/[^\s)]+/g, (match) => {
        urls.push(match);
        return `__URL${urls.length - 1}__`;
    });
    const sentences = withPlaceholders.match(/[^.!?]+[.!?]+(\s|$)/g) || [withPlaceholders];
    return sentences
        .map((s) => s.trim().replace(/__URL(\d+)__/g, (_, i) => urls[Number(i)]))
        .filter(Boolean);
};

// Turns any bare URL inside a string into a real clickable link.
const Linkify = ({ text }) => {
    const clean = String(text || "");
    const parts = clean.split(/(https?:\/\/[^\s)]+)/g);
    return (
        <>
            {parts.map((part, i) =>
                /^https?:\/\//i.test(part) ? (
                    <a key={i} href={part} target="_blank" rel="noreferrer" className="underline break-all">
                        {part}
                    </a>
                ) : (
                    <span key={i}>{part}</span>
                )
            )}
        </>
    );
};

const SectionHeading = ({ children, accentColor, headingGap }) => (
    <h2
        className={`text-sm font-bold uppercase tracking-widest ${headingGap} pl-3 border-l-4`}
        style={{ borderColor: accentColor, color: accentColor }}
    >
        {children}
    </h2>
);

const LatexModernTemplate = ({ data, accentColor, spacing }) => {
    const info = data.personal_info || {};
    const d = getDensity(spacing);

    return (
        <div className={`max-w-4xl mx-auto ${d.padding} bg-white text-gray-900 text-[13px] ${d.lineHeight}`}>
            {/* Header */}
            <header className={`flex flex-wrap justify-between items-start gap-4 pb-4 ${d.headerGap} border-b-2`} style={{ borderColor: accentColor }}>
                <div>
                    <h1 className="text-3xl font-bold" style={{ color: accentColor }}>
                        {info.full_name || "Your Name"}
                    </h1>
                    {info.profession && (
                        <p className="mt-1 text-sm font-medium text-gray-600">{info.profession}</p>
                    )}
                </div>

                <div className="flex flex-col items-start sm:items-end gap-1 text-[12px] text-gray-700">
                    {info.email && (
                        <a href={`mailto:${info.email}`} className="flex items-center gap-1.5 hover:underline">
                            <Mail className="size-3.5" /> {info.email}
                        </a>
                    )}
                    {info.phone && (
                        <a href={`tel:${info.phone.replace(/[^+\d]/g, "")}`} className="flex items-center gap-1.5 hover:underline">
                            <Phone className="size-3.5" /> {info.phone}
                        </a>
                    )}
                    {info.location && (
                        <span className="flex items-center gap-1.5">
                            <MapPin className="size-3.5" /> {info.location}
                        </span>
                    )}
                    {info.linkedin && (
                        <a href={normalizeUrl(info.linkedin)} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:underline break-all">
                            <Linkedin className="size-3.5" /> {displayUrl(info.linkedin)}
                        </a>
                    )}
                    {info.website && (
                        <a href={normalizeUrl(info.website)} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:underline break-all">
                            <Globe className="size-3.5" /> {displayUrl(info.website)}
                        </a>
                    )}
                    {(data.profiles || []).filter((p) => p?.url).map((p, i) => (
                        <a key={i} href={normalizeUrl(p.url)} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:underline break-all">
                            <Link2 className="size-3.5" /> {p.label || displayUrl(p.url)}
                        </a>
                    ))}
                </div>
            </header>

            {/* Professional Summary */}
            {data.professional_summary && (
                <section className={d.gap}>
                    <SectionHeading accentColor={accentColor} headingGap={d.headingGap}>Summary</SectionHeading>
                    <p className={`text-gray-800 ${d.lineHeight}`}>{data.professional_summary}</p>
                </section>
            )}

            {/* Experience */}
            {data.experience && data.experience.length > 0 && (
                <section className={d.gap}>
                    <SectionHeading accentColor={accentColor} headingGap={d.headingGap}>Experience</SectionHeading>
                    <div className={d.entryGap}>
                        {data.experience.map((exp, index) => (
                            <div key={index}>
                                <div className="flex justify-between items-baseline gap-4">
                                    <h3 className="font-semibold text-gray-900">
                                        {exp.position}{exp.company && <span className="font-normal text-gray-600"> · {exp.company}</span>}
                                    </h3>
                                    <p className="text-sm text-gray-500 whitespace-nowrap">
                                        {formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
                                    </p>
                                </div>
                                {exp.link && (
                                    <a href={normalizeUrl(exp.link)} target="_blank" rel="noreferrer" className="text-xs underline" style={{ color: accentColor }}>
                                        {exp.link_label || "View Certificate"}
                                    </a>
                                )}
                                {exp.description && (
                                    <ul className={`mt-1 ${d.bulletGap} list-disc list-outside pl-5 text-gray-800`}>
                                        {toBullets(exp.description).map((bullet, i) => (
                                            <li key={i}><Linkify text={bullet} /></li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Projects */}
            {data.project && data.project.length > 0 && (
                <section className={d.gap}>
                    <SectionHeading accentColor={accentColor} headingGap={d.headingGap}>Projects</SectionHeading>
                    <div className={d.entryGap}>
                        {data.project.map((proj, index) => (
                            <div key={index}>
                                <div className="flex items-baseline gap-2 flex-wrap">
                                    <h3 className="font-semibold text-gray-900">{proj.name}</h3>
                                    {proj.type && <span className="text-sm text-gray-500">{proj.type}</span>}
                                    {proj.link && (
                                        <a href={normalizeUrl(proj.link)} target="_blank" rel="noreferrer" className="text-xs underline" style={{ color: accentColor }}>
                                            {proj.link_label || "Link"}
                                        </a>
                                    )}
                                </div>
                                {proj.description && (
                                    <ul className={`mt-1 ${d.bulletGap} list-disc list-outside pl-5 text-gray-800`}>
                                        {toBullets(proj.description).map((bullet, i) => (
                                            <li key={i}><Linkify text={bullet} /></li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Education */}
            {data.education && data.education.length > 0 && (
                <section className={d.gap}>
                    <SectionHeading accentColor={accentColor} headingGap={d.headingGap}>Education</SectionHeading>
                    <div className={d.entryGap}>
                        {data.education.map((edu, index) => (
                            <div key={index} className="flex justify-between items-baseline gap-4">
                                <div>
                                    <h3 className="font-semibold text-gray-900">{edu.institution}</h3>
                                    <p className="text-gray-600">
                                        {edu.degree} {edu.field && `in ${edu.field}`}
                                        {edu.gpa && ` · GPA: ${edu.gpa}`}
                                    </p>
                                </div>
                                <p className="text-sm text-gray-500 whitespace-nowrap">{formatDate(edu.graduation_date)}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills */}
            {data.skills && data.skills.length > 0 && (
                <section>
                    <SectionHeading accentColor={accentColor} headingGap={d.headingGap}>Technical Skills</SectionHeading>
                    <div className="flex flex-wrap gap-2">
                        {data.skills.map((skill, index) => (
                            <span
                                key={index}
                                className="text-xs px-2.5 py-1 rounded-full border"
                                style={{ borderColor: accentColor, color: accentColor }}
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default LatexModernTemplate;
