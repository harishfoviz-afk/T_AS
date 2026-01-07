// --- SCORING LOGIC ---
function calculateFullRecommendation(ansSet) {
    let scores = { "CBSE": 0, "ICSE": 0, "IB": 0, "Cambridge (IGCSE)": 0, "State Board": 0 };
    let veto = { ib: false, cambridge: false, icse: false };

    if (ansSet.q1 === 0) { scores["IB"] += 6; scores["Cambridge (IGCSE)"] += 6; scores["ICSE"] += 4; } 
    if (ansSet.q1 === 1) { scores["CBSE"] += 6; scores["State Board"] += 5; scores["ICSE"] += 4; } 
    if (ansSet.q1 === 2) { scores["IB"] += 8; scores["Cambridge (IGCSE)"] += 8; } 
    if (ansSet.q1 === 3) { scores["CBSE"] += 4; scores["ICSE"] += 4; } 

    if (ansSet.q2 === 0) { scores["CBSE"] += 7; scores["State Board"] += 5; } 
    if (ansSet.q2 === 1) { scores["ICSE"] += 7; scores["IB"] += 6; } 
    if (ansSet.q2 === 2) { scores["IB"] += 7; scores["Cambridge (IGCSE)"] += 7; } 

    if (ansSet.q3 === 0) { scores["CBSE"] += 20; scores["State Board"] += 15; scores["IB"] -= 10; }
    if (ansSet.q3 === 1) { scores["IB"] += 20; scores["Cambridge (IGCSE)"] += 20; scores["CBSE"] -= 5; }
    if (ansSet.q3 === 2) { scores["IB"] += 10; scores["ICSE"] += 8; }

    if (ansSet.q4 === 0) { veto.ib = true; veto.cambridge = true; scores["State Board"] += 10; scores["CBSE"] += 5; }
    if (ansSet.q4 === 1) { veto.ib = true; scores["CBSE"] += 8; scores["ICSE"] += 8; }
    
    let results = Object.keys(scores).map(board => { 
        let s = scores[board];
        if (veto.ib && (board === "IB" || board === "Cambridge (IGCSE)")) s = -999;
        return { name: board, score: s }; 
    });

    results.sort((a, b) => b.score - a.score);
    
    let topScore = Math.max(results[0].score, 1);
    results.forEach(r => {
        r.percentage = r.score < 0 ? 0 : Math.min(Math.round((r.score / topScore) * 95), 99);
    });

    return { recommended: results[0], alternative: results[1], fullRanking: results };
}

