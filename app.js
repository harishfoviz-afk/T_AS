// --- CONFIG ---
const RAZORPAY_KEY_ID = "rzp_live_RxHmfgMlTRV3Su";
const EMAILJS_PUBLIC_KEY = "GJEWFtAL7s231EDrk"; 
const EMAILJS_SERVICE_ID = "service_bm56t8v"; 
const EMAILJS_TEMPLATE_ID = "template_qze00kx"; 
const EMAILJS_LEAD_TEMPLATE_ID = "template_qze00kx";

// Prices in PAISE (1 Rupee = 100 Paise)
const PACKAGE_PRICES = { 'Essential': 59900, 'Premium': 99900, 'The Smart Parent Pro': 149900 };

// --- STATE MANAGEMENT ---
let currentQuestion = 0;
let selectedPackage = 'Essential';
let selectedPrice = 599;
let answers = {};
let customerData = {
    orderId: 'N/A',
    childAge: '5-10',
    residentialArea: 'Not Provided',
    pincode: '000000',               
    partnerId: ''
};

let hasSeenDowngradeModal = false;
let isSyncMatchMode = false;
let isManualSync = false;
let syncTimerInterval = null;

// --- INITIALIZATION ---
(function() {
    if (typeof emailjs !== 'undefined') {
        emailjs.init({
            publicKey: EMAILJS_PUBLIC_KEY,
        });
    }
})();

function checkPaymentStatus() {
    const params = new URLSearchParams(window.location.search);
    const razorpayId = params.get('razorpay_payment_id') || params.get('razorpay_payment_link_id');

    if (razorpayId) {
        const landing = document.getElementById('landingPage');
        if (landing) landing.style.display = 'none';

        const overlay = document.getElementById('redirectLoadingOverlay');
        if (overlay) overlay.style.display = 'flex';

        const lastOrderId = localStorage.getItem('aptskola_last_order_id');
        const savedSession = localStorage.getItem(`aptskola_session_${lastOrderId}`);

        if (savedSession) {
            const data = JSON.parse(savedSession);
            answers = data.answers;
            customerData = data.customerData;
            selectedPackage = data.selectedPackage;
            selectedPrice = data.selectedPrice;
            
            renderReportToBrowser().then(() => {
                showInstantSuccessPage();
                if(overlay) overlay.style.display = 'none';
                triggerAutomatedEmail();
            });
        } else {
            if(overlay) overlay.style.display = 'none';
            if(landing) landing.style.display = 'block';
            alert("Payment successful! However, your session data was lost.");
        }
    }
}

function validateInputs(email, phone) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[6-9]\d{9}$/;
    
    let isValid = true;
    const emailEl = document.getElementById('email');
    const phoneEl = document.getElementById('phone');

    if(emailEl) emailEl.classList.remove('input-error');
    if(phoneEl) phoneEl.classList.remove('input-error');

    if (!emailRegex.test(email)) {
        if(emailEl) emailEl.classList.add('input-error');
        isValid = false;
    }
    if (!mobileRegex.test(phone)) {
        if(phoneEl) phoneEl.classList.add('input-error');
        isValid = false;
    }
    return isValid;
}

function generateOrderId(prefix = '') {
    const typePrefix = prefix || (selectedPrice === 599 ? 'AS5-' : (selectedPrice === 999 ? 'AS9-' : 'AS1-'));
    return typePrefix + Date.now().toString().slice(-8) + Math.floor(Math.random() * 100);
}

