const foundations = {
    'tsk': { name: "TSK Mehmetçik Vakfı", icon: "🇹🇷", desc: "Ülkemizin güvenliği için canını ortaya koyan kahramanlarımız için." },
    'kizilay': { name: "Türk Kızılayı", icon: "🏥", desc: "Afetzedeler ve ihtiyaç sahipleri için kara gün dostu." },
    'ihh': { name: "İHH (Filistin Yardımı)", icon: "🇵🇸", desc: "Filistin ve dünyanın dört bir yanındaki mazlumlar için." },
    'afad': { name: "AFAD", icon: "🌪️", desc: "Afet ve Acil Durum Yönetimi Başkanlığı." },
    'losev': { name: "LÖSEV", icon: "🧡", desc: "Lösemili çocuklarımıza umut ol." }
};

function initSadakaPage() {
    renderFoundations();
    updateSadakaStats();
}

function renderFoundations() {
    const list = document.getElementById('foundation-list');
    if (!list) return;

    list.innerHTML = '';

    // Ensure default selection
    if (!state.sadaka.selectedFoundation) {
        state.sadaka.selectedFoundation = 'tsk';
    }

    Object.keys(foundations).forEach(key => {
        const f = foundations[key];
        const isActive = state.sadaka.selectedFoundation === key;

        const card = document.createElement('div');
        card.className = `foundation-card ${isActive ? 'active' : ''}`;
        card.onclick = () => selectFoundation(key);

        card.innerHTML = `
            <div class="f-icon">${f.icon}</div>
            <div class="f-name">${f.name}</div>
        `;
        list.appendChild(card);
    });

    // Update info text as well
    // Info text removed
}

function selectFoundation(key) {
    state.sadaka.selectedFoundation = key;
    saveState();
    renderFoundations(); // Re-render to update active state
}

// function updateFoundationInfoText removed

function watchAdForSadaka() {
    const btn = document.getElementById('watchAdBtn');
    if (btn.disabled) return;

    const originalText = btn.innerHTML;

    btn.disabled = true;
    btn.innerHTML = '<span>⏳</span><span>Video Yükleniyor...</span>';

    // Simulate Ad Watch
    setTimeout(() => {
        btn.innerHTML = '<span>▶️</span><span>Video Oynatılıyor...</span>';

        setTimeout(() => {
            // Success
            state.sadaka.totalGiven = (state.sadaka.totalGiven || 0) + 1;
            state.sadaka.todayGiven = (state.sadaka.todayGiven || 0) + 1;
            saveState();

            updateSadakaStats();

            // Show a celebration or toast
            // Maybe animate coins? For now just toast.
            showToast(`Teşekkürler! ${foundations[state.sadaka.selectedFoundation].name} için destek oldunuz.`);

            // Reset button
            btn.innerHTML = '<span>✅</span><span>Bağış Tamamlandı!</span>';
            setTimeout(() => {
                btn.disabled = false;
                btn.innerHTML = originalText;
            }, 2000);

        }, 3000); // 3 sec simulated video
    }, 1500);
}

function updateSadakaStats() {
    if (document.getElementById('total-sadaka-count')) {
        document.getElementById('total-sadaka-count').textContent = state.sadaka.totalGiven || 0;
    }
    if (document.getElementById('today-sadaka-count')) {
        document.getElementById('today-sadaka-count').textContent = state.sadaka.todayGiven || 0;
    }
}
