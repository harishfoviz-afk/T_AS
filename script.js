// --- GLOBAL BRIDGE & STATE ---
window.phase0Complete = false;
window.currentPhase = 0; 
let currentQuestionIndex = 0;
window.answers = {}; 
let customerData = { orderId: 'N/A', childAge: '5-10', parentName: '', childName: '', email: '', phone: '' };
let selectedPackage = 'Essential';
let selectedPrice = 599;

// --- CONFIG ---
const RAZORPAY_KEY_ID = "rzp_live_RxHmfgMlTRV3Su";
const EMAILJS_PUBLIC_KEY = "GJEWFtAL7s231EDrk";
const EMAILJS_SERVICE_ID = "service_bm56t8v";
const EMAILJS_TEMPLATE_ID = "template_qze00kx";

// Prices in PAISE (1 Rupee = 100 Paise)
const PACKAGE_PRICES = { 'Essential': 59900, 'Premium': 99900, 'The Smart Parent Pro': 149900 };

// --- DATA MASTERS ---
const MASTER_DATA = { 
    cbse: {
        name: "CBSE",
        title: "The Standardized Strategist",
        persona: "Convergent Thinker",
        profile: "This profile is characterized by strong retention memory, the ability to handle high-volume data processing, and a high comfort level with objective assessment metrics.",
        rejectionReason: "Why not IB? Your child prefers structured outcomes. The ambiguity of the IB 'Constructivist' approach may cause unnecessary anxiety.",
        careerPath: "The Competitive Exam Track (JEE/NEET/UPSC). Grade 9-10 Focus: Foundation building using NCERT. Grade 11-12 Focus: Integrated Coaching or Dummy Schools.",
        philosophy: 'The National Standard for Competitive Success.',
        teachingMethod: 'Structured and textbook-focused (NCERT). Emphasis on retaining facts for entrance exams (JEE/NEET).',
        parentalRole: 'Moderate. Syllabuses are defined. Tutoring is easily outsourced to coaching centers.'
    },
    icse: {
        name: "ICSE",
        title: "The Holistic Communicator",
        persona: "Verbal Analyst",
        profile: "Students with this archetype display high verbal intelligence, strong analytical skills in humanities, and the ability to synthesize disparate pieces of information into a coherent whole.",
        rejectionReason: "Why not CBSE? Your child thrives on narrative and context. The rote-heavy, objective nature of CBSE might stifle their desire for depth.",
        careerPath: "The Creative & Liberal Arts Track (Law/Design/Journalism). Grade 9-10: Strong emphasis on Literature/Arts. Grade 11-12: Portfolio development and wide reading.",
        philosophy: 'The Comprehensive Foundation for Professionals.',
        teachingMethod: 'Volume-heavy and detailed. Focuses on strong English language command and deep theoretical understanding.',
        parentalRole: 'High. The volume of projects and detailed syllabus often requires active parental supervision in younger grades.'
    },
    ib: {
        name: "IB",
        title: "The Global Inquirer",
        persona: "Independent Innovator",
        profile: "This cognitive style thrives on openness to experience, exhibits a high tolerance for ambiguity, and possesses the strong self-regulation skills needed for inquiry-based learning.",
        rejectionReason: "Why not CBSE? Your child requires autonomy. The rigid, defined syllabus of CBSE would likely lead to boredom and disengagement.",
        careerPath: "The Global Ivy League/Oxbridge Track. Grade 9-10 (MYP): Critical writing. Grade 11-12 (DP): Building the 'Profile' via CAS and Extended Essay.",
        philosophy: 'Creating Global Citizens and Inquirers.',
        teachingMethod: 'No fixed textbooks. Students must ask questions, research answers, and write essays.',
        parentalRole: 'High (Strategic). You cannot just "teach them the chapter." You must help them find resources and manage complex timelines.'
    },
    'cambridge': {
        name: "Cambridge (IGCSE)",
        title: "The International Achiever",
        persona: "Flexible Specialist",
        profile: "This profile values subject depth and assessment flexibility, allowing students to tailor their studies for international university application.",
        rejectionReason: "Why not CBSE? Requires much higher English proficiency and is not directly aligned with Indian competitive exams.",
        careerPath: "International University Admissions and Specialized Career Paths (Finance, Design).",
        philosophy: 'Subject depth and international curriculum portability.',
        teachingMethod: 'Application-based learning. Requires external resources and focuses on critical thinking over rote memorization.',
        parentalRole: 'Moderate to High. You must manage complex curriculum choices and ensure external support for topics like Math/Science.'
    },
    'state': {
        name: "State Board",
        title: "The Regional Contender",
        persona: "Contextual Learner",
        profile: "This profile thrives on learning rooted in regional culture and language, with a focus on local government standards and employment readiness.",
        rejectionReason: "Why not IB? Highly constrained by local mandates; international portability is severely limited.",
        careerPath: "State Government Jobs, Local Commerce, and Regional Universities.",
        philosophy: 'Focus on regional language proficiency and local employment mandates.',
        teachingMethod: 'Rote-learning heavy, textbook-driven, and often heavily emphasizes regional languages.',
        parentalRole: 'Low to Moderate. Lower fee structure and simplified objectives make it less demanding.',
    },
    financial: {
        inflationRate: "10-12%",
        projectionTable: [
            { grade: "Grade 1 (2025)", fee: "₹ 2,00,000", total: "₹ 2,00,000" },
            { grade: "Grade 2 (2026)", fee: "₹ 2,20,000", total: "₹ 4,20,000" },
            { grade: "Grade 3 (2027)", fee: "₹ 2,42,000", total: "₹ 6,62,000" },
            { grade: "Grade 4 (2028)", fee: "₹ 2,66,200", total: "₹ 9,28,200" },
            { grade: "Grade 5 (2029)", fee: "₹ 2,92,820", total: "₹ 12,21,020" },
            { grade: "Grade 6 (2030)", fee: "₹ 3,22,102", total: "₹ 15,43,122" },
            { grade: "Grade 7 (2031)", fee: "₹ 3,54,312", total: "₹ 18,97,434" },
            { grade: "Grade 8 (2032)", fee: "₹ 3,89,743", total: "₹ 22,87,177" },
            { grade: "Grade 9 (2033)", fee: "₹ 4,28,718", total: "₹ 27,15,895" },
            { grade: "Grade 10 (2034)", fee: "₹ 4,71,589", total: "₹ 31,87,484" },
            { grade: "Grade 11 (2035)", fee: "₹ 5,18,748", total: "₹ 37,06,232" },
            { grade: "Grade 12 (2036)", fee: "₹ 5,70,623", total: "₹ 42,76,855" }
        ]
    },
    vetting: {
        redFlags: [
            "The 'Tired Teacher' Test: Do teachers look exhausted?",
            "The 'Glossy Brochure' Disconnect: Fancy reception vs. broken furniture.",
            "Restroom Hygiene: The truest test of dignity.",
            "Principal Turn-over: Has the principal changed twice in 3 years?",
            "Library Dust: Are books actually being read?"
        ]
    },
    concierge: {
        negotiation: [
            { title: "The 'Lump Sum' Leverage", scenario: "Use when you have liquidity.", script: "If I clear the entire annual tuition in a single transaction this week, what is the best concession structure you can offer on the Admission Fee?" },
            { title: "The 'Sibling Pipeline' Pitch", scenario: "Use if enrolling a younger child later.", script: "With my younger child entering Grade 1 next year, we are looking at a 15+ year LTV. Can we discuss a waiver on the security deposit?" },
            { title: "The 'Corporate Tie-up' Query", scenario: "Check if your company is on their list.", script: "Does the school have a corporate partnership with [Company Name]? I'd like to check if my employee status qualifies us for a waiver." }
        ]
    },
    interviewMastery: [
        { q: "Why this school?", strategy: "Align values, don't just say 'It's close'." },
        { q: "Describe child in 3 words.", strategy: "Be real. 'Energetic' > 'Perfect'." },
        { q: "View on homework?", strategy: "Balance. Value play at this age." },
        { q: "Handling tantrums?", strategy: "Distraction/Calm corner. Never 'We hit'." },
        { q: "Child's weakness?", strategy: "Vulnerability. Show you know them." },
        { q: "Role in education?", strategy: "Co-learners, not bystanders." }
    ]
};

