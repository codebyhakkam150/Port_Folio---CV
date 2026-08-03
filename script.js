

function renderGutterAndCode() {
  const gutter = document.getElementById('gutter');
  const codeBlock = document.getElementById('codeBlock');
  if (!gutter || !codeBlock) return;

  let gutterText = '';
  for (let i = 1; i <= codeLines.length; i++) gutterText += i + '\n';
  gutter.textContent = gutterText;

  let i = 0;
  function typeNextLine() {
    if (i >= codeLines.length) return;
    const line = codeLines[i];
    const p = document.createElement('div');
    p.style.paddingLeft = (line.indent * 20) + 'px';
    p.innerHTML = line.html || '&nbsp;';
    p.style.opacity = 0;
    codeBlock.appendChild(p);
    requestAnimationFrame(() => {
      p.style.transition = 'opacity 0.3s ease';
      p.style.opacity = 1;
    });
    i++;
    setTimeout(typeNextLine, 220);
  }
  typeNextLine();
}

// ===== Mobile tab menu toggle =====
function setupMenuToggle() {
  const toggle = document.getElementById('menuToggle');
  const tabs = document.querySelector('.tabs');
  if (!toggle || !tabs) return;
  toggle.addEventListener('click', () => {
    const open = tabs.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  tabs.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => tabs.classList.remove('open'));
  });
}

// ===== Active tab highlight on scroll =====
function setupScrollSpy() {
  const sections = document.querySelectorAll('section[id], header');
  const tabLinks = document.querySelectorAll('.tab');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        tabLinks.forEach(t => t.classList.remove('active'));
        const match = document.querySelector('.tab[href="#' + id + '"]');
        if (match) match.classList.add('active');
      }
    });
  }, { threshold: 0.4, rootMargin: '-80px 0px -60% 0px' });
  sections.forEach(s => { if (s.id) observer.observe(s); });
}

// ===== CV view/download handlers =====
function setupCvButtons() {
  const downloadBtn = document.getElementById('downloadCv');
  if (!downloadBtn) return;
  downloadBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const url = downloadBtn.getAttribute('href') || 'cv.pdf';
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Not found');
      const blob = await res.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'Muhammed-Hakkam-CV.pdf';
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('CV not found. Add your CV as cv.pdf in the project root.');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderGutterAndCode();
  setupMenuToggle();
  setupScrollSpy();
  setupCvButtons();
});
