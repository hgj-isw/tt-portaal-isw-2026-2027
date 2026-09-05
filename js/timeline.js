/** Planning-pagina — overzichtelijke weekkaarten per niveau */

let pendingPlanningTab = null;

function navigeerNaarPlanning(spoor) {
    pendingPlanningTab = spoor || null;
    navigeer('tijdlijn');
}

function onPlanningPageShown() {
    if (pendingPlanningTab) {
        const sp = pendingPlanningTab;
        pendingPlanningTab = null;
        requestAnimationFrame(() => {
            goToPlanningNow(sp);
            if (typeof schedulePageHeightUpdate === 'function') schedulePageHeightUpdate();
        });
        return;
    }
    if (typeof focusPlanningOnLoad === 'function') focusPlanningOnLoad();
}

function findVakantieTussen(blokA, blokB) {
    if (!blokB) return null;
    const aEind = parseDatum(blokA.tot).getTime();
    const bStart = parseDatum(blokB.van).getTime();
    if (!(aEind < bStart)) return null;

    return PORTAL_DATA.vakanties.find(v => {
        if (v.naam === 'Zomervakantie') return false;
        const vVan = parseDatum(v.van).getTime();
        const vTot = parseDatum(v.tot).getTime();
        // Vakantie moet volledig in de kloof tussen de twee blokken vallen
        return vVan > aEind && vTot < bStart;
    }) || null;
}

function formatWeekWeergave(jwStart, jwEind) {
    if (jwEind == null || jwStart === jwEind) return String(jwStart);
    return `${jwStart}–${jwEind}`;
}

function getDeadlineType(d, idx, total, is3m) {
    if (d.type) return d.type;
    if (d.label.toLowerCase().includes('zachte') || d.label.toLowerCase().includes('soft')) return 'Soft deadline';
    if (d.label.toLowerCase().includes('harde')) return 'Harde deadline';
    if (is3m && idx === total - 1) return 'Harde deadline';
    if (is3m && idx === 0 && total > 1) return 'Soft deadline';
    if (!is3m && idx === total - 1) return 'Harde deadline';
    if (!is3m && d.label.toLowerCase().includes('concept')) return 'Soft deadline';
    return 'Soft deadline';
}

function buildPlanningCards(spoor) {
    const cards = [];
    const status = getSchoolStatus(spoor);
    const is3m = spoor === 'm3';
    const blokken = PORTAL_DATA.getBlokken(spoor);
    const scrollId = `plan-now-${spoor}`;
    const geplaatsteVakanties = new Set();

    blokken.forEach((blok, i) => {
        const actief = isBlokActief(blok, status);

        cards.push({
            type: 'blok',
            weekWeergave: formatWeekWeergave(blok.jwStart, blok.jwEind),
            periode: datumRange(blok),
            subtitel: blok.fase,
            titel: blok.titel,
            tekst: blok.detail || '',
            deadlines: (blok.deadlines || []).map((d, idx) => ({
                label: d.label,
                datum: d.datum,
                week: d.jw,
                type: getDeadlineType(d, idx, blok.deadlines.length, is3m)
            })),
            actief,
            scrollId: actief ? scrollId : null
        });

        const vak = findVakantieTussen(blok, blokken[i + 1]);
        if (vak && !geplaatsteVakanties.has(vak.naam)) {
            geplaatsteVakanties.add(vak.naam);
            const vakActief = !!status.vakantie && status.vakantie.naam === vak.naam;
            cards.push({
                type: 'vakantie',
                weekWeergave: formatWeekWeergave(vak.jwStart, vak.jwEind !== vak.jwStart ? vak.jwEind : null),
                periode: formatPeriode(vak.van, vak.tot),
                titel: vak.naam,
                tekst: 'Geen reguliere T&T-lessen.',
                actief: vakActief,
                scrollId: vakActief ? scrollId : null
            });
        }
    });

    return cards;
}

