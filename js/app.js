/** Navigatie, bestanden, canvas-animaties en initialisatie */

function normalizeBestand(item) {
    if (typeof item === 'string') return { naam: item, url: null };
    return { naam: item.naam, url: item.url || null };
}

function generateSpecificFiles(containerId, fileItems, colorClass, textClass, iconColor) {
    const container = document.getElementById(containerId);
    if (!container) return;
    let html = '';
    fileItems.forEach((raw) => {
        const { naam, url } = normalizeBestand(raw);
        const rowInner = `
            <div class="flex items-center gap-3">
                <div class="p-1.5 bg-white/5 rounded-lg border border-white/10">
                    <svg class="w-4 h-4 ${iconColor}" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                </div>
                <span class="text-sm font-semibold text-gray-200">${naam}</span>
            </div>
            <span class="font-mono-tech text-[9px] ${textClass} ${colorClass} px-2 py-1 rounded border border-current opacity-70">${url ? 'OPEN' : 'BINNENKORT'}</span>`;

        if (url) {
            html += `<a href="${url}" target="_blank" rel="noopener noreferrer" class="file-row flex items-center justify-between p-3.5 rounded-xl bg-black/40 border border-white/5 hover:border-white/20 transition-colors">${rowInner}</a>`;
        } else {
            html += `<div class="file-row flex items-center justify-between p-3.5 rounded-xl bg-black/40 border border-white/5 cursor-default" title="Bestand wordt nog gekoppeld">${rowInner}</div>`;
        }
    });
    container.innerHTML = html;
}

function initBestanden() {
    const cfg = {
        'files-basis-1': ['bg-[#00ffcc]/10', 'text-[#00ffcc]', 'text-[#00ffcc]'],
        'files-basis-2': ['bg-[#00ffcc]/10', 'text-[#00ffcc]', 'text-[#00ffcc]'],
        'files-3m-1': ['bg-[#00e5ff]/10', 'text-[#00e5ff]', 'text-[#00e5ff]'],
        'files-3m-2': ['bg-[#00e5ff]/10', 'text-[#00e5ff]', 'text-[#00e5ff]'],
        'files-3m-3': ['bg-[#00e5ff]/10', 'text-[#00e5ff]', 'text-[#00e5ff]'],
        'files-3m-4': ['bg-[#00e5ff]/10', 'text-[#00e5ff]', 'text-[#00e5ff]'],
        'files-4m-1': ['bg-[#9d00ff]/10', 'text-[#9d00ff]', 'text-[#9d00ff]'],
        'files-4m-2': ['bg-[#9d00ff]/10', 'text-[#9d00ff]', 'text-[#9d00ff]'],
        'files-4m-3': ['bg-[#9d00ff]/10', 'text-[#9d00ff]', 'text-[#9d00ff]'],
        'files-4m-4': ['bg-[#9d00ff]/10', 'text-[#9d00ff]', 'text-[#9d00ff]'],
        'files-4m-5': ['bg-[#e8b84a]/10', 'text-[#e8b84a]', 'text-[#e8b84a]']
    };
    Object.entries(PORTAL_DATA.bestanden).forEach(([id, items]) => {
        const [bg, txt, icon] = cfg[id];
        generateSpecificFiles(id, items, bg, txt, icon);
    });
}

function switchTab(groep, targetId, btnElement) {
    document.querySelectorAll(`.content-${groep}`).forEach(c => c.classList.remove('active'));
    const container = document.getElementById(`menu-${groep}`);
    const isMaatwerk = targetId === 'tab-4m-5';
    const activeClass = groep === '3m'
        ? 'active-cyan'
        : (groep === '4m' ? (isMaatwerk ? 'active-maatwerk' : 'active-purple') : 'active-green');
    container.querySelectorAll('.tab-btn').forEach(b => {
        b.classList.remove('active-cyan', 'active-purple', 'active-green', 'active-maatwerk');
    });
    document.getElementById(targetId).classList.add('active');
    btnElement.classList.add(activeClass);

    const content4m = document.getElementById('portal-content-4m');
    if (content4m) {
        content4m.classList.toggle('maatwerk-glow', isMaatwerk);
        content4m.classList.toggle('purple-glow', !isMaatwerk);
    }
    schedulePageHeightUpdate();
}

