// Ensure React and Motion are available globally from CDN
const { useState, useEffect, useRef } = React;
// Framer Motion global is often 'Motion' or 'FramerMotion' depending on CDN
const { motion, AnimatePresence } = window.Motion || window.FramerMotion || {};

if (!motion) {
    console.error("Framer Motion not found. Please check CDN scripts.");
}

const SlotHeadline = () => {
  const words = ["Stop Worrying", "Stop Doubting", "Stop Guessing", "Start Knowing"];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-24 md:h-32 overflow-hidden flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.h1
          key={words[index]}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{ duration: 0.5, ease: "backOut" }}
          className="text-4xl md:text-7xl font-extrabold text-white text-center leading-tight"
        >
          {words[index].includes("Start") ? (
            <>
              {words[index].split(" ")[0]}{" "}
              <span className="text-brand-orange">{words[index].split(" ")[1]}</span>
            </>
          ) : (
            words[index]
          )}
        </motion.h1>
      </AnimatePresence>
    </div>
  );
};

const PulsingSubtext = () => (
  <motion.p
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1, delay: 0.5 }}
    className="text-slate-400 text-lg md:text-2xl text-center max-w-3xl mx-auto mt-8 leading-relaxed font-medium"
  >
    Get a scientific, personalized board recommendation based on your child's unique psychology in 5 minutes.
  </motion.p>
);

const MagneticButton = () => {
  const buttonRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!buttonRef.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;

    if (Math.abs(distanceX) < 150 && Math.abs(distanceY) < 150) {
      setPosition({ x: distanceX * 0.35, y: distanceY * 0.35 });
    } else {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseLeave = () => setPosition({ x: 0, y: 0 });

  return (
    <div className="flex justify-center mt-14">
      <motion.button
        ref={buttonRef}
        animate={{ x: position.x, y: position.y }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => {
          if (typeof window.scrollToPhase0 === 'function') {
            window.scrollToPhase0();
          }
        }}
        className="bg-brand-orange text-white px-10 py-5 rounded-full font-bold text-xl shadow-2xl hover:shadow-orange-500/40 transition-shadow border-2 border-orange-400/20"
      >
        Start Learning Fitment Analysis →
      </motion.button>
    </div>
  );
};

const Hero = () => {
  return (
    <section className="relative pt-40 pb-28 px-4 overflow-hidden bg-brand-navy min-h-[90vh] flex flex-col items-center justify-center">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-brand-orange/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="flex justify-center mb-8">
           <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 px-4 py-2 rounded-full text-xs font-bold text-slate-300 uppercase tracking-widest">
            ⚡ Scientific Assessment Engine
          </div>
        </div>
        
        <SlotHeadline />
        <PulsingSubtext />
        <MagneticButton />
      </div>
      
      {/* Brand Badge */}
      <div className="mt-24 text-slate-500 flex items-center gap-4 opacity-80 hover:opacity-100 transition-opacity">
        <span className="font-extrabold text-white text-lg">Apt <span className="text-brand-orange">Skola</span></span>
        <span className="w-px h-6 bg-slate-700"></span>
        <span className="text-sm font-medium tracking-wide uppercase">A Foviz Venture</span>
      </div>

      {/* Quick Links Replacement */}
      <div className="absolute top-8 right-8 flex gap-4 z-50">
          <button onClick={() => window.openSyncMatchGate && window.openSyncMatchGate()} className="hidden md:block text-xs font-bold text-slate-400 border border-slate-700/50 px-4 py-2 rounded-full hover:bg-slate-800 transition backdrop-blur-sm">
              Unlock Parent & Child Sync Check
          </button>
          <a href="https://xray.aptskola.com" target="_blank" className="hidden md:block text-xs font-bold text-slate-400 border border-slate-700/50 px-4 py-2 rounded-full hover:bg-slate-800 transition backdrop-blur-sm">
              🔎 AI School Forensic Report
          </a>
      </div>
    </section>
  );
};

// Render the component on window load to ensure CDNs are ready
window.addEventListener('load', () => {
    const container = document.getElementById('react-hero-root');
    if (container) {
        const root = ReactDOM.createRoot(container);
        root.render(<Hero />);
    }
});
