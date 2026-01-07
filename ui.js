// --- UI COMPONENTS (HTML Strings) ---
const xrayCardHtml = `
    <div class="xray-card">
        <h3>Apt Skola Exclusive: AI Forensic School X-ray</h3>
        <div class="price">₹99 <span style="font-size: 0.9rem; color: #64748B; text-decoration: line-through;">₹399</span></div>
        <p style="font-size: 0.85rem; color: #475569; margin-bottom: 15px;">Spot hidden red flags, library authenticity, and teacher turnover using our proprietary AI vision tool.</p>
        <a href="https://xray.aptskola.com" target="_blank" class="btn-xray">Get X-ray (75% OFF)</a>
    </div>
`;

const fovizBannerHtml = `
    <div class="foviz-banner">
        <h3><a href="https://foviz.in" target="_blank" style="color: inherit; text-decoration: none; hover: underline;">Plan the "Next Phase" with 5D Analysis</a></h3>
        <p>Your board choice is Step 1. Foviz Career GPS maps your path to 2040.</p>
    </div>
`;

const ambassadorButtonHtml = `
    <button onclick="openCollaborationModal('Ambassador')" class="btn-ambassador">
        <span>✨</span> Thank you and Be our Ambassadors and earn cash rewards from 300 to 3000 <span>🤝</span><span>✨</span>
    </button>
`;

const manualSyncUI = `
    <div id="manualSyncBlock" style="margin-top: 25px; padding: 20px; border: 2px dashed #CBD5E1; border-radius: 12px; background: #F8FAFC;">
        <h3 style="color: #0F172A; font-size: 1.1rem; font-weight: 700; margin-bottom: 10px;">🔄 Manual Sync Recovery</h3>
        <p style="font-size: 0.85rem; color: #64748B; margin-bottom: 15px;">We couldn't find your session on this device. Please check your Phase 1 PDF report.</p>
        <div class="form-group">
            <label style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px;">Your Recommended Board (from PDF)</label>
            <select id="manualBoardSelect" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid #E2E8F0;">
                <option value="">-- Choose Board --</option>
                <option value="CBSE">CBSE</option>
                <option value="ICSE">ICSE</option>
                <option value="IB">IB</option>
                <option value="Cambridge">Cambridge (IGCSE)</option>
                <option value="State Board">State Board</option>
            </select>
        </div>
        <button onclick="confirmManualSync()" class="custom-cta-button" style="margin-top: 10px; padding: 12px; font-size: 0.95rem;">Sync Manually & Start →</button>
    </div>
`;