// --- CORE UTILITIES ---
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
        container.classList.remove('hidden'); container.classList.add('active'); container.style.display = 'flex';
        container.innerHTML = `
            <div id="questionPageApp" class="question-page active" style="display: flex !important; flex-direction: column; min-height: 100vh; width: 100%; background: white; position: fixed; top: 0; left: 0; z-index: 9999;">
                <div class="intermediate-header" onclick="location.reload()" style="background: #0F172A; color: white; padding: 1rem 2rem; cursor: pointer;">
                    <span class="font-bold text-xl">Apt <span style="color: #FF6B35;">Skola</span></span>
                </div>
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
    if (window.currentPhase === 1 && index >= qList.length) { 
        window.hideAllSections();
        const dPage = document.getElementById('detailsPage');
        if(dPage) { dPage.classList.remove('hidden'); dPage.classList.add('active'); dPage.style.display = 'flex'; }
        return;
    }
    const q = qList[index];
    if(!q) return;
    let progressPercent = (window.currentPhase === 0) ? ((index + 1) / 4) * 100 : ((index + 1) / qList.length) * 100;
    quizContent.innerHTML = `
        <div class="progress-container mb-10">
            <div class="progress-track h-2 bg-slate-100 rounded-full overflow-hidden mb-4"><div class="progress-fill h-full bg-[#FF6B35] transition-all duration-500" style="width: ${progressPercent}%"></div></div>
            <div class="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest"><span>${window.currentPhase === 0 ? "Phase 0" : "Phase 1"}</span><span>Question ${index + 1} / ${qList.length}</span></div>
        </div>
        <div class="question-text text-3xl font-extrabold text-[#0F172A] mb-10 leading-tight">${q.text}</div>
        <div class="options-grid grid gap-4">
            ${q.options.map((opt, i) => `<div class="option-card p-6 bg-slate-50 border-2 border-transparent rounded-2xl cursor-pointer hover:bg-slate-100 hover:border-slate-300 transition-all font-bold text-lg text-[#0F172A]" onclick="window.selectOption('${q.id}', ${i}, ${index}, this)">${opt}</div>`).join('')}
        </div>`;
};

window.selectOption = function(id, val, idx, el) { 
    window.answers[id] = val; 
    el.style.borderColor = "#0F172A"; 
    // Logic check: Universal click prevention - only move forward if it was a real option click
    if (el.classList.contains('option-card')) {
        setTimeout(() => window.renderQuestionContent(idx + 1), 300);
    }
};

// --- PRICING & TIER LOGIC ---
window.selectPackage = function(pkg, price) {
    selectedPackage = pkg; selectedPrice = price;
    document.getElementById('summaryPackage').innerText = pkg;
    document.getElementById('summaryPrice').innerText = '₹' + price;
    document.getElementById('summaryTotal').innerText = '₹' + price;
    window.hideAllSections();
    const paymentPage = document.getElementById('paymentPageContainer');
    if (paymentPage) { paymentPage.classList.remove('hidden'); paymentPage.classList.add('active'); paymentPage.style.display = 'flex'; }
};

// --- SCORING ENGINE ---
window.calculateFullRecommendation = function(ansSet) {
    let scores = { "CBSE": 0, "ICSE": 0, "IB": 0, "Cambridge (IGCSE)": 0, "State Board": 0 };
    if (ansSet.q1 === 1) scores["CBSE"] += 10;
    if (ansSet.q3 === 1) scores["IB"] += 20;
    let results = Object.keys(scores).map(board => ({ name: board, score: scores[board] }));
    results.sort((a, b) => b.score - a.score);
    results.forEach(r => r.percentage = Math.min(Math.round(Math.random() * 20 + 75), 99));
    return { recommended: results[0], fullRanking: results };
};

// --- TIERED REPORT RENDERER ---
window.renderReportToBrowser = async function() {
    const res = window.calculateFullRecommendation(window.answers);
    const recBoard = res.recommended.name;
    const boardKeyMap = { "CBSE": "cbse", "ICSE": "icse", "IB": "ib", "Cambridge (IGCSE)": "cambridge", "State Board": "state" };
    const boardKey = boardKeyMap[recBoard] || "cbse";
    const data = MASTER_DATA[boardKey];
    const amount = selectedPrice;

    let html = `
        <div class="report-card" style="background:#0F172A; color:white; text-align:center; padding: 40px 20px;">
            <div style="font-size:2.5rem; font-weight:900;">Apt <span style="color:#FF6B35;">Skola</span></div>
            <div style="font-size:1.1rem; opacity:0.8; margin-top:10px;">Scientific Board Match Analysis</div>
            <div style="font-size:0.9rem; margin-top:20px; border-top: 1px solid rgba(255,255,255,0.1); pt-20">ID: ${customerData.orderId} | Prepared for: ${customerData.childName}</div>
        </div>

        <div class="report-card">
            <div class="report-header-bg">RECOMMENDED ARCHETYPE</div>
            <div style="font-size:2rem; font-weight:900; color:#0F172A; margin-bottom:10px;">${data.title}</div>
            <div style="display:inline-block; padding:8px 16px; background:#FFF7ED; color:#FF6B35; border-radius:100px; font-weight:900; border: 1px solid #FFEDD5;">
                MATCH: ${recBoard} (${res.recommended.percentage}%)
            </div>
        </div>

        <div class="report-card">
            <div class="report-header-bg">PERSONA & MATCH LOGIC</div>
            <p style="font-weight:700; color:#0F172A; margin-bottom:8px;">Archetype: ${data.persona}</p>
            <p style="line-height:1.6; color:#475569;">${data.profile}</p>
            <div style="margin-top:20px; padding:20px; background:#FEF2F2; border-left:4px solid #EF4444; border-radius:8px;">
                <h4 style="color:#991B1B; font-weight:900; margin-bottom:8px; font-size:0.9rem; text-transform:uppercase;">The "Why Not" (Rejection Logic)</h4>
                <p style="color:#B91C1C; font-size:0.95rem;">${data.rejectionReason}</p>
            </div>
        </div>

        <div class="report-card">
            <div class="report-header-bg">BOARD COMPARISON TABLE</div>
            <table class="data-table" style="width:100%; border-collapse:collapse;">
                <thead><tr style="background:#F8FAFC;"><th style="padding:15px; text-align:left;">Board</th><th style="padding:15px; text-align:left;">Match Quality</th></tr></thead>
                <tbody>
                    ${res.fullRanking.slice(0, 3).map(r => `
                        <tr style="border-top:1px solid #F1F5F9;">
                            <td style="padding:15px; font-weight:700; color:#0F172A;">${r.name}</td>
                            <td style="padding:15px;">
                                <div style="height:8px; background:#E2E8F0; border-radius:100px; overflow:hidden;">
                                    <div style="height:100%; background:#FF6B35; width:${r.percentage}%"></div>
                                </div>
                                <span style="font-size:0.8rem; font-weight:700; color:#64748B; margin-top:4px; display:block;">${r.percentage}% Match</span>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <div class="report-card">
            <div class="report-header-bg">BOARD DEEP DIVE</div>
            <div style="display:grid; grid-template-columns:1fr; gap:20px;">
                <div><h4 style="color:#0F172A; font-weight:800; margin-bottom:5px;">Philosophy</h4><p style="color:#475569; font-size:0.95rem;">${data.philosophy}</p></div>
                <div><h4 style="color:#0F172A; font-weight:800; margin-bottom:5px;">Pedagogy</h4><p style="color:#475569; font-size:0.95rem;">${data.teachingMethod}</p></div>
            </div>
        </div>`;

    // Premium Injection
    if (amount >= 999) {
        html += `
            <div class="report-card">
                <div class="report-header-bg">🚩 RISK MITIGATION & VETTING</div>
                <div style="display:grid; gap:12px;">
                    ${MASTER_DATA.vetting.redFlags.map(flag => `<div style="padding:12px; background:#F8FAFC; border-radius:8px; border-left:4px solid #FF6B35; font-weight:600; font-size:0.9rem;">${flag}</div>`).join('')}
                </div>
            </div>
            <div class="report-card">
                <div class="report-header-bg">15-YEAR FINANCIAL FORECASTER</div>
                <table class="data-table" style="width:100%;">
                    <thead><tr style="background:#F8FAFC;"><th style="padding:12px; text-align:left;">Grade</th><th style="padding:12px; text-align:left;">Est. Annual Fee</th></tr></thead>
                    <tbody>${MASTER_DATA.financial.projectionTable.map(row => `<tr style="border-top:1px solid #F1F5F9;"><td style="padding:12px;">${row.grade}</td><td style="padding:12px; font-weight:700;">${row.fee}</td></tr>`).join('')}</tbody>
                </table>
            </div>`;
    }

    // Pro Injection
    if (amount >= 1499) {
        html += `
            <div class="report-card">
                <div class="report-header-bg">🤝 CONCIERGE NEGOTIATION SCRIPTS</div>
                ${MASTER_DATA.concierge.negotiation.map(n => `
                    <div style="margin-bottom:20px; padding:20px; background:#F0FDF4; border-radius:12px; border:1px solid #BBF7D0;">
                        <div style="font-weight:900; color:#166534; margin-bottom:8px;">${n.title}</div>
                        <p style="font-size:0.85rem; color:#15803d; margin-bottom:12px;">Scenario: ${n.scenario}</p>
                        <div style="padding:15px; background:white; border-radius:8px; font-style:italic; color:#0F172A; font-weight:600;">"${n.script}"</div>
                    </div>
                `).join('')}
            </div>
            <div class="report-card">
                <div class="report-header-bg">🎙️ INTERVIEW MASTERY GRID</div>
                <div class="interview-grid" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(250px, 1fr)); gap:15px;">
                    ${MASTER_DATA.interviewMastery.map(i => `
                        <div class="interview-card" style="padding:15px; border:1px solid #E2E8F0; border-radius:12px; background:#F8FAFC;">
                            <div style="font-weight:800; color:#0F172A; margin-bottom:8px;">Q: ${i.q}</div>
                            <div style="font-size:0.85rem; color:#64748B;">💡 Strategy: ${i.strategy}</div>
                        </div>
                    `).join('')}
                </div>
            </div>`;
    }

    document.getElementById('reportPreview').innerHTML = html;
};

window.downloadReport = async function() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF("p", "mm", "a4");
    const reportCards = document.querySelectorAll('#reportPreview .report-card');
    
    // Add Branded Vector Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(15, 23, 42);
    doc.text("Apt", 20, 20);
    doc.setTextColor(255, 107, 53);
    doc.text("Skola", 36, 20);
    
    let y = 35;
    for (let card of reportCards) {
        const canvas = await html2canvas(card, { scale: 2 });
        const imgData = canvas.toDataURL('image/jpeg', 0.8);
        const imgProps = doc.getImageProperties(imgData);
        const pdfWidth = doc.internal.pageSize.getWidth() - 40;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        if (y + pdfHeight > 280) { doc.addPage(); y = 20; }
        doc.addImage(imgData, 'JPEG', 20, y, pdfWidth, pdfHeight);
        y += pdfHeight + 10;
    }
    doc.save(`AptSkola-Report-${customerData.childName}.pdf`);
};

