// Final React Hero Component Fix
const { useState, useEffect, useRef } = React;
const { motion, AnimatePresence } = window.Motion || window.FramerMotion || {};

const Hero = () => {
  const words = ["Worrying", "Doubting", "Guessing", "Knowing"];
  const colors = ["text-orange-300", "text-blue-300", "text-orange-300", "text-brand-orange"];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex((prev) => (prev + 1) % words.length), 2000);
    return () => clearInterval(timer);
  }, []);

  const handleClick = () => {
    console.log("React Button: Triggering Quiz...");
    window.currentPhase = 0;
    if (typeof window.initializeQuizShell === 'function') {
      window.initializeQuizShell(0);
    }
  };

  // Global click listener fail-safe
  useEffect(() => {
    const handleGlobalClick = (e) => {
      if (e.target && e.target.textContent && e.target.textContent.includes("Start Learning Fitment Analysis")) {
        console.log("Global catch: Start Learning Fitment Analysis clicked");
        handleClick();
      }
    };
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  return (
    <section className="relative pt-40 pb-28 px-4 overflow-hidden bg-brand-navy min-h-[90vh] flex flex-col items-center justify-center">
      {/* High-Contrast Shadow Buttons - Landing Page Top Right */}
      <div className="absolute top-6 right-6 flex gap-4 z-[1000]">
          <button 
            onClick={() => window.openSyncMatchGate && window.openSyncMatchGate()} 
            className="border-2 border-orange-500"
            style={{background: '#0F172A', color: 'white', padding: '6px 14px', borderRadius: '50px', fontWeight: '800', fontSize: '0.8rem', cursor: 'pointer', boxShadow: '0 4px 15px rgba(249,115,22,0.3)'}}
          >
              Parent and Child Sync Check
          </button>
          <a 
            href="https://xray.aptskola.com" 
            target="_blank" 
            className="border-2 border-yellow-500"
            style={{background: '#0F172A', color: 'white', padding: '6px 14px', borderRadius: '50px', fontWeight: '800', fontSize: '0.8rem', textDecoration: 'none', boxShadow: '0 4px 15px rgba(234,179,8,0.3)'}}
          >
              School/College X-ray
          </a>
      </div>

      <div className="hero-top-nav">
          <span className="font-extrabold text-white text-2xl">Apt <span className="text-brand-orange">Skola</span></span>
          <span className="w-px h-6 bg-slate-700 mx-4"></span>
          <span className="text-sm font-medium tracking-wide uppercase text-slate-400">A Foviz Venture</span>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 h-32 md:h-40">
          <h1 className={`text-4xl md:text-7xl font-extrabold text-center leading-tight ${words[index] === "Knowing" ? "text-green-500" : "text-red-500"}`}>
            {words[index] === "Knowing" ? "START" : "STOP"}
          </h1>
          <div className="overflow-hidden h-16 md:h-24 flex items-center">
            <AnimatePresence mode="wait">
              <motion.h1
                key={words[index]}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -40, opacity: 0 }}
                transition={{ duration: 0.5, ease: "backOut" }}
                className={`text-4xl md:text-7xl font-extrabold text-center leading-tight ${colors[index]}`}
              >
                {words[index]}
              </motion.h1>
            </AnimatePresence>
          </div>
        </div>

        <p className="text-brand-orange font-bold text-xl md:text-2xl mt-4 uppercase tracking-wider text-center">Find Your Child's Perfect School Board</p>
        
        <p className="text-slate-400 text-lg md:text-2xl text-center max-w-3xl mx-auto mt-8 leading-relaxed font-medium">
          Get a scientific, personalized board recommendation based on your child's unique psychology in 5 minutes.
        </p>

        <button 
          onClick={handleClick}
          className="bg-brand-orange text-white px-10 py-5 rounded-full font-bold text-xl shadow-2xl hover:scale-105 transition-all mt-14 border-2 border-brand-orange"
        >
          Start Learning Fitment Analysis <span className="hero-arrow-massive">→</span>
        </button>
      </div>
    </section>
  );
};

window.addEventListener('load', () => {
    const container = document.getElementById('react-hero-root');
    if (container) {
        const root = ReactDOM.createRoot(container);
        root.render(<Hero />);
    }
});
