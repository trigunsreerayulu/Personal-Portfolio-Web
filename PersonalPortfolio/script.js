const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-link, .nav-contact');
const contactForm = document.querySelector('#contact-form');
const formStatus = document.querySelector('#form-status');

function setMenuOpen(isOpen) {
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  navLinks.classList.toggle('is-open', isOpen);
  document.body.classList.toggle('menu-open', isOpen);
}

menuToggle.addEventListener('click', () => {
  setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
});

navItems.forEach((link) => {
  link.addEventListener('click', () => setMenuOpen(false));
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
    setMenuOpen(false);
    menuToggle.focus();
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 680) {
    setMenuOpen(false);
  }
});

const revealItems = document.querySelectorAll('.reveal');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (typeof IntersectionObserver === 'function' && !reducedMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const pageSections = document.querySelectorAll('main section[id]');
if (typeof IntersectionObserver === 'function') {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      document.querySelectorAll('.nav-link').forEach((link) => {
        const isCurrent = link.getAttribute('href') === `#${entry.target.id}`;
        link.classList.toggle('is-current', isCurrent);
        if (isCurrent) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-25% 0px -65% 0px' });

  pageSections.forEach((section) => sectionObserver.observe(section));
}

document.querySelector('#year').textContent = new Date().getFullYear();

contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;

  const formData = new FormData(contactForm);
  const recipient = contactForm.dataset.recipient;
  const subject = `Portfolio inquiry from ${formData.get('name')}`;
  const body = `Name: ${formData.get('name')}\nEmail: ${formData.get('email')}\n\n${formData.get('message')}`;
  const mailto = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  formStatus.textContent = 'Opening your email app with the message ready.';
  window.location.href = mailto;
});
