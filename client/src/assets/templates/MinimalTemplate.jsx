import { getDensity } from "./density";

const normalizeUrl = (value) => {
    const trimmed = String(value || "").trim();
    if (!trimmed) return "";
    return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
};

const MinimalTemplate = ({ data, accentColor, spacing }) => {
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
        <div className={`max-w-4xl mx-auto ${d.padding} bg-white text-gray-900 font-light ${d.lineHeight}`}>
            {/* Header */}
            <header className={d.headerGap}>
                <h1 className="text-4xl font-thin mb-4 tracking-wide">
                    {data.personal_info?.full_name || "Your Name"}
                </h1>

                <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                    {data.personal_info?.email && (
                        <a href={`mailto:${data.personal_info.email}`} className="hover:underline">{data.personal_info.email}</a>
                    )}
                    {data.personal_info?.phone && (
                        <a href={`tel:${data.personal_info.phone.replace(/[^+\d]/g, "")}`} className="hover:underline">{data.personal_info.phone}</a>
                    )}
                    {data.personal_info?.location && <span>{data.personal_info.location}</span>}
                    {data.personal_info?.linkedin && (
                        <a href={normalizeUrl(data.personal_info.linkedin)} target="_blank" rel="noreferrer" className="break-all hover:underline">{data.personal_info.linkedin}</a>
                    )}
                    {data.personal_info?.website && (
                        <a href={normalizeUrl(data.personal_info.website)} target="_blank" rel="noreferrer" className="break-all hover:underline">{data.personal_info.website}</a>
                    )}
                    {(data.profiles || []).filter((p) => p?.url).map((p, i) => (
                        <a key={i} href={normalizeUrl(p.url)} target="_blank" rel="noreferrer" className="break-all hover:underline">{p.label || p.url}</a>
                    ))}
                </div>
            </header>

            {/* Professional Summary */}
            {data.professional_summary && (
                <section className={d.gap}>
                    <p className={`text-gray-700 ${d.lineHeight}`}>
                        {data.professional_summary}
                    </p>
                </section>
            )}

            {/* Experience */}
            {data.experience && data.experience.length > 0 && (
                <section className={d.gap}>
                    <h2 className="text-sm uppercase tracking-widest mb-6 font-medium" style={{ color: accentColor }}>
                        Experience
                    </h2>

                    <div className={d.entryGap}>
                        {data.experience.map((exp, index) => (
                            <div key={index}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="text-lg font-medium">{exp.position}</h3>
                                    <span className="text-sm text-gray-500">
                                        {formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
                                    </span>
                                </div>
                                <p className="text-gray-600 mb-2">{exp.company}</p>
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
                    <h2 className="text-sm uppercase tracking-widest mb-6 font-medium" style={{ color: accentColor }}>
                        Projects
                    </h2>

                    <div className={d.entryGap}>
                        {data.project.map((proj, index) => (
                            <div key={index} className="flex flex-col gap-2 justify-between items-baseline">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h3 className="text-lg font-medium ">{proj.name}</h3>
                                    {proj.link && (
                                        <a href={normalizeUrl(proj.link)} target="_blank" rel="noreferrer" className="text-xs underline" style={{ color: accentColor }}>
                                            {proj.link_label || "Link"}
                                        </a>
                                    )}
                                </div>
                                <p className="text-gray-600">{proj.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Education */}
            {data.education && data.education.length > 0 && (
                <section className={d.gap}>
                    <h2 className="text-sm uppercase tracking-widest mb-6 font-medium" style={{ color: accentColor }}>
                        Education
                    </h2>

                    <div className={d.entryGap}>
                        {data.education.map((edu, index) => (
                            <div key={index} className="flex justify-between items-baseline">
                                <div>
                                    <h3 className="font-medium">
                                        {edu.degree} {edu.field && `in ${edu.field}`}
                                    </h3>
                                    <p className="text-gray-600">{edu.institution}</p>
                                    {edu.gpa && <p className="text-sm text-gray-500">GPA: {edu.gpa}</p>}
                                </div>
                                <span className="text-sm text-gray-500">
                                    {formatDate(edu.graduation_date)}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills */}
            {data.skills && data.skills.length > 0 && (
                <section>
                    <h2 className="text-sm uppercase tracking-widest mb-6 font-medium" style={{ color: accentColor }}>
                        Skills
                    </h2>

                    <div className="text-gray-700">
                        {data.skills.join(" • ")}
                    </div>
                </section>
            )}
        </div>
    );
}

export default MinimalTemplate;