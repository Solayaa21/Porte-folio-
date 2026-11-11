// Pipeline: one step open at a time, a second click closes it
const stations = document.querySelectorAll('.station');

const toggleStation = (station, scroll) => {
    const wasOpen = station.getAttribute('aria-expanded') === 'true';

    stations.forEach(other => {
        other.setAttribute('aria-expanded', 'false');
        document.getElementById(other.getAttribute('aria-controls')).classList.remove('is-open');
    });

    if (!wasOpen) {
        const panel = document.getElementById(station.getAttribute('aria-controls'));
        station.setAttribute('aria-expanded', 'true');
        panel.classList.add('is-open');
        if (scroll) panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
};

stations.forEach(station => {
    station.addEventListener('click', () => toggleStation(station, window.matchMedia('(max-width: 900px)').matches));
});

// A link such as index.html#etape-2 opens that step
const linked = location.hash && document.querySelector(`.station[aria-controls="${location.hash.slice(1)}"]`);
if (linked) toggleStation(linked, true);

// Blocks fade in when they enter the screen
const revealed = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    revealed.forEach(el => observer.observe(el));
} else {
    revealed.forEach(el => el.classList.add('is-visible'));
}

// Lightbox: any element with data-full opens the full-size capture
const lightbox = document.getElementById('lightbox');

if (lightbox) {
    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    let opener = null;

    const close = () => {
        lightbox.hidden = true;
        lightboxImg.src = '';
        document.body.style.overflow = '';
        if (opener) opener.focus();
    };

    document.querySelectorAll('[data-full]').forEach(el => {
        el.addEventListener('click', () => {
            opener = el;
            lightboxImg.src = el.dataset.full;
            lightbox.hidden = false;
            document.body.style.overflow = 'hidden';
            closeBtn.focus();
        });
    });

    closeBtn.addEventListener('click', close);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !lightbox.hidden) close(); });
}

// Footer year
document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

// Google Ads: loaded only after consent (CNIL). Fill in both values to switch it on.
const ADS_ID = 'AW-18569485782';          // e.g. 'AW-123456789'
const ADS_CONVERSION = 'AW-18569485782/KspICLHYt7YdENa7z5ZF';  // e.g. 'AW-123456789/AbCdEfGhIjK'
const CONSENT_KEY = 'am-consent';
const SIX_MONTHS = 1000 * 60 * 60 * 24 * 182;

const readConsent = () => {
    try {
        const c = JSON.parse(localStorage.getItem(CONSENT_KEY) || 'null');
        return c && Date.now() - c.date < SIX_MONTHS ? c.value : null;
    } catch (e) { return null; }
};
const saveConsent = value => {
    try { localStorage.setItem(CONSENT_KEY, JSON.stringify({ value, date: Date.now() })); } catch (e) { /* private mode */ }
};

const loadAds = () => {
    if (!ADS_ID || window.gtag) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    gtag('consent', 'default', { ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'denied', analytics_storage: 'denied' });
    gtag('js', new Date());
    gtag('config', ADS_ID);
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ADS_ID;
    document.head.appendChild(s);
    if (ADS_CONVERSION && document.body.dataset.conversion) gtag('event', 'conversion', { send_to: ADS_CONVERSION });
};

const showBanner = () => {
    if (!ADS_ID || document.querySelector('.consent')) return;
    const en = document.documentElement.lang === 'en';
    const legal = en ? (location.pathname.includes('/en/') ? 'legal-notice.html#data' : 'en/legal-notice.html#data')
                     : (location.pathname.includes('/en/') ? '../mentions-legales.html#donnees' : 'mentions-legales.html#donnees');
    const box = document.createElement('div');
    box.className = 'consent';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-label', en ? 'Cookies' : 'Cookies');
    box.innerHTML = en
        ? `<p>With your consent, this site uses Google Ads cookies to measure ad performance. <a href="${legal}">Learn more</a></p><div class="consent-actions"><button type="button" class="btn btn-sm btn-ghost" data-consent="no">Decline</button><button type="button" class="btn btn-sm btn-ghost" data-consent="yes">Accept</button></div>`
        : `<p>Avec votre accord, ce site utilise des cookies Google Ads pour mesurer l'efficacité de ses annonces. <a href="${legal}">En savoir plus</a></p><div class="consent-actions"><button type="button" class="btn btn-sm btn-ghost" data-consent="no">Refuser</button><button type="button" class="btn btn-sm btn-ghost" data-consent="yes">Accepter</button></div>`;
    box.addEventListener('click', e => {
        const b = e.target.closest('[data-consent]');
        if (!b) return;
        saveConsent(b.dataset.consent);
        box.remove();
        if (b.dataset.consent === 'yes') loadAds();
    });
    document.body.appendChild(box);
};

const consent = readConsent();
if (consent === 'yes') loadAds();
else if (consent === null) showBanner();

document.querySelectorAll('[data-cookie-reset]').forEach(b => b.addEventListener('click', () => {
    try { localStorage.removeItem(CONSENT_KEY); } catch (e) { /* ignore */ }
    if (window.gtag) location.reload(); else showBanner();
}));
