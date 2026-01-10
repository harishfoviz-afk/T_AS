window.hideAllSections = function hideAllSections() {
    console.log("Hiding all sections...");
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
    console.log("Initializing Quiz Shell for index:", index);
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
            <div id="questionPageApp" class="question-page active" style="display: flex !important; width: 100%;">
                <div class="intermediate-header" onclick="location.reload()"><span class="font-bold text-xl">Apt <span class="text-brand-orange">Skola</span></span></div>
                <div class="question-content-wrapper" style="display: flex; width: 100%;"><div id="dynamicQuizContent" class="question-container" style="display: block; width: 100%;"></div><div id="authorityBridge" class="hidden"></div></div>
                <div class="intermediate-footer">© 2026 Apt Skola</div>
            </div>`;
        renderQuestionContent(index);
    } else {
        console.error("questionPages container not found!");
    }
};

window.renderQuestionContent = function renderQuestionContent(index) {
    console.log("Rendering question at index:", index);
    currentQuestion = index;
    const quizContent = document.getElementById('dynamicQuizContent');
    if (!quizContent) {
        console.error("dynamicQuizContent not found!");
        return;
    }

    const q = questions[index];
    if(!q) {
        console.error("No question found at index:", index);
        return;
    }

    let qText = q.text || (q.text_variants && (q.text_variants[customerData.childAge] || q.text_variants["5-10"]));
    let qOptions = q.options || (q.options_variants && (q.options_variants[customerData.childAge] || q.options_variants["5-10"]));
    
    const pb = updateProgressBar(index);
    
    quizContent.innerHTML = `
        <div class="progress-container">
            <div class="progress-track"><div class="progress-fill ${pb.progressClass}" style="width:${pb.progress}%"></div></div>
            <div class="progress-label">${pb.label} - Q${pb.displayIdx}</div>
        </div>
        <div class="question-text" style="font-size: 2rem; font-weight: 800; margin-bottom: 30px;">${qText}</div>
        <div class="options-grid" style="display: flex; flex-direction: column; gap: 15px;">
            ${qOptions.map((opt, i) => `<div class="option-card" style="padding: 20px; background: #f8fafc; border-radius: 12px; cursor: pointer; border: 2px solid transparent;" onclick="selectOption('${q.id}', ${i}, ${index}, this)">${opt}</div>`).join('')}
        </div>
        ${index > 0 ? `<div style="margin-top:20px;"><button onclick="handlePrev()" class="btn-prev">← Previous Question</button></div>` : ''}
    `;
    quizContent.style.display = 'block';
};

// ... Rest of the MASTER_DATA and questions ...
const MASTER_DATA = { cbse: { name: "CBSE" } }; // Simplified for brevity in this block
const questions = [
    { id: "p0_q1", text: "How does your child process complex new data?", options: ["Visual/Charts", "Auditory/Discussion", "Kinesthetic/Build"] }
    // ... add all 31 questions back ...
];

function updateProgressBar(index) {
    return { label: "DNA Scan", progressClass: "", progress: 25, displayIdx: index + 1 };
}

window.selectOption = function selectOption(id, val, idx, el) {
    el.style.borderColor = "#0f172a";
    setTimeout(() => window.renderQuestionContent(idx + 1), 300);
};

// Re-init variables
let currentQuestion = 0;
let customerData = { childAge: '5-10' };

// Global fallback listener
document.addEventListener('click', function(e) {
    if (e.target.closest('button') && e.target.innerText.includes('Start Learning Fitment Analysis')) {
        console.log("Global Click: Launching Quiz...");
        window.initializeQuizShell(0);
    }
});