function sluitMobielMenu() {
    document.getElementById('mobile-menu').classList.add('hidden');
    document.getElementById('mobile-menu-btn').setAttribute('aria-expanded', 'false');
}

const NAV_ACTIVE = "nav-btn font-mono-tech text-xs tracking-wider px-5 py-2 rounded-xl text-white bg-white/10 shadow-sm border border-white/10 cyber-btn";
const NAV_INACTIVE = {
    home: "nav-btn font-mono-tech text-xs tracking-wider px-5 py-2 rounded-xl text-gray-400 hover:bg-white/5 hover:text-[#00e5ff] transition-colors cyber-btn",
    basis: "nav-btn font-mono-tech text-xs tracking-wider px-5 py-2 rounded-xl text-gray-400 hover:bg-white/5 hover:text-[#00ffcc] transition-colors cyber-btn",
    '3mavo': "nav-btn font-mono-tech text-xs tracking-wider px-5 py-2 rounded-xl text-gray-400 hover:bg-white/5 hover:text-[#00e5ff] transition-colors cyber-btn",
    '4mavo': "nav-btn font-mono-tech text-xs tracking-wider px-5 py-2 rounded-xl text-gray-400 hover:bg-white/5 hover:text-[#9d00ff] transition-colors cyber-btn",
    tijdlijn: "nav-btn font-mono-tech text-xs tracking-wider px-5 py-2 rounded-xl text-gray-400 hover:bg-white/5 hover:text-[#00ffcc] transition-colors cyber-btn"
};

let transCanvas, tctx, tWidth, tHeight, isTransitioning = false;
let bgCanvas, bctx, width, height, bgDots = [];
let canvasMouse = { x: -1000, y: -1000 };
const cyberLetters = "01//--+*#%!@$XØ█▓▒░<>[]{}";

function updateNavButtons(targetId) {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.className = btn.dataset.target === targetId ? NAV_ACTIVE : (NAV_INACTIVE[btn.dataset.target] || NAV_INACTIVE.home);
    });
}

function initTransitionCanvas() {
    if (!transCanvas) return;
    tWidth = window.innerWidth;
    tHeight = window.innerHeight;
    transCanvas.width = tWidth;
    transCanvas.height = tHeight;
}

function getTextNodes(container) {
    const textNodes = [];
    function traverse(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            if (node.nodeValue.trim().length > 0) textNodes.push(node);
        } else {
            for (const child of node.childNodes) traverse(child);
        }
    }
    traverse(container);
    return textNodes;
}

const PAGE_TAIL_PX = 80; /* ~2–3 cm onder laatste item */

function updatePageHeight() {
    const uiLayer = document.getElementById('ui-layer');
    const active = document.querySelector('.page-active');
    if (!uiLayer || !active) return;

    const bottom = active.offsetTop + active.offsetHeight;
    const total = Math.ceil(bottom + PAGE_TAIL_PX);
    uiLayer.style.height = total + 'px';
    uiLayer.style.minHeight = total + 'px';
}

function schedulePageHeightUpdate() {
    requestAnimationFrame(() => requestAnimationFrame(updatePageHeight));
}

function onPageShown(targetPageId) {
    schedulePageHeightUpdate();
    if (targetPageId === 'tijdlijn' && typeof onPlanningPageShown === 'function') {
        requestAnimationFrame(() => onPlanningPageShown());
    }
}

