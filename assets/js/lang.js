
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

const svgLangIcon = `<p class="flex flex-wrap items-center gap-0.5 justify-between">
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
<path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
</svg>
@lang
</p>
`;

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
                const cur = (desc || elLang?.innerText || '').trim();
                bnt.innerHTML = svgLangIcon.replace("@lang", cur)
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
