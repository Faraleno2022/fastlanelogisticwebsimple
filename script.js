document.documentElement.classList.add('js-enabled');
requestAnimationFrame(() => document.body.classList.add('is-ready'));

const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = navMenu?.querySelectorAll('a') || [];
const backgroundRegions = document.querySelectorAll('main, .site-footer');

function syncHeader() {
  header?.classList.toggle('is-scrolled', window.scrollY > 24);
}

function closeMenu() {
  menuToggle?.classList.remove('active');
  menuToggle?.setAttribute('aria-expanded', 'false');
  menuToggle?.setAttribute('aria-label', 'Ouvrir le menu');
  navMenu?.classList.remove('open');
  document.body.classList.remove('menu-open');
  backgroundRegions.forEach((region) => { region.inert = false; });
}

menuToggle?.addEventListener('click', () => {
  const isOpen = navMenu?.classList.toggle('open');
  menuToggle.classList.toggle('active', Boolean(isOpen));
  menuToggle.setAttribute('aria-expanded', String(Boolean(isOpen)));
  menuToggle.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
  document.body.classList.toggle('menu-open', Boolean(isOpen));
  backgroundRegions.forEach((region) => { region.inert = Boolean(isOpen); });
});

navLinks.forEach((link) => link.addEventListener('click', closeMenu));

document.addEventListener('keydown', (event) => {
  if (!navMenu?.classList.contains('open')) return;
  if (event.key === 'Escape') {
    closeMenu();
    menuToggle?.focus();
  }
  if (event.key === 'Tab') {
    const lastLink = navLinks[navLinks.length - 1];
    if (event.shiftKey && document.activeElement === menuToggle) {
      event.preventDefault();
      lastLink?.focus();
    } else if (!event.shiftKey && document.activeElement === lastLink) {
      event.preventDefault();
      menuToggle?.focus();
    }
  }
});

window.addEventListener('scroll', syncHeader, { passive: true });
window.addEventListener('resize', () => {
  if (window.innerWidth > 900) closeMenu();
});
syncHeader();

const revealElements = document.querySelectorAll('.js-reveal');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion || !('IntersectionObserver' in window)) {
  revealElements.forEach((element) => element.classList.add('in-view'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.13, rootMargin: '0px 0px -35px' });

  revealElements.forEach((element) => revealObserver.observe(element));
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (event) => {
    const targetId = anchor.getAttribute('href');
    if (!targetId || targetId === '#') return;
    const target = document.getElementById(targetId.slice(1));
    if (target) {
      event.preventDefault();
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      history.replaceState(null, '', targetId);
    }
  });
});

const contactForm = document.querySelector('[data-contact-form]');

contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!contactForm.checkValidity()) {
    contactForm.reportValidity();
    return;
  }

  const formData = new FormData(contactForm);
  const name = formData.get('name');
  const company = formData.get('company') || 'Non renseignée';
  const phone = formData.get('phone') || 'Non renseigné';
  const subject = formData.get('subject');
  const message = formData.get('message');
  const email = formData.get('email');

  const emailSubject = encodeURIComponent(`[Site web] ${subject} — ${name}`);
  const emailBody = encodeURIComponent(
    `Nom : ${name}\nEntreprise : ${company}\nE-mail : ${email}\nTéléphone : ${phone}\n\nMessage :\n${message}`
  );

  const status = contactForm.querySelector('.form-status');
  if (status) {
    status.textContent = 'Votre messagerie va s’ouvrir avec votre demande préremplie.';
    status.classList.add('visible');
  }

  window.location.href = `mailto:contact@fastlanelogisticgn.com?subject=${emailSubject}&body=${emailBody}`;
});

const year = document.querySelector('[data-year]');
if (year) year.textContent = new Date().getFullYear();