document.getElementById('customerForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const disclaimerBox = document.getElementById('confirmDisclaimer');
    if(disclaimerBox && !disclaimerBox.checked) {
        alert("Please acknowledge the Disclaimer & Terms to proceed.");
        return;
    }

    const emailValue = document.getElementById('email')?.value;
    const phoneValue = document.getElementById('phone')?.value;

    if (!validateInputs(emailValue, phoneValue)) {
        alert("Please provide a valid email and a 10-digit Indian mobile number.");
        return;
    }

    const newOrderId = generateOrderId();
    
    customerData = {
        parentName: document.getElementById('parentName')?.value,
        childName: document.getElementById('childName')?.value,
        email: emailValue,
        phone: phoneValue,
        childAge: document.getElementById('childAge')?.value,
        partnerId: document.getElementById('partnerId')?.value, 
        package: selectedPackage,
        amount: selectedPrice,
        orderId: newOrderId
    };

    localStorage.setItem(`aptskola_session_${newOrderId}`, JSON.stringify({
        answers: answers,
        customerData: customerData,
        selectedPackage: selectedPackage,
        selectedPrice: selectedPrice
    }));
    localStorage.setItem('aptskola_last_order_id', newOrderId);

    const formData = new FormData(this);
    formData.append('orderId', newOrderId);

    fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
    })
    .then(() => console.log("Lead captured via Web3Forms"))
    .catch((error) => console.error("Web3Forms Error:", error));

    setTimeout(() => {
        document.getElementById('detailsPage').classList.add('hidden');
        const pCont = document.getElementById('paymentPageContainer');
        if(pCont) {
            pCont.classList.remove('hidden');
            pCont.classList.add('active');
            
            document.getElementById('summaryPackage').textContent = selectedPackage;
            document.getElementById('summaryPrice').textContent = `₹${selectedPrice}`;
            document.getElementById('summaryTotal').textContent = `₹${selectedPrice}`;
            document.getElementById('payButton').innerText = `Pay ₹${selectedPrice} via Razorpay Link →`;
        }
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, 500);
});

