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
    console.log("Global: Initializing Quiz Shell...");
    const landing = document.getElementById("landingPage");
    if (landing) landing.style.display = "none";
    const reactRoot = document.getElementById("react-hero-root");
    if (reactRoot) reactRoot.style.display = "none";
    
    window.hideAllSections();
    
    const container = document.getElementById('questionPages');
    if (container) {
        container.classList.remove('hidden');
        container.classList.add('active');
        container.style.display = 'flex';
        container.innerHTML = `
            <div id="questionPageApp" class="question-page active" style="display: flex !important; flex-direction: column; min-height: 100vh; width: 100%; background: white;">
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

    const q = questions[index];
    if(!q) return;

    let qText = q.text || (q.text_variants && (q.text_variants[customerData.childAge] || q.text_variants["5-10"]));
    let qOptions = q.options || (q.options_variants && (q.options_variants[customerData.childAge] || q.options_variants["5-10"]));
    
    const pb = updateProgressBar(index);
    
    quizContent.innerHTML = `
        <div class="progress-container" style="margin-bottom: 20px;">
            <div class="progress-track" style="height: 6px; background: #E2E8F0; border-radius: 10px; overflow: hidden;">
                <div class="progress-fill ${pb.progressClass}" style="width: ${pb.progress}%; height: 100%; background: #FF6B35;"></div>
            </div>
            <div class="progress-label" style="font-size: 0.9rem; color: #64748B; margin-top: 10px;">${pb.label} - Q${pb.displayIdx}</div>
        </div>
        <div class="question-text" style="font-size: 2rem; font-weight: 800; color: #0F172A; margin-bottom: 30px;">${qText}</div>
        <div class="options-grid" style="display: flex; flex-direction: column; gap: 15px;">
            ${qOptions.map((opt, i) => `<div class="option-card" style="padding: 20px; background: #F8FAFC; border-radius: 12px; cursor: pointer; border: 2px solid transparent; font-size: 1.1rem; font-weight: 500;" onclick="window.selectOption('${q.id}', ${i}, ${index}, this)">${opt}</div>`).join('')}
        </div>
    `;
};

window.selectOption = function selectOption(id, val, idx, el) {
    answers[id] = val;
    el.style.borderColor = "#0F172A";
    el.style.background = "white";
    setTimeout(() => window.renderQuestionContent(idx + 1), 300);
};

// --- DATA & STATE ---
let currentQuestion = 0;
let answers = {};
let customerData = { childAge: '5-10' };

const questions = [
    { id: "p0_q1", text: "How does your child process complex new data?", options: ["Visual/Charts", "Auditory/Discussion", "Kinesthetic/Build"] },
    { id: "p0_q2", text: "Under high-stakes evaluation, what is the default response?", options: ["The Thriver/Speed", "The Deep Thinker/Precision", "The Collaborative"] },
    { id: "p0_q3", text: "What is the ultimate End-State for the child's career?", options: ["Global Explorer/Ivy", "Competitive Edge/National", "The Innovator"] },
    { id: "p0_q4", text: "Which KPI matters most?", options: ["Academic Mastery/Grades", "Holistic Confidence", "Critical Thinking/Logic"] }
];

function updateProgressBar(index) {
    let progress = ((index + 1) / questions.length) * 100;
    return { label: "DNA Scan", progressClass: "", progress: progress, displayIdx: index + 1 };
}

// --- FALLBACK LISTENER ---
document.addEventListener('click', function(e) {
    if (e.target.innerText && e.target.innerText.includes('Start Learning Fitment Analysis')) {
        window.initializeQuizShell(0);
    }
});
