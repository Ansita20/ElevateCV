// Faithful clone of the classic LaTeX academic CV look (the "Jake's Resume"
// style) - strictly monochrome, no icons, pipe-separated contact line, thin
// black rules under section headers, and the standard two-line entry format
// (bold title + date on line 1, italic subtitle on line 2). Color is used
// only for hyperlinks, matching how real LaTeX resumes use hyperref.
import { getDensity } from "./density";

const SERIF_STACK = '"Times New Roman", Times, "Liberation Serif", serif';

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
const Linkify = ({ text, accentColor }) => {
    const clean = String(text || "");
    const parts = clean.split(/(https?:\/\/[^\s)]+)/g);
    return (
        <>
            {parts.map((part, i) =>
                /^https?:\/\//i.test(part) ? (
                    <a key={i} href={part} target="_blank" rel="noreferrer" className="underline break-all" style={{ color: accentColor }}>
                        {part}
                    </a>
                ) : (
                    <span key={i}>{part}</span>
                )
            )}
        </>
    );
};

const SectionHeading = ({ children, headingGap }) => (
    <h2 className={`text-[12.5px] font-bold uppercase tracking-wider pb-0.5 ${headingGap} border-b border-black text-black`}>
        {children}
    </h2>
);

const LatexClassicTemplate = ({ data, accentColor, spacing }) => {
    const info = data.personal_info || {};
    const d = getDensity(spacing);

    const contactItems = [
        info.phone && { key: "phone", href: `tel:${info.phone.replace(/[^+\d]/g, "")}`, label: info.phone },
        info.email && { key: "email", href: `mailto:${info.email}`, label: info.email },
        info.linkedin && { key: "linkedin", href: normalizeUrl(info.linkedin), label: displayUrl(info.linkedin) },
        info.website && { key: "website", href: normalizeUrl(info.website), label: displayUrl(info.website) },
        ...(data.profiles || [])
            .filter((p) => p?.url)
            .map((p, i) => ({ key: `profile-${i}`, href: normalizeUrl(p.url), label: p.label || displayUrl(p.url) })),
    ].filter(Boolean);

    return (
        <div className={`max-w-4xl mx-auto ${d.padding} bg-white text-black text-[12px] ${d.lineHeight}`} style={{ fontFamily: SERIF_STACK }}>
            {/* Header */}
            <header className={`text-center ${d.headerGap}`}>
                <h1 className="text-[26px] font-bold tracking-wide">
                    {info.full_name || "Your Name"}
                </h1>
                {info.profession && <p className="italic text-[12px] text-black">{info.profession}</p>}
                {info.location && <p className="text-[11px] text-black">{info.location}</p>}

                <div className="mt-1 flex flex-wrap justify-center items-center gap-x-1.5 gap-y-0.5 text-[11px] text-black">
                    {contactItems.map((item, index) => (
                        <span key={item.key} className="flex items-center gap-1.5">
                            {index > 0 && <span className="text-black">|</span>}
                            <a href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="hover:underline break-all" style={{ color: accentColor }}>
                                {item.label}
                            </a>
                        </span>
                    ))}
                </div>
            </header>

            {/* Professional Summary */}
            {data.professional_summary && (
                <section className={d.gap}>
                    <SectionHeading headingGap={d.headingGap}>Summary</SectionHeading>
                    <p className={`text-black ${d.lineHeight}`}>{data.professional_summary}</p>
                </section>
            )}

            {/* Education */}
            {data.education && data.education.length > 0 && (
                <section className={d.gap}>
                    <SectionHeading headingGap={d.headingGap}>Education</SectionHeading>
                    <div className={d.entryGap}>
                        {data.education.map((edu, index) => (
                            <div key={index}>
                                <div className="flex justify-between items-baseline gap-4">
                                    <h3 className="font-bold text-black">{edu.institution}</h3>
                                    <p className="text-[11px] text-black whitespace-nowrap">{formatDate(edu.graduation_date)}</p>
                                </div>
                                <p className="italic text-black">
                                    {edu.degree} {edu.field && `in ${edu.field}`}
                                    {edu.gpa && ` — GPA: ${edu.gpa}`}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Experience */}
            {data.experience && data.experience.length > 0 && (
                <section className={d.gap}>
                    <SectionHeading headingGap={d.headingGap}>Experience</SectionHeading>
                    <div className={d.entryGap}>
                        {data.experience.map((exp, index) => (
                            <div key={index}>
                                <div className="flex justify-between items-baseline gap-4">
                                    <h3 className="font-bold text-black">{exp.company}</h3>
                                    <p className="text-[11px] text-black whitespace-nowrap">
                                        {formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
                                    </p>
                                </div>
                                <div className="flex justify-between items-baseline gap-4">
                                    {exp.position && <p className="italic text-black">{exp.position}</p>}
                                    {exp.link && (
                                        <a href={normalizeUrl(exp.link)} target="_blank" rel="noreferrer" className="text-[11px] underline shrink-0" style={{ color: accentColor }}>
                                            {exp.link_label || "View Certificate"}
                                        </a>
                                    )}
                                </div>
                                {exp.description && (
                                    <ul className={`mt-0.5 ${d.bulletGap} list-disc list-outside pl-4 text-black`}>
                                        {toBullets(exp.description).map((bullet, i) => (
                                            <li key={i}><Linkify text={bullet} accentColor={accentColor} /></li>
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
                    <SectionHeading headingGap={d.headingGap}>Projects</SectionHeading>
                    <div className={d.entryGap}>
                        {data.project.map((proj, index) => (
                            <div key={index}>
                                <div className="flex justify-between items-baseline gap-4">
                                    <p className="flex items-baseline gap-1.5 flex-wrap">
                                        <span className="font-bold text-black">{proj.name}</span>
                                        {proj.type && <span className="italic text-[11px] text-black">| {proj.type}</span>}
                                    </p>
                                    {proj.link && (
                                        <a href={normalizeUrl(proj.link)} target="_blank" rel="noreferrer" className="text-[11px] underline shrink-0" style={{ color: accentColor }}>
                                            {proj.link_label || "Link"}
                                        </a>
                                    )}
                                </div>
                                {proj.description && (
                                    <ul className={`mt-0.5 ${d.bulletGap} list-disc list-outside pl-4 text-black`}>
                                        {toBullets(proj.description).map((bullet, i) => (
                                            <li key={i}><Linkify text={bullet} accentColor={accentColor} /></li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills */}
            {data.skills && data.skills.length > 0 && (
                <section>
                    <SectionHeading headingGap={d.headingGap}>Technical Skills</SectionHeading>
                    <p className="text-black"><span className="font-bold">Skills: </span>{data.skills.join(", ")}</p>
                </section>
            )}
        </div>
    );
};

export default LatexClassicTemplate;
