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

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background on scroll
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
    } else {
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

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

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = getTheme();
    setTheme(savedTheme);
});

// === Dynamic Download CV ===
const downloadCV = document.getElementById('downloadCV');
if (downloadCV) {
  downloadCV.addEventListener('click', async () => {
    try {
      // Ambil data dari resume.json terbaru (auto generated di GitHub)
      const res = await fetch('resume.json');
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
      cvElement.style.padding = '20px';
      cvElement.style.maxWidth = '800px';
      cvElement.style.color = '#111';

            cvElement.innerHTML = `
    <div style="font-family:Inter, Arial, sans-serif; max-width:820px; margin:0 auto; color:#0f172a;">
        <!-- Header -->
        <div style="background:#0f172a; color:#fff; padding:18px 22px; border-radius:8px 8px 0 0; display:flex; justify-content:space-between; align-items:center;">
            <div style="flex:1">
                <h1 style="margin:0; font-size:24px; font-weight:700;">${data.name}</h1>
            </div>
            <div style="text-align:right; font-size:12px; line-height:1.35; min-width:200px;">
                <div style="color:#e2e8f0;">${data.contact.email}</div>
                <div style="margin-top:6px; color:#cbd5e1;">${data.contact.phone}</div>
                <div style="margin-top:6px; color:#cbd5e1;">${data.contact.location}</div>
            </div>
        </div>

        <!-- Body -->
        <div style="display:flex; gap:18px; border:1px solid #e6eef3; border-top:none; padding:18px 20px; background:#fff; border-radius:0 0 8px 8px;">

            <!-- Left column -->
            <div style="flex:0 0 33%; padding-right:12px; font-size:13px;">
                <h3 style="margin:0 0 6px 0; font-size:12px; letter-spacing:0.8px; color:#0b1220;">Profile</h3>
                <p style="margin:0 0 10px 0; font-size:12.5px; line-height:1.35;">${data.profile}</p>

                <h3 style="margin:0 0 6px 0; font-size:12px; letter-spacing:0.8px; color:#0b1220;">Skills</h3>
                ${Object.entries(data.skillsOverview || {}).map(([k, v]) =>
                    `<p style="margin:2px 0; font-size:12.2px;"><strong style=\"font-weight:600;\">${k}</strong><br><span style=\"color:#374151;\">${v.join(', ')}</span></p>`
                ).join('')}

                <h3 style="margin:8px 0 6px 0; font-size:12px; letter-spacing:0.8px; color:#0b1220;">Certifications</h3>
                <ul style="margin:4px 0 0 18px; padding:0; font-size:12px; color:#334155;">
                    ${ (data.certifications || []).map(c => `<li style="margin-bottom:4px;">${c}</li>`).join('') }
                </ul>
            </div>

            <!-- Right column -->
            <div style="flex:1; padding-left:6px; font-size:13px;">
                <h3 style="margin:0 0 8px 0; font-size:12px; letter-spacing:0.8px; color:#0b1220;">Experience</h3>
                ${ (data.experience || []).map(e => `
                    <div style="margin-bottom:8px;">
                        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                            <div style="font-weight:700; font-size:13px;">${e.role}</div>
                            <div style="font-size:11.5px; color:#475569">${e.date || ''}</div>
                        </div>
                        <div style="font-size:12px; color:#334155; margin:4px 0 6px 0;">${e.company}</div>
                        <ul style="margin:0 0 6px 18px; font-size:12.2px; color:#263238;">
                            ${ (e.bullets || []).map(b => `<li style=\"margin-bottom:4px; line-height:1.32;\">${b}</li>`).join('') }
                        </ul>
                    </div>
                `).join('') }

                <h3 style="margin:6px 0 8px 0; font-size:12px; letter-spacing:0.8px; color:#0b1220;">Projects</h3>
                ${ (data.projects || []).map(p => `
                    <div style="margin-bottom:8px;">
                        <div style="font-weight:600; font-size:13px;">${p.title}</div>
                        ${ (p.details || []).map(d => `<div style=\"font-size:12px; color:#374151; margin:4px 0;\">• ${d}</div>`).join('') }
                    </div>
                `).join('') }

                <h3 style="margin:6px 0 6px 0; font-size:12px; letter-spacing:0.8px; color:#0b1220;">Education</h3>
                ${ (data.education || []).map(ed => `
                    <div style="font-size:12px; color:#334155; margin-bottom:6px;"><strong>${ed.school}</strong><br>${ed.degree} (${ed.year}) — GPA ${ed.gpa}</div>
                `).join('') }
            </div>

        </div>
    </div>
`;



      // Generate PDF dari elemen
      html2pdf()
        .from(cvElement)
        .set({
          margin: 10,
          filename: `${data.name.replace(/\s+/g, '_')}_CV.pdf`,
          html2canvas: { scale: 2 },
        })
        .save();

    } catch (err) {
      alert('❌ Gagal memuat resume.json atau membuat PDF');
      console.error(err);
    }
  });
}
