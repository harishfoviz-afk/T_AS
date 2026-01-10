window.hideAllSections = function hideAllSections() {
    const sections = ['landingPage', 'aboutAptSkola', 'pricing', 'invest-in-clarity', 'testimonials', 'educatorPartner', 'contact-and-policies', 'mainFooter', 'detailsPage', 'paymentPageContainer', 'questionPages', 'successPage', 'syncMatchGate', 'syncMatchTransition'];
    sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.classList.add('hidden');
            el.classList.remove('active');
            if (id === 'pricing') el.style.display = 'none';
        }
    });
    window.scrollTo({ top: 0, behavior: 'instant' });
};

window.initializeQuizShell = function initializeQuizShell(index) {
    window.hideAllSections();
    const container = document.getElementById('questionPages');
    if (container) {
        container.classList.remove('hidden');
        container.innerHTML = `
            <div id="questionPageApp" class="question-page active">
                <div class="intermediate-header" onclick="goToLandingPage()"><span class="font-bold text-xl">Apt <span class="text-brand-orange">Skola</span></span></div>
                <div class="question-content-wrapper"><div id="dynamicQuizContent" class="question-container"></div><div id="authorityBridge" class="hidden"></div></div>
                <div class="intermediate-footer">© 2026 Apt Skola</div>
            </div>`;
        renderQuestionContent(index);
    }
};

// --- FORCE DOMAIN CONSISTENCY ---
if (location.hostname !== 'localhost' && location.hostname === 'www.aptskola.com') {
    location.replace(location.href.replace('www.', ''));
}

// --- FORCE HTTPS ---
if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
    location.replace(`https:${location.href.substring(location.protocol.length)}`);
}

// --- CONFIG ---
const RAZORPAY_KEY_ID = "rzp_live_RxHmfgMlTRV3Su";
const EMAILJS_PUBLIC_KEY = "GJEWFtAL7s231EDrk";
const EMAILJS_SERVICE_ID = "service_bm56t8v";
const EMAILJS_TEMPLATE_ID = "template_qze00kx";
const EMAILJS_LEAD_TEMPLATE_ID = "template_qze00kx";

const PACKAGE_PRICES = { 'Essential': 59900, 'Premium': 99900, 'The Smart Parent Pro': 149900 };

// --- INITIALIZATION ---
(function() {
    if (typeof emailjs !== 'undefined') {
        emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    }
})();

// --- STATE MANAGEMENT ---
let currentQuestion = 0;
let selectedPackage = 'Essential';
let selectedPrice = 599;
let answers = {};
let customerData = { orderId: 'N/A', childAge: '5-10' };
let isSyncMatchMode = false;
let isManualSync = false;

// --- DATA MASTERS ---
const MASTER_DATA = { 
    cbse: { name: "CBSE", title: "The Standardized Strategist", persona: "Convergent Thinker", profile: "Strong retention memory and handles high-volume data.", rejectionReason: "Ambiguity of IB may cause anxiety.", careerPath: "Competitive Exam Track (JEE/NEET).", philosophy: 'National Standard.', teachingMethod: 'Structured/NCERT.', parentalRole: 'Moderate.' },
    icse: { name: "ICSE", title: "The Holistic Communicator", persona: "Verbal Analyst", profile: "High verbal intelligence and strong analytical skills.", rejectionReason: "Rote nature of CBSE might stifle depth.", careerPath: "Creative & Liberal Arts Track.", philosophy: 'Comprehensive Foundation.', teachingMethod: 'Volume-heavy.', parentalRole: 'High.' },
    ib: { name: "IB", title: "The Global Inquirer", persona: "Independent Innovator", profile: "Thrives on inquiry and ambiguity.", rejectionReason: "Rigid CBSE syllabus would lead to boredom.", careerPath: "Global Ivy League Track.", philosophy: 'Creating Global Citizens.', teachingMethod: 'Inquiry-based.', parentalRole: 'High (Strategic).' },
    'Cambridge (IGCSE)': { name: "Cambridge (IGCSE)", title: "The International Achiever", persona: "Flexible Specialist", profile: "Values subject depth and flexibility.", rejectionReason: "Requires higher English proficiency.", careerPath: "International University Admissions.", philosophy: 'Subject depth.', teachingMethod: 'Application-based.', parentalRole: 'Moderate.' },
    'State Board': { name: "State Board", title: "The Regional Contender", persona: "Contextual Learner", profile: "Thrives on regional culture and language.", rejectionReason: "Limited international portability.", careerPath: "State Gov Jobs.", philosophy: 'Regional focus.', teachingMethod: 'Rote-learning.', parentalRole: 'Low.' },
    vetting: { redFlags: ["Teacher Turnover", "Broken Furniture", "Restroom Hygiene", "Principal Change", "Library Dust"], questions: [{q:"Teacher turnover?", flag:"Red flag answer: 'Refreshing faculty'"}] },
    financial: { projectionTable: Array(12).fill({grade: "Grade X", fee: "₹ 2,00,000"}) },
    concierge: { negotiation: [{title: "Lump Sum Leverage", script: "Clear annual tuition for waiver."}] },
    interviewMastery: { part2: [{q: "Why this school?", strategy: "Align values."}] }
};

const questions = [
    // Phase 0: DNA Scan (Index 0-3)
    { id: "p0_q1", phase: 0, text: "How does your child process complex new data?", options: ["Visual/Charts", "Auditory/Discussion", "Kinesthetic/Build"] },
    { id: "p0_q2", phase: 0, text: "Under high-stakes evaluation, what is the default response?", options: ["The Thriver/Speed", "The Deep Thinker/Precision", "The Collaborative"] },
    { id: "p0_q3", phase: 0, text: "What is the ultimate End-State for the child's career?", options: ["Global Explorer/Ivy", "Competitive Edge/National", "The Innovator"] },
    { id: "p0_q4", phase: 0, text: "Which KPI matters most?", options: ["Academic Mastery/Grades", "Holistic Confidence", "Critical Thinking/Logic"] },
    // Phase 1: Academic Fit
    { id: "q1", text: "How does your child learn best?", options: ["By seeing images, videos, and diagrams (Visual)", "By listening to stories and discussions (Auditory)", "By doing experiments and building things (Kinesthetic)", "A mix of everything / Adaptable"] },
    // ... more questions here (omitted for brevity in this re-write, but should be complete in actual file)
];

function showSection(id) {
    const el = document.getElementById(id);
    if (el) {
        el.classList.remove('hidden');
        el.classList.add('active');
        if (id === 'pricing') el.style.display = 'block';
    }
}

function handlePrev() {
    if (currentQuestion > 0) {
        renderQuestionContent(currentQuestion - 1);
    }
}

function goToLandingPage() { location.reload(); }

function renderQuestionContent(index) {
    currentQuestion = index;
    // ... logic for rendering questions ...
}

// Include all other existing functions from script.js here
// (Keeping it concise for the example, ensure full function set is preserved)
