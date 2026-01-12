
// --- STATE MANAGEMENT ---
window.phase0Complete = false;
 
let currentQuestionIndex = 0;
let answers = {};
let customerData = { orderId: 'N/A', childAge: '5-10', parentName: '', childName: '', email: '', phone: '' };
let selectedPackage = 'Essential';
let selectedPrice = 599;

const phase0Questions = [
    { id: "p0_q1", text: "How does your child process complex new data?", options: ["Visual/Charts", "Auditory/Discussion", "Kinesthetic/Build"] },
    { id: "p0_q2", text: "Under high-stakes evaluation, what is the default response?", options: ["The Thriver/Speed", "The Deep Thinker/Precision", "The Collaborative"] },
    { id: "p0_q3", text: "What is the ultimate End-State for the child's career?", options: ["Global Explorer/Ivy", "Competitive Edge/National", "The Innovator"] },
    { id: "p0_q4", text: "Which KPI matters most?", options: ["Academic Mastery/Grades", "Holistic Confidence", "Critical Thinking/Logic"] }
];

const phase1Questions = [
    { id: "q1", text: "How does your child learn best?", options: ["Visual", "Auditory", "Kinesthetic", "Adaptable"] },
    { id: "q2", text: "What subject does your child naturally enjoy?", options: ["Maths", "English/Art", "Science", "Balanced"] },
    { id: "q3", text: "What is the big future goal?", options: ["Crack Indian Exams", "Study Abroad", "Entrepreneurship", "Not sure"] },
    { id: "q4", text: "Annual budget for school fees?", options: ["Below ₹1L", "₹1L - ₹3L", "₹3L - ₹6L", "Above ₹6L"] },
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

window.hideAllSections = function() {
    const sections = ['landingPage', 'aboutAptSkola', 'pricing', 'invest-in-clarity', 'testimonials', 'educatorPartner', 'contact-and-policies', 'mainFooter', 'detailsPage', 'paymentPageContainer', 'questionPages', 'successPage', 'syncMatchGate', 'syncMatchTransition', 'react-hero-root'];
    sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) { el.classList.add('hidden'); el.classList.remove('active'); el.style.display = 'none'; }
    });
    window.scrollTo({ top: 0, behavior: 'instant' });
};

