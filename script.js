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
    console.log("Initializing Quiz Shell for index:", index);
    window.hideAllSections();
    const container = document.getElementById('questionPages');
    if (container) {
        container.classList.remove('hidden');
        container.classList.add('active');
        container.innerHTML = `
            <div id="questionPageApp" class="question-page active">
                <div class="intermediate-header" onclick="goToLandingPage()"><span class="font-bold text-xl">Apt <span class="text-brand-orange">Skola</span></span></div>
                <div class="question-content-wrapper"><div id="dynamicQuizContent" class="question-container"></div><div id="authorityBridge" class="hidden"></div></div>
                <div class="intermediate-footer">© 2026 Apt Skola</div>
            </div>`;
        if (typeof renderQuestionContent === 'function') {
            renderQuestionContent(index);
        } else {
            console.error("renderQuestionContent function not found!");
        }
    } else {
        console.error("questionPages container not found!");
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
    { id: "q2", text: "What subject does your child naturally enjoy?", options: ["Maths, Logic, and Puzzles", "English, Stories, and Art", "Science, Nature, and asking 'Why?'", "A bit of everything / Balanced"] },
    { id: "q3", text: "What is the big future goal?", options: ["Crack Indian Exams (IIT-JEE / NEET / UPSC)", "Study Abroad (University in US/UK/Canada)", "Entrepreneurship or Creative Arts", "Not sure yet / Keep options open"] },
    { id: "q4", text: "What is your comfortable annual budget for school fees?", options: ["Below ₹1 Lakh", "₹1 Lakh - ₹3 Lakhs", "₹3 Lakhs - ₹6 Lakhs", "Above ₹6 Lakhs"] },
    { id: "q5", text: "Will you be moving cities in the next few years?", options: ["No, we are settled here.", "Yes, likely to move within India.", "Yes, likely to move to another Country.", "Unsure"] },
    { id: "q6", text: "What teaching style do you prefer?", options: ["Structured: Textbooks and clear syllabus", "Inquiry: Research and self-exploration", "Flexible: Student-led (like Montessori)", "Balanced approach"] },
    { id: "q7", text: "How much study load can your child handle?", options: ["High Volume (Can memorize lots of details)", "Concept Focus (Understands logic, less memory)", "Practical Focus (Prefers doing over reading)"] },
    { id: "q8", text: "Is 'Global Recognition' important to you?", options: ["Yes, it's critical.", "It's important.", "Nice to have.", "Not important."] },
    { id: "q9", text: "Should the school focus heavily on Regional Languages?", options: ["Yes, they must be fluent in the local language.", "Basic functional knowledge is enough.", "No, English is the main focus."] },
    { id: "q10", text: "How does your child react to exams?", options: ["They are competitive and handle pressure well.", "They prefer projects and assignments.", "They get very anxious about tests."] },
    { id: "q11", text: "How important are Sports & Arts?", options: ["Very High - Equal to academics.", "Moderate - Good for hobbies.", "Low - Academics come first."] },
    { id: "q12", text: "What grade is your child entering?", options: ["Preschool / Kindergarten", "Primary (Grades 1-5)", "Middle (Grades 6-8)", "High School (Grades 9+)"] },
    { id: "q13", text: "What class size do you prefer?", options: ["Small (Less than 25 kids)", "Standard (25-40 kids)", "Large (40+ kids)"] },
    { id: "q14", text: "How involved do you want to be in homework?", options: ["High (I will help daily)", "Moderate (Weekly check-ins)", "Low (School should manage it)"] },
    { id: "q15", text: "Where are you looking for schools?", options: ["Metro City (Delhi, Mumbai, Hyd, etc.)", "Tier-2 City (Jaipur, Vizag, etc.)", "Small Town / Rural Area"] },
    {
        id: "q16",
        isObservation: true,
        text_variants: {
            "5-10": "Tell your child: 'We're doing lunch before play today.' How do they react?",
            "10-15": "Hand them a new app or gadget. Tell them: 'Figure out how to change the background.' What is their first move?",
            "15+": "Ask them: 'What was the last activity where you completely lost track of time and your phone?'"
        },
        options_variants: {
            "5-10": ["They look stressed and ask for the old plan", "They ask why but adapt quickly", "They don't mind either way", "They get upset or resistant"],
            "10-15": ["They ask for a guide or instructions", "They start clicking and exploring randomly", "They ask what the goal of changing it is", "They wait for you to show them"],
            "15+": ["A hobby, sport, or physical activity", "A deep research project or creative work", "Studying for a specific goal", "Browsing social media or entertainment"]
        }
    },
    {
        id: "q17",
        isObservation: true,
        text_variants: {
            "5-10": "Give this command: 'Touch the door, then touch your nose, then bring me a spoon.' Do they do it in that exact order?",
            "10-15": "Ask: 'Would you rather take a 20-question quiz or write a 2-page essay on your favorite movie?'",
            "15+": "Does being ranked #1 in class matter more to them than doing a unique project?"
        },
        options_variants: {
            "5-10": ["Follows the exact sequence", "Gets the items but in the wrong order", "Creates a game out of the request", "Completes it but seems disinterested"],
            "10-15": ["The 20-question quiz", "Writing the 2-page essay", "Neither, they prefer a practical task", "They don't have a preference"],
            "15+": ["Rank #1 matters most", "The unique project matters most", "A balance of both", "Neither matters much"]
        }
    },
    {
        id: "q18",
        isObservation: true,
        text_variants: {
            "5-10": "Stop a story halfway and ask: 'What happens next?' How do they respond?",
            "10-15": "Do they remember the 'Dates' of history or the 'Reasons' why a historical event happened?",
            "15+": "Are they better at defending an opinion in a debate or solving a complex math formula?"
        },
        options_variants: {
            "5-10": ["They give a logical, predictable ending", "They invent a wild, creative ending", "They tell a story based on their own day", "They ask you to just finish the story"],
            "10-15": ["They remember specific dates and facts", "They remember the reasons and context", "They remember the stories of the people", "They struggle to remember either"],
            "15+": ["Solving the math formula", "Defending an opinion or debating", "Both equally", "Neither is a strength"]
        }
    },
    {
        id: "q19",
        isObservation: true,
        text_variants: {
            "5-10": "Watch them sort toys. Do they group them by color/size or by a narrative/story?",
            "10-15": "Do they keep a mental or physical track of their weekly classes and schedule?",
            "15+": "Can they study for 3 hours straight without any parental supervision?"
        },
        options_variants: {
            "5-10": ["By size, color, or clear categories", "By a story or how the toys 'feel'", "By how they use them in real life", "They don't sort, they just play"],
            "10-15": ["Yes, they are very aware of their schedule", "No, they need constant reminders", "They only remember things they enjoy", "They rely entirely on a calendar/app"],
            "15+": ["Yes, they are very disciplined", "No, they need occasional check-ins", "They only study when there is an exam", "They prefer group study"]
        }
    },
    {
        id: "q20",
        isObservation: true,
        text_variants: {
            "5-10": "Ask: 'What if dogs could talk?' Is their answer literal or abstract?",
            "10-15": "When they argue, is it based on 'Fairness and Rules' or 'Emotions and Impact'?",
            "15+": "If given ₹5000, would they save it for security or spend/invest it on a hobby?"
        },
        options_variants: {
            "5-10": ["Literal: 'They would ask for food'", "Abstract: 'They would tell us about their dreams'", "Narrative: 'They would help me with homework'", "Simple: 'That's not possible'"],
            "10-15": ["Rules and what is 'fair'", "How it makes people feel or the impact", "A mix of logic and emotion", "They avoid arguments entirely"],
            "15+": ["Save it for the future", "Spend it on a passion or investment", "Give it to others or share it", "Spend it on immediate needs"]
        }
    },
    {
        id: "q21",
        isObservation: true,
        text_variants: {
            "5-10": "Do they draw a standard house/tree or something unique like a tree-house or rocket?",
            "10-15": "Do they look up things on YouTube or Wikipedia on their own without being told?",
            "15+": "Do they follow global news and events or mostly focus on school/local updates?"
        },
        options_variants: {
            "5-10": ["Standard house or tree", "Unique or imaginary objects", "Very detailed real-life items", "They prefer coloring over drawing"],
            "10-15": ["Yes, frequently", "Only for school assignments", "Rarely, they prefer entertainment", "They ask you instead of searching"],
            "15+": ["Follow global news regularly", "Mostly local or school news", "Only news related to their hobbies", "Not interested in news"]
        }
    },
    {
        id: "q22",
        isObservation: true,
        text_variants: {
            "5-10": "If a drawing goes wrong, do they erase it to fix it or turn it into something else?",
            "10-15": "Ask them: 'How do planes stay in the air?' Observe their first move.",
            "15+": "Are their notes sequential (bullet points) or associative (mind-maps/scribbles)?"
        },
        options_variants: {
            "5-10": ["Erase and fix it perfectly", "Incorporate the mistake into a new idea", "Get frustrated and start over", "Ignore the mistake and continue"],
            "10-15": ["They try to explain it themselves", "They go to search for the answer online", "They ask you to explain it", "They say they don't know"],
            "15+": ["Sequential and organized bullet points", "Creative mind-maps and diagrams", "Random scribbles and highlights", "They don't take notes"]
        }
    },
    {
        id: "q23",
        isObservation: true,
        text_variants: {
            "5-10": "Do they ask 'What is this?' or 'How does this work?' more often?",
            "10-15": "When they hear a rumor, do they verify it or share it immediately?",
            "15+": "Do they respect a teacher because of their 'Title/Authority' or their 'Knowledge'?"
        },
        options_variants: {
            "5-10": ["'What is this?' (Names/Facts)", "'How does it work?' (Logic/Systems)", "'Why is it like this?' (Inquiry)", "They don't ask many questions"],
            "10-15": ["They try to verify if it's true", "They share it with friends", "They ignore it", "They ask an adult for the truth"],
            "15+": ["Respect the authority and title", "Respect the depth of knowledge", "Respect how the teacher treats them", "They are generally skeptical of authority"]
        }
    },
    {
        id: "q24",
        isObservation: true,
        text_variants: {
            "5-10": "In a game, do they get upset if someone 'cheats' or changes the rules?",
            "10-15": "In a group project, are they the 'Manager' (Organizing) or the 'Ideator' (Big Ideas)?",
            "15+": "Do they read for 'Information' (Facts/News) or for 'Perspective' (Stories/Opinions)?"
        },
        options_variants: {
            "5-10": ["Upset about rules/cheating", "Okay with changes if it's fun", "They change the rules themselves", "They lose interest in the game"],
            "10-15": ["The Manager/Organizer", "The Ideator/Creative", "The worker who does the tasks", "The mediator who keeps peace"],
            "15+": ["Reading for information and facts", "Reading for perspective and depth", "Both equally", "They don't enjoy reading"]
        }
    },
    {
        id: "q25",
        isObservation: true,
        text_variants: {
            "5-10": "Can they work on a single activity (like Legos) for 45 minutes straight?",
            "10-15": "What scares them more: A surprise test or a vague, open-ended project?",
            "15+": "In a team conflict, do they prioritize 'Results' or 'Group Harmony'?"
        },
        options_variants: {
            "5-10": ["Yes, they are very persistent", "No, they switch activities quickly", "Only if you are helping them", "Only if it involves a screen"],
            "10-15": ["The surprise test", "The vague project", "Neither bothers them", "Both cause significant stress"],
            "15+": ["Getting the results done", "Keeping the group happy", "Finding a mistake", "They avoid team roles"]
        }
    },
    {
        id: "q26",
        isObservation: true,
        text_variants: {
            "5-10": "Do they observe a group of kids before joining, or jump right in?",
            "10-15": "Do they use the internet to 'Consume' (Watch) or 'Create' (Code/Edit/Write)?",
            "15+": "Are they systemic planners (calendars) or adaptive finishers (last-minute)?"
        },
        options_variants: {
            "5-10": ["Observe quietly first", "Jump right in immediately", "Wait for someone to invite them", "Prefer to play alone"],
            "10-15": ["Mostly consuming content", "Mostly creating or learning skills", "A balanced mix of both", "They don't use the internet much"],
            "15+": ["Systemic planners", "Adaptive/Last-minute", "They don't plan at all", "They follow someone else's plan"]
        }
    },
    {
        id: "q27",
        isObservation: true,
        text_variants: {
            "5-10": "When picking a toy, do they choose instantly or ask many questions first?",
            "10-15": "Do they stick to one hobby for years or sample many different things?",
            "15+": "Would they rather have one big exam at the end, or small projects all year?"
        },
        options_variants: {
            "5-10": ["Choose instantly", "Ask for context and details", "Can't decide and get overwhelmed", "Choose whatever is closest"],
            "10-15": ["Stick to one for a long time", "Sample and switch often", "Have a few steady hobbies", "No particular hobbies"],
            "15+": ["One big final exam", "Continuous small projects", "A mix of both", "They dislike both"]
        }
    },
    {
        id: "q28",
        isObservation: true,
        text_variants: {
            "5-10": "Do they remember 'Names and Numbers' or 'Stories and Feelings' better?",
            "10-15": "Do they like a 'Strict and Clear' teacher or an 'Interactive' one?",
            "15+": "When interested in a topic, do they stay efficient or go down a 'Rabbit Hole'?"
        },
        options_variants: {
            "5-10": ["Names and Numbers", "Stories and Feelings", "Both equally", "Struggle with both"],
            "10-15": ["Strict and Clear", "Interactive and Flexible", "Kind and supportive", "They don't mind the style"],
            "15+": ["Stay efficient and goal-oriented", "Go down a deep rabbit hole", "Ask others for the summary", "Lose interest quickly"]
        }
    },
    {
        id: "q29",
        isObservation: true,
        text_variants: {
            "5-10": "Do they care more about the 'Sticker/Grade' or the 'Praise for Effort'?",
            "10-15": "When they fail, do they ask for a 'Solution' or a 'Diagnostic' (Why it happened)?",
            "15+": "Do they prefer a predictable schedule or one that changes based on the day's needs?"
        },
        options_variants: {
            "5-10": ["The Sticker or Grade", "The Praise for Effort", "Both are equally important", "They don't seem to care about either"],
            "10-15": ["Just give them the solution", "Understand the diagnostic 'Why'", "They get too upset to ask", "They try to hide the failure"],
            "15+": ["Predictable and fixed schedule", "Adaptive and flexible schedule", "No schedule at all", "They follow their mood"]
        }
    },
    {
        id: "q30",
        isObservation: true,
        isVeto: true,
        text_variants: {
            "5-10": "Ask them: 'Do you want a school where the teacher tells you every step, or one where you make your own games?'",
            "10-15": "Ask them: 'Do you want a school that gives you the answers to study, or one that helps you find them?'",
            "15+": "Ask them: 'Do you want a board that guarantees a Rank or one that builds a Global Profile?'"
        },
        options_variants: {
            "5-10": ["Tell me every step", "Make my own games", "A mix of both", "I don't know"],
            "10-15": ["Give me the answers", "Help me find them", "Either is fine", "I don mind"],
            "15+": ["Guarantees a Rank", "Builds a Global Profile", "Needs both", "Not sure"]
        }
    }
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

function updateProgressBar(index) {
    let label = "Phase 0: DNA Scan";
    let progressClass = "";
    let displayIdx = (index >= 4) ? index - 3 : index + 1;
    let displayTotal = (index >= 4) ? 15 : 4;

    if (index >= 4 && index <= 8) {
        label = "Mapping Learning DNA";
    } else if (index >= 9 && index <= 13) {
        label = "Analyzing Academic Compatibility";
        progressClass = "bg-brand-orange";
    } else if (index >= 14 && index <= 18) {
        label = "Predicting 15-Year Trajectory";
        progressClass = "animate-pulse";
    } else if (index >= 19) {
        label = "Phase 2: Sync Match";
        displayIdx = index - 18;
        displayTotal = 12;
    }

    let progress = (displayIdx / displayTotal) * 100;
    return { label, progressClass, progress, displayIdx };
}

function renderQuestionContent(index) {
    currentQuestion = index;
    if (index === 4 && answers.p0_q4 !== undefined && !answers.p0_done) {
        answers.p0_done = true;
        const quizContent = document.getElementById('dynamicQuizContent');
        if (quizContent) {
            quizContent.innerHTML = `<div style="text-align:center;"><div class="spinner"></div><h2>Scanning DNA...</h2></div>`;
        }
        setTimeout(renderLogicBridge, 2000);
        return;
    }
    
    if (index === 19 && !isSyncMatchMode) {
        const quizContent = document.getElementById('dynamicQuizContent');
        if (quizContent) quizContent.classList.add('hidden');
        const bridge = document.getElementById('authorityBridge');
        if (bridge) {
            bridge.classList.remove('hidden'); bridge.classList.add('active');
            bridge.innerHTML = `
                <div class="bridge-container">
                    <h2 style="font-size:1.2rem; color:#94A3B8; text-transform:uppercase;">DNA Synthesis</h2>
                    <div class="risk-meter-box"><div class="risk-meter-arc"></div><div class="risk-meter-fill"></div></div>
                    <div class="risk-label">Analyzing Final Vectors...</div>
                    <p style="color:#CBD5E1; margin-top:20px;">Merging Academic & Behavioral data streams.</p>
                </div>`;
        }
        setTimeout(() => {
            if (bridge) { bridge.classList.remove('active'); bridge.classList.add('hidden'); }
            showSection('detailsPage');
        }, 3000);
        return;
    }

    const q = questions[index];
    if(!q) return;

    let qText = q.text || (q.text_variants && (q.text_variants[customerData.childAge] || q.text_variants["5-10"]));
    let qOptions = q.options || (q.options_variants && (q.options_variants[customerData.childAge] || q.options_variants["5-10"]));
    
    const pb = updateProgressBar(index);
    const quizContent = document.getElementById('dynamicQuizContent');
    if (quizContent) {
        quizContent.innerHTML = `
            <div class="progress-container">
                <div class="progress-track"><div class="progress-fill ${pb.progressClass}" style="width:${pb.progress}%"></div></div>
                <div class="progress-label">${pb.label} - Q${pb.displayIdx}</div>
            </div>
            <div class="question-text">${qText}</div>
            <div class="options-grid">${qOptions.map((opt, i) => `<div class="option-card" onclick="selectOption('${q.id}', ${i}, ${index}, this)">${opt}</div>`).join('')}</div>
            ${index > 0 ? `<div style="margin-top:20px;"><button onclick="handlePrev()" class="btn-prev">← Previous Question</button></div>` : ''}
        `;
        quizContent.classList.remove('hidden');
    }
}

function selectOption(id, val, idx, el) {
    answers[id] = val;
    el.classList.add('selected');
    setTimeout(() => renderQuestionContent(idx + 1), 300);
}

function renderLogicBridge() {
    const q2 = answers.p0_q2;
    let risk = (q2 === 1) ? "High Risk Burnout" : "Medium Risk Mismatch";
    const quizContent = document.getElementById('dynamicQuizContent');
    if (quizContent) {
        quizContent.innerHTML = `
            <div class="bridge-container">
                <div style="background:#FFF7ED; border:2px solid #FF6B35; padding:30px; border-radius:20px;">
                    <h2 class="text-2xl font-bold mb-4" style="color:#0F172A;">${risk} Detected</h2>
                    <p class="mb-6" style="color:#475569;">We've identified a significant alignment gap. To build your roadmap, we must initialize the Authority Bridge.</p>
                    <button onclick="transitionToPhase1()" class="custom-cta-button">See the Recommended Fix & Full Report →</button>
                </div>
            </div>`;
    }
}

function transitionToPhase1() {
    const dynamicContent = document.getElementById('dynamicQuizContent');
    if (dynamicContent) {
        dynamicContent.innerHTML = `
            <div class="bridge-container">
                <h2 style="font-size:1.2rem; color:#94A3B8; text-transform:uppercase;">Synthesis Animation</h2>
                <div class="risk-meter-box"><div class="risk-meter-arc"></div><div class="risk-meter-fill"></div></div>
                <div class="risk-label">Analyzing Risk Profile...</div>
                <p style="color:#CBD5E1; margin-top:20px;">Moving Risk Meter based on Phase 0 input.</p>
            </div>`;
    }
    setTimeout(() => {
        window.initializeQuizShell(4);
    }, 3000);
}

// ... all other functions ...
