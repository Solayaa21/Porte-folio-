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
