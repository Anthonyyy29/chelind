// ==========================================================================
// CHELINDO — script.js (shared across index.html, news.html, matches.html)
// Navbar scroll state, mobile nav, active-menu highlight, scroll-reveal,
// live fixture countdown, ripple / tilt / toast micro-interactions,
// AND Laravel API Integration (/api/social-links, /api/matches, /api/articles).
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  initYear();
  initNavbarScroll();
  initMobileNav();
  initActiveMenu();
  initScrollReveal();
  initCountdown();
  initRippleButtons();
  initTiltCards();
  initApiData();
});

/* Footer year */
function initYear() {
  const el = document.getElementById("year");
  if (el) el.textContent = new Date().getFullYear();
}

/* Sticky navbar gains a shadow once the page scrolls */
function initNavbarScroll() {
  const topbar = document.getElementById("topbar");
  if (!topbar) return;
  const onScroll = () =>
    topbar.classList.toggle("is-scrolled", window.scrollY > 12);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* Hamburger menu for small screens */
function initMobileNav() {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("topnav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.classList.toggle("is-active", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.classList.remove("is-active");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* Highlight the nav link matching the current page */
function initActiveMenu() {
  const currentLocation = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".topnav a, .nav-links a").forEach((item) => {
    if (item.getAttribute("href") === currentLocation) {
      item.classList.add("active");
    }
  });
}

/* Fade-up reveal for sections as they enter the viewport */
function initScrollReveal() {
  const items = document.querySelectorAll(".reveal-on-scroll");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
  );

  items.forEach((el) => observer.observe(el));
}

/* Live countdown to the next fixture's kickoff (scoreboard) */
function initCountdown() {
  const fixture = document.getElementById("nextFixture");
  const daysEl = document.getElementById("cdDays");
  const hoursEl = document.getElementById("cdHours");
  const minutesEl = document.getElementById("cdMinutes");
  const secondsEl = document.getElementById("cdSeconds");
  if (!fixture || !daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  const kickoff = new Date(fixture.dataset.kickoff);
  if (Number.isNaN(kickoff.getTime())) return;

  const pad = (n) => String(Math.max(0, n)).padStart(2, "0");

  const tick = () => {
    const diff = kickoff.getTime() - Date.now();
    if (diff <= 0) {
      daysEl.textContent =
        hoursEl.textContent =
        minutesEl.textContent =
        secondsEl.textContent =
          "00";
      clearInterval(timer);
      return;
    }
    const totalSeconds = Math.floor(diff / 1000);
    daysEl.textContent = pad(Math.floor(totalSeconds / 86400));
    hoursEl.textContent = pad(Math.floor((totalSeconds % 86400) / 3600));
    minutesEl.textContent = pad(Math.floor((totalSeconds % 3600) / 60));
    secondsEl.textContent = pad(totalSeconds % 60);
  };

  tick();
  const timer = setInterval(tick, 1000);
}

/* Ripple effect on primary buttons */
function initRippleButtons() {
  const buttons = document.querySelectorAll(
    ".btn-like, .topbar-cta, .btn-primary, .btn-outline, .cta-button",
  );

  buttons.forEach((button) => {
    button.addEventListener("click", function (e) {
      const circle = document.createElement("span");
      const diameter = Math.max(this.clientWidth, this.clientHeight);
      const radius = diameter / 2;
      const rect = this.getBoundingClientRect();

      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - radius}px`;
      circle.style.top = `${e.clientY - rect.top - radius}px`;
      circle.classList.add("ripple-effect");

      const existingRipple = this.querySelector(".ripple-effect");
      if (existingRipple) existingRipple.remove();
      this.appendChild(circle);

      const playerName = this.getAttribute("data-player");
      if (playerName) {
        showCustomToast(`Anda menyukai ${playerName}! KTBFFH! 💙`);
        createFloatingHearts(e.clientX, e.clientY);
      }
    });
  });
}

/* Subtle 3D tilt on hover for image-style cards */
function initTiltCards() {
  const cards = document.querySelectorAll(
    ".player-card, .featured-card, .news-card, .social-card, .media-plate, .news-card-pdf, .social-card-pdf",
  );

  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform =
        "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    });
  });
}

function showCustomToast(message) {
  const toast = document.createElement("div");
  toast.className = "custom-toast";
  toast.innerText = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 100);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

function createFloatingHearts(x, y) {
  for (let i = 0; i < 6; i++) {
    const heart = document.createElement("div");
    heart.className = "floating-heart";
    heart.innerHTML = "💙";
    heart.style.left = `${x + (Math.random() * 40 - 20)}px`;
    heart.style.top = `${y + (Math.random() * 40 - 20)}px`;
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1000);
  }
}

// ==========================================================================
// LARAVEL API INTEGRATION (API.md Contract)
// ==========================================================================

function initApiData() {
  loadSocialLinks();
  loadMatches();
  loadLatestArticles();
}

async function fetchApi(endpoint) {
  try {
    const res = await fetch(`/api/${endpoint}`, {
      headers: {
        "Accept": "application/json"
      }
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.log(`[Chelind API] Offline or endpoint /api/${endpoint} unreachable, using fallback static HTML.`);
    return null;
  }
}

async function loadSocialLinks() {
  const container = document.querySelector(".social-grid-pdf");
  if (!container) return;

  const json = await fetchApi("social-links");
  if (json && json.data && Array.isArray(json.data) && json.data.length > 0) {
    container.innerHTML = json.data.map((item) => `
      <a class="social-card-pdf reveal-on-scroll is-visible" href="${item.url}" target="_blank" rel="noopener">
        <div class="social-icon-pdf">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm-1-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm4 7h-2v-3c0-.55-.45-1-1-1s-1 .45-1 1v3h-2v-6h2v1.1c.37-.63 1.05-1.1 1.8-1.1 1.22 0 2.2 1.08 2.2 2.4V17z"/></svg>
        </div>
        <h3>${item.platform ? item.platform.toUpperCase() : ''} ${item.handle || ''}</h3>
        <p>${item.description || 'Kunjungi akun resmi kami untuk update terbaru.'}</p>
      </a>
    `).join('');
  }
}

async function loadMatches() {
  const listContainer = document.querySelector(".matches-list-pdf");
  if (!listContainer) return;

  const json = await fetchApi("matches?limit=4");
  if (json && json.data && Array.isArray(json.data) && json.data.length > 0) {
    listContainer.innerHTML = json.data.map((match) => {
      const kickoffDate = new Date(match.kickoff || match.kickoff_at || Date.now());
      const dayStr = kickoffDate.toLocaleDateString("id-ID", { weekday: "short" }).toUpperCase();
      const numStr = kickoffDate.getDate().toString().padStart(2, "0");
      const monthStr = kickoffDate.toLocaleDateString("id-ID", { month: "short" }).toUpperCase();
      const timeStr = kickoffDate.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB";

      return `
        <div class="match-card-pdf reveal-on-scroll is-visible">
          <div class="match-date-badge">
            <span class="day">${dayStr}</span>
            <span class="num">${numStr}</span>
            <span class="month">${monthStr}</span>
          </div>
          <div class="match-info-pdf">
            <span class="competition-tag">${(match.competition || match.league || 'PREMIER LEAGUE').toUpperCase()}</span>
            <h3>${match.home_team || match.homeTeam || 'Chelsea'} vs ${match.away_team || match.awayTeam || 'Opponent'}</h3>
            <p>${timeStr} • ${match.venue || match.location || 'Stamford Bridge'}</p>
          </div>
          <a href="matches.html" class="match-link-pdf">Lihat Detail &rarr;</a>
        </div>
      `;
    }).join('');
  }
}

async function loadLatestArticles() {
  const newsContainer = document.querySelector(".news-grid-pdf");
  if (!newsContainer) return;

  const json = await fetchApi("articles?limit=3");
  if (json && json.data && Array.isArray(json.data) && json.data.length > 0) {
    newsContainer.innerHTML = json.data.map((article) => `
      <article class="news-card-pdf reveal-on-scroll is-visible">
        <div class="news-thumb-pdf">
          <img src="${article.cover_image || 'assets/news/featured.jpg'}" alt="${article.title}" />
        </div>
        <div class="news-body-pdf">
          <span class="news-cat-pdf">${(article.category ? article.category.name : 'BERITA').toUpperCase()}</span>
          <h3>${article.title}</h3>
          <p>${article.excerpt || (article.body ? article.body.substring(0, 90) + '...' : '')}</p>
        </div>
      </article>
    `).join('');
  }
}
