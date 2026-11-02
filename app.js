
const modalBackdrop = document.getElementById("modalBackdrop");
const commitmentTheme = document.getElementById("commitmentTheme");
const commitmentTitle = document.getElementById("commitmentTitle");
const formResult = document.getElementById("formResult");

function openModal(theme) {
  if (theme) {
    const selectedTheme = Array.from(commitmentTheme.options)
      .find(option => option.value === theme);

    if (selectedTheme) {
      commitmentTheme.value = selectedTheme.value;
    }
  }

  modalBackdrop.classList.add("open");
  modalBackdrop.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");

  formResult.textContent = "";

  setTimeout(() => commitmentTitle.focus(), 50);
}

function closeModal() {
  modalBackdrop.classList.remove("open");
  modalBackdrop.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
}

// Create commitment buttons
document.getElementById("createHeroBtn")
  .addEventListener("click", () => openModal());

document.getElementById("createBottomBtn")
  .addEventListener("click", () => openModal());

// Sign-in placeholder
document.getElementById("signInBtn")
  .addEventListener("click", () => {
    alert("Sign-in will be enabled after we connect Supabase authentication.");
  });

// Close popup
document.getElementById("modalClose")
  .addEventListener("click", closeModal);

modalBackdrop.addEventListener("click", event => {
  if (event.target === modalBackdrop) closeModal();
});

// Close popup using Escape
document.addEventListener("keydown", event => {
  if (event.key === "Escape" &&
      modalBackdrop.classList.contains("open")) {
    closeModal();
  }
});

// Commitment category cards
document.querySelectorAll(".theme-card").forEach(card => {
  card.addEventListener("click", () => {
    const theme = card.getAttribute("data-theme");
    openModal(theme);
  });
});

// Track dropdown selection
commitmentTheme.addEventListener("change", () => {
  formResult.textContent = "";
});

// Commitment form preview
document.getElementById("commitmentForm")
  .addEventListener("submit", event => {
    event.preventDefault();

    const title = commitmentTitle.value.trim();
    const theme = commitmentTheme.options[
      commitmentTheme.selectedIndex
    ].value;

    if (!title || !theme) return;

    formResult.textContent =
      `Your "${theme}" commitment draft is ready to continue. ` +
      "This is a front-end preview only; it has not been saved or shared.";
  });

// Mobile navigation
const menuToggle = document.getElementById("menuToggle");

menuToggle.addEventListener("click", () => {
  const nav = document.querySelector(".desktop-nav");
  const isOpen = nav.classList.toggle("show");

  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

// Close mobile navigation after selecting a link
document.querySelectorAll(".desktop-nav a").forEach(link => {
  link.addEventListener("click", () => {
    document.querySelector(".desktop-nav").classList.remove("show");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

// Automatic copyright year
document.getElementById("year").textContent =
  new Date().getFullYear();
