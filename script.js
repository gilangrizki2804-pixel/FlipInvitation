/**
 * Script Logika Flip Book Undangan Pernikahan
 * Menggunakan St.PageFlip + Web Audio API + Dynamic Responsive Mobile
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Inisialisasi Audio FX (Synthesized Paper Rustle menggunakan Web Audio API)
  let audioCtx = null;
  function playPageFlipSound() {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const bufferSize = audioCtx.sampleRate * 0.12;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        const decay = Math.exp(-i / (bufferSize * 0.3));
        output[i] = (Math.random() * 2 - 1) * decay;
      }

      const whiteNoise = audioCtx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, audioCtx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.12);

      const gainNode = audioCtx.createGain();
      gainNode.gain.setValueAtTime(0.28, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);

      whiteNoise.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      whiteNoise.start();
    } catch (e) {
      console.log('Audio flip effect unhandled:', e);
    }
  }

  // 2. Background Music Controller
  const bgMusic = document.getElementById('bg-music');
  const musicToggleBtn = document.getElementById('music-toggle');
  const floatingMusicBtn = document.getElementById('floating-music-btn');
  let isMusicPlaying = false;

  function startMusic() {
    if (!bgMusic || isMusicPlaying) return;
    bgMusic.play().then(() => {
      isMusicPlaying = true;
      if (floatingMusicBtn) floatingMusicBtn.classList.add('playing');
    }).catch(err => {
      console.warn('Playback was prevented:', err);
    });
  }

  function toggleMusic() {
    if (!bgMusic) return;
    if (isMusicPlaying) {
      bgMusic.pause();
      isMusicPlaying = false;
      if (floatingMusicBtn) floatingMusicBtn.classList.remove('playing');
    } else {
      bgMusic.play().then(() => {
        isMusicPlaying = true;
        if (floatingMusicBtn) floatingMusicBtn.classList.add('playing');
      }).catch(err => {
        console.warn('Playback was prevented:', err);
      });
    }
  }

  if (musicToggleBtn) musicToggleBtn.addEventListener('click', toggleMusic);
  if (floatingMusicBtn) floatingMusicBtn.addEventListener('click', toggleMusic);

  // Auto trigger audio context & music on first user touch anywhere
  document.body.addEventListener('click', () => {
    if (!isMusicPlaying) startMusic();
  }, { once: true });

  // 3. Ambil Nama Tamu dari URL Parameter (?to=Nama+Tamu atau ?u=Nama+Tamu)
  const urlParams = new URLSearchParams(window.location.search);
  const guestParam = urlParams.get('to') || urlParams.get('u') || urlParams.get('guest');
  const defaultGuestName = "Tamu Undangan";
  const guestName = guestParam ? decodeURIComponent(guestParam.replace(/\+/g, ' ')) : defaultGuestName;

  document.querySelectorAll('.guest-name-placeholder').forEach(el => {
    el.textContent = guestName;
  });

  // 4. Perhitungan Dimensi Halaman Responsif (Mobile & Desktop)
  function getPageDimensions() {
    const isMobile = window.innerWidth <= 768;
    const ratio = 724 / 1024; // 0.7071 (Rasio Buku Potret A4/Standar)

    if (isMobile) {
      // Sisakan margin minimal di kanan-kiri (12px per sisi)
      const maxAvailableW = window.innerWidth - 24;
      // Sisakan ruang untuk control dock di bawah dan status bar
      const maxAvailableH = window.innerHeight - 80;

      let w = Math.min(maxAvailableW, 360);
      let h = Math.round(w / ratio);

      if (h > maxAvailableH) {
        h = maxAvailableH;
        w = Math.round(h * ratio);
      }

      return {
        width: Math.max(Math.round(w), 280),
        height: Math.max(Math.round(h), 400),
        isMobile: true
      };
    } else {
      // Mode Desktop (Dua Halaman Terbuka Berdampingan)
      const maxAvailableW = Math.min((window.innerWidth - 80) / 2, 450);
      const maxAvailableH = window.innerHeight - 110;

      let w = maxAvailableW;
      let h = Math.round(w / ratio);

      if (h > maxAvailableH) {
        h = maxAvailableH;
        w = Math.round(h * ratio);
      }

      return {
        width: Math.max(Math.round(w), 360),
        height: Math.max(Math.round(h), 510),
        isMobile: false
      };
    }
  }

  // 5. Inisialisasi St.PageFlip
  const flipbookEl = document.getElementById('flipbook');
  let pageFlipInstance = null;

  function initFlipbook() {
    const dims = getPageDimensions();
    const targetStartPage = parseInt(urlParams.get('page') || '0', 10);

    pageFlipInstance = new St.PageFlip(flipbookEl, {
      width: dims.width,
      height: dims.height,
      size: 'fixed',
      minWidth: 260,
      maxWidth: 500,
      minHeight: 380,
      maxHeight: 750,
      maxShadowOpacity: 0.45,
      showCover: true,
      startPage: targetStartPage,
      mobileScrollSupport: false,
      usePortrait: dims.isMobile,
      flippingTime: 850,
      swipeDistance: 20,
      drawShadow: true
    });

    pageFlipInstance.loadFromHTML(document.querySelectorAll('.page'));

    const pageIndicator = document.getElementById('page-indicator');

    // Event Flip
    pageFlipInstance.on('flip', (e) => {
      playPageFlipSound();
      updatePageIndicator(e.data);
      if (!isMusicPlaying) startMusic();
    });

    pageFlipInstance.on('init', (e) => {
      updatePageIndicator(e.data.page);
    });

    function updatePageIndicator(pageIdx) {
      if (!pageIndicator) return;
      const totalPages = pageFlipInstance.getPageCount();
      const current = pageIdx + 1;
      pageIndicator.textContent = `${current} / ${totalPages}`;
    }

    // Tombol Navigasi
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');

    if (btnPrev) {
      btnPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        pageFlipInstance.flipPrev();
        if (!isMusicPlaying) startMusic();
      });
    }

    if (btnNext) {
      btnNext.addEventListener('click', (e) => {
        e.stopPropagation();
        pageFlipInstance.flipNext();
        if (!isMusicPlaying) startMusic();
      });
    }

    // Tombol Aksi di Cover Depan
    const btnOpenCover = document.getElementById('btn-open-from-cover');
    if (btnOpenCover) {
      btnOpenCover.addEventListener('click', (e) => {
        e.stopPropagation();
        startMusic();
        pageFlipInstance.flipNext();
      });
    }

    const coverHint = document.getElementById('cover-flip-trigger');
    if (coverHint) {
      coverHint.addEventListener('click', (e) => {
        e.stopPropagation();
        startMusic();
        pageFlipInstance.flipNext();
      });
    }
  }

  if (window.St && window.St.PageFlip) {
    initFlipbook();
  } else {
    window.addEventListener('load', initFlipbook);
  }

  // Handle Resize / Orientasi Berputar Layar HP (Hanya reload jika lebar berubah signifikan)
  let lastWindowWidth = window.innerWidth;
  let resizeTimeout = null;
  window.addEventListener('resize', () => {
    if (Math.abs(window.innerWidth - lastWindowWidth) < 40) return;
    lastWindowWidth = window.innerWidth;
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (pageFlipInstance) {
        const currentPage = pageFlipInstance.getCurrentPageIndex();
        window.location.search = `?page=${currentPage}&to=${encodeURIComponent(guestName)}`;
      }
    }, 400);
  });

  // 6. Countdown Timer
  function initCountdown() {
    const targetDate = new Date(WEDDING_CONFIG.events.countdownTarget).getTime();
    const daysEl = document.getElementById('cd-days');
    const hoursEl = document.getElementById('cd-hours');
    const minsEl = document.getElementById('cd-mins');
    const secsEl = document.getElementById('cd-secs');

    if (!daysEl) return;

    function updateTimer() {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        daysEl.textContent = "00";
        hoursEl.textContent = "00";
        minsEl.textContent = "00";
        secsEl.textContent = "00";
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      daysEl.textContent = String(days).padStart(2, '0');
      hoursEl.textContent = String(hours).padStart(2, '0');
      minsEl.textContent = String(minutes).padStart(2, '0');
      secsEl.textContent = String(seconds).padStart(2, '0');
    }

    updateTimer();
    setInterval(updateTimer, 1000);
  }
  initCountdown();

  // 7. Toast Notification Utility
  const toastEl = document.getElementById('toast');
  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('show');
    setTimeout(() => {
      toastEl.classList.remove('show');
    }, 2800);
  }

  // 8. Salin Nomor Rekening
  document.querySelectorAll('.btn-copy-account').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const accNumber = btn.getAttribute('data-account');
      if (navigator.clipboard) {
        navigator.clipboard.writeText(accNumber).then(() => {
          showToast(`Nomor rekening ${accNumber} disalin!`);
        });
      } else {
        const input = document.createElement('input');
        input.value = accNumber;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        showToast(`Nomor rekening ${accNumber} disalin!`);
      }
    });
  });

  // 9. Interactive RSVP & Ucapan (Local Storage)
  const rsvpForm = document.getElementById('rsvp-form');
  const wishesListEl = document.getElementById('wishes-list');

  const defaultWishes = [
    {
      name: "Bpk. Hendra & Keluarga",
      status: "attending",
      text: "Selamat untuk Raden & Arum! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah."
    },
    {
      name: "Dinda Salsabila",
      status: "attending",
      text: "Masya Allah cantiknya Arum! Selamat menempuh hidup baru kalian berdua, lancar sampai hari H!"
    },
    {
      name: "Dimas Prasetyo",
      status: "attending",
      text: "Selamat menempuh babak baru Mas Raden & Mbak Arum, langgeng sampai kakek nenek."
    }
  ];

  function loadWishes() {
    let saved = localStorage.getItem('wedding_wishes_raden_arum');
    let wishes = saved ? JSON.parse(saved) : defaultWishes;

    if (!wishesListEl) return;
    wishesListEl.innerHTML = '';
    wishes.forEach(item => {
      const wishDiv = document.createElement('div');
      wishDiv.className = 'wish-item';
      const badgeClass = item.status === 'attending' ? 'attending' : 'not-attending';
      const badgeText = item.status === 'attending' ? '✓ Hadir' : '✕ Tidak Hadir';

      wishDiv.innerHTML = `
        <div class="wish-author">
          <span>${escapeHtml(item.name)}</span>
          <span class="wish-badge ${badgeClass}">${badgeText}</span>
        </div>
        <div class="wish-text">${escapeHtml(item.text)}</div>
      `;
      wishesListEl.appendChild(wishDiv);
    });
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('rsvp-name').value.trim();
      const status = document.getElementById('rsvp-status').value;
      const text = document.getElementById('rsvp-message').value.trim();

      if (!name || !text) {
        showToast('Mohon isi nama dan ucapan Anda.');
        return;
      }

      let saved = localStorage.getItem('wedding_wishes_raden_arum');
      let wishes = saved ? JSON.parse(saved) : defaultWishes;

      wishes.unshift({ name, status, text });
      localStorage.setItem('wedding_wishes_raden_arum', JSON.stringify(wishes));

      loadWishes();
      rsvpForm.reset();
      showToast('Terima kasih atas doa & konfirmasi Anda! ✨');
    });
  }

  loadWishes();

  // 10. Table of Contents Modal
  const tocModal = document.getElementById('toc-modal');
  const btnToc = document.getElementById('btn-toc');
  const btnCloseToc = document.getElementById('btn-close-toc');

  if (btnToc && tocModal) {
    btnToc.addEventListener('click', (e) => {
      e.stopPropagation();
      tocModal.classList.add('open');
    });
  }

  if (btnCloseToc && tocModal) {
    btnCloseToc.addEventListener('click', (e) => {
      e.stopPropagation();
      tocModal.classList.remove('open');
    });
  }

  document.querySelectorAll('.toc-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetPage = parseInt(item.getAttribute('data-page'), 10);
      if (pageFlipInstance && !isNaN(targetPage)) {
        pageFlipInstance.flip(targetPage);
        if (!isMusicPlaying) startMusic();
      }
      if (tocModal) tocModal.classList.remove('open');
    });
  });

  // 11. Fullscreen Toggle
  const btnFullscreen = document.getElementById('btn-fullscreen');
  if (btnFullscreen) {
    btnFullscreen.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
          console.log('Fullscreen request error:', err);
        });
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    });
  }
});