function redirectToRazorpay() {
    if (typeof Razorpay === 'undefined') {
        alert("Payment gateway is still loading. Please refresh the page.");
        return;
    }

    const payButton = document.getElementById('payButton');
    if (payButton) payButton.innerText = "Opening Secure Checkout...";
    
    const amountInPaise = PACKAGE_PRICES[selectedPackage] || 59900;

    const options = {
        "key": RAZORPAY_KEY_ID, 
        "amount": amountInPaise, 
        "currency": "INR",
        "name": "Apt Skola",
        "description": `Payment for ${selectedPackage} Report`,
        "image": "https://aptskola.com/favicon.png", 
        "prefill": {
            "name": customerData.parentName,
            "email": customerData.email,
            "contact": customerData.phone
        },
        "handler": function (response) {
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
            
            renderReportToBrowser().then(() => {
                showInstantSuccessPage();
                if(overlay) overlay.style.display = 'none';
                triggerAutomatedEmail();
            }).catch((error) => {
                alert("There was an error generating your report: " + error.message);
                if(overlay) overlay.style.display = 'none';
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
    const res = calculateFullRecommendation(answers);
    const recBoard = res.recommended.name;
    const boardKey = recBoard.toLowerCase().includes('cbse') ? 'cbse' : 
                     (recBoard.toLowerCase().includes('icse') ? 'icse' : 
                     (recBoard.toLowerCase().includes('ib') ? 'ib' : 
                     (recBoard.toLowerCase().includes('cambridge') ? 'Cambridge (IGCSE)' : 'State Board')));
    
    const data = MASTER_DATA[boardKey];

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

    if (selectedPrice >= 999) {
        htmlSummary += `
            <div style="margin-top: 20px; padding: 15px; background-color: #F0FDF4; border-left: 4px solid #10B981; border-radius: 4px;">
                <h4 style="margin: 0 0 5px 0; color: #166534; font-size: 14px; text-transform: uppercase;">Premium Insights</h4>
                <p style="margin: 0; color: #334155; font-size: 14px;"><strong>Risk Check:</strong> Look for 'Library Dust' and 'Teacher Turnover' during your campus visit.</p>
                <p style="margin: 5px 0 0; color: #334155; font-size: 14px;"><strong>Financial:</strong> Budget for a 12% annual fee inflation over 15 years.</p>
            </div>
        `;
    }

    if (selectedPrice >= 1499) {
        htmlSummary += `
            <div style="margin-top: 15px; padding: 15px; background-color: #FFF7ED; border-left: 4px solid #FF6B35; border-radius: 4px;">
                <h4 style="margin: 0 0 5px 0; color: #9A3412; font-size: 14px; text-transform: uppercase;">Pro Admission Tips</h4>
                <p style="margin: 0; color: #334155; font-size: 14px;"><strong>Negotiation:</strong> Use the 'Lump Sum Leverage' script to ask for admission fee waivers.</p>
                <p style="margin: 5px 0 0; color: #334155; font-size: 14px;"><strong>Interview:</strong> Never answer for the child; it is the #1 reason for rejection.</p>
            </div>
        `;
    }

    htmlSummary += `</div></div>`;

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
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
            user_email: customerData.email,
            user_name: customerData.parentName,
            order_id: customerData.orderId,
            child_name: customerData.childName,
            report_text_summary: htmlSummary 
        });
    } catch (e) {
        console.error("Email dispatch failed:", e);
    }
}

function processSyncUpgrade() {
    const payButton = document.querySelector('#upgradeBlock button');
    if (payButton) payButton.innerText = "Opening Upgrade...";

    const options = {
        "key": RAZORPAY_KEY_ID,
        "amount": 29900, 
        "currency": "INR",
        "name": "Apt Skola",
        "description": "Sync Match Module Upgrade",
        "prefill": {
            "name": customerData.parentName,
            "email": customerData.email,
            "contact": customerData.phone
        },
        "handler": function (response) {
            customerData.package = 'Premium';
            isSyncMatchMode = true; 
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

function selectPackage(pkg, price) {
    selectedPackage = pkg;
    selectedPrice = price;

    if (price === 599) {
        hasSeenDowngradeModal = true;
        const modal = document.getElementById('downgradeModal');
        if (modal) modal.classList.add('active');
    } else if (price === 999) {
        const modal = document.getElementById('proUpgradeModal');
        if (modal) modal.classList.add('active');
    } else {
        proceedToQuiz(pkg, price);
    }
}

function proceedToQuiz(pkg, price) {
    currentQuestion = 0;
    answers = {};
    customerData = { orderId: 'N/A', childAge: '5-10' };
    selectedPackage = pkg;
    selectedPrice = price;
    isSyncMatchMode = false; 
    document.getElementById('landingPage').classList.add('hidden');
    initializeQuizShell(0);
    window.scrollTo({ top: 0, behavior: 'instant' });
}

function initializeQuizShell(index) {
    const questionPages = document.getElementById('questionPages');
    if (!questionPages) return;
    
    const shellHtml = `
        <div id="questionPageApp" class="question-page active">
            ${getIntermediateHeaderHtml()}
            <div class="question-content-wrapper"><div id="dynamicQuizContent" class="question-container"></div></div>
            ${getIntermediateFooterHtml()}
        </div>`;
    questionPages.innerHTML = shellHtml;
    renderQuestionContent(index);
}

function hydrateData() {
    if (!customerData || !customerData.orderId || customerData.orderId === "N/A") {
        const lastOrderId = localStorage.getItem("aptskola_last_order_id");
        if (lastOrderId) {
            const sessionData = JSON.parse(localStorage.getItem("aptskola_session_" + lastOrderId));
            if (sessionData) {
                answers = sessionData.answers;
                customerData = sessionData.customerData;
                selectedPackage = sessionData.selectedPackage || (sessionData.customerData ? sessionData.customerData.package : "Essential");
                selectedPrice = sessionData.selectedPrice || (sessionData.customerData ? sessionData.customerData.amount : 599);
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    checkPaymentStatus(); 
    calculateCostOfConfusion();
    
    const logos = document.querySelectorAll('#landingHeaderLogo');
    logos.forEach(l => l.addEventListener('click', goToLandingPage));

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('unlock') === 'sync' || urlParams.get('page') === 'sync') {
        setTimeout(() => {
            openSyncMatchGate();
        }, 500);
    }
});

function copyOrderId() {
    const orderId = document.getElementById('displayOrderId').textContent;
    if (orderId && orderId !== 'N/A') {
        navigator.clipboard.writeText(orderId).then(() => {
            alert("Order ID copied to clipboard!");
        });
    }
}
