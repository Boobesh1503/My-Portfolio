/**
 * Boobesh Prasath - Academic CV Portfolio Scripts
 * Handles interactive features, animations, theme switching, resume viewer, and search
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 2. Dark / Light Theme Toggle
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const currentTheme = localStorage.getItem('site-theme') || 'light';
  document.body.setAttribute('data-theme', currentTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const activeTheme = document.body.getAttribute('data-theme');
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
      document.body.setAttribute('data-theme', newTheme);
      localStorage.setItem('site-theme', newTheme);
      showToast(`Switched to ${newTheme} mode`);
    });
  }

  // 2b. Custom Profile Photo Upload / Storage
  const avatarRing = document.getElementById('avatar-ring');
  const avatarFileInput = document.getElementById('avatar-file-input');
  const profileImg = document.getElementById('profile-img');

  const savedAvatar = localStorage.getItem('user-avatar-custom');
  if (savedAvatar && profileImg && savedAvatar.startsWith('data:image')) {
    profileImg.src = savedAvatar;
  } else if (profileImg) {
    profileImg.src = 'assets/profile.jpg';
  }

  if (avatarRing && avatarFileInput && profileImg) {
    avatarRing.addEventListener('click', (e) => {
      if (e.target.closest('.status-badge')) return;
      avatarFileInput.click();
    });

    avatarFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          profileImg.src = event.target.result;
          try {
            localStorage.setItem('user-avatar-custom', event.target.result);
          } catch (err) {
            console.log('Image too large for localStorage, displayed for session');
          }
          showToast('Profile photo updated successfully!');
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // 3. Mobile Navigation Menu Toggle
  const mobileToggleBtn = document.getElementById('mobile-toggle-btn');
  const navMenu = document.getElementById('nav-menu');

  if (mobileToggleBtn && navMenu) {
    mobileToggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }

  // 4. Active Navigation Link on Scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    const scrollY = window.pageYOffset;
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav);

  // 5. Resume Viewer Modal & Download CV Functionality
  const resumeModal = document.getElementById('resume-modal');
  const downloadCvBtn = document.getElementById('download-cv-btn');
  const previewResumeBtn = document.getElementById('preview-resume-btn');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const modalDownloadBtn = document.getElementById('modal-download-btn');

  function openResumeModal() {
    if (resumeModal) {
      resumeModal.classList.add('active');
      resumeModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeResumeModal() {
    if (resumeModal) {
      resumeModal.classList.remove('active');
      resumeModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  if (previewResumeBtn) {
    previewResumeBtn.addEventListener('click', openResumeModal);
  }

  if (downloadCvBtn) {
    downloadCvBtn.addEventListener('click', () => {
      openResumeModal();
      showToast('Opening Resume Viewer. Use Print / Save as PDF!');
    });
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeResumeModal);
  }

  if (modalDownloadBtn) {
    modalDownloadBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Close modal when clicking on backdrop
  if (resumeModal) {
    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) {
        closeResumeModal();
      }
    });
  }

  // 6. Quick Search Palette
  const searchModal = document.getElementById('search-modal');
  const searchToggleBtn = document.getElementById('search-toggle-btn');
  const searchCloseBtn = document.getElementById('search-close-btn');
  const quickSearchInput = document.getElementById('quick-search-input');
  const searchResultsList = document.getElementById('search-results-list');

  // Search Data Index
  const searchIndex = [
    { title: 'About Boobesh Prasath', category: 'Profile', link: '#about' },
    { title: 'DevOps & Cloud Engineer Profile', category: 'Summary', link: '#about' },
    { title: 'Capgemini - Network Engineer (7 Months)', category: 'Experience', link: '#experience' },
    { title: 'Nokia Open Services Platform (OSP)', category: 'Experience', link: '#experience' },
    { title: 'Data Recovery Script Development', category: 'Experience', link: '#experience' },
    { title: 'SS7 & SIGTRAN Signaling Analysis', category: 'Experience', link: '#experience' },
    { title: 'Techvolt Software - Frontend Developer', category: 'Experience', link: '#experience' },
    { title: 'Sales Data ETL Validation Project', category: 'Project', link: '#projects' },
    { title: 'CI/CD Pipeline Demo (Node.js & Docker)', category: 'Project', link: '#projects' },
    { title: 'AWS (EC2, S3, IAM)', category: 'Skill', link: '#skills' },
    { title: 'Docker Containerization', category: 'Skill', link: '#skills' },
    { title: 'Linux & Bash Scripting', category: 'Skill', link: '#skills' },
    { title: 'Jenkins CI/CD Automation', category: 'Skill', link: '#skills' },
    { title: 'SS7 & SIGTRAN Protocols', category: 'Skill', link: '#skills' },
    { title: 'React.js & Node.js Web Development', category: 'Skill', link: '#skills' },
    { title: 'MySQL & Database Validation', category: 'Skill', link: '#skills' },
    { title: 'B.E. Computer Science & Engineering (GPA 8.2)', category: 'Education', link: '#education' },
    { title: 'AWS Cloud Foundations Certification', category: 'Certification', link: '#education' },
    { title: 'Contact Details & Message Form', category: 'Contact', link: '#contact' },
    { title: 'Email: prasanth909214@gmail.com', category: 'Contact', link: '#contact' },
    { title: 'Phone: +91 9944425150', category: 'Contact', link: '#contact' }
  ];

  function openSearchModal() {
    if (searchModal) {
      searchModal.classList.add('active');
      searchModal.setAttribute('aria-hidden', 'false');
      quickSearchInput.value = '';
      renderSearchResults(searchIndex);
      setTimeout(() => quickSearchInput.focus(), 100);
    }
  }

  function closeSearchModal() {
    if (searchModal) {
      searchModal.classList.remove('active');
      searchModal.setAttribute('aria-hidden', 'true');
    }
  }

  function renderSearchResults(items) {
    if (!searchResultsList) return;
    if (items.length === 0) {
      searchResultsList.innerHTML = `<div style="padding: 1.5rem; text-align: center; color: var(--text-muted);">No matching results found</div>`;
      return;
    }

    searchResultsList.innerHTML = items.map(item => `
      <a href="${item.link}" class="search-result-item" onclick="document.getElementById('search-modal').classList.remove('active')">
        <span>${item.title}</span>
        <span class="search-result-tag">${item.category}</span>
      </a>
    `).join('');
  }

  if (searchToggleBtn) {
    searchToggleBtn.addEventListener('click', openSearchModal);
  }

  if (searchCloseBtn) {
    searchCloseBtn.addEventListener('click', closeSearchModal);
  }

  if (quickSearchInput) {
    quickSearchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      if (!query) {
        renderSearchResults(searchIndex);
        return;
      }
      const filtered = searchIndex.filter(item => 
        item.title.toLowerCase().includes(query) || 
        item.category.toLowerCase().includes(query)
      );
      renderSearchResults(filtered);
    });
  }

  if (searchModal) {
    searchModal.addEventListener('click', (e) => {
      if (e.target === searchModal) {
        closeSearchModal();
      }
    });
  }

  // Keyboard shortcut: Ctrl+K or Cmd+K to open search, Escape to close modals
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      openSearchModal();
    }
    if (e.key === 'Escape') {
      closeSearchModal();
      closeResumeModal();
    }
  });

  // 7. Copy Contact Details Helper
  const copyContactBtn = document.getElementById('copy-contact-btn');
  if (copyContactBtn) {
    copyContactBtn.addEventListener('click', () => {
      const contactInfo = `Boobesh Prasath M - DevOps Engineer\nEmail: prasanth909214@gmail.com\nPhone: +91 9944425150\nLocation: Chennai, Tamil Nadu, India`;
      copyToClipboard(contactInfo, 'Contact details copied to clipboard!');
    });
  }

  // 8. Contact Form Submission Handling - Direct to prasanth909214@gmail.com
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const submitBtnText = document.getElementById('submit-btn-text');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        showToast('Please fill in all required fields');
        return;
      }

      // Update button state to sending
      if (submitBtn) {
        submitBtn.disabled = true;
        if (submitBtnText) submitBtnText.textContent = 'Sending to Boobesh...';
      }

      try {
        const response = await fetch('https://formsubmit.co/ajax/prasanth909214@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name: name,
            email: email,
            _subject: `[Portfolio] ${subject} - from ${name}`,
            message: message,
            _replyto: email
          })
        });

        const result = await response.json();

        if (response.ok || result.success === 'true') {
          showToast(`Success! Your message was sent directly to Boobesh's email.`);
          contactForm.reset();
        } else {
          throw new Error('Service response not ok');
        }
      } catch (error) {
        console.warn('FormSubmit AJAX fallback to mailto:', error);
        // Fallback directly to mailto
        const mailtoUrl = `mailto:prasanth909214@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Hi Boobesh,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
        window.location.href = mailtoUrl;
        showToast(`Opening your email app to send directly to prasanth909214@gmail.com`);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          if (submitBtnText) submitBtnText.textContent = 'Send Message';
        }
      }
    });
  }
});

// Global Copy Helper
function copyToClipboard(text, message = 'Copied to clipboard!') {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(message);
    }).catch(() => {
      fallbackCopy(text, message);
    });
  } else {
    fallbackCopy(text, message);
  }
}

function fallbackCopy(text, message) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
    showToast(message);
  } catch (err) {
    showToast('Failed to copy');
  }
  document.body.removeChild(textarea);
}

// Global Toast Notification Helper
function showToast(message) {
  const toastContainer = document.getElementById('toast-container');
  if (!toastContainer) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>✓</span> <span>${message}</span>`;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    if (toast.parentNode === toastContainer) {
      toastContainer.removeChild(toast);
    }
  }, 3000);
}