// --- SYNC MATCH CALCULATION ---
function calculateSyncMatch() {
    const parentQuestions = ["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8", "q9", "q10", "q11", "q12", "q13", "q14", "q15"];
    const isParentDataMissing = parentQuestions.some(id => answers[id] === undefined);

    if (isParentDataMissing) {
        alert("Initial assessment data is missing.");
        goToLandingPage();
        return;
    }

    let perceptionRes = calculateFullRecommendation(answers);
    let parentRec = perceptionRes.recommended.name;

    let dnaScores = { "CBSE": 0, "IB": 0, "ICSE": 0, "State": 0 };
    for(let i=16; i<=30; i++) {
        let val = answers['q'+i];
        if(val === undefined) continue;
        let multiplier = (i === 30) ? 2.0 : 1.0; 
        if(val === 0) dnaScores["CBSE"] += multiplier;
        if(val === 1) dnaScores["IB"] += multiplier;
        if(val === 2) dnaScores["ICSE"] += multiplier;
        if(val === 3) dnaScores["State"] += multiplier;
    }
    let topDNA = Object.keys(dnaScores).reduce((a, b) => dnaScores[a] > dnaScores[b] ? a : b);
    
    const traits = { "CBSE": "Logical Structure", "IB": "Inquiry-based Autonomy", "ICSE": "Deep Narrative Context", "State": "Functional Local Proficiency" };
    const mappings = { "CBSE": "CBSE", "IB": "IB", "ICSE": "ICSE", "State": "State Board" };
    
    let normalizedDNA = mappings[topDNA] || topDNA;
    let isConflict = (parentRec !== normalizedDNA);
    let alignmentScore = isConflict ? 45 : 92;

    const manualDisclaimer = isManualSync ? `<p style="text-align: center; font-size: 0.75rem; color: #94A3B8; margin-bottom: 10px;">⚠️ Sync generated via Manual Input from Phase 1 Report.</p>` : '';

    let bridgeHtml = isConflict ? `
		<div class="report-card" style="border: 2px solid var(--sunrise-primary); background: #FFF9F2; margin-top: 20px;">
			<h3 style="color: var(--navy-premium); font-weight: 800; font-size: 1.2rem; margin-bottom: 10px;">Bridge Narrative: Conflict Resolution</h3>
			<p style="color: var(--navy-light); font-size: 0.95rem; line-height: 1.6; margin-bottom: 10px;">
				<strong>The Mismatch:</strong> Your strategic goal is <strong>${parentRec}</strong>, but our forensic DNA audit shows your child’s natural cognitive engine thrives on <strong>${traits[topDNA]}</strong>, which is the hallmark of the <strong>${normalizedDNA}</strong> ecosystem.
			</p>
			<p style="color: var(--navy-light); font-size: 0.95rem; line-height: 1.6; margin-bottom: 10px;">
				<strong>Cognitive Risk:</strong> Forcing a child with high ${traits[topDNA]} into a purely ${parentRec} structure can lead to "Academic Burnout" by Grade 8, as their natural inquiry style is suppressed by rigid standardization.
			</p>
			<p style="color: var(--navy-light); font-size: 0.95rem; line-height: 1.6; margin-bottom: 10px;">
				<strong>The Strategy:</strong> Do not abandon your vision; instead, look for a "Hybrid School". Select a ${parentRec} school that offers high-autonomy clubs, project-based labs, or ${normalizedDNA}-inspired electives to feed their natural instinct.
			</p>
			<p style="color: var(--navy-light); font-size: 0.95rem; line-height: 1.6;">
				<strong>Final Verdict:</strong> Alignment is possible by choosing the board for the "Certificate" but selecting the specific school campus for the "Culture".
			</p>
		</div>` : `
    <div class="report-card" style="border: 2px solid #22C55E; background: #F0FDF4; margin-top: 20px;">
        <h3 style="color: #166534; font-weight: 800; font-size: 1.2rem; margin-bottom: 10px;">✅ PERFECT ALIGNMENT</h3>
        <p style="color: #166534; font-size: 0.95rem; line-height: 1.6;">
            Your parenting vision and your child’s cognitive DNA are in a rare state of "Scientific Sync." Your choice of <strong>${parentRec}</strong> perfectly supports their natural strength in <strong>${traits[topDNA]}</strong>. This foundation minimizes academic friction and maximizes their potential for high-tier university placements.
        </p>
    </div>`;

    const successPage = document.getElementById('successPage');
    if(successPage) {
        successPage.innerHTML = `
            ${getIntermediateHeaderHtml()}
            <div class="success-content-wrapper">
                <div class="success-container">
                    ${manualDisclaimer}
                    <h2 style="color:var(--navy-premium); text-align:center;">Sync Match Report 🔄</h2>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-top:30px;">
                        <div style="background:#F0F9FF; padding:20px; border-radius:10px; border:1px solid #BAE6FD;">
                            <h3 style="font-size:0.9rem; font-weight:bold; color:#0369A1; text-transform:uppercase;">Vision Match</h3>
                            <div style="font-size:1.4rem; font-weight:800; color:#0C4A6E;">${parentRec}</div>
                        </div>
                        <div style="background:#FFF7ED; padding:20px; border-radius:10px; border:1px solid #FFEDD5;">
                            <h3 style="font-size:0.9rem; font-weight:bold; color:#C2410C; text-transform:uppercase;">DNA Verification</h3>
                            <div style="font-size:1.4rem; font-weight:800; color:#7C2D12;">${normalizedDNA}</div>
                        </div>
                    </div>
                    ${bridgeHtml}
                    ${ambassadorButtonHtml}
                    ${xrayCardHtml}
                    ${fovizBannerHtml}
                    <button class="custom-cta-button" style="margin-top:30px;" onclick="endFullSession()">End Session</button>
                </div>
            </div>
            ${getIntermediateFooterHtml()}
        `;
        successPage.classList.remove('hidden');
        successPage.classList.add('active');
    }
}
