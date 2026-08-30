import { Mail, Phone, MapPin, Linkedin, Globe, Link2 } from "lucide-react";
import { getDensity } from "./density";

const normalizeUrl = (value) => {
    const trimmed = String(value || "").trim();
    if (!trimmed) return "";
    return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
};

const MinimalImageTemplate = ({ data, accentColor, spacing }) => {
    const d = getDensity(spacing);
    const colPadding = spacing === "compact" ? "py-6" : spacing === "relaxed" ? "py-12" : "py-10";
    const asidePadding = spacing === "compact" ? "p-4 pt-0" : spacing === "relaxed" ? "p-8 pt-0" : "p-6 pt-0";
    const mainPadding = spacing === "compact" ? "p-6 pt-0" : spacing === "relaxed" ? "p-10 pt-0" : "p-8 pt-0";
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        if (!/^\d{4}-\d{2}$/.test(dateStr)) return dateStr;
        const [year, month] = dateStr.split("-");
        return new Date(year, month - 1).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
        });
    };

    return (
        <div className="max-w-5xl mx-auto bg-white text-zinc-800">
            <div className="grid grid-cols-3">

                <div className={`col-span-1 ${colPadding}`}>
                    {/* Image */}
                    {data.personal_info?.image && typeof data.personal_info.image === 'string' ? (
                        <div className="mb-6">
                            <img src={data.personal_info.image} alt="Profile" className="w-32 h-32 object-cover rounded-full mx-auto" style={{ background: accentColor+'70' }} />
                        </div>
                    ) : (
                        data.personal_info?.image && typeof data.personal_info.image === 'object' ? (
                            <div className="mb-6">
                                <img src={URL.createObjectURL(data.personal_info.image)} alt="Profile" className="w-32 h-32 object-cover rounded-full mx-auto" />
                            </div>
                        ) : null
                    )}
                </div>

                {/* Name + Title */}
                <div className={`col-span-2 flex flex-col justify-center ${colPadding} px-8`}>
                    <h1 className="text-4xl font-bold text-zinc-700 tracking-widest">
                        {data.personal_info?.full_name || "Your Name"}
                    </h1>
                    <p className="uppercase text-zinc-600 font-medium text-sm tracking-widest">
                        {data?.personal_info?.profession || "Profession"}
                    </p>
                </div>

                {/* Left Sidebar */}
                <aside className={`col-span-1 border-r border-zinc-400 ${asidePadding}`}>


                    {/* Contact */}
                    <section className={d.gap}>
                        <h2 className="text-sm font-semibold tracking-widest text-zinc-600 mb-3">
                            CONTACT
                        </h2>
                        <div className="space-y-2 text-sm">
                            {data.personal_info?.phone && (
                                <a href={`tel:${data.personal_info.phone.replace(/[^+\d]/g, "")}`} className="flex items-center gap-2 hover:underline">
                                    <Phone size={14} style={{ color: accentColor }} />
                                    <span>{data.personal_info.phone}</span>
                                </a>
                            )}
                            {data.personal_info?.email && (
                                <a href={`mailto:${data.personal_info.email}`} className="flex items-center gap-2 hover:underline">
                                    <Mail size={14} style={{ color: accentColor }} />
                                    <span className="break-all">{data.personal_info.email}</span>
                                </a>
                            )}
                            {data.personal_info?.location && (
                                <div className="flex items-center gap-2">
                                    <MapPin size={14} style={{ color: accentColor }} />
                                    <span>{data.personal_info.location}</span>
                                </div>
                            )}
                            {data.personal_info?.linkedin && (
                                <a href={normalizeUrl(data.personal_info.linkedin)} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:underline">
                                    <Linkedin size={14} style={{ color: accentColor }} />
                                    <span className="break-all">{data.personal_info.linkedin}</span>
                                </a>
                            )}
                            {data.personal_info?.website && (
                                <a href={normalizeUrl(data.personal_info.website)} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:underline">
                                    <Globe size={14} style={{ color: accentColor }} />
                                    <span className="break-all">{data.personal_info.website}</span>
                                </a>
                            )}
                            {(data.profiles || []).filter((p) => p?.url).map((p, i) => (
                                <a key={i} href={normalizeUrl(p.url)} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:underline">
                                    <Link2 size={14} style={{ color: accentColor }} />
                                    <span className="break-all">{p.label || p.url}</span>
                                </a>
                            ))}
                        </div>
                    </section>

                    {/* Education */}
                    {data.education && data.education.length > 0 && (
                        <section className={d.gap}>
                            <h2 className="text-sm font-semibold tracking-widest text-zinc-600 mb-3">
                                EDUCATION
                            </h2>
                            <div className={`${d.entryGap} text-sm`}>
                                {data.education.map((edu, index) => (
                                    <div key={index}>
                                        <p className="font-semibold uppercase">{edu.degree}</p>
                                        <p className="text-zinc-600">{edu.institution}</p>
                                        <p className="text-xs text-zinc-500">
                                            {formatDate(edu.graduation_date)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Skills */}
                    {data.skills && data.skills.length > 0 && (
                        <section>
                            <h2 className="text-sm font-semibold tracking-widest text-zinc-600 mb-3">
                                SKILLS
                            </h2>
                            <ul className={`${d.bulletGap} text-sm`}>
                                {data.skills.map((skill, index) => (
                                    <li key={index}>{skill}</li>
                                ))}
                            </ul>
                        </section>
                    )}
                </aside>

                {/* Right Content */}
                <main className={`col-span-2 ${mainPadding}`}>

                    {/* Summary */}
                    {data.professional_summary && (
                        <section className={d.gap}>
                            <h2 className="text-sm font-semibold tracking-widest mb-3" style={{ color: accentColor }} >
                                SUMMARY
                            </h2>
                            <p className={`text-zinc-700 ${d.lineHeight}`}>
                                {data.professional_summary}
                            </p>
                        </section>
                    )}

                    {/* Experience */}
                    {data.experience && data.experience.length > 0 && (
                        <section>
                            <h2 className="text-sm font-semibold tracking-widest mb-4" style={{ color: accentColor }} >
                                EXPERIENCE
                            </h2>
                            <div className={`${d.entryGap} ${d.gap}`}>
                                {data.experience.map((exp, index) => (
                                    <div key={index}>
                                        <div className="flex justify-between items-center">
                                            <h3 className="font-semibold text-zinc-900">
                                                {exp.position}
                                            </h3>
                                            <span className="text-xs text-zinc-500">
                                                {formatDate(exp.start_date)} -{" "}
                                                {exp.is_current ? "Present" : formatDate(exp.end_date)}
                                            </span>
                                        </div>
                                        <p className="text-sm mb-2" style={{ color: accentColor }} >
                                            {exp.company}
                                        </p>
                                        {exp.link && (
                                            <a href={normalizeUrl(exp.link)} target="_blank" rel="noreferrer" className="text-xs underline block mb-1" style={{ color: accentColor }}>
                                                {exp.link_label || "View Certificate"}
                                            </a>
                                        )}
                                        {exp.description && (
                                            <ul className={`list-disc list-inside text-sm text-zinc-700 ${d.lineHeight} ${d.bulletGap}`}>
                                                {exp.description.split("\n").map((line, i) => (
                                                    <li key={i}>{line}</li>
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
                        <section>
                            <h2 className="text-sm uppercase tracking-widest font-semibold" style={{ color: accentColor }}>
                                PROJECTS
                            </h2>
                            <div className={d.entryGap}>
                                {data.project.map((project, index) => (
                                    <div key={index}>
                                        <div className="flex items-center gap-2 flex-wrap mt-3">
                                            <h3 className="text-md font-medium text-zinc-800">{project.name}</h3>
                                            {project.link && (
                                                <a href={normalizeUrl(project.link)} target="_blank" rel="noreferrer" className="text-xs underline" style={{ color: accentColor }}>
                                                    {project.link_label || "Link"}
                                                </a>
                                            )}
                                        </div>
                                        <p className="text-sm mb-1" style={{ color: accentColor }} >
                                            {project.type}
                                        </p>
                                        {project.description && (
                                            <ul className={`list-disc list-inside text-sm text-zinc-700 ${d.bulletGap}`}>
                                                {project.description.split("\n").map((line, i) => (
                                                    <li key={i}>{line}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </main>
            </div>
        </div>
    );
}


export default MinimalImageTemplate;