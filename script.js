// --- GLOBAL UTILITIES & funnel ---
window.phase0Complete = false;
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
            progressPercent = 33; progressColor = "bg-slate-400"; phaseLabel = "Mapping Learning DNA";
        } else if (phase1Idx <= 10) {
            progressPercent = 66; progressColor = "bg-brand-orange"; phaseLabel = "Analyzing Academic Compatibility";
        } else {
            progressPercent = 100; progressColor = "bg-brand-orange animate-pulse shadow-[0_0_15px_rgba(255,107,53,0.6)]"; phaseLabel = "Matching for Board";
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
});

// --- PIXEL RETARGETING TRIGGER ---
    if (typeof fbq !== 'undefined') {
        fbq('track', 'InitiateCheckout', {
            content_name: selectedPackage,
            value: selectedPrice,
            currency: 'INR'
        });
    }
    if (typeof gtag !== 'undefined') {
        gtag('event', 'begin_checkout', {
            items: [{ item_name: selectedPackage, price: selectedPrice }]
        });
    }

    const formData = new FormData(this);
    formData.append('orderId', newOrderId);

// --- RAZORPAY POPUP METHOD (WITH AUTO-PREFILL) ---
function testPaymentSuccess() {
    console.log("Test payment success triggered");
    
    // Simulate payment success
    const orderId = customerData.orderId || 'TEST_' + Date.now();
    customerData.orderId = orderId;
    localStorage.setItem(`aptskola_session_${orderId}`, JSON.stringify({
        answers: answers,
        customerData: customerData,
        selectedPackage: selectedPackage,
        selectedPrice: selectedPrice
    }));
    localStorage.setItem('aptskola_last_order_id', orderId);
    
    const overlay = document.getElementById('redirectLoadingOverlay');
    if (overlay) overlay.style.display = 'flex';

    // Generate report instantly
    console.log("Starting report generation...");
    renderReportToBrowser().then(() => {
        console.log("Report rendered successfully, showing success page...");
        showInstantSuccessPage();
        if(overlay) {
            overlay.style.display = 'none';
            console.log("Overlay hidden");
        }
        
        // Send the email with the report image
        triggerAutomatedEmail();
    }).catch((error) => {
        console.error("Error in report generation:", error);
        alert("There was an error generating your report. Please contact support with this error: " + error.message);
        if(overlay) {
            overlay.style.display = 'none';
            console.log("Overlay hidden after error");
        }
    });
}
    
function redirectToRazorpay() {
    // For testing: bypass payment and show success page
    if (window.location.search.includes('test=1')) {
        console.log("TEST MODE: Bypassing payment");
        testPaymentSuccess();
        return;
    }
    
    if (typeof Razorpay === 'undefined') {
        alert("Payment gateway is still loading. Please refresh the page or check your internet connection.");
        return;
    }

    const payButton = document.getElementById('payButton');
    if (payButton) payButton.innerText = "Opening Secure Checkout...";
    
    // 1. Pull the price in Paise (e.g., 59900) from your config
    const amountInPaise = PACKAGE_PRICES[selectedPackage] || 59900;

    const options = {
        "key": RAZORPAY_KEY_ID, 
        "amount": amountInPaise, 
        "currency": "INR",
        "name": "Apt Skola",
        "description": `Payment for ${selectedPackage} Report`,
        "image": "https://aptskola.com/favicon.png", 
        
        // 2. THIS IS THE PREFILL LOGIC: 
        // It uses the data already entered in your details form.
        "prefill": {
            "name": customerData.parentName,
            "email": customerData.email,
            "contact": customerData.phone
        },
        
        "handler": function (response) {
            // SUCCESS: Runs after payment without leaving the page
            console.log("Payment Successful. ID: " + response.razorpay_payment_id);
            
            // Check if we have answers before proceeding
            if (!answers || Object.keys(answers).length === 0) {
                console.error("No answers found! Checking localStorage...");
                const lastOrderId = localStorage.getItem('aptskola_last_order_id');
                const sessionData = JSON.parse(localStorage.getItem(`aptskola_session_${lastOrderId}`));
                if (sessionData && sessionData.answers) {
                    answers = sessionData.answers;
                    customerData = sessionData.customerData;
                    selectedPackage = sessionData.selectedPackage;
                    selectedPrice = sessionData.selectedPrice;
                    console.log("Loaded answers from localStorage");
                } else {
                    alert("Assessment data not found. Please complete the assessment first.");
                    return;
                }
            }
            
            // Save payment success state to localStorage
            const orderId = customerData.orderId || 'ORDER_' + Date.now();
            customerData.orderId = orderId;
            localStorage.setItem(`aptskola_session_${orderId}`, JSON.stringify({
                answers: answers,
                customerData: customerData,
                selectedPackage: selectedPackage,
                selectedPrice: selectedPrice
            }));
            localStorage.setItem('aptskola_last_order_id', orderId);
            
            const overlay = document.getElementById('redirectLoadingOverlay');
            if (overlay) overlay.style.display = 'flex';
            
            // Generate report instantly
            console.log("Starting report generation...");
            renderReportToBrowser().then(() => {
                console.log("Report rendered successfully, showing success page...");
                showInstantSuccessPage();
                if(overlay) {
                    overlay.style.display = 'none';
                    console.log("Overlay hidden");
                }
                
                // Send the email with the report image
                triggerAutomatedEmail();
            }).catch((error) => {
                console.error("Error in report generation:", error);
                alert("There was an error generating your report. Please contact support with this error: " + error.message);
                if(overlay) {
                    overlay.style.display = 'none';
                    console.log("Overlay hidden after error");
                }
            });
        },
        "theme": { "color": "#FF6B35" },
        "modal": {
            "ondismiss": function() {
                if(payButton) payButton.innerText = `Pay ₹${selectedPrice} via UPI / Card →`;
            }
        }
    };

    const rzp1 = new Razorpay(options);
    rzp1.open();
}

