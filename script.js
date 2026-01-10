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

    if (index === 4 && !isSyncMatchMode && !window.phase0Complete) {
        window.showPsychometricHistogram();
        return;
    }

    const q = questions[index];
    if(!q) return;

    // DNA Roadmap Refactor
    const isPhase0 = index < 4;
    let progressPercent = 0;
    let progressColor = "bg-slate-400";
    let phaseLabel = "Phase 0: DNA Scan";
    let currentQNum = index + 1;
    let displayTotal = isPhase0 ? 4 : 15;

    if (isPhase0) {
        progressPercent = (currentQNum / 4) * 100;
    } else {
        const phase1Idx = index - 3;
        currentQNum = phase1Idx;
        displayTotal = 15;
        if (phase1Idx <= 5) {
            progressPercent = 33;
            progressColor = "bg-slate-400";
            phaseLabel = "Mapping Learning DNA";
        } else if (phase1Idx <= 10) {
            progressPercent = 66;
            progressColor = "bg-brand-orange";
            phaseLabel = "Analyzing Academic Compatibility";
        } else {
            progressPercent = 100;
            progressColor = "bg-brand-orange animate-pulse shadow-[0_0_15px_rgba(255,107,53,0.6)]";
            phaseLabel = "Matching for Board";
        }
    }

    quizContent.innerHTML = `
        <div class="progress-container mb-10">
            <div class="progress-track h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
                <div class="progress-fill h-full ${progressColor} transition-all duration-500" style="width: ${progressPercent}%"></div>
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
            <button onclick="window.handlePrev()" class="text-slate-400 font-bold hover:text-brand-navy transition-colors flex items-center justify-center gap-2 mx-auto uppercase">
                ← PREVIOUS QUESTION
            </button>
        </div>`;
};

window.handlePrev = function() {
    if (currentQuestion > 0) window.renderQuestionContent(currentQuestion - 1);
};

window.selectOption = function selectOption(id, val, idx, el) {
    answers[id] = val;
    el.style.borderColor = "#0F172A";
    setTimeout(() => {
        if (idx === 18 && !isSyncMatchMode) { // End of Phase 1
            window.hideAllSections();
            document.getElementById('detailsPage').classList.remove('hidden');
            document.getElementById('detailsPage').classList.add('active');
        } else {
            window.renderQuestionContent(idx + 1);
        }
    }, 300);
};

// --- FORM CAPTURE & FINALIZATION TRIGGER ---
document.getElementById('customerForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    customerData = { 
        parentName: document.getElementById('parentName').value, 
        childName: document.getElementById('childName').value,
        childAge: document.getElementById('childAge').value,
        orderId: "AS" + Date.now()
    };
    window.triggerDNAFinalization();
});

