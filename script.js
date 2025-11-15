// === Language Translation System ===
let translations = {};
let currentLang = 'id'; // Default language

// Load translations
async function loadTranslations() {
    try {
        // Prevent cached translations on GitHub Pages by cache-busting
        const response = await fetch('translations.json?cb=' + Date.now());
        if (!response.ok) throw new Error(`translations.json fetch failed: ${response.status} ${response.statusText}`);
        translations = await response.json();
        
        // Get saved language from localStorage or default to 'id'
        const savedLang = localStorage.getItem('language') || 'id';
        currentLang = savedLang;
        
        // Apply translations
        applyTranslations(currentLang);
        updateLangIcon(currentLang);
    } catch (error) {
        console.error('Failed to load translations:', error);
        // Show a visible banner so deploy-time failures are obvious without opening DevTools
        try {
            const bannerId = 'translation-error-banner';
            if (!document.getElementById(bannerId)) {
                const b = document.createElement('div');
                b.id = bannerId;
                b.style.cssText = 'position:fixed;top:0;left:0;right:0;background:#fee2e2;color:#7f1d1d;padding:8px 12px;z-index:9999;text-align:center;font-size:14px;box-shadow:0 2px 6px rgba(0,0,0,0.05);';
                b.textContent = '⚠️ Terjadi kesalahan memuat terjemahan di situs terdeploy. Periksa Console (F12) untuk detail.';
                document.body.appendChild(b);
                // Auto-remove after 12s so it doesn't block the UI forever
                setTimeout(() => b.remove(), 12000);
            }
        } catch (_) {
            /* ignore DOM errors */
        }
    }
}

// Apply translations to elements with data-i18n attribute
function applyTranslations(lang) {
    const elements = document.querySelectorAll('[data-i18n]');
    
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        const keys = key.split('.');
        
        let value = translations[lang];
        for (const k of keys) {
            if (value && value[k] !== undefined) {
                value = value[k];
            } else {
                console.warn(`Translation key not found: ${key}`);
                return;
            }
        }
        
        if (typeof value === 'string') {
            element.textContent = value;
        }
    });
    
    // Update HTML lang attribute
    document.documentElement.setAttribute('lang', lang);
}

// Update language icon
function updateLangIcon(lang) {
    const langIcon = document.querySelector('.lang-icon');
    if (langIcon) {
        langIcon.textContent = lang === 'id' ? '🇬🇧' : '🇮🇩';
    }
}

// Language Toggle
const langToggle = document.getElementById('langToggle');
if (langToggle) {
    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'id' ? 'en' : 'id';
        localStorage.setItem('language', currentLang);
        applyTranslations(currentLang);
        updateLangIcon(currentLang);
    });
}

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        
        // Animate hamburger
        const spans = hamburger.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
}

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards and sections
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll(
        '.skill-card, .project-card, .detail-card, .metric-card, .service-card'
    );
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Add active state to navigation links based on scroll position
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-menu a');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Add active class styling in CSS (we'll add this via a style tag or update CSS)
const style = document.createElement('style');
style.textContent = `
    .nav-menu a.active {
        color: var(--teal-verdigris);
    }
`;
document.head.appendChild(style);

// Dark Mode Toggle
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle?.querySelector('.theme-icon');
const html = document.documentElement;

// Get theme from localStorage or default to light
const getTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
};

// Set theme
const setTheme = (theme) => {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update icon
    if (themeIcon) {
        if (theme === 'dark') {
            themeIcon.textContent = '☀️';
        } else {
            themeIcon.textContent = '🌙';
        }
    }
};

// Toggle theme
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    });
}

// Initialize theme and language on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = getTheme();
    setTheme(savedTheme);
});

// Load translations immediately (don't wait for DOMContentLoaded)
loadTranslations();

