/** Week- en datumhulpfuncties */

function getISOWeek(date = new Date()) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

function parseDatum(str) {
    const [y, m, d] = str.split('-').map(Number);
    return new Date(y, m - 1, d);
}

function toDatumStr(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function formatDatum(str) {
    return parseDatum(str).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatDatumKort(str) {
    return parseDatum(str).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' });
}

function formatPeriode(van, tot) {
    if (van === tot) return formatDatum(van);
    return `${formatDatumKort(van)} – ${formatDatumKort(tot)}`;
}

function isVakantieWeek(jw) {
    return PORTAL_DATA.vakanties.some(v => {
        if (v.jwStart > v.jwEind) return jw >= v.jwStart || jw <= v.jwEind;
        return jw >= v.jwStart && jw <= v.jwEind;
    });
}

function getVakantieForWeek(jw) {
    return PORTAL_DATA.vakanties.find(v => {
        if (v.jwStart > v.jwEind) return jw >= v.jwStart || jw <= v.jwEind;
        return jw >= v.jwStart && jw <= v.jwEind;
    });
}

function getSchoolStatus(spoor = 'm3', date = new Date()) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const isoWeek = getISOWeek(d);
    const datumStr = toDatumStr(d);
    const start = parseDatum(PORTAL_DATA.schoolStart);
    const end = parseDatum(PORTAL_DATA.schoolEind);
    const ts = d.getTime();
    const inSchooljaar = ts >= start.getTime() && ts <= end.getTime();

    const vakantie = PORTAL_DATA.vakanties.find(v => {
        const van = parseDatum(v.van).getTime();
        const tot = parseDatum(v.tot).getTime();
        return ts >= van && ts <= tot;
    });

    let lesweek = null;
    if (inSchooljaar && !vakantie) {
        const startWeek = getISOWeek(start);
        if (d.getFullYear() === start.getFullYear()) lesweek = isoWeek - startWeek + 1;
        else lesweek = (52 - startWeek + 1) + isoWeek;
    }

    const blokken = PORTAL_DATA.getBlokken(spoor);
    const actiefBlok = !vakantie
        ? blokken.find(b => datumInBlok(datumStr, b))
        : null;

    return { isoWeek, lesweek, vakantie, actiefBlok, inSchooljaar, datumStr, spoor };
}

function datumInBlok(datumStr, blok) {
    const d = parseDatum(datumStr);
    const van = parseDatum(blok.van);
    const tot = parseDatum(blok.tot);
    if (tot < van) {
        // periode over de jaargrens (bijv. week 48 → week 23)
        return d >= van || d <= tot;
    }
    return d >= van && d <= tot;
}

function weekInBlokRange(jw, blok) {
    if (blok.jwStart <= blok.jwEind) return jw >= blok.jwStart && jw <= blok.jwEind;
    return jw >= blok.jwStart || jw <= blok.jwEind;
}

function getSchoolWeekLabel(date = new Date()) {
    const s = getSchoolStatus('m3', date);
    if (s.vakantie) return `Vakantie — ${s.vakantie.naam}`;
    if (s.lesweek) return `Lesweek ${s.lesweek}`;
    if (parseDatum(toDatumStr(date)) < parseDatum(PORTAL_DATA.schoolStart)) return 'School start binnenkort';
    return `Week ${s.isoWeek}`;
}

/** Werkelijke datum/week — huidig schooljaar (niet portaal 2026-2027) */
function getActualWeekInfo(date = new Date()) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const isoWeek = getISOWeek(d);
    const maand = d.getMonth();
    const startJaar = maand >= 7 ? d.getFullYear() : d.getFullYear() - 1;
    const schoolStart = new Date(startJaar, 7, 18);
    schoolStart.setHours(0, 0, 0, 0);
    const schoolEind = new Date(startJaar + 1, 6, 15);
    schoolEind.setHours(0, 0, 0, 0);
    const inSchooljaar = d >= schoolStart && d <= schoolEind;

    let lesweek = null;
    if (inSchooljaar) {
        const startWeek = getISOWeek(schoolStart);
        if (d.getFullYear() === schoolStart.getFullYear()) {
            lesweek = isoWeek - startWeek + 1;
        } else {
            lesweek = (52 - startWeek + 1) + isoWeek;
        }
        if (lesweek < 1) lesweek = 1;
    }

    const dag = d.toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const datumLang = dag.charAt(0).toUpperCase() + dag.slice(1);

    return {
        isoWeek,
        lesweek,
        datumLang,
        schooljaarLabel: `${startJaar}-${startJaar + 1}`,
        inSchooljaar,
        inVakantie: !inSchooljaar && (d < schoolStart || d > schoolEind)
    };
}

function getVolgendeDeadline(spoor) {
    const vandaag = new Date();
    vandaag.setHours(0, 0, 0, 0);
    const deadlines = [];
    PORTAL_DATA.getBlokken(spoor).forEach(blok => {
        (blok.deadlines || []).forEach(d => {
            deadlines.push({ ...d, project: blok.titel, datumObj: parseDatum(d.datum) });
        });
    });
    if (!deadlines.length) return null;
    const komend = deadlines.filter(d => d.datumObj >= vandaag).sort((a, b) => a.datumObj - b.datumObj);
    return komend[0] || deadlines.sort((a, b) => b.datumObj - a.datumObj)[0];
}

function formatDeadlineLine(deadline) {
    if (!deadline) return '—';
    const dag = deadline.datumObj.toLocaleDateString('nl-NL', { weekday: 'long' });
    return `${formatDatum(deadline.datum)} · ${dag.charAt(0).toUpperCase() + dag.slice(1)}`;
}

function weekLabel(blok) {
    return `Wk ${blok.jwStart}–${blok.jwEind}`;
}

function datumRange(blok) {
    return formatPeriode(blok.van, blok.tot);
}

function isBlokActief(blok, status) {
    return status.actiefBlok && status.actiefBlok.id === blok.id && !status.vakantie;
}

function jwIndex(jw) {
    return PORTAL_DATA.jaarweken.indexOf(jw);
}

function getBlokForWeek(spoor, jw) {
    return PORTAL_DATA.getBlokken(spoor).find(b => weekInBlokRange(jw, b));
}

function getMilestones(spoor) {
    return spoor === 'm3' ? PORTAL_DATA.m3Weeks : PORTAL_DATA.m4Weeks;
}

function getBlokSegmenten(spoor) {
    return PORTAL_DATA.getBlokken(spoor).map(b => ({
        jwStart: b.jwStart,
        jwEind: b.jwEind,
        titel: b.titel,
        fase: b.fase,
        kleur: spoor === 'm3' ? '3m' : '4m'
    }));
}
