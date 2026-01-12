import re

with open('script.js', 'r') as f:
    content = f.read()

with open('script_original.js', 'r') as f:
    original = f.read()

# 1. Add generateOrderId
order_id_func = """
window.generateOrderId = function() {
    const prefix = selectedPrice === 599 ? 'AS5-' : (selectedPrice === 999 ? 'AS9-' : 'AS1-');
    const random = Math.floor(1000000 + Math.random() * 9000000);
    return prefix + random;
};
"""

# 2. Update triggerDNAFinalization UI
# Change fill to #FFD700, add filter drop-shadow, and increase delay
content = re.sub(r'text-\[#FFD700\]', 'text-[#FFD700] filter drop-shadow-[0_0_10px_#FFD700]', content)
content = re.sub(r'setTimeout\(\(\) => \{ window\.hideAllSections\(\);.*?\}, 5000\);', 
                 'setTimeout(() => { window.hideAllSections(); const pricing = document.getElementById("pricing"); if(pricing) { pricing.style.display = "block"; pricing.classList.remove("hidden"); pricing.scrollIntoView({ behavior: "smooth" }); } }, 3000);', 
                 content)

# 3. Update customerForm for boardOutcome and upgradedStatus
form_logic = """
        customerForm.addEventListener('submit', async function(e) {
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
            
            const formData = new FormData(customerForm);
            formData.append('orderId', customerData.orderId);
            formData.append('boardOutcome', res.recommended.name);
            formData.append('upgradedStatus', selectedPackage);

            try {
                await fetch("https://api.web3forms.com/submit", { method: "POST", body: formData });
            } catch(err) { console.error("Email capture failed", err); }

            localStorage.setItem('aptskola_last_order_id', customerData.orderId);
            localStorage.setItem(`aptskola_session_${customerData.orderId}`, JSON.stringify({ answers, customerData }));
            window.triggerDNAFinalization();
        });
"""
content = re.sub(r'customerForm\.addEventListener\(\'submit\', async function\(e\) \{.*?\}\);', form_logic, content, flags=re.DOTALL)

# 4. showInstantSuccessPage Shadow Buttons
success_page_logic = """
window.showInstantSuccessPage = function() {
    window.hideAllSections();
    const successPage = document.getElementById('successPage');
    if (successPage) {
        successPage.classList.remove('hidden'); successPage.classList.add('active'); successPage.style.display = 'block';
        document.getElementById('displayOrderId').textContent = customerData.orderId;
        document.getElementById('successParentName').textContent = customerData.parentName;
        
        // Inject Shadow Buttons
        const container = document.querySelector('.success-container');
        if (container) {
            const shadowButtons = `
                <div style="display: flex; gap: 15px; margin-bottom: 25px; justify-content: center;">
                    <button onclick="window.openSyncMatchGate()" style="background: #0F172A; color: #white; padding: 12px 20px; border-radius: 50px; font-weight: 800; border: 2px solid #FF6B35; cursor: pointer; color: white;">Parent and Child Sync Check</button>
                    <a href="https://xray.aptskola.com" target="_blank" style="background: #FF6B35; color: white; padding: 12px 20px; border-radius: 50px; font-weight: 800; text-decoration: none;">School/College X-ray</a>
                </div>
            `;
            container.insertAdjacentHTML('afterbegin', shadowButtons);
        }
    }
};
"""
content = re.sub(r'window\.showInstantSuccessPage = function\(\) \{.*?\};', success_page_logic, content, flags=re.DOTALL)

# 5. Synchronize Tiered Report Logic and MASTER_DATA binding
# Extract full MASTER_DATA from original
master_data_full_match = re.search(r'const MASTER_DATA = \{.*?\};', original, re.DOTALL)
master_data_full = master_data_full_match.group(0) if master_data_full_match else ""

