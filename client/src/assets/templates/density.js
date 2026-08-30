// Shared spacing presets so every template can be squeezed onto one page.
// ATS-friendly resumes are almost always expected to fit a single page, so
// "compact" trims padding/margins/line-height without changing font choice
// or removing content.
export const DENSITY_PRESETS = {
    compact: {
        padding: "px-6 py-4",
        gap: "mb-1.5",
        headingGap: "mb-1",
        entryGap: "space-y-1.5",
        bulletGap: "space-y-0",
        lineHeight: "leading-tight",
        headerGap: "mb-2",
    },
    normal: {
        padding: "px-10 py-8",
        gap: "mb-3",
        headingGap: "mb-1.5",
        entryGap: "space-y-2.5",
        bulletGap: "space-y-0.5",
        lineHeight: "leading-snug",
        headerGap: "mb-3",
    },
    relaxed: {
        padding: "px-12 py-10",
        gap: "mb-5",
        headingGap: "mb-2.5",
        entryGap: "space-y-4",
        bulletGap: "space-y-1.5",
        lineHeight: "leading-relaxed",
        headerGap: "mb-5",
    },
};

export const getDensity = (spacing) => DENSITY_PRESETS[spacing] || DENSITY_PRESETS.normal;