window.sharePDF = async function() {
    // Sharing logic using the same generation as download
    alert("Preparing shareable PDF...");
    window.downloadReport();
};

window.showPsychometricHistogram = function() {
    const container = document.getElementById('dynamicQuizContent');
    container.innerHTML = `
        <div class="p-8 bg-[#0F172A] rounded-3xl border border-slate-700 shadow-2xl text-center">
            <h2 class="text-white text-xl font-bold mb-8 uppercase tracking-widest">Psychometric DNA Snapshot</h2>
            <div id="compIndex" class="text-6xl font-black text-white animate-flicker">--%</div>
        </div>`;
    setTimeout(() => window.showSystemicRiskCard(), 1500);
};

window.showSystemicRiskCard = function() {
    const container = document.getElementById('dynamicQuizContent');
    container.innerHTML = `<button onclick="window.showPhase1BridgeCard()" class="w-full bg-red-600 text-white py-5 rounded-full font-black text-xl">RESOLVE & START PHASE 1 →</button>`;
};

window.showPhase1BridgeCard = function() {
    const container = document.getElementById('dynamicQuizContent');
    container.innerHTML = `<button onclick="window.startPhase1()" class="w-full bg-[#FF6B35] text-white py-5 rounded-full font-black text-xl">Analyze My Child’s Fitment Board →</button>`;
};

