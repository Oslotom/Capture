// Decorative, tilted iPhone frame previewing the active-run map screen.
// Built from CSS/SVG rather than a live map — it's a static hero visual.
export const PhoneMockup = () => {
  return (
    <div className="[perspective:1000px]">
      <div className="w-44 rotate-[9deg] transition-transform duration-500 hover:rotate-[6deg]">
        <div className="relative rounded-[2.2rem] border-[6px] border-[#1a1b1e] bg-[#1a1b1e] shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-[#1a1b1e] rounded-b-xl z-20" />

          {/* Screen */}
          <div className="relative w-full aspect-[9/19.5] rounded-[1.7rem] overflow-hidden bg-[#EAF0EC]">
            {/* Fake map terrain */}
            <svg viewBox="0 0 180 390" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
              <rect width="180" height="390" fill="#EAF0EC" />
              <g stroke="#D3DEDA" strokeWidth="1.5">
                <path d="M0 60 H180" /><path d="M0 130 H180" /><path d="M0 210 H180" /><path d="M0 290 H180" /><path d="M0 350 H180" />
                <path d="M40 0 V390" /><path d="M95 0 V390" /><path d="M145 0 V390" />
              </g>
              {/* Territory blobs */}
              <polygon points="30,150 70,130 85,170 55,205 20,190" fill="#F43F5E" fillOpacity="0.35" stroke="#F43F5E" strokeWidth="2" />
              <polygon points="90,110 130,95 150,140 120,165 85,150" fill="#14B8A6" fillOpacity="0.35" stroke="#14B8A6" strokeWidth="2" />
              <polygon points="60,220 100,205 125,245 95,280 55,265" fill="#8B5CF6" fillOpacity="0.35" stroke="#8B5CF6" strokeWidth="2" />
              {/* Route */}
              <path d="M75,320 L90,280 L70,240 L100,200" fill="none" stroke="#32E03F" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="75" cy="320" r="6" fill="#32E03F" stroke="white" strokeWidth="2" />
            </svg>

            {/* Top HUD */}
            <div className="absolute top-6 left-3 right-3 z-10 flex justify-between items-start">
              <div className="bg-white/90 rounded-full pl-1.5 pr-2.5 py-1 shadow-md flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span className="text-[6px] font-black uppercase tracking-widest text-black">TRACKING · RUN</span>
              </div>
            </div>
            <div className="absolute top-6 right-3 z-10">
              <div className="bg-white/90 rounded-full px-2 py-1 shadow-md">
                <span className="text-[7px] font-black italic text-black">04:12</span>
              </div>
            </div>

            {/* Bottom sheet */}
            <div className="absolute bottom-0 left-0 right-0 z-10 bg-white rounded-t-2xl px-3 pt-3 pb-4 shadow-[0_-10px_20px_rgba(0,0,0,0.15)]">
              <div className="w-6 h-0.5 bg-surface-secondary rounded-full mx-auto mb-2 opacity-60" />
              <div className="grid grid-cols-3 gap-1 text-center mb-2">
                <div>
                  <p className="text-[4px] text-textSecondary font-black uppercase tracking-widest">Distance</p>
                  <p className="text-[8px] font-black italic text-black">0.62 <span className="text-[4px] font-bold">KM</span></p>
                </div>
                <div>
                  <p className="text-[4px] text-textSecondary font-black uppercase tracking-widest">Duration</p>
                  <p className="text-[8px] font-black italic text-black">04:12</p>
                </div>
                <div>
                  <p className="text-[4px] text-textSecondary font-black uppercase tracking-widest">Pace</p>
                  <p className="text-[8px] font-black italic text-black">6:47</p>
                </div>
              </div>
              <div className="flex gap-1">
                <div className="flex-1 h-4 bg-[#090A0C] rounded-md" />
                <div className="flex-1 h-4 bg-accent rounded-md" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
