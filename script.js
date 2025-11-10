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
  <div style="background:#1e293b;color:white;padding:24px;border-radius:8px 8px 0 0">
    <h1 style="margin:0;font-size:28px">${data.name}</h1>
    <p style="margin:4px 0 0">${data.contact.location} • ${data.contact.phone} • ${data.contact.email}</p>
  </div>

  <div style="display:flex;gap:20px;padding:24px;border:1px solid #ddd;border-top:none;border-radius:0 0 8px 8px;font-size:14px;line-height:1.5">
    <div style="flex:1;min-width:35%">
      <h2 style="border-bottom:2px solid #1e293b;padding-bottom:4px">Profile</h2>
      <p>${data.profile}</p>

      <h2 style="border-bottom:2px solid #1e293b;padding-bottom:4px">Skills</h2>
      ${Object.entries(data.skillsOverview).map(([k, v]) =>
        `<p><strong>${k}:</strong> ${v.join(', ')}</p>`
      ).join('')}

      <h2 style="border-bottom:2px solid #1e293b;padding-bottom:4px">Certifications</h2>
      <ul>${data.certifications.map(c => `<li>${c}</li>`).join('')}</ul>
      <h2 style="border-bottom:2px solid #1e293b;padding-bottom:4px">Education</h2>
      ${data.education.map(e => `
        <p><strong>${e.school}</strong><br>${e.degree} (${e.year}) — GPA ${e.gpa}</p>
      `).join('')}
    </div>

    <div style="flex:2">
      <h2 style="border-bottom:2px solid #1e293b;padding-bottom:4px">Experience</h2>
      ${data.experience.map(e => `
        <div style="margin-bottom:10px">
          <h3 style="margin:0;color:#0f172a">${e.role}</h3>
          <p style="margin:0;font-weight:500">${e.company} — <span style="font-style:italic">${e.date}</span></p>
          <ul>${e.bullets.map(b => `<li>${b}</li>`).join('')}</ul>
        </div>
      `).join('')}

      <h2 style="border-bottom:2px solid #1e293b;padding-bottom:4px">Projects</h2>
      ${data.projects.map(p => `
        <div style="margin-bottom:10px">
          <h3 style="margin:0;color:#0f172a">${p.title}</h3>
          <ul>${p.details.map(d => `<li>${d}</li>`).join('')}</ul>
        </div>
      `).join('')}
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
