/**
 * Trio Films - Interactive Application Logic
 * Studio appointment booking, dynamic showreel modal, filtering, and navigation.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const siteNav = document.getElementById('siteNav');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  
  const bookingModal = document.getElementById('bookingModal');
  const closeBookingBtn = document.getElementById('closeBookingBtn');
  const openBookingBtnNav = document.getElementById('openBookingBtnNav');
  const openBookingBtnHero = document.getElementById('openBookingBtnHero');
  const openBookingTriggers = document.querySelectorAll('.open-booking-trigger');
  
  const consultationForm = document.getElementById('consultationForm');
  const projectTypeSelect = document.getElementById('projectType');
  const preferredDateInput = document.getElementById('preferredDate');
  const whatsappDirectSubmit = document.getElementById('whatsappDirectSubmit');
  
  const videoModal = document.getElementById('videoModal');
  const closeVideoBtn = document.getElementById('closeVideoBtn');
  const openReelBtn = document.getElementById('openReelBtn');
  const videoPlayerPoster = document.getElementById('videoPlayerPoster');
  const videoModalTitle = document.getElementById('videoModalTitle');
  const videoModalDesc = document.getElementById('videoModalDesc');
  const playerPlayToggle = document.getElementById('playerPlayToggle');
  const playerProgressBar = document.getElementById('playerProgressBar');
  
  const toastNotice = document.getElementById('toastNotice');
  const toastMessage = document.getElementById('toastMessage');
  
  // Set minimum booking date to today
  if (preferredDateInput) {
    const today = new Date().toISOString().split('T')[0];
    preferredDateInput.min = today;
  }

  // Auto update year
  const currentYearSpan = document.getElementById('currentYear');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  /* --------------------------------------------------------------------------
     1. Navigation Scroll Effect & Active Section Tracking
     -------------------------------------------------------------------------- */
  const handleScroll = () => {
    if (window.scrollY > 40) {
      siteNav.classList.add('scrolled');
    } else {
      siteNav.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Mobile menu toggle
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
    });

    // Close on mobile link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
      });
    });
  }

  /* --------------------------------------------------------------------------
     2. Portfolio Work Filter
     -------------------------------------------------------------------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const workCards = document.querySelectorAll('.work-card');

  const applyCategoryFilter = (filterValue) => {
    workCards.forEach(card => {
      const category = card.getAttribute('data-category');
      if (filterValue === 'all' || category === filterValue) {
        card.style.display = 'flex';
        requestAnimationFrame(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        });
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(15px)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 220);
      }
    });
  };

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');
      applyCategoryFilter(filterValue);
    });
  });

  // Initialize with currently active filter
  const initialActiveBtn = document.querySelector('.filter-btn.active');
  if (initialActiveBtn) {
    applyCategoryFilter(initialActiveBtn.getAttribute('data-filter'));
  }

  /* --------------------------------------------------------------------------
     3. Booking Modal Handlers
     -------------------------------------------------------------------------- */
  const openModal = (modal) => {
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = (modal) => {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (openBookingBtnNav) {
    openBookingBtnNav.addEventListener('click', () => openModal(bookingModal));
  }
  if (openBookingBtnHero) {
    openBookingBtnHero.addEventListener('click', () => openModal(bookingModal));
  }

  openBookingTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceName = trigger.getAttribute('data-service');
      if (serviceName && projectTypeSelect) {
        // Find matching option or set value
        let matched = false;
        for (let i = 0; i < projectTypeSelect.options.length; i++) {
          if (projectTypeSelect.options[i].text.toLowerCase().includes(serviceName.toLowerCase()) || 
              projectTypeSelect.options[i].value.toLowerCase().includes(serviceName.toLowerCase())) {
            projectTypeSelect.selectedIndex = i;
            matched = true;
            break;
          }
        }
        if (!matched && serviceName) {
          projectTypeSelect.value = serviceName;
        }
      }
      closeModal(videoModal);
      openModal(bookingModal);
    });
  });

  if (closeBookingBtn) {
    closeBookingBtn.addEventListener('click', () => closeModal(bookingModal));
  }

  /* --------------------------------------------------------------------------
     4. Showreel / Video Modal
     -------------------------------------------------------------------------- */
  const openVideoOverlay = (title, desc, imgSrc) => {
    if (videoModalTitle) videoModalTitle.textContent = title || 'Trio Films Studio Reel';
    if (videoModalDesc) videoModalDesc.textContent = desc || 'Captured across Singapore by Trio Films.';
    if (videoPlayerPoster && imgSrc) videoPlayerPoster.src = imgSrc;
    openModal(videoModal);
  };

  if (openReelBtn) {
    openReelBtn.addEventListener('click', () => {
      openVideoOverlay(
        'Trio Films Official Cinema Showreel',
        'Featuring 10th anniversary gala celebrations, commercial cinematography, and DaVinci color mastering in Singapore.',
        'assets/images/hero_cinema.jpg'
      );
    });
  }

  // Work card play buttons
  document.querySelectorAll('.work-overlay-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const title = btn.getAttribute('data-video-title');
      const desc = btn.getAttribute('data-video-desc');
      const img = btn.getAttribute('data-video-img');
      openVideoOverlay(title, desc, img);
    });
  });

  if (closeVideoBtn) {
    closeVideoBtn.addEventListener('click', () => closeModal(videoModal));
  }

  // Close modals on clicking backdrop
  [bookingModal, videoModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeModal(modal);
        }
      });
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal(bookingModal);
      closeModal(videoModal);
    }
  });

  // Simulated Player Play/Pause animation
  let isPlaying = false;
  let progressInterval;
  if (playerPlayToggle && playerProgressBar) {
    playerPlayToggle.addEventListener('click', () => {
      isPlaying = !isPlaying;
      if (isPlaying) {
        playerPlayToggle.innerHTML = `
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16"></rect>
            <rect x="14" y="4" width="4" height="16"></rect>
          </svg>
        `;
        showToast('Playback started in 4K Master Cinema mode.');
        let currentW = 42;
        progressInterval = setInterval(() => {
          currentW = (currentW + 1) % 100;
          playerProgressBar.style.width = currentW + '%';
        }, 500);
      } else {
        playerPlayToggle.innerHTML = `
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="6 4 20 12 6 20 6 4"></polygon>
          </svg>
        `;
        clearInterval(progressInterval);
      }
    });
  }

  /* --------------------------------------------------------------------------
     5. Toast Notification System
     -------------------------------------------------------------------------- */
  let toastTimer;
  const showToast = (message) => {
    if (!toastNotice) return;
    if (toastMessage) toastMessage.textContent = message;
    toastNotice.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastNotice.classList.remove('show');
    }, 4500);
  };

  /* --------------------------------------------------------------------------
     6. Form Submission & Direct WhatsApp Integration
     -------------------------------------------------------------------------- */
  if (consultationForm) {
    consultationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('clientName').value.trim();
      const phone = document.getElementById('clientPhone').value.trim();
      const project = projectTypeSelect.value;
      const date = preferredDateInput.value;

      showToast(`Appointment Request Confirmed for ${name}! Our Level 5 studio team will contact ${phone}.`);
      consultationForm.reset();
      setTimeout(() => {
        closeModal(bookingModal);
      }, 1200);
    });
  }

  // Quick WhatsApp Dispatch button
  if (whatsappDirectSubmit) {
    whatsappDirectSubmit.addEventListener('click', () => {
      const name = document.getElementById('clientName').value.trim() || 'Prospective Client';
      const project = projectTypeSelect.value;
      const date = preferredDateInput.value || 'Upcoming';
      const details = document.getElementById('projectDetails').value.trim();

      const text = encodeURIComponent(
        `Hello Trio Films! I would like to schedule an appointment at your Level 5 studio.\n\n` +
        `• Name/Org: ${name}\n` +
        `• Project: ${project}\n` +
        `• Preferred Date: ${date}\n` +
        (details ? `• Notes: ${details}\n` : '') +
        `\nLooking forward to discussing our production.`
      );

      window.open(`https://wa.me/6596255505?text=${text}`, '_blank');
      closeModal(bookingModal);
      showToast('Opening WhatsApp with your appointment details...');
    });
  }
});