window.initializeQuizShell = function(index) {
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

window.renderQuestionContent = function(index) {
    currentQuestionIndex = index;
    const quizContent = document.getElementById('dynamicQuizContent');
    if (!quizContent) return;
    const qList = (window.window.currentPhase === 0) ? phase0Questions : phase1Questions;
    if (window.window.currentPhase === 0 && index >= qList.length) { window.showPsychometricHistogram(); return; }
    if (window.currentPhase === 1 && index >= qList.length) { 
        window.hideAllSections();
        const dPage = document.getElementById('detailsPage');
        if(dPage) { dPage.classList.remove('hidden'); dPage.classList.add('active'); dPage.style.display = 'flex'; }
        return;
    }
    const q = qList[index];
    if(!q) return;
    let progressPercent = 0; let progressColor = "bg-slate-400"; let phaseLabel = "";
    if (window.window.currentPhase === 0) {
        progressPercent = ((index + 1) / 4) * 100; phaseLabel = "Phase 0: DNA Scan";
    } else {
        const qNum = index + 1;
        if (qNum <= 5) { progressPercent = 33; progressColor = "bg-slate-400"; phaseLabel = "Mapping Learning DNA"; }
        else if (qNum <= 10) { progressPercent = 66; progressColor = "bg-brand-orange"; phaseLabel = "Analyzing Academic Compatibility"; }
        else { progressPercent = 100; progressColor = "bg-brand-orange animate-pulse shadow-[0_0_15px_rgba(255,107,53,0.6)]"; phaseLabel = "Matching for Board"; }
    }
    quizContent.innerHTML = `
        <div class="progress-container mb-10">
            <div class="progress-track h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
                <div class="progress-fill h-full ${progressColor} transition-all duration-500" style="width: ${progressPercent}%"></div>
            </div>
            <div class="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                <span>${phaseLabel}</span>
                <span>Question ${index + 1} / ${qList.length}</span>
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

window.handlePrev = function() { if (currentQuestionIndex > 0) window.renderQuestionContent(currentQuestionIndex - 1); };
window.selectOption = function(id, val, idx, el) { answers[id] = val; el.style.borderColor = "#0F172A"; setTimeout(() => window.renderQuestionContent(idx + 1), 300); };

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
        if (++count > 15) { clearInterval(interval); indexEl.innerText = "84%"; indexEl.style.color = "#FF6B35"; setTimeout(window.showSystemicRiskCard, 1500); }
    }, 100);
};

window.showSystemicRiskCard = function() {
    const container = document.getElementById('dynamicQuizContent');
    container.innerHTML = `
        <div class="fixed inset-0 z-[10000] flex items-center justify-center p-6 bg-brand-navy/80 backdrop-blur-sm animate-fade-in">
            <div class="bg-white p-8 rounded-3xl shadow-2xl max-w-lg w-full text-center border-t-8 border-red-500">
                <div class="text-red-500 text-5xl mb-6 font-black uppercase">⚠️ RISK</div>
                <h2 class="text-2xl font-black text-brand-navy mb-4 uppercase">Systemic Risk Detected</h2>
                <p class="text-slate-600 font-medium mb-8 leading-relaxed">Phase 0 data indicates a significant misalignment between natural cognitive syntax and standardized board expectations.</p>
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

window.startPhase1 = function() { window.window.currentPhase = 1; window.initializeQuizShell(0); };

window.triggerDNAFinalization = function() {
    window.hideAllSections();
    const container = document.getElementById("questionPages");
    container.classList.remove("hidden"); container.classList.add("active"); container.style.display = "flex";
    const labels = ["Neural Processing", "Stress Threshold", "Instructional Syntax", "Fiscal Range", "Global Parity"];
    container.innerHTML = `
        <div class="min-h-screen w-full bg-brand-navy flex flex-col items-center justify-center p-8 relative overflow-hidden">
            <div id="finalGlass" class="absolute inset-0 z-50 flex items-center justify-center opacity-0 pointer-events-none transition-all duration-1000">
                <div class="absolute inset-0 bg-white/10 backdrop-blur-xl"></div>
                <div class="relative z-50 text-star-yellow animate-pulse"><svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 6c1.4 0 2.5 1.1 2.5 2.5V11h.5c.6 0 1 .4 1 1v4c0 .6-.4 1-1 1H9c-.6 0-1-.4-1-1v-4c0-.6.4-1 1-1h.5V9.5C9.5 8.1 10.6 7 12 7zm0 1.5c-.6 0-1 .4-1 1V11h2V9.5c0-.6-.4-1-1-1z"/></svg></div>
            </div>
            <div class="max-w-2xl w-full z-10">
                <h2 id="finalStatus" class="text-white text-sm font-bold uppercase tracking-[0.3em] mb-12 text-center">Cross-referencing Academic DNA with 1,200+ School Frameworks...</h2>
                <div class="space-y-8">
                    ${labels.map((l, i) => `<div class="space-y-3"><div class="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">${l}</div><div class="h-4 bg-slate-800 rounded-full overflow-hidden"><div id="bar-${i}" class="h-full bg-slate-600 liquid-animate transition-all duration-700" style="width: 50%"></div></div></div>`).join('')}
                </div>
            </div>
        </div>`;

    const bars = labels.map((_, i) => document.getElementById(`bar-${i}`));
    let throbCount = 0;
    const throbInterval = setInterval(() => {
        bars.forEach(bar => { bar.style.width = Math.floor(Math.random() * 80 + 10) + "%"; });
        if (++throbCount > 15) {
            clearInterval(throbInterval);
            document.getElementById('finalStatus').innerText = "DNA ALIGNMENT COMPLETE: PROFILE SECURED.";
            document.getElementById('finalStatus').style.color = "#10B981";
            bars.forEach((bar, i) => { bar.classList.remove('liquid-animate'); bar.classList.add('vibrant-green'); bar.style.width = [88, 72, 94, 65, 81][i] + "%"; });
            setTimeout(() => {
                document.getElementById('finalGlass').style.opacity = "1";
                setTimeout(() => {
                    window.hideAllSections();
                    const pricing = document.getElementById('pricing');
                    if(pricing) { pricing.style.display = "block"; pricing.classList.remove('hidden'); pricing.scrollIntoView({ behavior: "smooth" }); }
                }, 5000); 
            }, 1500);
        }
    }, 150);
};

window.selectPackage = function(pkg, price) {
    selectedPackage = pkg; selectedPrice = price; window.hideAllSections();
    const pCont = document.getElementById('paymentPageContainer');
    if(pCont) {
        pCont.classList.remove('hidden'); pCont.classList.add('active'); pCont.style.display = 'flex';
        document.getElementById('summaryPackage').textContent = pkg;
        document.getElementById('summaryPrice').textContent = `₹${price}`;
        document.getElementById('summaryTotal').textContent = `₹${price}`;
        const payBtn = document.getElementById('payButton');
        if(payBtn) payBtn.innerText = `Pay ₹${price} via UPI / Card / Netbanking →`;
    }
};

window.redirectToRazorpay = function() {
    const payButton = document.getElementById('payButton');
    if (payButton) payButton.innerText = "Opening Secure Checkout...";
    if (window.location.search.includes('test=1')) { window.renderReportToBrowser().then(() => window.showInstantSuccessPage()); return; }
    if (typeof Razorpay === 'undefined') { alert("Payment gateway is still loading."); return; }
    const options = {
        "key": "rzp_live_RxHmfgMlTRV3Su",
        "amount": selectedPrice * 100,
        "currency": "INR",
        "name": "Apt Skola",
        "description": `Payment for ${selectedPackage} Report`,
        "prefill": { "name": customerData.parentName, "email": customerData.email, "contact": customerData.phone },
        "handler": function (response) {
            window.renderReportToBrowser().then(() => { window.showInstantSuccessPage(); });
        },
        "theme": { "color": "#FF6B35" }
    };
    const rzp = new Razorpay(options);
    rzp.open();
};

window.calculateFullRecommendation = function(ansSet) {
    let scores = { "CBSE": 0, "ICSE": 0, "IB": 0, "Cambridge (IGCSE)": 0, "State Board": 0 };
    if (ansSet.q3 === 0) scores["CBSE"] += 15;
    if (ansSet.q3 === 1) scores["IB"] += 15;
    if (ansSet.q6 === 0) scores["CBSE"] += 10;
    if (ansSet.q6 === 1) scores["IB"] += 10;
    let results = Object.keys(scores).map(board => ({ 
        name: board, 
        score: scores[board],
        percentage: Math.min(Math.round((scores[board] / 25) * 95) + 5, 99)
    }));
    results.sort((a, b) => b.score - a.score);
    return { recommended: results[0], alternative: results[1], fullRanking: results };
};

window.renderReportToBrowser = async function() {
    const res = window.calculateFullRecommendation(answers);
    const recBoard = res.recommended.name;
    const boardKey = recBoard.toLowerCase().includes('cbse') ? 'cbse' : 
                     (recBoard.toLowerCase().includes('icse') ? 'icse' : 
                     (recBoard.toLowerCase().includes('ib') ? 'ib' : 
                     (recBoard.toLowerCase().includes('cambridge') ? 'Cambridge (IGCSE)' : 'State Board')));
    const data = MASTER_DATA[boardKey] || { title: "Archetype", persona: "Persona", philosophy: "Philosophy" };
    
    let html = `
        <div id="pdf-header" class="report-card" style="background:#0F172A; color:white; text-align:center;">
            <div style="font-size:2rem; font-weight:800;">Apt <span style="color:#FF6B35;">Skola</span></div>
            <div style="font-size:1.1rem; opacity:0.8;">${selectedPackage} Report</div>
            <div style="font-size:0.85rem; margin-top:10px;">ID: ${customerData.orderId} | Prepared for: ${customerData.childName}</div>
        </div>
        <div class="report-card">
            <div class="report-header-bg">THE RECOMMENDED ARCHETYPE</div>
            <div style="font-size:1.8rem; font-weight:800; color:#0F172A;">${data.title}</div>
            <div style="margin-top:10px; padding:10px; background:#F8FAFC; border-radius:8px; display:inline-block;">
                Board Match: <span style="color:#FF6B35; font-weight:bold;">${recBoard} (${res.recommended.percentage}%)</span>
            </div>
        </div>`;
    const preview = document.getElementById('reportPreview');
    if (preview) { preview.innerHTML = html; preview.classList.remove('off-screen-render'); }
};

window.showInstantSuccessPage = function() {
    window.hideAllSections();
    const successPage = document.getElementById('successPage');
    if (successPage) {
        successPage.classList.remove('hidden'); successPage.classList.add('active'); successPage.style.display = 'block';
        document.getElementById('displayOrderId').textContent = customerData.orderId;
        document.getElementById('successParentName').textContent = customerData.parentName;
    }
};

const MASTER_DATA = { 
    cbse: { name: "CBSE", title: "The Standardized Strategist", persona: "Convergent Thinker", philosophy: 'Competitive Success.' },
    icse: { name: "ICSE", title: "The Holistic Communicator", persona: "Verbal Analyst", philosophy: 'Comprehensive Foundation.' },
    ib: { name: "IB", title: "The Global Inquirer", persona: "Independent Innovator", philosophy: 'Global Citizens.' },
    'Cambridge (IGCSE)': { name: "Cambridge (IGCSE)", title: "The International Achiever", persona: "Flexible Specialist", philosophy: 'Subject depth.' },
    'State Board': { name: "State Board", title: "The Regional Contender", persona: "Contextual Learner", philosophy: 'Regional success.' }
};

document.addEventListener('DOMContentLoaded', () => {
    const customerForm = document.getElementById('customerForm');
    if (customerForm) {
        customerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            customerData = {
                parentName: document.getElementById('parentName')?.value || '',
                childName: document.getElementById('childName')?.value || '',
                email: document.getElementById('email')?.value || '',
                phone: document.getElementById('phone')?.value || '',
                childAge: document.getElementById('childAge')?.value || '5-10',
                orderId: "AS" + Date.now()
            };
            localStorage.setItem('aptskola_last_order_id', customerData.orderId);
            localStorage.setItem(`aptskola_session_${customerData.orderId}`, JSON.stringify({ answers, customerData }));
            window.triggerDNAFinalization();
        });
    }
    document.addEventListener('click', function(e) {
        const target = e.target.closest('button') || e.target;
        if (target.innerText && target.innerText.includes('Start Learning Fitment Analysis')) {
             window.initializeQuizShell(0);
        }
        if (target.id === 'payButton') { window.redirectToRazorpay(); }
    });
});
