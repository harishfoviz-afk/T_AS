// --- STATE MANAGEMENT ---
window.phase0Complete = false;
let currentQuestion = 0;
let answers = {};
let customerData = { orderId: 'N/A', childAge: '5-10' };
let isSyncMatchMode = false;

// --- GLOBAL BRIDGE ---
window.hideAllSections = function hideAllSections() {
    const sections = ['landingPage', 'aboutAptSkola', 'pricing', 'invest-in-clarity', 'testimonials', 'educatorPartner', 'contact-and-policies', 'mainFooter', 'detailsPage', 'paymentPageContainer', 'questionPages', 'successPage', 'syncMatchGate', 'syncMatchTransition', 'react-hero-root'];
    sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.classList.add('hidden');
            el.classList.remove('active');
            el.style.display = 'none';
        }
    });
    window.scrollTo({ top: 0, behavior: 'instant' });
};

window.initializeQuizShell = function initializeQuizShell(index) {
    console.log("Global: Initializing Quiz Shell for index", index);
    window.hideAllSections();
    const container = document.getElementById('questionPages');
    if (container) {
        container.classList.remove('hidden');
        container.classList.add('active');
        container.style.display = 'flex';
        container.innerHTML = `
            <div id="questionPageApp" class="question-page active" style="display: flex !important; flex-direction: column; min-height: 100vh; width: 100%; background: white; position: fixed; top: 0; left: 0; z-index: 9999;">
                <div class="intermediate-header" onclick="location.reload()" style="background: #0F172A; color: white; padding: 1rem 2rem; cursor: pointer;">
                    <span class="font-bold text-xl">Apt <span style="color: #FF6B35;">Skola</span></span>
                </div>
                <div class="question-content-wrapper" style="flex: 1; display: flex; align-items: center; justify-content: center; padding: 40px 20px;">
                    <div id="dynamicQuizContent" class="question-container" style="max-width: 750px; width: 100%;"></div>
                </div>
                <div class="intermediate-footer" style="background: #0F172A; color: #CBD5E1; padding: 1.5rem; text-align: center; font-size: 0.85rem;">
                    © 2026 Apt Skola
                </div>
            </div>`;
        window.renderQuestionContent(index);
    }
};

window.renderQuestionContent = function renderQuestionContent(index) {
    currentQuestion = index;
    const quizContent = document.getElementById('dynamicQuizContent');
    if (!quizContent) return;

    // Trigger Histogram only if Phase 0 just finished and we haven't shown it yet
    if (index === 4 && !isSyncMatchMode && !window.phase0Complete) {
        window.showPsychometricHistogram();
        return;
    }

    const q = questions[index];
    if(!q) return;

    // Calculate Dynamic UI values for numbering
    const isPhase0 = index < 4;
    const displayTotal = isPhase0 ? 4 : (isSyncMatchMode ? 30 : 15);
    const currentQNum = isPhase0 ? index + 1 : (isSyncMatchMode ? index + 1 : index - 3);
    const progressPercent = (currentQNum / displayTotal * 100).toFixed(0);
    const phaseLabel = isPhase0 ? "Phase 0: DNA Scan" : "Phase 1: Fitment Analysis";

    quizContent.innerHTML = `
        <div class="progress-container mb-10">
            <div class="progress-track h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
                <div class="progress-fill h-full bg-brand-orange transition-all duration-500" style="width: ${progressPercent}%"></div>
            </div>
            <div class="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                <span>${phaseLabel}</span>
                <span>Question ${currentQNum} / ${displayTotal}</span>
            </div>
        </div>
        <div class="question-text text-3xl font-extrabold text-brand-navy mb-10 leading-tight">${q.text}</div>
        <div class="options-grid grid gap-4">
            ${q.options.map((opt, i) => `
                <div class="option-card p-6 bg-slate-50 border-2 border-transparent rounded-2xl cursor-pointer hover:bg-slate-100 hover:border-slate-300 transition-all font-bold text-lg text-brand-navy" 
                     onclick="window.selectOption('${q.id}', ${i}, ${index}, this)">${opt}</div>
            `).join('')}
        </div>
        <div class="mt-12 text-center">
            <button onclick="window.handlePrev()" class="text-slate-400 font-bold hover:text-brand-navy transition-colors flex items-center justify-center gap-2 mx-auto">
                BACK TO PREVIOUS
            </button>
        </div>`;
};

window.handlePrev = function() {
    if (currentQuestion > 0) window.renderQuestionContent(currentQuestion - 1);
};

window.selectOption = function selectOption(id, val, idx, el) {
    answers[id] = val;
    el.style.borderColor = "#0F172A";
    setTimeout(() => window.renderQuestionContent(idx + 1), 300);
};

window.showPsychometricHistogram = function() {
    const container = document.getElementById('dynamicQuizContent');
    container.innerHTML = `
        <div class="p-8 bg-brand-navy rounded-3xl border border-slate-700 shadow-2xl text-center">
            <h2 class="text-white text-xl font-bold mb-8 uppercase tracking-widest">Psychometric DNA Snapshot</h2>
            <div class="space-y-6 mb-10 text-left">
                ${['Cognitive Synthesis', 'Pressure Threshold', 'Ambition Vector', 'Logic Architecture'].map(label => `
                    <div class="space-y-2">
                        <div class="flex justify-between text-xs font-bold text-slate-400"><span>${label}</span><span>ANALYZING...</span></div>
                        <div class="h-3 bg-slate-800 rounded-full overflow-hidden">
                            <div class="h-full bg-brand-orange animate-pulse" style="width: ${Math.random() * 40 + 60}%"></div>
                        </div>
                    </div>`).join('')}
            </div>
            <div id="compIndex" class="text-6xl font-black text-white animate-flicker">--%</div>
        </div>`;
    let count = 0;
    const interval = setInterval(() => {
        const indexEl = document.getElementById('compIndex');
        if (indexEl) indexEl.innerText = Math.floor(Math.random() * 30 + 40) + "%";
        if (++count > 15) {
            clearInterval(interval);
            indexEl.innerText = "84%";
            indexEl.style.color = "#FF6B35";
            setTimeout(window.showPhase1BridgeCard, 1500);
        }
    }, 100);
};