async function triggerAutomatedEmail() {
    console.log("CTO: Generating Branded HTML Report with Tiered Insights...");
    console.log("Selected package:", selectedPackage, "Selected price:", selectedPrice);
    
    const res = calculateFullRecommendation(answers);
    const recBoard = res.recommended.name;
    const boardKey = recBoard.toLowerCase().includes('cbse') ? 'cbse' : 
                     (recBoard.toLowerCase().includes('icse') ? 'icse' : 
                     (recBoard.toLowerCase().includes('ib') ? 'ib' : 
                     (recBoard.toLowerCase().includes('cambridge') ? 'Cambridge (IGCSE)' : 'State Board')));
    
    const data = MASTER_DATA[boardKey];

    // Build the Branded Header and Basic Info
    let htmlSummary = `
        <div style="border: 1px solid #E2E8F0; border-radius: 16px; overflow: hidden; font-family: sans-serif; margin: 20px 0;">
            <div style="background-color: #0F172A; color: #ffffff; padding: 25px; text-align: center;">
                <h2 style="margin: 0; font-size: 22px; letter-spacing: 0.5px;">${data.title}</h2>
                <p style="margin: 8px 0 0; color: #FF6B35; font-weight: 800; font-size: 16px;">
                    MATCH: ${recBoard} (${res.recommended.percentage}%)
                </p>
            </div>
            <div style="padding: 25px; background-color: #ffffff; color: #334155;">
                <p style="margin-top: 0;"><strong>Persona:</strong> ${data.persona}</p>
                <p style="line-height: 1.6;"><strong>Philosophy:</strong> ${data.philosophy}</p>
    `;

    // ADDED: Premium Insights (₹999 Tier)
    if (selectedPrice >= 999) {
        console.log("Adding premium content for price:", selectedPrice);
        htmlSummary += `
            <div style="margin-top: 20px; padding: 15px; background-color: #F0FDF4; border-left: 4px solid #10B981; border-radius: 4px;">
                <h4 style="margin: 0 0 5px 0; color: #166534; font-size: 14px; text-transform: uppercase;">Premium Insights</h4>
                <p style="margin: 0; color: #334155; font-size: 14px;"><strong>Risk Check:</strong> Look for 'Library Dust' and 'Teacher Turnover' during your campus visit.</p>
                <p style="margin: 5px 0 0; color: #334155; font-size: 14px;"><strong>Financial:</strong> Budget for a 12% annual fee inflation over 15 years.</p>
            </div>
        `;
    }

    // ADDED: Pro Admission Tips (₹1499 Tier)
    if (selectedPrice >= 1499) {
        console.log("Adding pro content for price:", selectedPrice);
        htmlSummary += `
            <div style="margin-top: 15px; padding: 15px; background-color: #FFF7ED; border-left: 4px solid #FF6B35; border-radius: 4px;">
                <h4 style="margin: 0 0 5px 0; color: #9A3412; font-size: 14px; text-transform: uppercase;">Pro Admission Tips</h4>
                <p style="margin: 0; color: #334155; font-size: 14px;"><strong>Negotiation:</strong> Use the 'Lump Sum Leverage' script to ask for admission fee waivers.</p>
                <p style="margin: 5px 0 0; color: #334155; font-size: 14px;"><strong>Interview:</strong> Never answer for the child; it is the #1 reason for rejection.</p>
            </div>
        `;
    }

    htmlSummary += `</div></div>`;

	// ADDED: Partnership Invitation (Captured from Educator Partner Section)
    htmlSummary += `
        <div style="margin-top: 20px; padding: 15px; border: 1px dashed #CBD5E1; border-radius: 8px; background-color: #F8FAFC; text-align: center;">
            <h4 style="margin: 0 0 10px 0; color: #0F172A; font-size: 14px;">🤝 Join the Apt Skola Network</h4>
            <p style="margin: 0; color: #475569; font-size: 13px; line-height: 1.5;">
                Teachers & Tutors: Earn <strong>₹300</strong> for student referrals and 
                <strong>₹3,000</strong> per session for school-wide engagement. 
            </p>
            <a href="https://aptskola.com/#educatorPartner" style="display: inline-block; margin-top: 10px; color: #FF6B35; font-weight: 700; text-decoration: none; font-size: 13px;">Register as Partner →</a>
        </div>
    `;

    try {
        console.log("Sending email for package:", selectedPackage, "price:", selectedPrice);
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
            user_email: customerData.email,
            user_name: customerData.parentName,
            order_id: customerData.orderId,
            child_name: customerData.childName,
            report_text_summary: htmlSummary 
        });
        console.log("Email sent successfully for order:", customerData.orderId);
    } catch (e) {
        console.error("Email dispatch failed for order", customerData.orderId, ":", e);
    }
}