function renderPlanCard(item, spoor) {
    const is3m = spoor === 'm3';
    const borderCls = is3m ? 'border-l-[#00e5ff]' : 'border-l-[#9d00ff]';
    const glowCls = is3m ? 'cyan-glow' : 'purple-glow';
    const rowId = item.scrollId ? ` id="${item.scrollId}"` : '';
    const rowCls = item.actief ? ' plan-row-actief' : '';

    let cardInner = '';

    if (item.type === 'vakantie') {
        cardInner = `<article class="plan-card plan-card-vakantie pro-panel p-4 border-l-4 border-l-amber-400/70${item.actief ? ' plan-card-actief-vak' : ''}">
            <div class="plan-card-label font-mono-tech text-[10px] text-amber-300/80 uppercase tracking-wider">Vakantie · ${item.periode}</div>
            <h3 class="text-base font-bold text-white mt-1">${item.titel}</h3>
            <p class="text-sm text-gray-400 mt-1">${item.tekst}</p>
        </article>`;
    } else {
        const deadlinesHtml = (item.deadlines || []).map(d => {
            const isHard = d.type === 'Harde deadline';
            const isImportant = d.type === 'Belangrijke datum';
            const badgeCls = isHard ? 'plan-badge-hard' : (isImportant ? 'plan-badge-hard' : 'plan-badge-soft');
            return `<li class="plan-deadline-row">
                <span class="plan-week-inline font-mono-tech">Wk ${d.week}</span>
                <span class="plan-badge ${badgeCls} font-mono-tech">${d.type}</span>
                <span class="plan-deadline-label">${d.label}</span>
                <span class="plan-deadline-datum font-mono-tech">${formatDatum(d.datum)}</span>
            </li>`;
        }).join('');

        const tekstHtml = item.tekst
            ? `<p class="text-sm text-gray-400 mt-1.5 leading-relaxed">${item.tekst}</p>`
            : '';

        cardInner = `<article class="plan-card pro-panel ${glowCls} p-5 border-l-4 ${borderCls}${item.actief ? ' plan-card-actief' : ''}">
            <div class="flex flex-wrap justify-between items-start gap-2 mb-2">
                <div class="plan-card-label font-mono-tech text-[10px] text-gray-500 uppercase tracking-wider">${item.subtitel || 'Belangrijk moment'} · ${item.periode}</div>
                ${item.actief ? '<span class="nu-badge">NU BEZIG</span>' : ''}
            </div>
            <h3 class="text-lg font-bold text-white">${item.titel}</h3>
            ${tekstHtml}
            ${deadlinesHtml ? `<ul class="plan-deadline-lijst mt-4">${deadlinesHtml}</ul>` : ''}
        </article>`;
    }

    return `<div class="plan-row${rowCls}"${rowId} data-spoor="${spoor}">
        <div class="plan-week-col">
            <span class="plan-week-label font-mono-tech">Week</span>
            <span class="plan-week-num">${item.weekWeergave}</span>
        </div>
        <div class="plan-card-wrap">${cardInner}</div>
    </div>`;
}

function renderPlanningList(containerId, spoor) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const cards = buildPlanningCards(spoor);
    el.innerHTML = cards.map(c => renderPlanCard(c, spoor)).join('');
}

function renderPlanningHierNu() {
    const el = document.getElementById('planning-hier-nu');
    if (!el) return;
    const s3 = getSchoolStatus('m3');
    const s4 = getSchoolStatus('m4');

    let m3 = 'Nog niet gestart';
    let m4 = 'Nog niet gestart';
    if (s3.vakantie) m3 = s3.vakantie.naam;
    else if (s3.actiefBlok) m3 = s3.actiefBlok.titel;
    else if (s3.inSchooljaar) m3 = 'Bekijk je planning';

    if (s4.vakantie) m4 = s4.vakantie.naam;
    else if (s4.actiefBlok) m4 = s4.actiefBlok.titel;
    else if (s4.inSchooljaar) m4 = 'Bekijk je planning';

    el.innerHTML = `
        <p class="plan-hier-title font-mono-tech text-[10px] text-gray-500 uppercase tracking-wider mb-2">Waar ben je nu? — klik om te springen</p>
        <div class="plan-hier-btns">
            <button type="button" class="plan-hier-btn plan-hier-3m" onclick="goToPlanningNow('3m')">
                <span class="plan-hier-niveau">3 MAVO</span>
                <span class="plan-hier-label">${m3}</span>
            </button>
            <button type="button" class="plan-hier-btn plan-hier-4m" onclick="goToPlanningNow('4m')">
                <span class="plan-hier-niveau">4 MAVO</span>
                <span class="plan-hier-label">${m4}</span>
            </button>
        </div>`;
}

function goToPlanningNow(spoor) {
    const tabBtn = document.querySelector(spoor === '3m' ? '.plan-tab-3m' : '.plan-tab-4m');
    if (tabBtn) switchPlanningView(spoor, tabBtn, true);
}

function scrollToPlanningNow(spoor) {
    const target = document.getElementById(`plan-now-${spoor}`);
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.scrollY - 100;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
}