window.showPhase1BridgeCard = function() {
    const container = document.getElementById('dynamicQuizContent');
    if (!container) return;

    container.innerHTML = `
        <div class="bg-slate-50 border-2 border-brand-orange rounded-3xl p-8 shadow-2xl animate-fade-in-up">
            <h2 class="text-3xl font-extrabold text-brand-navy mb-6 text-center">Deep-Dive Assessment: Phase 1</h2>
            <p class="text-lg text-slate-700 mb-8 leading-relaxed text-center">You’ve mastered the basics! Now, it’s time for a precision analysis to unlock your child’s detailed fitment roadmap.</p>
            <div class="space-y-4 mb-10">
                <div class="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200"><div class="text-brand-orange text-2xl font-black">01</div><div class="text-brand-navy font-bold">5-Minute Deep-Dive into Academic DNA</div></div>
                <div class="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200"><div class="text-brand-orange text-2xl font-black">02</div><div class="text-brand-navy font-bold">Instant Fitment Score for CBSE, ICSE, and IB</div></div>
                <div class="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200"><div class="text-brand-orange text-2xl font-black">03</div><div class="text-brand-navy font-bold">Actionable Roadmap to a 2040 Global Career</div></div>
            </div>
            <button onclick="window.phase0Complete=true; window.initializeQuizShell(4);" class="w-full bg-brand-orange text-white py-5 rounded-full font-black text-xl shadow-xl hover:scale-105 transition-all mb-4">
                Analyze My Child’s Fitment Board →
            </button>
            <p class="text-sm text-slate-500 italic text-center px-4 leading-relaxed">
                Note: Upon completion, your inputs will generate your Smart Parent Pro Dashboard. Based on your unique data, our engine will recommend the optimal analysis path—ranging from Behavioral Fitment to the comprehensive Institutional Alignment Matrix
            </p>
        </div>`;
};

// --- DATA ---
const questions = [
    { id: "p0_q1", text: "How does your child process complex new data?", options: ["Visual/Charts", "Auditory/Discussion", "Kinesthetic/Build"] },
    { id: "p0_q2", text: "Under high-stakes evaluation, what is the default response?", options: ["The Thriver/Speed", "The Deep Thinker/Precision", "The Collaborative"] },
    { id: "p0_q3", text: "What is the ultimate End-State for the child's career?", options: ["Global Explorer/Ivy", "Competitive Edge/National", "The Innovator"] },
    { id: "p0_q4", text: "Which KPI matters most?", options: ["Academic Mastery/Grades", "Holistic Confidence", "Critical Thinking/Logic"] },
    { id: "q1", text: "How does your child learn best?", options: ["By seeing images, videos, and diagrams (Visual)", "By listening to stories and discussions (Auditory)", "By doing experiments and building things (Kinesthetic)", "A mix of everything / Adaptable"] },
    { id: "q2", text: "What subject does your child naturally enjoy?", options: ["Maths, Logic, and Puzzles", "English, Stories, and Art", "Science, Nature, and asking 'Why?'", "A bit of everything / Balanced"] },
    { id: "q3", text: "What is the big future goal?", options: ["Crack Indian Exams (IIT-JEE / NEET / UPSC)", "Study Abroad (University in US/UK/Canada)", "Entrepreneurship or Creative Arts", "Not sure yet / Keep options open"] },
    { id: "q4", text: "What is your comfortable annual budget for school fees?", options: ["Below ₹1 Lakh", "₹1 Lakh - ₹3 Lakhs", "₹3 Lakhs - ₹6 Lakhs", "Above ₹6 Lakhs"] },
    { id: "q5", text: "Will you be moving cities in the next few years?", options: ["No, we are settled here.", "Yes, likely to move within India.", "Yes, likely to move to another Country.", "Unsure"] },
    { id: "q6", text: "What teaching style do you prefer?", options: ["Structured: Textbooks and clear syllabus", "Inquiry: Research and self-exploration", "Flexible: Student-led (like Montessori)", "Balanced approach"] },
    { id: "q7", text: "How much study load can your child handle?", options: ["High Volume (Can memorize lots of details)", "Concept Focus (Understands logic, less memory)", "Practical Focus (Prefers doing over reading)"] },
    { id: "q8", text: "Is 'Global Recognition' important to you?", options: ["Yes, it's critical.", "It's important.", "Nice to have.", "Not important."] },
    { id: "q9", text: "Should the school focus heavily on Regional Languages?", options: ["Yes, they must be fluent in the local language.", "Basic functional knowledge is enough.", "No, English is the main focus."] },
    { id: "q10", text: "How does your child react to exams?", options: ["They are competitive and handle pressure well.", "They prefer projects and assignments.", "They get very anxious about tests."] },
    { id: "q11", text: "How important are Sports & Arts?", options: ["Very High - Equal to academics.", "Moderate - Good for hobbies.", "Low - Academics come first."] }
];

// Global Catch
document.addEventListener('click', function(e) {
    if (e.target.innerText && e.target.innerText.includes('Start Learning Fitment Analysis')) {
        console.log("Fallback: Initializing Phase 0...");
        window.initializeQuizShell(0);
    }
});
