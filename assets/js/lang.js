
const dropdownLang = document.getElementById('dropdown-lang');
const lang = localStorage.getItem('lang') || 'en';
const rtlLangs = [ 'ar', 'he', 'fa' ];
let i18n_en = null;

//* Map element id to dictionary key on i18n file
const mappedElements = [
    { elId: 'caw-title-manifesto', key: 'title' },
    { elId: 'caw-desc-manifesto', key: 'description' },
    { elId: 'caw-subtitle-manifesto', key: 'manifesto-subtitle' },
    { elId: 'tooltip-theme-mode', key: 'tooltip-theme-mode' },
    { elId: 'tooltip-army', key: 'tooltip-army' },
    { elId: 'join-army-link', key: 'join-army-link' },
    { elId: 'join-army-footer-link', key: 'join-army-footer-link' },
    { elId: 'link-original-manifesto', key: 'link-original-manifesto' },
]

loadTranlation(lang);

async function loadTranlation(lang, desc) {

    lang = (lang || 'en').toLowerCase();
    const file = `./assets/lang/manifesto.${lang}.txt`;

    //* Load default language to be used as fallback when a language is incomplete
    if (lang !== 'en')
        await loadLabels('en');

    await loadLabels(lang);

    fetch(file)
        .then(response => response.text())
        .then(text => {
            const el = document.getElementById('content-manifesto');
            if (el)
                el.innerText = text;

            const elLang = document.querySelector(`a[hreflang="${lang}"]`);
            const bnt = document.getElementById('dropdownDefault');
            if (bnt) {
                bnt.innerText = (desc || elLang?.innerText || '').trim();
                bnt.innerText = bnt.innerText.replace(/(\r\n|\n|\r)/gm, " ");
            }

            document.body.setAttribute('lang', lang);

            //* Set RTL if needed
            if (rtlLangs.includes(lang)) {
                document.body.setAttribute('dir', 'rtl');
            }
            else
                document.body.removeAttribute('dir');                            
        });
}

async function loadLabels(lang) {
    try {

        if (!lang)
            lang = localStorage.getItem('lang') || 'en';

        lang = lang.toLowerCase();
        const resp = await fetch(`./assets/lang/i18n.${lang}.json`);
        const i18n = await resp.json();

        if (!i18n_en && lang === 'en')
            i18n_en = i18n;

        mappedElements.forEach(x => setText(i18n, x.elId, x.key));
    }
    catch (error) {
        console.error(error);
    }
}

function setText(i18n, elId, dicKey) {
    if (!dicKey || !elId)
        return;

    const el = document.getElementById(elId);
    if (el)
        el.innerText = i18n[ dicKey ] || i18n_en?.[ dicKey ] || el.innerText || '';
}

function setLang(lang) {
    localStorage.setItem('lang', lang);
    loadTranlation(lang);
}

dropdownLang?.addEventListener('click', function (e) {
    setLang(e?.target?.hreflang || 'en', e?.target?.innerText);
});
