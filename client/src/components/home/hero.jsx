import React from 'react'
import logo from '../../assets/fulllogo_transparent (1).png'

const hero = () => {
      const [mobileOpen, setMobileOpen] = React.useState(false)
return (
        <>
            <style>{`
            
                @import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");

                * {
                    font-family: "Poppins", sans-serif;
                }`}
            </style>
            <section className='flex flex-col items-center bg-gradient-to-b from-black to-[#3B006E] text-white px-4 pb-10'>
                <nav className="flex items-center justify-between py-3 md:px-16 lg:px-24 xl:px-32 md:py-4 w-full">
                    <a href="#">
                        <img src={logo} alt="Full Logo" className="h-10 w-auto" />
                    </a>
                    <div id="menu" className={`${mobileOpen ? 'max-md:w-full' : 'max-md:w-0'} max-md:absolute max-md:top-0 max-md:z-10 max-md:left-0 max-md:transition-all max-md:duration-300 max-md:overflow-hidden max-md:h-full max-md:bg-black/50 max-md:backdrop-blur max-md:flex-col max-md:justify-center flex items-center gap-8 text-sm`}>
                        <a href="#" onClick={() => setMobileOpen(false)} className="text-gray-200 hover:text-gray-300">Home</a>
                        <a href="#" onClick={() => setMobileOpen(false)} className="text-gray-200 hover:text-gray-300">Features</a>
                        <a href="#" onClick={() => setMobileOpen(false)} className="text-gray-200 hover:text-gray-300">Pricing</a>
                        <a href="#" onClick={() => setMobileOpen(false)} className="text-gray-200 hover:text-gray-300">Affiliate</a>

                        <button className="md:hidden bg-purple-600 hover:bg-purple-700 text-slate-50 px-10 h-10 rounded-full text-sm transition">
                            Submit
                        </button>
                        <button id="close-menu" onClick={() => setMobileOpen(false)} className="md:hidden bg-gray-900 hover:bg-gray-800 text-white p-2 rounded-md aspect-square font-medium transition">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M18 6 6 18" />
                                <path d="m6 6 12 12" />
                            </svg>
                        </button>
                    </div>
                    <button className="hidden md:block bg-purple-600 hover:bg-purple-700 text-slate-50 px-10 h-10 rounded-full text-sm transition">
                        Submit
                    </button>

                    <button id="open-menu" onClick={() => setMobileOpen(true)}
                        className="md:hidden bg-gray-900 hover:bg-gray-800 text-white p-2 rounded-md aspect-square font-medium transition">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M4 12h16" />
                            <path d="M4 18h16" />
                            <path d="M4 6h16" />
                        </svg>
                    </button>
                </nav>

                {/* Avatars + Stars */}
                <div className="flex items-center mt-32 mx-auto lg:mx-0">
                    <div className="flex -space-x-3 pr-3">
                        <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200" alt="user3" className="size-8 object-cover rounded-full border-2 border-white hover:-translate-y-0.5 transition z-[1]" />
                        <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200" alt="user1" className="size-8 object-cover rounded-full border-2 border-white hover:-translate-y-0.5 transition z-2" />
                        <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200" alt="user2" className="size-8 object-cover rounded-full border-2 border-white hover:-translate-y-0.5 transition z-[3]" />
                        <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200" alt="user3" className="size-8 object-cover rounded-full border-2 border-white hover:-translate-y-0.5 transition z-[4]" />
                    </div>

                    <div>
                        <div className="flex ">
                            {Array(5).fill(0).map((_, i) => (
                                <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star text-transparent fill-[#FF8F20]" aria-hidden="true"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg>
                            ))}
                        </div>
                        <p className="text-xs text-gray-200">Used by 10,000+ users</p>
                    </div>
                </div>

                <h1 className="text-[42px]/13 md:text-6xl/19 font-semibold text-center max-w-[840px] mt-4 bg-gradient-to-r from-white to-[#5D009F] text-transparent bg-clip-text">
                    One Directory. Thousands of AI Possibilities.
                </h1>
                <p className="text-gray-200 text-sm max-md:px-2 text-center max-w-sm mt-3">
                    Unlock the perfect tools for automation, content, research, coding, and more.
                </p>

                <div className="mt-8 flex items-center text-sm bg-white h-13 border pl-3 pr-0.5 rounded-md border-gray-500/30 w-full max-w-md">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className='text-gray-400 shrink-0'><path d="m21 21-4.34-4.34" /><circle cx="11" cy="11" r="8" /></svg>
                    <input className="px-2 w-full h-full outline-none placeholder:text-gray-500 text-gray-500 bg-transparent rounded-lg" type="email" placeholder="Search for a product" />
                    <button type="submit" className="bg-purple-600 hover:bg-purple-700 px-10 h-11 font-medium text-sm rounded-lg">Search</button>
                </div>

                <p className='text-gray-200 mt-4 text-sm'>2000+ products and updating every day</p>

                <div className='relative max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-8 md:px-0 mt-14'>
                    <div className='bg-linear-to-b from-[#2A0150] to-[#090025] hover:-translate-y-1 transition duration-300 border border-violet-900 rounded-lg p-6 space-y-4'>
                        <div className='flex items-start justify-between'>
                            <img className='w-12 h-12' src='https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/companyLogo/mark/figma.png' alt="figma" />
                            <button className='bg-purple-950 text-xs text-slate-50 rounded-full px-4 py-2'>New</button>
                        </div>
                        <p className='text-lg text-gray-50'>Figma</p>
                        <p className='text-sm text-gray-200'>Let AI handle the repetitive, time-consuming tasks so your.</p>
                    </div>
                    <div className='bg-linear-to-b from-[#2A0150] to-[#090025] hover:-translate-y-1 transition duration-300 border border-violet-900 rounded-lg p-6 space-y-4'>
                        <img className='w-12 h-12' src='https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/companyLogo/mark/miro.png' alt="miro" />
                        <p className='text-lg text-gray-50'>Miro</p>
                        <p className='text-sm text-gray-200'>Empower your business by letting AI take over repetitive tasks.</p>
                    </div>
                    <div className='bg-linear-to-b from-[#2A0150] to-[#090025] hover:-translate-y-1 transition duration-300 border border-violet-900 rounded-lg p-6 space-y-4'>
                        <img className='w-12 h-12' src='https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/companyLogo/mark/webflow.png' alt="webflow" />
                        <p className='text-lg text-gray-50'>Webflow</p>
                        <p className='text-sm text-gray-200'>AI takes care of the repetitive stuff, so your team can focus.</p>
                    </div>
                </div>
            </section>
        </>
    )
}

export default hero