function switchPageInstant(current, target, targetPageId) {
    current.classList.remove('page-active');
    target.classList.add('page-active');
    updateNavButtons(targetPageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onPageShown(targetPageId);
}

function navigeer(targetPageId) {
    const current = document.querySelector('.page-active');
    const target = document.getElementById('page-' + targetPageId);
    if (isTransitioning || !current || current === target) return;

    if (!tctx || !transCanvas) {
        switchPageInstant(current, target, targetPageId);
        return;
    }

    isTransitioning = true;
    updateNavButtons(targetPageId);

    const strokeColor = targetPageId === '4mavo' ? 'rgba(157, 0, 255,'
        : (targetPageId === 'basis' ? 'rgba(0, 255, 204,' : 'rgba(0, 229, 255,');

    current.classList.add('page-transitioning');
    target.classList.add('page-transitioning');

    const currentNodes = getTextNodes(current).map(node => {
        if (!node._originalVal) node._originalVal = node.nodeValue;
        return { node, original: node._originalVal, y: node.parentElement.getBoundingClientRect().top };
    });
    const targetNodes = getTextNodes(target).map(node => {
        if (!node._originalVal) node._originalVal = node.nodeValue;
        return { node, original: node._originalVal, y: node.parentElement.getBoundingClientRect().top };
    });

    const duration = 650;
    const startTime = performance.now();

    function animateTransition(time) {
        const progress = Math.min((time - startTime) / duration, 1);
        const easeProgress = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        const lineY = easeProgress * tHeight;

        tctx.clearRect(0, 0, tWidth, tHeight);
        tctx.strokeStyle = '#ffffff'; tctx.lineWidth = 1;
        tctx.beginPath(); tctx.moveTo(0, lineY); tctx.lineTo(tWidth, lineY); tctx.stroke();
        tctx.strokeStyle = `${strokeColor} 0.8)`; tctx.lineWidth = 3;
        tctx.beginPath(); tctx.moveTo(0, lineY); tctx.lineTo(tWidth, lineY); tctx.stroke();
        tctx.strokeStyle = `${strokeColor} 0.15)`; tctx.lineWidth = 25;
        tctx.beginPath(); tctx.moveTo(0, lineY); tctx.lineTo(tWidth, lineY); tctx.stroke();

        tctx.fillStyle = `${strokeColor} 0.6)`;
        for (let i = 0; i < 15; i++) {
            if (Math.random() > 0.3) {
                tctx.fillRect(Math.random() * tWidth, lineY + (Math.random() * 20 - 10), Math.random() * 40 + 10, 1.5);
            }
        }

        const localCurrent = lineY - current.getBoundingClientRect().top;
        current.style.clipPath = `inset(${Math.max(0, localCurrent)}px 0 0 0)`;
        const localTarget = lineY - target.getBoundingClientRect().top;
        target.style.clipPath = `inset(0 0 calc(100% - ${Math.max(0, localTarget)}px) 0)`;

        currentNodes.forEach(item => {
            const dist = item.y - lineY;
            if (dist > 0 && dist < 80) {
                item.node.nodeValue = item.original.split('').map(char =>
                    (char === ' ' || char === '\n') ? char : cyberLetters[Math.floor(Math.random() * cyberLetters.length)]
                ).join('');
            } else {
                item.node.nodeValue = item.original;
            }
        });

        targetNodes.forEach(item => {
            const past = lineY - item.y;
            if (lineY < item.y) {
                item.node.nodeValue = item.original;
            } else if (past < 150) {
                const f = past / 150;
                item.node.nodeValue = item.original.split('').map(char =>
                    (char === ' ' || char === '\n') ? char : (Math.random() > f ? cyberLetters[Math.floor(Math.random() * cyberLetters.length)] : char)
                ).join('');
            } else {
                item.node.nodeValue = item.original;
            }
        });

        if (progress < 1) {
            requestAnimationFrame(animateTransition);
        } else {
            tctx.clearRect(0, 0, tWidth, tHeight);
            current.style.clipPath = '';
            target.style.clipPath = '';
            current.classList.remove('page-transitioning', 'page-active');
            target.classList.remove('page-transitioning');
            target.classList.add('page-active');
            currentNodes.forEach(i => { i.node.nodeValue = i.original; });
            targetNodes.forEach(i => { i.node.nodeValue = i.original; });
            window.scrollTo({ top: 0, behavior: 'smooth' });
            isTransitioning = false;
            onPageShown(targetPageId);
        }
    }
    requestAnimationFrame(animateTransition);
}

function initBgCanvas() {
    if (!bgCanvas || !bctx) return;
    width = window.innerWidth;
    height = window.innerHeight;
    bgCanvas.width = width;
    bgCanvas.height = height;
    const off = document.createElement('canvas');
    off.width = width;
    off.height = height;
    const octx = off.getContext('2d');
    octx.fillStyle = 'white';
    octx.font = `900 ${Math.min(height * 0.20, 160)}px 'Inter', sans-serif`;
    octx.textAlign = 'center';
    octx.textBaseline = 'middle';

    const fontSize = Math.min(height * 0.20, 160);
    const textLeft = 'ISW';
    const xPosLeft = width > 768 ? 120 : 50;
    const startYLeft = height / 2 - fontSize * 0.9;
    for (let i = 0; i < textLeft.length; i++) octx.fillText(textLeft[i], xPosLeft, startYLeft + i * fontSize * 0.9);

    const textRight = 'T&T';
    const xPosRight = width - (width > 768 ? 120 : 50);
    for (let i = 0; i < textRight.length; i++) octx.fillText(textRight[i], xPosRight, startYLeft + i * fontSize * 0.9);

    const data = octx.getImageData(0, 0, width, height).data;
    bgDots = [];
    const spacing = 14;
    for (let y = 0; y < height; y += spacing) {
        for (let x = 0; x < width; x += spacing) {
            const alphaIndex = (Math.floor(y) * width + Math.floor(x)) * 4 + 3;
            if (data[alphaIndex] > 128) {
                bgDots.push({ x, y, type: x < width / 2 ? 'ISW' : 'T&T', offset: Math.random() * Math.PI * 2 });
            } else {
                bgDots.push({ x, y, type: 'normal', offset: Math.random() * Math.PI * 2 });
            }
        }
    }
}

function animateBgCanvas() {
    if (!bctx) return;
    bctx.clearRect(0, 0, width, height);
    const time = Date.now() * 0.0008;
    bgDots.forEach(dot => {
        const dist = Math.hypot(canvasMouse.x - dot.x, canvasMouse.y - dot.y);
        const mouseEffect = Math.max(0, 1 - dist / 150);
        const pulse = Math.sin(time + dot.offset);
        bctx.beginPath();
        if (dot.type === 'ISW') {
            bctx.fillStyle = `rgba(0, 229, 255, ${0.35 + pulse * 0.2 + mouseEffect * 0.4})`;
            bctx.arc(dot.x, dot.y, 1.8 + mouseEffect, 0, Math.PI * 2);
        } else if (dot.type === 'T&T') {
            bctx.fillStyle = `rgba(157, 0, 255, ${0.35 + pulse * 0.2 + mouseEffect * 0.4})`;
            bctx.arc(dot.x, dot.y, 1.8 + mouseEffect, 0, Math.PI * 2);
        } else {
            bctx.fillStyle = `rgba(255, 255, 255, ${0.04 + pulse * 0.03 + mouseEffect * 0.15})`;
            bctx.arc(dot.x, dot.y, 1.3 + mouseEffect, 0, Math.PI * 2);
        }
        bctx.fill();
    });
    requestAnimationFrame(animateBgCanvas);
}

function initCyberButtons() {
    const btnLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    document.querySelectorAll('.cyber-btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            const targetText = btn.dataset.value;
            if (!targetText) return;
            let iteration = 0;
            clearInterval(btn._cyberInterval);
            const arrow = btn.querySelector('span');
            btn._cyberInterval = setInterval(() => {
                const newText = targetText.split('').map((letter, index) =>
                    index < iteration ? targetText[index] : btnLetters[Math.floor(Math.random() * btnLetters.length)]
                ).join('');
                if (arrow) {
                    btn.childNodes[0].nodeValue = newText + ' ';
                } else {
                    btn.textContent = newText;
                }
                iteration += 0.5;
                if (iteration >= targetText.length) clearInterval(btn._cyberInterval);
            }, 30);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    transCanvas = document.getElementById('transition-canvas');
    bgCanvas = document.getElementById('bg-canvas');
    if (transCanvas) tctx = transCanvas.getContext('2d');
    if (bgCanvas) bctx = bgCanvas.getContext('2d');

    initTimeline();
    initBestanden();
    initTransitionCanvas();
    initBgCanvas();
    initCyberButtons();
    initHeaderCloverLogo();
    initFx();

    window.addEventListener('resize', () => {
        initTransitionCanvas();
        initBgCanvas();
        initHeaderCloverLogo();
    });
    window.addEventListener('mousemove', e => {
        canvasMouse.x = e.clientX;
        canvasMouse.y = e.clientY;
    });

    const menuBtn = document.getElementById('mobile-menu-btn');
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            const menu = document.getElementById('mobile-menu');
            const hidden = menu.classList.toggle('hidden');
            menuBtn.setAttribute('aria-expanded', hidden ? 'false' : 'true');
        });
    }

    animateBgCanvas();
    schedulePageHeightUpdate();
    window.addEventListener('resize', updatePageHeight);
});
