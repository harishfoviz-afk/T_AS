import re

with open('script.js', 'r') as f:
    content = f.read()

# 1. Inject Global State at the top
header = """window.phase0Complete = false;
window.currentPhase = 0; 
let currentQuestionIndex = 0;
let answers = {};
"""
content = header + content

# 2. Add phase0Questions and phase1Questions
questions_data = """
const phase0Questions = [
    { id: "p0_q1", text: "How does your child process complex new data?", options: ["Visual/Charts", "Auditory/Discussion", "Kinesthetic/Build"] },
    { id: "p0_q2", text: "Under high-stakes evaluation, what is the default response?", options: ["The Thriver/Speed", "The Deep Thinker/Precision", "The Collaborative"] },
    { id: "p0_q3", text: "What is the ultimate End-State for the child's career?", options: ["Global Explorer/Ivy", "Competitive Edge/National", "The Innovator"] },
    { id: "p0_q4", text: "Which KPI matters most?", options: ["Academic Mastery/Grades", "Holistic Confidence", "Critical Thinking/Logic"] }
];

const phase1Questions = [
    { id: "q1", text: "How does your child learn best?", options: ["By seeing images, videos, and diagrams (Visual)", "By listening to stories and discussions (Auditory)", "By doing experiments and building things (Kinesthetic)", "A mix of everything / Adaptable"] },
    { id: "q2", text: "What subject does your child naturally enjoy?", options: ["Maths, Logic, and Puzzles", "English, Stories, and Art", "Science, Nature, and asking 'Why?'", "A bit of everything / Balanced"] },
    { id: "q3", text: "What is the big future goal?", options: ["Crack Indian Exams", "Study Abroad", "Entrepreneurship", "Not sure"] },
    { id: "q4", text: "Annual budget for school fees?", options: ["Below ₹1 Lakh", "₹1 Lakh - ₹3 Lakhs", "₹3 Lakhs - ₹6 Lakhs", "Above ₹6 Lakhs"] },
    { id: "q5", text: "Will you be moving cities?", options: ["No", "Within India", "Abroad", "Unsure"] },
    { id: "q6", text: "Teaching style preference?", options: ["Structured", "Inquiry", "Flexible", "Balanced"] },
    { id: "q7", text: "Study load capacity?", options: ["High Volume", "Concept Focus", "Practical Focus"] },
    { id: "q8", text: "Importance of Global Recognition?", options: ["Critical", "Important", "Nice to have", "Not important"] },
    { id: "q9", text: "Regional Language focus?", options: ["Fluency", "Functional", "English only"] },
    { id: "q10", text: "Reaction to exams?", options: ["Competitive", "Project-based", "Anxious"] },
    { id: "q11", text: "Importance of Sports & Arts?", options: ["Very High", "Moderate", "Low"] },
    { id: "q12", text: "Grade entering?", options: ["Preschool", "Primary", "Middle", "High School"] },
    { id: "q13", text: "Class size preference?", options: ["Small", "Standard", "Large"] },
    { id: "q14", text: "Homework involvement?", options: ["High", "Moderate", "Low"] },
    { id: "q15", text: "Where are you looking for schools?", options: ["Metro City", "Tier-2 City", "Small Town"] }
];
"""
content = content.replace("// --- STATE MANAGEMENT ---", questions_data + "\n// --- STATE MANAGEMENT ---")