// === Dynamic Download CV ===
const downloadCV = document.getElementById('downloadCV');
if (downloadCV) {
  downloadCV.addEventListener('click', async () => {
    try {
      // Ambil data dari resume.json terbaru (auto generated di GitHub)
    // Cache-bust resume.json on download to ensure latest content is used on deployed site
    const res = await fetch('resume.json?cb=' + Date.now());
      const data = await res.json();

      // Lazy-load html2pdf.js (biar gak nambah load di awal)
      if (!window.html2pdf) {
        const s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.3/html2pdf.bundle.min.js';
        document.body.appendChild(s);
        await new Promise(r => (s.onload = r));
      }

      // Bangun struktur CV sementara untuk dijadikan PDF
    const cvElement = document.createElement('div');
    cvElement.style.fontFamily = 'Inter, sans-serif';
    // reset outer wrapper padding/width so inner template controls page layout exactly
    cvElement.style.padding = '0';
    cvElement.style.maxWidth = 'none';
    cvElement.style.color = '#111';

            cvElement.innerHTML = `
            <div style="font-family:Inter, Arial, sans-serif; width:210mm; margin:0 auto; color:#0f172a; font-size:15px; box-sizing:border-box; padding:0.3in;">
        <!-- Header -->
    <div style="background:#0f172a; color:#fff; padding:12px 14px; border-radius:8px 8px 0 0; display:flex; justify-content:space-between; align-items:center;">
                                <div style="flex:1">
                                <h1 style="margin:0; font-size:28px; font-weight:700;">${data.name}</h1>
            </div>
            <div style="text-align:right; font-size:13px; line-height:1.35; min-width:200px;">
                <div style="color:#e2e8f0;">${data.contact.email}</div>
                <div style="margin-top:6px; color:#cbd5e1;">${data.contact.phone}</div>
                <div style="margin-top:6px; color:#cbd5e1;">${data.contact.location}</div>
            </div>
        </div>

        <!-- Body -->
    <div style="display:flex; gap:12px; border:1px solid #e6eef3; border-top:none; padding:12px 14px; background:#fff; border-radius:0 0 8px 8px;">

            <!-- Left column -->
            <div style="flex:0 0 30%; padding:8px 10px;">
                <h3 style="margin:0 0 6px 0; font-size:13px; letter-spacing:0.6px; color:#0b1220;">Profile</h3>
                <p style="margin:0 0 8px 0; font-size:14.8px; line-height:1.32;">${data.profile}</p>

                <h3 style="margin:0 0 6px 0; font-size:12px; letter-spacing:0.8px; color:#0b1220;">Skills</h3>
                ${Object.entries(data.skillsOverview || {}).map(([k, v]) =>
                    `<p style="margin:2px 0; font-size:13.2px;"><strong style=\"font-weight:600;\">${k}</strong><br><span style=\"color:#374151;\">${v.join(', ')}</span></p>`
                ).join('')}

                <h3 style="margin:8px 0 6px 0; font-size:12px; letter-spacing:0.8px; color:#0b1220;">Certifications</h3>
                <ul style="margin:4px 0 0 18px; padding:0; font-size:13px; color:#334155;">
                    ${ (data.certifications || []).map(c => `<li style="margin-bottom:4px;">${c}</li>`).join('') }
                </ul>

                <h3 style="margin:8px 0 6px 0; font-size:13px; letter-spacing:0.6px; color:#0b1220;">Education</h3>
                ${ (data.education || []).map(ed => `
                    <div style="font-size:13.5px; color:#334155; margin-bottom:6px;"><strong>${ed.school}</strong><br>${ed.degree} (${ed.year}) — GPA ${ed.gpa}</div>
                `).join('') }
            </div>

            <!-- Right column -->
            <div style="flex:1; padding:8px 8px;">
                <h3 style="margin:0 0 8px 0; font-size:13px; letter-spacing:0.6px; color:#0b1220;">Experience</h3>
                ${ (data.experience || []).map(e => `
                    <div style="margin-bottom:8px;">
                        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                            <div style="font-weight:700; font-size:14px;">${e.role}</div>
                            <div style="font-size:12.5px; color:#475569">${e.date || ''}</div>
                        </div>
                        <div style="font-size:13.5px; color:#334155; margin:4px 0 6px 0;">${e.company}</div>
                        <ul style="margin:0 0 6px 16px; font-size:13.5px; color:#263238;">
                            ${ (e.bullets || []).map(b => `<li style=\"margin-bottom:4px; line-height:1.3;\">${b}</li>`).join('') }
                        </ul>
                    </div>
                `).join('') }

                <h3 style="margin:6px 0 8px 0; font-size:13px; letter-spacing:0.6px; color:#0b1220;">Projects</h3>
                ${ (data.projects || []).map(p => `
                    <div style="margin-bottom:8px;">
                        <div style="font-weight:600; font-size:14.5px;">${p.title}</div>
                        ${ (p.details || []).map(d => `<div style=\"font-size:13.5px; color:#374151; margin:4px 0;\">• ${d}</div>`).join('') }
                    </div>
                `).join('') }

                <!-- Education moved to left column -->
            </div>

        </div>
    </div>
`;

// Hindari pemotongan elemen besar di tengah halaman
const style = document.createElement('style');
// Be careful: avoid overly broad "avoid break" rules (they can push content to the next page).
// Only prevent breaks inside lists/paragraphs and marked sections, allow divs to break across pages.
style.textContent = `
    * { box-sizing: border-box; }
    h2, h3 { page-break-after: avoid; }
    /* Prevent lists and paragraphs from being split awkwardly */
    ul, p { page-break-inside: avoid; break-inside: avoid; }
    /* Use .no-break or .cv-section for blocks that must not be split across pages */
    .no-break, .cv-section { page-break-inside: avoid; break-inside: avoid; }
`;
cvElement.prepend(style);



      // Generate PDF dari elemen
                html2pdf()
                    .from(cvElement)
                    .set({
                        // We'll handle margins via the element padding and set jsPDF/html2pdf margin to 0
                        margin: 0,
                        filename: `${data.name.replace(/\s+/g, '_')}_CV.pdf`,
                        html2canvas: { scale: 2 },
                        // Ensure jsPDF uses inches and A4 format
                        jsPDF: { unit: 'in', format: 'a4' }
                    })
                    .save();

    } catch (err) {
      alert('Gagal memuat resume.json atau membuat PDF');
      console.error(err);
    }
  });
}