function processSyncUpgrade() {
    const payButton = document.querySelector('#upgradeBlock button');
    if (payButton) payButton.innerText = "Opening Upgrade...";

    const options = {
        "key": RAZORPAY_KEY_ID,
        "amount": 29900, // ₹299 in Paise
        "currency": "INR",
        "name": "Apt Skola",
        "description": "Sync Match Module Upgrade",
        "prefill": {
            "name": customerData.parentName,
            "email": customerData.email,
            "contact": customerData.phone
        },
        "handler": function (response) {
            // SUCCESS: Runs instantly without redirecting
            customerData.package = 'Premium';
            isSyncMatchMode = true; 
            
            // Save elevated state
            localStorage.setItem(`aptskola_session_${customerData.orderId}`, JSON.stringify({ answers, customerData }));

            const upgradeBlock = document.getElementById('upgradeBlock');
            const startBtn = document.getElementById('startSyncBtn');
            
            if(upgradeBlock) upgradeBlock.classList.add('hidden');
            if(startBtn) {
                startBtn.classList.remove('hidden');
                startBtn.innerText = "Access Unlocked! Start Sync Check →";
                startBtn.style.background = "#10B981";
            }
            
            showSyncTransition();
        },
        "theme": { "color": "#FF6B35" }
    };
    const rzp1 = new Razorpay(options);
    rzp1.open();
}

function closeBonusModalAndShowSuccess() {
    document.getElementById('bonusModal').classList.remove('active');
    if (selectedPrice >= 1499) {
        document.getElementById('forensicSuccessModal').classList.add('active');
    } else {
        showInstantSuccessPage();
    }
}

function closeForensicModalAndShowSuccess() {
    document.getElementById('forensicSuccessModal').classList.remove('active');
    showInstantSuccessPage();
}