# 3. Dynamic logic injections
funnel_logic = """
window.initializeQuizShell = function(index) {
    console.log("Quiz Shell: Phase", window.currentPhase, "Index", index);
    window.hideAllSections();
    const container = document.getElementById('questionPages');
    if (container) {
        container.classList.remove('hidden');
        container.classList.add('active');
        container.style.display = 'flex';
        container.innerHTML = `
            <div id="questionPageApp" class="question-page active" style="display: flex !important; flex-direction: column; min-height: 100vh; width: 100%; background: white; position: fixed; top: 0; left: 0; z-index: 9999;">
                <div class="intermediate-header" onclick="goToLandingPage()"><span class="font-bold text-xl">Apt <span style="color: #FF6B35;">Skola</span></span></div>
                <div class="question-content-wrapper" style="flex: 1; display: flex; align-items: center; justify-content: center; padding: 40px 20px;">
                    <div id="dynamicQuizContent" class="question-container" style="max-width: 750px; width: 100%;"></div>
                </div>
                <div class="intermediate-footer" style="background: #0F172A; color: #CBD5E1; padding: 1.5rem; text-align: center; font-size: 0.85rem;">© 2026 Apt Skola</div>
            </div>`;
        window.renderQuestionContent(index);
    }
};

window.renderQuestionContent = function(index) {
    currentQuestionIndex = index;
    const quizContent = document.getElementById('dynamicQuizContent');
    if (!quizContent) return;
    const qList = (window.currentPhase === 0) ? phase0Questions : phase1Questions;
    if (window.currentPhase === 0 && index >= qList.length) { window.showPsychometricHistogram(); return; }
    if (window.currentPhase === 1 && index >= qList.length) { window.hideAllSections(); showDetailsPage(); return; }
    const q = qList[index];
    if(!q) return;
    let progressPercent = 0; let progressColor = "bg-slate-400"; let phaseLabel = "";
    if (window.currentPhase === 0) { progressPercent = ((index + 1) / 4) * 100; phaseLabel = "Phase 0: DNA Scan"; }
    else {
        const qNum = index + 1;
        if (qNum <= 5) { progressPercent = 33; progressColor = "bg-slate-400"; phaseLabel = "Mapping Learning DNA"; }
        else if (qNum <= 10) { progressPercent = 66; progressColor = "bg-brand-orange"; phaseLabel = "Analyzing Academic Compatibility"; }
        else { progressPercent = 100; progressColor = "bg-brand-orange animate-pulse shadow-[0_0_15px_rgba(255,107,53,0.6)]"; phaseLabel = "Matching for Board"; }
    }
    quizContent.innerHTML = `
        <div class="progress-container mb-10">
            <div class="progress-track h-2 bg-slate-100 rounded-full overflow-hidden mb-4"><div class="progress-fill h-full ${progressColor} transition-all duration-500" style="width: ${progressPercent}%"></div></div>
            <div class="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest"><span>${phaseLabel}</span><span>Question ${index + 1} / ${qList.length}</span></div>
        </div>
        <div class="question-text text-3xl font-extrabold text-brand-navy mb-10 leading-tight">${q.text}</div>
        <div class="options-grid grid gap-4">${q.options.map((opt, i) => `<div class="option-card p-6 bg-slate-50 border-2 border-transparent rounded-2xl cursor-pointer hover:bg-slate-100 transition-all font-bold text-lg text-brand-navy" onclick="window.selectOption('${q.id}', ${i}, ${index}, this)">${opt}</div>`).join('')}</div>
        <div class="mt-12 text-center"><button onclick="window.handlePrev()" class="text-slate-400 font-bold hover:text-brand-navy transition-colors flex items-center justify-center gap-2 mx-auto uppercase">← PREVIOUS QUESTION</button></div>`;
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
                        <div class="h-3 bg-slate-800 rounded-full overflow-hidden"><div class="h-full bg-brand-orange animate-pulse" style="width: ${Math.random() * 40 + 60}%"></div></div>
                    </div>`).join('')}
            </div>
            <div id="compIndex" class="text-6xl font-black text-white animate-flicker">--%</div>
        </div>`;
    let count = 0;
    const interval = setInterval(() => {
        const indexEl = document.getElementById('compIndex');
        if (indexEl) indexEl.innerText = Math.floor(Math.random() * 15 + 72) + "%";
        if (++count > 15) { clearInterval(interval); indexEl.style.color = "#FF6B35"; setTimeout(window.showSystemicRiskCard, 1500); }
    }, 100);
};

window.showSystemicRiskCard = function() {
    const container = document.getElementById('dynamicQuizContent');
    if (!container) return;
    const q1Answer = answers["p0_q1"];
    let persona = "Unique Learner";
    let trait = "has a distinct cognitive processing style";
    if (q1Answer === 0) { persona = "Visual Strategist"; trait = "thrives on spatial logic and data mapping"; }
    else if (q1Answer === 1) { persona = "Verbal Analyst"; trait = "excels in narrative synthesis and discussions"; }
    else if (q1Answer === 2) { persona = "Conceptual Learner"; trait = "thrives in inquiry-based settings"; }
    container.innerHTML = `
        <div class="fixed inset-0 z-[10000] flex items-center justify-center p-6 bg-brand-navy/80 backdrop-blur-sm animate-fade-in">
            <div class="bg-red-50 p-8 rounded-3xl shadow-2xl max-w-lg w-full text-center border-t-8 border-red-500">
                <h2 class="text-xl font-bold text-red-600 mb-2 uppercase tracking-tight">Phase 0 Insight: The ${persona}</h2>
                <p class="text-slate-800 text-lg font-medium mb-6 italic">"Your child is a ${persona} who ${trait}."</p>
                <div class="bg-white/50 p-4 rounded-xl border border-red-200 mb-8"><p class="text-red-700 font-bold leading-tight">⚠️ MISALIGNMENT ALERT<br><span class="text-sm font-normal text-slate-600">Current data suggests their natural learning style may conflict with 2 out of 4 major school boards.</span></p></div>
                <button onclick="window.showPhase1BridgeCard()" class="w-full bg-red-600 text-white py-5 rounded-full font-black text-xl shadow-xl hover:scale-105 transition-all">RESOLVE & START PHASE 1 →</button>
            </div>
        </div>`;
};

window.showPhase1BridgeCard = function() {
    const container = document.getElementById('dynamicQuizContent');
    container.innerHTML = `
        <div class="bg-slate-50 border-2 border-brand-orange rounded-3xl p-8 shadow-2xl animate-fade-in-up">
            <h2 class="text-3xl font-extrabold text-brand-navy mb-6 text-center">Deep-Dive Assessment: Phase 1</h2>
            <p class="text-lg text-slate-700 mb-8 leading-relaxed text-center">You’ve mastered the basics! Now, it’s time for a precision analysis to unlock your child’s detailed fitment roadmap.</p>
            <div class="space-y-4 mb-10">
                <div class="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200"><div class="text-brand-orange text-2xl font-black">01</div><div class="text-brand-navy font-bold">5-Minute Deep-Dive into Academic DNA</div></div>
                <div class="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200"><div class="text-brand-orange text-2xl font-black">02</div><div class="text-brand-navy font-bold">Instant Fitment Score for CBSE, ICSE, and IB</div></div>
                <div class="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200"><div class="text-brand-orange text-2xl font-black">03</div><div class="text-brand-navy font-bold">Actionable Roadmap to a 2040 Global Career</div></div>
            </div>
            <button onclick="window.startPhase1()" class="w-full bg-brand-orange text-white py-5 rounded-full font-black text-xl shadow-xl hover:scale-105 transition-all mb-4">Analyze My Child’s Fitment Board →</button>
            <p class="text-sm text-slate-500 italic text-center px-4 leading-relaxed">Note: Upon completion, your inputs will generate your Smart Parent Pro Dashboard. Based on your unique data, our engine will recommend the optimal analysis path—ranging from Behavioral Fitment to the comprehensive Institutional Alignment Matrix</p>
        </div>`;
};

window.startPhase1 = function() { window.currentPhase = 1; window.phase0Complete = true; window.initializeQuizShell(0); };
"""

