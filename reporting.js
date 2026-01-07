async function renderReportToBrowser() {
    console.log("Starting renderReportToBrowser");
    let sessionAnswers = answers;
    let sessionCustomerData = customerData;
    
    const lastOrderId = localStorage.getItem('aptskola_last_order_id');
    const sessionData = JSON.parse(localStorage.getItem(`aptskola_session_${lastOrderId}`));
    if (sessionData) {
        sessionAnswers = sessionData.answers;
        sessionCustomerData = sessionData.customerData;
        answers = sessionAnswers;
        customerData = sessionCustomerData;
    }

    if (!sessionAnswers || Object.keys(sessionAnswers).length === 0) {
        throw new Error("No assessment answers found. Please complete the assessment first.");
    }

    const res = calculateFullRecommendation(sessionAnswers);
    const recBoard = res.recommended.name;
    const boardKey = recBoard.toLowerCase().includes('cbse') ? 'cbse' : 
                     (recBoard.toLowerCase().includes('icse') ? 'icse' : 
                     (recBoard.toLowerCase().includes('ib') ? 'ib' : 
                     (recBoard.toLowerCase().includes('cambridge') ? 'Cambridge (IGCSE)' : 'State Board')));
    
    const data = MASTER_DATA[boardKey];
    if (!data) {
        throw new Error(`Board data not found for key: ${boardKey}`);
    }
    const amount = sessionCustomerData.amount || 599;

    let html = `
        <div id="pdf-header" class="report-card" style="background:#0F172A; color:white; text-align:center;">
            <div style="font-size:2rem; font-weight:800;">Apt <span style="color:#FF6B35;">Skola</span></div>
            <div style="font-size:1.1rem; opacity:0.8;">${sessionCustomerData.package} Report</div>
            <div style="font-size:0.85rem; margin-top:10px;">ID: ${sessionCustomerData.orderId} | Prepared for: ${sessionCustomerData.childName}</div>
        </div>

        <div class="report-card">
            <div class="report-header-bg">THE RECOMMENDED ARCHETYPE</div>
            <div style="font-size:1.8rem; font-weight:800; color:#0F172A;">${data.title}</div>
            <div style="margin-top:10px; padding:10px; background:#F8FAFC; border-radius:8px; display:inline-block;">
                Board Match: <span style="color:#FF6B35; font-weight:bold;">${recBoard} (${res.recommended.percentage}%)</span>
            </div>
        </div>

        <div class="report-card">
            <div class="report-header-bg">STUDENT PERSONA & MATCH LOGIC</div>
            <p><strong>Archetype:</strong> ${data.persona}</p>
            <p style="margin-top:10px; line-height:1.6;">${data.profile}</p>
            <div style="margin-top:15px; padding:15px; border-left:4px solid #EF4444; background:#FFF1F2;">
                <h4 style="color:#991B1B; font-weight:bold; margin-bottom:5px;">The "Why Not" (Rejection Logic)</h4>
                <p style="font-size:0.9rem;">${data.rejectionReason}</p>
            </div>
            <div style="margin-top:15px; border-top: 1px solid #eee; padding-top:15px;">
                <h4 style="color:#0F172A; font-weight:bold; margin-bottom:5px;">Projected Career Path</h4>
                <p style="font-size:0.9rem; line-height:1.5;">${data.careerPath}</p>
            </div>
        </div>

        <div class="report-card">
            <div class="report-header-bg">BOARD & OPTION COMPARISON</div>
            <table class="data-table">
                <thead><tr><th>Board</th><th>Match Quality</th><th>Status</th></tr></thead>
                <tbody>
                    ${res.fullRanking.slice(0, 3).map((r, i) => `
                        <tr>
                            <td style="font-weight:600;">${r.name}</td>
                            <td class="progress-bar-cell">
                                <div class="table-progress-track"><div class="table-progress-fill" style="width: ${r.percentage}%"></div></div>
                                <span class="percentage-label">${r.percentage}% Match</span>
                            </td>
                            <td style="color:${i === 0 ? '#10B981' : '#64748B'}; font-weight:bold;">${i === 0 ? 'Recommended' : 'Alternative'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <div class="report-card">
            <div class="report-header-bg">BOARD DEEP DIVE</div>
            <p><strong>Philosophy:</strong> ${data.philosophy}</p>
            <p style="margin-top:10px;"><strong>Pedagogy:</strong> ${data.teachingMethod}</p>
            <div style="margin-top:10px; padding:10px; border-radius:6px; background:${data.parentalRole.toLowerCase().includes('high') ? '#FEF2F2' : '#F0FDF4'}; border:1px solid ${data.parentalRole.toLowerCase().includes('high') ? '#FECDD3' : '#BBF7D0'};">
                <p style="color:${data.parentalRole.toLowerCase().includes('high') ? '#991B1B' : '#166534'}; margin:0;">
                    <strong>Parental Commitment:</strong> ${data.parentalRole} 
                </p>
            </div>
        </div>

        <div class="report-card">
            <div class="report-header-bg">EXPERT NOTE: SPECIAL NEEDS & INCLUSION</div>
            <p style="font-size:0.85rem; line-height:1.5; color:#475569;">
                A supportive school environment is often more critical than the syllabus itself. For students requiring significant customization, Open Schooling (NIOS) is the most adaptable choice.
            </p>
        </div>
    `;

    if (amount >= 999) {
        html += `
            <div class="report-card">
                <div class="report-header-bg">🧐 RISK MITIGATION & VETTING</div>
                <ul style="list-style:none; padding:0; font-size:0.9rem;">
                    ${MASTER_DATA.vetting.redFlags.map(f => `<li style="margin-bottom:8px;">🚩 ${f}</li>`).join('')}
                </ul>
            </div>
            <div class="report-card">
                <div class="report-header-bg">15-YEAR FEE FORECASTER (12% Inflation)</div>
                <table class="data-table">
                    ${MASTER_DATA.financial.projectionTable.slice(0, 12).map(r => `<tr><td>${r.grade}</td><td>${r.fee}</td></tr>`).join('')}
                </table>
            </div>
        `;
    }

    if (amount >= 1499) {
        html += `
            <div class="report-card">
                <div class="report-header-bg">🤝 FEE NEGOTIATION STRATEGIES</div>
                ${MASTER_DATA.concierge.negotiation.map(n => `
                    <div class="narrative-item">
                        <h4 class="narrative-theme">${n.title}</h4>
                        <p style="font-size:0.85rem; margin-bottom:10px;"><strong>Scenario:</strong> ${n.scenario}</p>
                        <div class="script-box">"${n.script}"</div>
                    </div>
                `).join('')}
            </div>
            <div class="report-card">
                <div class="report-header-bg">🎙️ PARENT INTERVIEW MASTERY</div>
                <div class="interview-grid">
                    ${MASTER_DATA.interviewMastery.part2.slice(0, 6).map(i => `
                        <div class="interview-card">
                            <div class="interview-card-q">${i.q}</div>
                            <div class="interview-card-strategy">💡 Strategy: ${i.strategy}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    html += `
        <div class="report-card" style="margin-top:40px; padding:20px; background:#F1F5F9; border-radius:8px; font-size:0.8rem; color:#64748B; text-align:justify;">
            <strong>DISCLAIMER:</strong> This report is advisory only. The final enrollment decision remains the sole responsibility of the parent. The outcome of this report is purely based on the user input provided..
        </div>
    `;

    const preview = document.getElementById('reportPreview');
    if (preview) {
        preview.innerHTML = html;
    }
}

async function downloadReport() {
    console.log("Download report triggered");
    const btn = document.getElementById("downloadBtn");
    const originalText = btn ? btn.textContent : "Download Report ⬇️";
    
    try {
        if (btn) {
            btn.textContent = "Generating PDF...";
            btn.disabled = true;
            btn.style.opacity = "0.7";
        }

        hydrateData();
        const { jsPDF } = window.jspdf;
        const reportElement = document.getElementById("reportPreview");
        
        if (!reportElement || !reportElement.innerHTML.trim()) {
            await renderReportToBrowser();
        }

        const cards = reportElement.querySelectorAll(".report-card, .xray-card, .foviz-banner, .btn-ambassador");
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const margin = 10;
        const contentWidth = pdfWidth - (2 * margin);
        
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(24);
        pdf.setTextColor(15, 23, 42);
        pdf.text("Apt", margin, 20);
        pdf.setTextColor(255, 107, 53);
        pdf.text("Skola", margin + 16, 20);
        
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        pdf.setTextColor(100, 116, 139);
        pdf.text("Order ID: " + (customerData.orderId || "N/A"), margin, 33);
        
        let currentY = 45;

        for (let i = 0; i < cards.length; i++) {
            const canvas = await html2canvas(cards[i], { scale: 2, useCORS: true, logging: false });
            const imgData = canvas.toDataURL("image/jpeg", 0.8);
            const imgProps = pdf.getImageProperties(imgData);
            const imgHeight = (imgProps.height * contentWidth) / imgProps.width;

            if (currentY + imgHeight > pdfHeight - margin) {
                pdf.addPage();
                currentY = margin;
            }
            pdf.addImage(imgData, "JPEG", margin, currentY, contentWidth, imgHeight);
            currentY += imgHeight + 8;
        }

        const res = calculateFullRecommendation(answers);
        const recBoard = res.recommended.name;
        pdf.save("Apt-Skola-" + (customerData.childName || "Report") + "-" + recBoard + ".pdf");
    } catch (err) {
        console.error("Download failed:", err);
        alert("Download failed: " + err.message);
    } finally {
        if (btn) {
            btn.textContent = originalText;
            btn.disabled = false;
            btn.style.opacity = "1";
        }
    }
}

async function sharePDF() {
    console.log("Share report triggered");
    const btn = document.getElementById("shareBtn");
    const originalText = btn ? btn.textContent : "Share Report 📲";

    if (!navigator.share) {
        alert("Sharing is not supported on this browser. Please use Download.");
        return;
    }

    try {
        if (btn) {
            btn.textContent = "Preparing Share...";
            btn.disabled = true;
            btn.style.opacity = "0.7";
        }

        hydrateData();
        const { jsPDF } = window.jspdf;
        const reportElement = document.getElementById("reportPreview");
        
        if (!reportElement || !reportElement.innerHTML.trim()) {
            await renderReportToBrowser();
        }

        const cards = reportElement.querySelectorAll(".report-card, .xray-card, .foviz-banner, .btn-ambassador");
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const margin = 10;
        const contentWidth = pdfWidth - (2 * margin);
        
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(24);
        pdf.setTextColor(15, 23, 42);
        pdf.text("Apt", margin, 20);
        pdf.setTextColor(255, 107, 53);
        pdf.text("Skola", margin + 16, 20);
        
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        pdf.setTextColor(100, 116, 139);
        pdf.text("Prepared for: " + (customerData.childName || "Student"), margin, 28);
        pdf.text("Order ID: " + (customerData.orderId || "N/A"), margin, 33);

        let currentY = 45;

        for (let i = 0; i < cards.length; i++) {
            const canvas = await html2canvas(cards[i], { scale: 2, useCORS: true, logging: false });
            const imgData = canvas.toDataURL("image/jpeg", 0.8);
            const imgProps = pdf.getImageProperties(imgData);
            const imgHeight = (imgProps.height * contentWidth) / imgProps.width;

            if (currentY + imgHeight > pdfHeight - margin) {
                pdf.addPage();
                currentY = margin;
            }
            pdf.addImage(imgData, "JPEG", margin, currentY, contentWidth, imgHeight);
            currentY += imgHeight + 8;
        }

        const pdfBlob = pdf.output("blob");
        const file = new File([pdfBlob], "Apt-Skola-Report.pdf", { type: "application/pdf" });

        await navigator.share({
            files: [file],
            title: "Apt Skola Board Match Report",
            text: "Here is the scientific board match report for " + (customerData.childName || "the student") + "."
        });
    } catch (err) {
        console.error("Share failed:", err);
        if (err.name !== "AbortError") {
            alert("Share failed: " + err.message);
        }
    } finally {
        if (btn) {
            btn.textContent = originalText;
            btn.disabled = false;
            btn.style.opacity = "1";
        }
    }
}