window.triggerDNAFinalization = function() {
    window.hideAllSections();
    const container = document.getElementById('questionPages');
    container.classList.remove('hidden');
    container.classList.add('active');
    container.style.display = 'flex';
    
    // Stage 1 & 2: Liquid Build & Settlement
    const labels = ['Neural Processing', 'Stress Threshold', 'Instructional Syntax', 'Fiscal Range', 'Global Parity'];
    container.innerHTML = `
        <div class="min-h-screen w-full bg-brand-navy flex flex-col items-center justify-center p-8 relative overflow-hidden">
            <div id="finalGlass" class="absolute inset-0 z-50 flex items-center justify-center opacity-0 pointer-events-none transition-all duration-1000">
                <div class="absolute inset-0 bg-white/10 backdrop-blur-xl"></div>
                <div class="relative z-50 text-star-yellow animate-pulse">
                    <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 6c1.4 0 2.5 1.1 2.5 2.5V11h.5c.6 0 1 .4 1 1v4c0 .6-.4 1-1 1H9c-.6 0-1-.4-1-1v-4c0-.6.4-1 1-1h.5V9.5C9.5 8.1 10.6 7 12 7zm0 1.5c-.6 0-1 .4-1 1V11h2V9.5c0-.6-.4-1-1-1z"/></svg>
                </div>
            </div>

            <div class="max-w-2xl w-full z-10">
                <h2 id="finalStatus" class="text-white text-sm font-bold uppercase tracking-[0.3em] mb-12 text-center">Cross-referencing Academic DNA with 1,200+ School Frameworks...</h2>
                
                <div class="space-y-8">
                    ${labels.map((l, i) => `
                        <div class="space-y-3">
                            <div class="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">${l}</div>
                            <div class="h-4 bg-slate-800 rounded-full overflow-hidden">
                                <div id="bar-${i}" class="h-full bg-slate-600 liquid-animate transition-all duration-700" style="width: 50%"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>`;

    // Animation Loop for "Throb" effect
    const bars = labels.map((_, i) => document.getElementById(`bar-${i}`));
    let throbCount = 0;
    const throbInterval = setInterval(() => {
        bars.forEach(bar => { bar.style.width = Math.floor(Math.random() * 80 + 10) + "%"; });
        if (++throbCount > 15) {
            clearInterval(throbInterval);
            // Settlement Stage
            document.getElementById('finalStatus').innerText = "DNA ALIGNMENT COMPLETE: PROFILE SECURED.";
            document.getElementById('finalStatus').style.color = "#10B981";
            bars.forEach((bar, i) => {
                bar.classList.remove('bg-slate-600', 'liquid-animate');
                bar.classList.add('vibrant-green');
                bar.style.width = [88, 72, 94, 65, 81][i] + "%";
            });
            
            // Final Lock Transition
            setTimeout(() => {
                document.getElementById('finalGlass').style.opacity = "1";
                setTimeout(() => {
                    window.hideAllSections();
                    showSection('paymentPageContainer');
                }, 2500);
            }, 1500);
        }
    }, 150);
};

// ... Rest of Master Data, PsychometricHistogram, BridgeCard ...
const MASTER_DATA = { cbse: { title: "Standardized Strategist" } };
const questions = [
    { id: "p0_q1", text: "How does your child process complex new data?", options: ["Visual", "Auditory", "Kinesthetic"] },
    { id: "p0_q2", text: "Under high-stakes evaluation response?", options: ["Speed", "Precision", "Collaborative"] },
    { id: "p0_q3", text: "Career End-State?", options: ["Ivy", "National", "Innovator"] },
    { id: "p0_q4", text: "Most important KPI?", options: ["Grades", "Confidence", "Logic"] },
    { id: "q1", text: "How does your child learn best?", options: ["Visual", "Auditory", "Kinesthetic", "Adaptable"] },
    { id: "q2", text: "Natural subject enjoyment?", options: ["Maths", "Arts", "Science", "Balanced"] },
    { id: "q3", text: "Future goal?", options: ["Exams", "Abroad", "Creative", "Unsure"] },
    { id: "q4", text: "Fee budget?", options: ["Low", "Mid", "High", "Ultra"] },
    { id: "q5", text: "Relocation likelihood?", options: ["No", "India", "Abroad", "Unsure"] },
    { id: "q6", text: "Pedagogy preference?", options: ["Structured", "Inquiry", "Flexible", "Balanced"] },
    { id: "q7", text: "Cognitive load capacity?", options: ["High", "Concept", "Practical"] },
    { id: "q8", text: "Global parity importance?", options: ["Critical", "High", "Mid", "Low"] },
    { id: "q9", text: "Linguistic focus?", options: ["Regional", "Functional", "English"] },
    { id: "q10", text: "Evaluation response?", options: ["Competitive", "Formative", "Anxious"] },
    { id: "q11", text: "Holistic importance?", options: ["Equal", "Moderate", "Minor"] },
    { id: "q12", text: "Enrollment grade?", options: ["Pre-K", "Primary", "Middle", "High"] },
    { id: "q13", text: "Class density preference?", options: ["Small", "Standard", "Large"] },
    { id: "q14", text: "Parental bandwidth?", options: ["High", "Mid", "Low"] },
    { id: "q15", text: "Target region?", options: ["Metro", "Tier-2", "Small Town"] }
];

window.showPsychometricHistogram = function() {
    const container = document.getElementById('dynamicQuizContent');
    container.innerHTML = `<div class="p-8 bg-brand-navy rounded-3xl text-center"><h2 class="text-white uppercase mb-8">DNA Snapshot</h2><div id="compIndex" class="text-6xl font-black text-white animate-flicker">--%</div></div>`;
    let count = 0;
    const interval = setInterval(() => {
        const indexEl = document.getElementById('compIndex');
        if (indexEl) indexEl.innerText = Math.floor(Math.random() * 30 + 40) + "%";
        if (++count > 15) { clearInterval(interval); indexEl.innerText = "84%"; indexEl.style.color = "#FF6B35"; setTimeout(window.showPhase1BridgeCard, 1000); }
    }, 100);
};

window.showPhase1BridgeCard = function() {
    const container = document.getElementById('dynamicQuizContent');
    container.innerHTML = `<div class="bg-slate-50 border-2 border-brand-orange rounded-3xl p-8 text-center"><h2 class="text-2xl font-bold mb-4">Phase 1 Bridge</h2><button onclick="window.phase0Complete=true; window.initializeQuizShell(4);" class="bg-brand-orange text-white px-10 py-4 rounded-full font-bold">START PHASE 1 →</button></div>`;
};

function showSection(id) {
    const el = document.getElementById(id);
    if (el) { el.classList.remove('hidden'); el.classList.add('active'); el.style.display = 'flex'; }
}

document.addEventListener('click', function(e) {
    if (e.target.innerText && e.target.innerText.includes('Start Learning Fitment Analysis')) {
        window.initializeQuizShell(0);
    }
});
