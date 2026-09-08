/**
 * Centrale databron T&T Portaal — schooljaar 2026-2027
 */
const PORTAL_DATA = {
    schooljaar: "2026-2027",
    startJaar: 2026,
    schoolStart: "2026-08-31",
    schoolEind: "2027-07-18",

    vakanties: [
        { naam: "Herfstvakantie", van: "2026-10-19", tot: "2026-10-23", jwStart: 43, jwEind: 43 },
        /* 2026 heeft 53 ISO-weken: 21 dec = wk 52, 1 jan = wk 53 */
        { naam: "Kerstvakantie", van: "2026-12-21", tot: "2027-01-01", jwStart: 52, jwEind: 53 },
        { naam: "Voorjaarsvakantie", van: "2027-02-22", tot: "2027-02-26", jwStart: 8, jwEind: 8 },
        { naam: "Pasen", van: "2027-03-26", tot: "2027-03-29", jwStart: 12, jwEind: 13 },
        { naam: "Meivakantie", van: "2027-04-26", tot: "2027-05-09", jwStart: 17, jwEind: 18 },
        { naam: "Zomervakantie", van: "2027-07-19", tot: "2027-08-27", jwStart: 30, jwEind: 35 }
    ],

    feestdagen: [
        { naam: "Bevrijdingsdag", datum: "2027-05-05", jw: 18 },
        { naam: "Hemelvaart", datum: "2027-05-06", jw: 19 },
        { naam: "Pinksteren", datum: "2027-05-17", jw: 20 }
    ],

    /* 3 MAVO — blokken gesplitst rond vakanties */
    blokkenM3: [
        {
            id: "m3-blok-01", fase: "Blok 01", jwStart: 37, jwEind: 42,
            van: "2026-09-07", tot: "2026-10-16",
            titel: "Vaardigheidsblok A",
            detail: "Plattegrond op schaal & Zorg Meubel",
            tabId: "tab-3m-1",
            deadlines: []
        },
        {
            id: "m3-blok-02a", fase: "Blok 02", jwStart: 44, jwEind: 51,
            van: "2026-10-26", tot: "2026-12-20",
            titel: "Project 1: Wonen & Duurzaamheid",
            detail: "starterswoning & zorgwoning (wedstrijd)",
            tabId: "tab-3m-2",
            deadlines: []
        },
        {
            id: "m3-blok-02b", fase: "Blok 02", jwStart: 1, jwEind: 6,
            van: "2027-01-04", tot: "2027-02-14",
            titel: "Project 1: Wonen & Duurzaamheid",
            detail: "starterswoning & zorgwoning (wedstrijd)",
            tabId: "tab-3m-2",
            deadlines: []
        },
        {
            id: "m3-blok-03a", fase: "Blok 03", jwStart: 7, jwEind: 7,
            van: "2027-02-15", tot: "2027-02-21",
            titel: "Vaardigheidsblok B",
            detail: "",
            tabId: "tab-3m-3",
            deadlines: []
        },
        {
            id: "m3-blok-03b", fase: "Blok 03", jwStart: 9, jwEind: 11,
            van: "2027-03-01", tot: "2027-03-21",
            titel: "Vaardigheidsblok B",
            detail: "",
            tabId: "tab-3m-3",
            deadlines: []
        },
        {
            id: "m3-blok-04a", fase: "Blok 04", jwStart: 12, jwEind: 16,
            van: "2027-03-22", tot: "2027-04-25",
            titel: "Project 2: Kweek & Voeding",
            detail: "",
            tabId: "tab-3m-4",
            deadlines: []
        },
        {
            id: "m3-blok-04b", fase: "Blok 04", jwStart: 19, jwEind: 24,
            van: "2027-05-10", tot: "2027-06-20",
            titel: "Project 2: Kweek & Voeding",
            detail: "",
            tabId: "tab-3m-4",
            deadlines: []
        }
    ],

    /* 4 MAVO — blokken gesplitst rond vakanties */
    blokkenM4: [
        {
            id: "m4-blok-01", fase: "Blok 01", jwStart: 37, jwEind: 41,
            van: "2026-09-07", tot: "2026-10-11",
            titel: "Profielwerkstuk",
            detail: "PWS: onvoldoende/voldoende/goed",
            tabId: "tab-4m-1",
            deadlines: [
                { label: "Soft deadline PWS", datum: "2026-10-02", jw: 40, type: "Soft deadline" },
                { label: "Harde deadline PWS", datum: "2026-10-09", jw: 41, type: "Harde deadline" }
            ]
        },
        {
            id: "m4-blok-02", fase: "Blok 02", jwStart: 42, jwEind: 42,
            van: "2026-10-12", tot: "2026-10-18",
            titel: "Start Plan van Aanpak",
            detail: "Kick-off Plan van Aanpak",
            tabId: "tab-4m-2",
            deadlines: []
        },
        {
            id: "m4-blok-03", fase: "Blok 03", jwStart: 44, jwEind: 47,
            van: "2026-10-26", tot: "2026-11-22",
            titel: "Plan van Aanpak",
            detail: "Plan van Aanpak uitwerken",
            tabId: "tab-4m-2",
            deadlines: []
        },
        {
            id: "m4-blok-04a", fase: "Blok 04", jwStart: 48, jwEind: 51,
            van: "2026-11-23", tot: "2026-12-20",
            titel: "Meesterproef",
            detail: "Bouw & realisatie meesterproef",
            tabId: "tab-4m-3",
            deadlines: []
        },
        {
            id: "m4-blok-04b", fase: "Blok 04", jwStart: 1, jwEind: 7,
            van: "2027-01-04", tot: "2027-02-21",
            titel: "Meesterproef",
            detail: "Bouw & realisatie meesterproef",
            tabId: "tab-4m-3",
            deadlines: []
        },
        {
            id: "m4-blok-05", fase: "Blok 05", jwStart: 9, jwEind: 9,
            van: "2027-03-01", tot: "2027-03-07",
            titel: "Meesterproef afronden + Portfolio afronden",
            detail: "Afronding meesterproef en portfolio",
            tabId: "tab-4m-4",
            deadlines: [
                { label: "Presentatie meesterproef", datum: "2027-03-04", jw: 9, type: "Belangrijke datum" }
            ]
        }
    ],

    /* 4 MAVO weekdata */
    m4Weeks: [
        { sw: 2, jw: 37, label: "Profielwerkstuk", milestone: true },
        { sw: 5, jw: 40, label: "PWS soft deadline", milestone: true, deadline: true },
        { sw: 6, jw: 41, label: "PWS harde deadline", milestone: true, deadline: true },
        { sw: 7, jw: 42, label: "Start Plan van Aanpak", milestone: true },
        { sw: 8, jw: 44, label: "Plan van Aanpak", milestone: true },
        { sw: 12, jw: 48, label: "Meesterproef", milestone: true },
        { sw: null, jw: 1, label: "Meesterproef vervolg", milestone: true },
        { sw: null, jw: 9, label: "Afronden + presentatie", milestone: true, deadline: true }
    ],

    /* 3 MAVO weekdata */
    m3Weeks: [
        { sw: null, jw: 37, label: "Vaardigheidsblok A", milestone: true },
        { sw: null, jw: 44, label: "Project 1 start", milestone: true },
        { sw: null, jw: 1, label: "Project 1 vervolg", milestone: true },
        { sw: null, jw: 7, label: "Vaardigheidsblok B", milestone: true },
        { sw: null, jw: 9, label: "Vaardigheidsblok B vervolg", milestone: true },
        { sw: null, jw: 12, label: "Project 2 start", milestone: true },
        { sw: null, jw: 19, label: "Project 2 vervolg", milestone: true }
    ],

    /**
     * Bestanden per tab. Item = string (binnenkort) of { naam, url }.
     */
    bestanden: {
        "files-basis-1": ["Uploaden naar OneDrive", "Beheren OneDrive map"],
        "files-basis-2": ["Hoe bouw je een bewijs op"],
        "files-3m-1": [
            { naam: "Leerlingenboekje", url: "docs/3m-blok-a/Leerlingenboekje-Vaardigheidsblok-A.docx" },
            { naam: "PPT schaal tekenen", url: "docs/3m-blok-a/PPT-schaal-tekenen.pptx" }
        ],
        "files-3m-2": ["Programmaboekje A-Opdracht", "Programmaboekje B-Opdracht", "Docentenhandleiding", "Beoordelingsformulier A", "Beoordelingsformulier B", "Tutorials & Bronnen"],
        "files-3m-3": ["Opdrachtomschrijving", "Beoordelingsformulier", "Tutorials"],
        "files-3m-4": ["Programmaboekje A-Opdracht", "Programmaboekje B-Opdracht", "Docentenhandleiding", "Beoordelingsformulier A", "Beoordelingsformulier B", "Tutorials & Bronnen"],
        "files-4m-1": [
            { naam: "PWS Handleiding", url: "docs/4m-pws/Project-Beroep-in-Beeld-PWS-26-27-v3.docx" },
            "Beoordelingsformulier"
        ],
        "files-4m-2": ["Programmaboekje", "Format Plan van Aanpak", "Rubric Beoordeling", "Tutorials"],
        "files-4m-3": ["Programmaboekje", "Docentenhandleiding", "Eisen Meesterproef", "Presentatie Richtlijnen"],
        "files-4m-4": ["Portfolio Format", "Reflectievragen"],
        "files-4m-5": [
            { naam: "Instructieboekje maatwerk", url: "docs/4m-maatwerk/Instructieboekje-maatwerk.docx" }
        ]
    }
};

/** Alle jaarweken schooljaar in volgorde (36→53, 1→29) — 2026 heeft week 53 */
PORTAL_DATA.jaarweken = (() => {
    const w = [];
    for (let i = 36; i <= 53; i++) w.push(i);
    for (let i = 1; i <= 29; i++) w.push(i);
    return w;
})();

PORTAL_DATA.getBlokken = (spoor) => {
    if (spoor === 'm3' || spoor === '3m') return PORTAL_DATA.blokkenM3;
    return PORTAL_DATA.blokkenM4;
};