// --- CORE UI ACTIONS ---
function scrollToClarity() {
    const target = document.getElementById('invest-in-clarity');
    if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function openSampleReport() {
    const modal = document.getElementById('sampleReportModal');
    const content = document.getElementById('sampleReportContent');
    if (content) {
        content.innerHTML = `
            <div style="text-align:center; margin-bottom:30px;">
                <h2 class="text-2xl font-bold text-brand-navy">Sample Report: The Decision Decoder</h2>
                <p class="text-sm text-slate-500">This is what you get after the assessment.</p>
            </div>
            <div class="report-card" style="background:#0F172A; color:white;">
                <div style="font-size:2rem; font-weight:800;">The Standardized Strategist</div>
                <div style="background:rgba(255,255,255,0.1); padding:10px; border-radius:8px; margin-top:10px;">
                    Recommended: <span style="color:#FF6B35; font-weight:bold;">CBSE</span>
                </div>
            </div>
            <div class="report-card" style="opacity: 0.6; filter: blur(1px); position: relative; overflow: hidden;">
                <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; z-index: 10; background: rgba(255,255,255,0.4);">
                    <button onclick="closeSampleReport(); scrollToPricing()" class="hero-btn-primary" style="box-shadow: 0 10px 20px rgba(0,0,0,0.2);">Unlock Full Report</button>
                </div>
                <div class="report-header-bg">CHILD'S PROFILE SUMMARY</div>
                <table class="data-table">
                    <tr><td><strong>Learning Style</strong></td><td>Visual Learner</td></tr>
                    <tr><td><strong>Core Interest</strong></td><td>Science & Logic</td></tr>
                </table>
            </div>
        `;
    }
    if (modal) modal.classList.add('active');
}

function closeSampleReport() {
    const modal = document.getElementById('sampleReportModal');
    if (modal) modal.classList.remove('active');
}

function openPricingModal() {
    const modal = document.getElementById('pricingModal');
    if (modal) modal.classList.add('active');
}

function closePricingModal() {
    const modal = document.getElementById('pricingModal');
    if (modal) modal.classList.remove('active');
}

function openPricingOrScroll() {
    if (window.innerWidth < 768) {
        scrollToClarity();
    } else {
        openPricingModal();
    }
}

function openCollaborationModal(type) {
    const modal = document.getElementById('collaborationModal');
    const title = document.getElementById('collabModalTitle');
    const subject = document.getElementById('collabSubject');
    const submitBtn = document.getElementById('collabSubmitBtn');

    if (modal && title && subject && submitBtn) {
        if (type === 'Partner') {
            title.innerText = 'Partner Registration';
            subject.value = 'New Educator Partner Application';
            submitBtn.innerText = 'Submit Application';
        } else {
            title.innerText = 'Be Our Ambassador';
            subject.value = 'New Ambassador Application';
            submitBtn.innerText = 'Apply Now';
        }
        modal.classList.add('active');
    }
}

function goToLandingPage() {
    currentQuestion = 0;
    answers = {};
    const form = document.getElementById('customerForm');
    if(form) form.reset();
    
    document.getElementById('landingPage').classList.remove('hidden');
    const dPage = document.getElementById('detailsPage');
    if(dPage) dPage.classList.add('hidden');
    const pCont = document.getElementById('paymentPageContainer');
    if(pCont) pCont.classList.add('hidden');
    const sPage = document.getElementById('successPage');
    if(sPage) sPage.classList.add('hidden');
    const sGate = document.getElementById('syncMatchGate');
    if(sGate) sGate.classList.add('hidden');
    const sTrans = document.getElementById('syncMatchTransition');
    if(sTrans) sTrans.classList.add('hidden');
    
    const app = document.getElementById('questionPageApp');
    if (app) app.classList.remove('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function getIntermediateHeaderHtml() {
     return `<div class="intermediate-header" onclick="goToLandingPage()" style="cursor:pointer;"><div class="max-w-7xl mx-auto"><span class="font-bold text-xl">Apt <span class="text-brand-orange">Skola</span></span></div></div>`;
}

function getIntermediateFooterHtml() {
     return `<div class="intermediate-footer"><div class="max-w-7xl mx-auto text-center"><p>&copy; 2026 Apt Skola, all rights reserved.</p></div></div>`;
}

function calculateCostOfConfusion() {
    const hoursInput = document.getElementById('researchHours');
    const rateInput = document.getElementById('hourlyRate');
    const tabsInput = document.getElementById('browserTabs');
    if (!hoursInput || !rateInput || !tabsInput) return;

    const hours = parseInt(hoursInput.value);
    const rate = parseInt(rateInput.value);
    const tabs = parseInt(tabsInput.value);
    
    const monthlyLoss = (hours * 4) * rate; 
    const anxietyLevel = Math.min(tabs * 5, 100); 

    const lossEl = document.getElementById('lossAmount');
    if(lossEl) lossEl.textContent = monthlyLoss.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
    
    const anxEl = document.getElementById('anxietyLevel');
    if(anxEl) anxEl.textContent = `${anxietyLevel}%`;

    const hVal = document.getElementById('hoursValue');
    if(hVal) hVal.textContent = `${hours} hours`;
    
    const rVal = document.getElementById('rateValue');
    if(rVal) rVal.textContent = `₹${rate.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
    
    const tVal = document.getElementById('tabsValue');
    if(tVal) tVal.textContent = `${tabs} tabs`;

    const donut = document.getElementById('confusionDonut');
    if(donut) {
        donut.style.setProperty('--anxiety-degree', `${anxietyLevel}%`);
    }
}

function renderQuestionContent(index) {
    currentQuestion = index;

    if (!isSyncMatchMode && index >= 15) { 
        const app = document.getElementById('questionPageApp');
        if (app) app.classList.remove('active');
        showDetailsPage(); 
        return; 
    }
    if (isSyncMatchMode && index >= 30) { 
        const app = document.getElementById('questionPageApp');
        if (app) app.classList.remove('active');
        calculateSyncMatch(); 
        return;
    }

    const q = questions[index];
    if(!q) return;

    let qText = q.text;
    let qOptions = q.options || [];

    if(q.isObservation) {
        qText = q.text_variants[customerData.childAge] || q.text_variants["5-10"];
        if(q.options_variants && q.options_variants[customerData.childAge]) {
            qOptions = q.options_variants[customerData.childAge];
        }
    }

    const totalQ = isSyncMatchMode ? 30 : 15;
    const progressPercent = ((index + 1) / totalQ * 100).toFixed(0);

    const optionsHTML = qOptions.map((opt, i) => {
        const isSelected = answers[q.id] === i ? 'selected' : '';
        return `<div class="option-card ${isSelected}" onclick="selectOption('${q.id}', ${i}, ${index}, this)">${opt}</div>`;
    }).join('');

    let prevBtnHtml = '';
    const startIdx = isSyncMatchMode ? 15 : 0;
    if (index > startIdx) {
        prevBtnHtml = `<button onclick="renderQuestionContent(${index - 1})" class="btn-prev" style="margin-top:20px; background:none; text-decoration:underline; border:none; color:#64748B; cursor:pointer;">← Previous Question</button>`;
    }

    const dynamicQuizContent = document.getElementById('dynamicQuizContent');
    if (dynamicQuizContent) {
        dynamicQuizContent.innerHTML = `
            <div class="progress-container">
                <div class="progress-track"><div class="progress-fill" style="width: ${progressPercent}%"></div></div>
                <div class="progress-label">Question ${index + 1}/${totalQ}</div>
            </div>
            <div class="question-text">${qText}</div>
            <div class="options-grid">${optionsHTML}</div>
            <div style="text-align:center;">${prevBtnHtml}</div>
        `;
    }
}

function selectOption(qId, val, idx, el) {
    answers[qId] = val;
    Array.from(el.parentNode.children).forEach(child => child.classList.remove('selected'));
    el.classList.add('selected');
    setTimeout(() => { renderQuestionContent(idx + 1); }, 300);
}

function showDetailsPage() {
    const detailsPage = document.getElementById('detailsPage');
    if (detailsPage) {
        detailsPage.classList.remove('hidden');
        detailsPage.classList.add('active');
    }
}

function showInstantSuccessPage() {
    const paymentPage = document.getElementById('paymentPageContainer');
    const successPage = document.getElementById('successPage');
    
    if(paymentPage) {
        paymentPage.classList.add('hidden');
    }
    if(successPage) {
        successPage.classList.remove('hidden');
        successPage.classList.add('active');
        
        window.scrollTo({ top: 0, behavior: 'instant' });
        
        setTimeout(() => {
            const downloadBtn = document.getElementById('downloadBtn');
            const shareBtn = document.getElementById('shareBtn');
            if (downloadBtn) {
                downloadBtn.style.pointerEvents = 'auto';
                downloadBtn.style.opacity = '1';
                downloadBtn.textContent = 'Download Report ⬇️';
            }
            if (shareBtn) {
                shareBtn.style.pointerEvents = 'auto';
                shareBtn.style.opacity = '1';
                shareBtn.textContent = 'Share Report 📲';
            }
        }, 100);
        
        const displayOrderId = document.getElementById('displayOrderId');
        if (displayOrderId) displayOrderId.textContent = customerData.orderId || 'N/A';
    }
    
    if (selectedPrice >= 1499) {
        const ticket = document.getElementById('goldenTicketContainer');
        if (ticket) ticket.style.display = 'block';
    }

    const pNameEl = document.getElementById('successParentName');
    if(pNameEl) pNameEl.innerText = customerData.parentName || 'Parent';
    
    const reportDiv = document.getElementById('reportPreview');
    if(reportDiv) {
        reportDiv.classList.remove('off-screen-render');
        const dlBtn = document.getElementById('downloadBtn');
        if(dlBtn && dlBtn.parentNode && dlBtn.parentNode.parentNode) {
            const container = dlBtn.parentNode.parentNode;
            container.insertBefore(reportDiv, dlBtn.parentNode.nextSibling);
        }
    }
    
    window.scrollTo({ top: 0, behavior: 'instant' });
}
