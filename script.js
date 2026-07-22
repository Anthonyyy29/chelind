document.addEventListener("DOMContentLoaded", () => {
  // 1. Highlight menu aktif
  const currentLocation = location.pathname.split("/").pop() || "index.html";
  const menuItems = document.querySelectorAll(".topnav a, .nav-links a");

  menuItems.forEach((item) => {
    if (item.getAttribute("href") === currentLocation) {
      item.classList.add("active");
    }
  });

  // 2. Animasi Klik Tombol (Ripple Effect + Notification)
  const likeButtons = document.querySelectorAll(
    ".btn-like, .topbar-cta, .cta-button",
  );

  likeButtons.forEach((button) => {
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

  // 3. Animasi Hover 3D Tilt
  const playerCards = document.querySelectorAll(
    ".player-card, .featured-card, .news-card",
  );

  playerCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform =
        "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    });
  });
});

function showCustomToast(message) {
  let toast = document.createElement("div");
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