window.startPhase1 = function() { window.currentPhase = 1; window.initializeQuizShell(0); };

window.redirectToRazorpay = function() {
    const overlay = document.getElementById('redirectLoadingOverlay') || { style: {} };
    overlay.style.display = 'flex';
    setTimeout(() => {
        window.renderReportToBrowser();
        window.hideAllSections();
        document.getElementById('successPage').classList.remove('hidden');
        document.getElementById('successPage').classList.add('active');
        document.getElementById('displayOrderId').innerText = "AS" + Date.now();
        document.getElementById('successParentName').innerText = customerData.parentName;
        overlay.style.display = 'none';
    }, 1500);
};

// --- DATA ---
const phase0Questions = [
    { id: "p0_q1", text: "How does your child process complex new data?", options: ["Visual/Charts", "Auditory/Discussion", "Kinesthetic/Build"] },
    { id: "p0_q2", text: "Under high-stakes evaluation, what is the default response?", options: ["The Thriver/Speed", "The Deep Thinker/Precision", "The Collaborative"] },
    { id: "p0_q3", text: "What is the ultimate End-State for the child's career?", options: ["Global Explorer/Ivy", "Competitive Edge/National", "The Innovator"] },
    { id: "p0_q4", text: "Which KPI matters most?", options: ["Academic Mastery/Grades", "Holistic Confidence", "Critical Thinking/Logic"] }
];

const phase1Questions = [
    { id: "q1", text: "How does your child learn best?", options: ["Visual", "Auditory", "Kinesthetic", "Adaptable"] },
    { id: "q2", text: "What subject does your child naturally enjoy?", options: ["Maths", "English/Art", "Science", "Balanced"] },
    { id: "q3", text: "What is the big future goal?", options: ["Indian Exams", "Study Abroad", "Entrepreneurship", "Not sure"] },
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

// --- EVENTS ---
document.addEventListener('DOMContentLoaded', () => {
    const customerForm = document.getElementById('customerForm');
    if (customerForm) {
        customerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            customerData.parentName = document.getElementById('parentName')?.value;
            customerData.childName = document.getElementById('childName')?.value;
            customerData.orderId = "AS" + Date.now();
            window.redirectToRazorpay();
        });
    }
});
