import React from "react";
import logo from "../../assets/fulllogo_transparent (1).png";
import Testimonials from "./Testimonials.jsx";
import Footer from "./footer.jsx";

const Hero = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <>
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap");
        * { font-family: "Poppins", sans-serif; }
      `}</style>

      <section className="flex flex-col items-center bg-gradient-to-b from-black to-[#3B006E] text-white px-4 pb-16">
        {/* Navigation */}
        <nav className="flex items-center justify-between w-full py-4 md:px-16 lg:px-24 xl:px-32">
          <a href="#">
            <img src={logo} alt="Logo" className="h-10 w-auto" />
          </a>

          {/* Menu for desktop */}
          <div className="hidden md:flex items-center gap-8 text-sm">
            {["Home", "Features", "Pricing", "Affiliate"].map((item) => (
              <a key={item} href="#" className="text-gray-200 hover:text-gray-300">
                {item}
              </a>
            ))}
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-2 rounded-full text-sm transition">
              Submit
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden bg-gray-900 hover:bg-gray-800 text-white p-2 rounded-md transition"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {mobileOpen ? (
                <>
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </>
              ) : (
                <>
                  <path d="M4 12h16" />
                  <path d="M4 6h16" />
                  <path d="M4 18h16" />
                </>
              )}
            </svg>
          </button>

          {/* Mobile menu */}
          <div
            className={`${
              mobileOpen ? "flex" : "hidden"
            } absolute top-0 left-0 w-full h-screen bg-black/80 backdrop-blur flex-col items-center justify-center gap-8 text-white text-lg z-20 transition`}
          >
            {["Home", "Features", "Pricing", "Affiliate"].map((item) => (
              <a key={item} href="#" onClick={() => setMobileOpen(false)}>
                {item}
              </a>
            ))}
            <button className="bg-purple-600 hover:bg-purple-700 px-10 py-2 rounded-full text-sm">
              Submit
            </button>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="text-center mt-20 lg:mt-28 max-w-3xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-white to-[#5D009F] text-transparent bg-clip-text">
            AI-powered CVs that open doors
          </h1>
          <p className="text-gray-200 text-sm sm:text-base mt-4">
            Create ATS-friendly, job-ready resumes in minutes using AI.
          </p>

          {/* Search Input */}
          <div className="mt-6 flex items-center gap-2 bg-white rounded-md border border-gray-500/30 overflow-hidden max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search for a product"
              className="flex-1 px-4 py-2 outline-none text-gray-700"
            />
            <button className="bg-purple-600 hover:bg-purple-700 px-6 py-2 text-white font-medium transition">
              Search
            </button>
          </div>

          <p className="text-gray-200 mt-4 text-sm">20+ CV templates available</p>

          {/* CTA Button */}
          <button className="mt-8 bg-purple-950 hover:bg-purple-800 px-6 py-2 rounded-full text-white font-semibold transition">
            Build Your Resume
          </button>

          {/* Subheading */}
          <p className="text-sm sm:text-base md:text-lg text-gray-100 mt-4 text-center line-clamp-2">
            🚀 <span className="font-semibold">Completely free:</span> Build, customize, and download your professional resume in minutes.
          </p>
        </div>

        {/* Features Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-5xl px-4 md:px-0">
          {[
            {
              image: "https://static.vecteezy.com/system/resources/previews/047/630/119/non_2x/applicant-tracking-system-ats-color-icon-illustration-vector.jpg",
              title: "ATS Friendly",
              desc: "Build resumes optimized to pass Applicant Tracking Systems effortlessly.",
              badge: "Popular",
            },
            {
              image: "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/df/2a/f6/df2af6ef-51ba-cf2c-27c7-ffe80e666c0b/AppIcon-0-0-1x_U007ephone-0-1-85-220.png/1200x630wa.jpg",
              title: "AI Resume Builder",
              desc: "Let AI write, improve, and tailor your CV for every job role.",
              badge: "",
            },
            {
              image: "https://www.shutterstock.com/image-illustration/3d-rendered-representation-cv-resume-260nw-2504920281.jpg",
              title: "Job-Specific CVs",
              desc: "Customize resumes instantly to match job descriptions and keywords.",
              badge: "",
            },
          ].map((card, index) => (
            <div
              key={index}
              className="bg-gradient-to-b from-[#2A0150] to-[#090025] hover:-translate-y-1 transition duration-300 border border-violet-900 rounded-xl p-6 flex flex-col space-y-3"
            >
              <div className="flex justify-between items-start">
                <img src={card.image} className="w-12 h-12 rounded-lg object-cover" />
                {card.badge && (
                  <span className="bg-purple-950 text-xs px-3 py-1 rounded-full">{card.badge}</span>
                )}
              </div>
              <h3 className="text-lg text-gray-50 font-semibold">{card.title}</h3>
              <p className="text-sm text-gray-200">{card.desc}</p>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Testimonials</h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-100 mt-4 max-w-xl mx-auto line-clamp-2">
            🌟 "This AI resume builder made creating my CV so easy and professional—I landed my dream interview in no time!"
          </p>
          <Testimonials />
        </div>

        {/* Footer */}
        <Footer />
      </section>
    </>
  );
};

export default Hero;