function showInstantSuccessPage() {
    console.log("showInstantSuccessPage called");
    const paymentPage = document.getElementById('paymentPageContainer');
    const successPage = document.getElementById('successPage');
    console.log("Payment page element:", paymentPage);
    console.log("Success page element:", successPage);
    
    // Add this inside your showInstantSuccessPage function in script.js
	const successContainer = document.querySelector('.success-container');
	console.log("Success container:", successContainer);
	if (successContainer) {
    const backupNotice = `
        <div style="background: #FFF7ED; border: 1px solid #FFEDD5; padding: 15px; border-radius: 10px; margin: 20px 0; border-left: 5px solid #F59E0B;">
            <p style="color: #9A3412; font-weight: 700; font-size: 0.9rem;">
                💾 PLEASE DOWNLOAD YOUR PDF NOW
            </p>
            <p style="color: #C2410C; font-size: 0.8rem; margin-top: 5px;">
                We have sent a summary to your email, but the full 15-year roadmap is only saved locally on this browser. Download the PDF to keep it forever.
            </p>
        </div>
    `;
    successContainer.insertAdjacentHTML('afterbegin', backupNotice);
}	
    if(paymentPage) {
        paymentPage.classList.add('hidden');
        console.log("Payment page hidden");
    }
    if(successPage) {
        successPage.classList.remove('hidden');
        successPage.classList.add('active');
        console.log("Success page shown");
        
        // Scroll to top to show the success page
        window.scrollTo({ top: 0, behavior: 'instant' });
        
        // Wait a bit for DOM to update, then check for buttons
    }
    
    // 5. BUTTON SAFETY: Force Pricing Buttons to be active
    const pricingButtons = document.querySelectorAll('#pricing button');
    pricingButtons.forEach(btn => {
        btn.style.pointerEvents = 'auto';
        btn.style.cursor = 'pointer';
        btn.style.zIndex = '100'; // Ensure they are on top
    });

    // 6. BUTTON SAFETY: Ensure landing page buttons/links are clickable
    const landingButtons = document.querySelectorAll('#landingPage button, #landingPage a, .hero-actions button');
    landingButtons.forEach(el => {
        try {
            el.style.pointerEvents = 'auto';
            el.style.cursor = 'pointer';
            el.style.zIndex = '80';
        } catch (e) { /* ignore readonly styles */ }
    });

    // 7. Ensure redirect/loading overlay doesn't block clicks when hidden
    const redirectOverlay = document.getElementById('redirectLoadingOverlay');
    if (redirectOverlay && !redirectOverlay.classList.contains('active')) {
        redirectOverlay.style.pointerEvents = 'none';
        redirectOverlay.style.display = 'none';
        redirectOverlay.style.visibility = 'hidden';
    }

    // 8. DEFENSIVE: detect any unexpected full-page blockers and make them non-interactive
    (function unblockCoveringElements() {
        try {
            const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
            const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
            const candidates = [];
            const all = Array.from(document.querySelectorAll('body *'));
            all.forEach(el => {
                const style = window.getComputedStyle(el);
                if (style.display === 'none' || style.visibility === 'hidden' || style.pointerEvents === 'none') return;
                const rect = el.getBoundingClientRect();
                if (!rect.width || !rect.height) return;
                const coversWidth = rect.width >= vw * 0.9 && rect.height >= vh * 0.9;
                const isFixed = style.position === 'fixed' || style.position === 'absolute' || style.position === 'sticky';
                const z = parseInt(style.zIndex) || 0;
                if (coversWidth && isFixed && z >= 50) {
                    candidates.push({ el, rect, z, className: el.className || '', id: el.id || '' });
                }
            });

            if (candidates.length > 0) {
                console.warn('Blocking elements detected:', candidates.map(c => ({id: c.id, class: c.className, z: c.z})));
                candidates.forEach(c => {
                    // Preserve intentional modals by checking for common modal classes/ids
                    const lower = String(c.className).toLowerCase();
                    const id = String(c.id).toLowerCase();
                    if (lower.includes('payment-modal') || lower.includes('sample-modal') || id.includes('redirect') || id.includes('modal') || c.el.classList.contains('active')) {
                        // if it's active modal, leave it; otherwise ensure it's visible and interactive
                        if (!c.el.classList.contains('active')) {
                            c.el.style.pointerEvents = 'none';
                            c.el.style.zIndex = '10';
                            console.info('Demoted non-active modal-like element:', c.el);
                        }
                    } else {
                        c.el.style.pointerEvents = 'none';
                        c.el.style.zIndex = '10';
                        console.info('Disabled unexpected full-page blocker:', c.el);
                    }
                });
            }
        } catch (e) {
            console.error('unblockCoveringElements failed', e);
        }
    })();
});

// --- HELPER FUNCTIONS (PASTE & RECOVERY) ---
async function pasteOrderId() {
    try {
        const text = await navigator.clipboard.readText();
        const syncInput = document.getElementById('syncOrderId');
        if (syncInput && text) {
            syncInput.value = text.trim();
            syncInput.style.borderColor = "#10B981"; 