# Replace the original initializeQuizShell, renderQuestionContent, etc.
# We'll insert the new logic and keep everything else.
content = re.sub(r'function initializeQuizShell\(index\) \{.*?\}', funnel_logic, content, flags=re.DOTALL)
content = re.sub(r'function renderQuestionContent\(index\) \{.*?\}', "", content, flags=re.DOTALL)
content = re.sub(r'function selectOption\(qId, val, idx, el\) \{.*?\}', "", content, flags=re.DOTALL)

# Add GenerateOrderId to the top
order_id_logic = """
window.generateOrderId = function() {
    const prefix = selectedPrice === 599 ? 'AS5-' : (selectedPrice === 999 ? 'AS9-' : 'AS1-');
    const randomDigits = Math.floor(1000000 + Math.random() * 9000000);
    return prefix + randomDigits;
};
"""
content = order_id_logic + content

# Fix customerForm listener for boardOutcome and upgradedStatus
form_submit_patch = """
    customerForm?.addEventListener('submit', async function(e) {
        e.preventDefault();
        const res = window.calculateFullRecommendation(answers);
        customerData = {
            parentName: document.getElementById('parentName')?.value || '',
            childName: document.getElementById('childName')?.value || '',
            email: document.getElementById('email')?.value || '',
            phone: document.getElementById('phone')?.value || '',
            childAge: document.getElementById('childAge')?.value || '5-10',
            orderId: window.generateOrderId()
        };
        const formData = new FormData(this);
        formData.append('orderId', customerData.orderId);
        formData.append('boardOutcome', res.recommended.name);
        formData.append('upgradedStatus', selectedPackage);
        try { await fetch("https://api.web3forms.com/submit", { method: "POST", body: formData }); }
        catch(err) { console.error("Lead capture failed", err); }
        window.triggerDNAFinalization();
    });
"""
content = re.sub(r'document\.getElementById\(\'customerForm\'\)\?\.addEventListener\(\'submit\', function\(e\) \{.*?\}\);', form_submit_patch, content, flags=re.DOTALL)

# Ensure currentPhase is reset on main CTA click
content += """
document.addEventListener('click', function(e) {
    if (e.target.innerText && e.target.innerText.includes('Start Learning Fitment Analysis') || e.target.innerText.includes('Scan My Child')) {
        window.currentPhase = 0; window.phase0Complete = false; window.initializeQuizShell(0);
    }
});
"""

with open('script.js', 'w') as f:
    f.write(content)