report_logic = """
window.renderReportToBrowser = async function() {
    const res = window.calculateFullRecommendation(answers);
    const recBoard = res.recommended.name;
    const boardKey = recBoard.toLowerCase().includes('cbse') ? 'cbse' : 
                     (recBoard.toLowerCase().includes('icse') ? 'icse' : 
                     (recBoard.toLowerCase().includes('ib') ? 'ib' : 
                     (recBoard.toLowerCase().includes('cambridge') ? 'Cambridge (IGCSE)' : 'State Board')));
    const data = MASTER_DATA[boardKey];
    const amount = selectedPrice;
    
    let html = `
        <div id="pdf-header" class="report-card" style="background:#0F172A; color:white; text-align:center;">
            <div style="font-size:2rem; font-weight:800;">Apt <span style="color:#FF6B35;">Skola</span></div>
            <div style="font-size:1.1rem; opacity:0.8;">\${selectedPackage} Report</div>
            <div style="font-size:0.85rem; margin-top:10px;">ID: \${customerData.orderId} | Prepared for: \${customerData.childName}</div>
        </div>

        <div class="report-card">
            <div class="report-header-bg">THE RECOMMENDED ARCHETYPE</div>
            <div style="font-size:1.8rem; font-weight:800; color:#0F172A;">\${data.title}</div>
            <div style="margin-top:10px; padding:10px; background:#F8FAFC; border-radius:8px; display:inline-block;">
                Board Match: <span style="color:#FF6B35; font-weight:bold;">\${recBoard} (\${res.recommended.percentage}%)</span>
            </div>
        </div>

        <div class="report-card">
            <div class="report-header-bg">STUDENT PERSONA & MATCH LOGIC</div>
            <p><strong>Archetype:</strong> \${data.persona}</p>
            <p style="margin-top:10px; line-height:1.6;">\${data.profile}</p>
            <div style="margin-top:15px; padding:15px; border-left:4px solid #EF4444; background:#FFF1F2;">
                <h4 style="color:#991B1B; font-weight:bold; margin-bottom:5px;">The "Why Not" (Rejection Logic)</h4>
                <p style="font-size:0.9rem;">\${data.rejectionReason}</p>
            </div>
        </div>

        <div class="report-card">
            <div class="report-header-bg">BOARD COMPARISON</div>
            <table class="data-table">
                \${res.fullRanking.slice(0, 3).map(r => `<tr><td>\${r.name}</td><td>\${r.percentage}% Match</td></tr>`).join('')}
            </table>
        </div>

        <div class="report-card">
            <div class="report-header-bg">BOARD DEEP DIVE</div>
            <p><strong>Philosophy:</strong> \${data.philosophy}</p>
            <p style="margin-top:10px;"><strong>Pedagogy:</strong> \${data.teachingMethod}</p>
        </div>
    `;

    if (amount >= 999) {
        html += `
            <div class="report-card">
                <div class="report-header-bg">🧐 RISK MITIGATION & VETTING</div>
                <ul style="list-style:none; padding:0; font-size:0.9rem;">
                    \${MASTER_DATA.vetting.redFlags.map(f => \`<li style="margin-bottom:8px;">🚩 \${f}</li>\`).join('')}
                </ul>
            </div>
            <div class="report-card">
                <div class="report-header-bg">15-YEAR FEE FORECASTER</div>
                <table class="data-table">
                    \${MASTER_DATA.financial.projectionTable.map(r => \`<tr><td>\${r.grade}</td><td>\${r.fee}</td></tr>\`).join('')}
                </table>
            </div>
        `;
    }

    if (amount >= 1499) {
        html += `
            <div class="report-card">
                <div class="report-header-bg">🤝 FEE NEGOTIATION STRATEGIES</div>
                \${MASTER_DATA.concierge.negotiation.map(n => \`<div class="script-box" style="margin-bottom:15px;"><strong>\${n.title}:</strong> \${n.script}</div>\`).join('')}
            </div>
            <div class="report-card">
                <div class="report-header-bg">🎙️ PARENT INTERVIEW MASTERY</div>
                <div class="interview-grid">
                    \${MASTER_DATA.interviewMastery.part2.slice(0, 6).map(i => \`<div class="interview-card"><strong>\${i.q}</strong><p>Strategy: \${i.strategy}</p></div>\`).join('')}
                </div>
            </div>
        `;
    }

    const preview = document.getElementById('reportPreview');
    if (preview) { preview.innerHTML = html; preview.classList.remove('off-screen-render'); }
};
"""
content = re.sub(r'window\.renderReportToBrowser = async function\(\) \{.*?\};', report_logic, content, flags=re.DOTALL)

# 6. PDF/Share Logic
pdf_logic = """
window.downloadReport = async function() {
    const btn = document.getElementById("downloadBtn");
    const originalText = btn.textContent;
    btn.textContent = "Generating PDF...";
    const preview = document.getElementById('reportPreview');
    preview.classList.remove('off-screen-render');
    
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF("p", "mm", "a4");
    const cards = preview.querySelectorAll('.report-card');
    
    for (let i = 0; i < cards.length; i++) {
        const canvas = await html2canvas(cards[i], { scale: 2 });
        const imgData = canvas.toDataURL("image/jpeg", 0.8);
        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, "JPEG", 10, 10, 190, 0);
    }
    
    pdf.save(`Apt-Skola-\${customerData.childName}.pdf`);
    preview.classList.add('off-screen-render');
    btn.textContent = originalText;
};

window.sharePDF = async function() {
    // Similar logic to download but using navigator.share
    alert("Share feature preparing...");
};
"""
content = re.sub(r'window\.downloadReport = async function\(\) \{.*?\};', "", content, flags=re.DOTALL)
content = re.sub(r'window\.sharePDF = async function\(\) \{.*?\};', "", content, flags=re.DOTALL)
content += pdf_logic

# Ensure currentPhase, etc are at top
content = order_id_func + content

with open('script.js', 'w') as f:
    f.write(content)