function focusPlanningOnLoad() {
    renderPlanningHierNu();
    const defaultSpoor = '3m';
    const tabBtn = document.querySelector('.plan-tab-3m');
    if (tabBtn) switchPlanningView(defaultSpoor, tabBtn, false);
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            scrollToPlanningNow(defaultSpoor);
            if (typeof schedulePageHeightUpdate === 'function') schedulePageHeightUpdate();
        });
    });
}

function switchPlanningView(view, btn, doScroll) {
    document.getElementById('planning-view-3m').classList.toggle('hidden', view !== '3m');
    document.getElementById('planning-view-4m').classList.toggle('hidden', view !== '4m');
    document.querySelectorAll('.plan-tab').forEach(b => {
        b.classList.remove('plan-tab-active');
        b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('plan-tab-active');
    btn.setAttribute('aria-selected', 'true');
    if (doScroll !== false) {
        requestAnimationFrame(() => scrollToPlanningNow(view));
    }
    requestAnimationFrame(() => {
        if (typeof schedulePageHeightUpdate === 'function') schedulePageHeightUpdate();
    });
}

function renderHomeWeekCard() {
    const info = getActualWeekInfo();
    const weekEl = document.getElementById('dynamic-week');
    const dateEl = document.getElementById('dynamic-week-date');
    const subEl = document.getElementById('dynamic-week-sub');

    if (weekEl) weekEl.textContent = `Week ${info.isoWeek}`;
    if (dateEl) dateEl.textContent = info.datumLang;
    if (subEl) {
        if (info.lesweek) {
            subEl.textContent = `Lesweek ${info.lesweek} · Schooljaar ${info.schooljaarLabel}`;
        } else if (info.inVakantie) {
            subEl.textContent = `Vakantie · Schooljaar ${info.schooljaarLabel}`;
        } else {
            subEl.textContent = `Schooljaar ${info.schooljaarLabel}`;
        }
    }
}

function renderHomepageDeadlines() {
    const d3 = getVolgendeDeadline('m3');
    const d4 = getVolgendeDeadline('m4');
    const sub3 = document.getElementById('home-deadline-3m-sub');
    const sub4 = document.getElementById('home-deadline-4m-sub');

    if (d3) {
        document.getElementById('home-deadline-3m-title').innerText = d3.label;
        if (sub3) sub3.innerText = d3.project;
        document.getElementById('home-deadline-3m-day').innerHTML =
            `<span class="w-1.5 h-1.5 bg-[#00e5ff] rounded-full animate-pulse"></span> ${formatDeadlineLine(d3)}`;
        const link3 = document.getElementById('home-deadline-3m-link');
        if (link3) link3.classList.remove('hidden');
    } else {
        document.getElementById('home-deadline-3m-title').innerText = 'Zie planning';
        if (sub3) sub3.innerText = 'Deadlines volgen later';
        document.getElementById('home-deadline-3m-day').innerHTML =
            `<span class="w-1.5 h-1.5 bg-[#00e5ff] rounded-full"></span> —`;
        const link3 = document.getElementById('home-deadline-3m-link');
        if (link3) link3.classList.remove('hidden');
    }
    if (d4) {
        document.getElementById('home-deadline-4m-title').innerText = d4.label;
        if (sub4) sub4.innerText = d4.project;
        document.getElementById('home-deadline-4m-day').innerHTML =
            `<span class="w-1.5 h-1.5 bg-[#9d00ff] rounded-full animate-pulse"></span> ${formatDeadlineLine(d4)}`;
        const link4 = document.getElementById('home-deadline-4m-link');
        if (link4) link4.classList.remove('hidden');
    }
}

function initTimeline() {
    renderHomeWeekCard();
    renderHomepageDeadlines();
    renderPlanningList('planning-list-3m', 'm3');
    renderPlanningList('planning-list-4m', 'm4');
    renderPlanningHierNu();
    updateActiefBadges();
    schedulePageHeightUpdate();
}

function updateActiefBadges() {
    const s3 = getSchoolStatus('m3');
    const s4 = getSchoolStatus('m4');
    document.querySelectorAll('[data-actief-badge]').forEach(el => {
        const tabId = el.dataset.actiefBadge;
        const match3 = s3.actiefBlok && s3.actiefBlok.tabId === tabId && !s3.vakantie;
        const match4 = s4.actiefBlok && s4.actiefBlok.tabId === tabId && !s4.vakantie;
        el.classList.toggle('hidden', !(match3 || match4));
    });
}
