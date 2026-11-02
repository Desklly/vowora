
/* ==========================================
   VOWORA — SUPABASE CONNECTION
========================================== */

const SUPABASE_URL = "https://xpaequtjsbcbyfhbbtdv.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_6jmbzIEzzNha4_EhdZN7DA_hOu7c9uZ";

if (!window.supabase) {
  alert("Vowora could not load Supabase. Please refresh the page.");
  throw new Error("Supabase library not loaded.");
}

const db = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

/* ==========================================
   EXISTING COMMITMENT ELEMENTS
========================================== */

const modalBackdrop = document.getElementById("modalBackdrop");
const commitmentTheme = document.getElementById("commitmentTheme");
const commitmentTitle = document.getElementById("commitmentTitle");
const formResult = document.getElementById("formResult");

function openModal(theme) {
  if (theme) {
    const option = Array.from(commitmentTheme.options)
      .find(item => item.value === theme);

    if (option) commitmentTheme.value = option.value;
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

document.getElementById("createHeroBtn")
  .addEventListener("click", () => openModal());

document.getElementById("createBottomBtn")
  .addEventListener("click", () => openModal());

document.getElementById("modalClose")
  .addEventListener("click", closeModal);

modalBackdrop.addEventListener("click", event => {
  if (event.target === modalBackdrop) closeModal();
});

/* ==========================================
   AUTHENTICATION WINDOW
========================================== */

const authStyles = document.createElement("style");

authStyles.textContent = `
.vow-auth-backdrop {
  position: fixed;
  inset: 0;
  z-index: 99999;
  display: none;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(5, 10, 22, .82);
  backdrop-filter: blur(8px);
}
.vow-auth-backdrop.open { display: flex; }
.vow-auth-box {
  width: 100%;
  max-width: 440px;
  padding: 34px;
  position: relative;
  background: #10182b;
  color: #fff;
  border: 1px solid rgba(217,171,76,.5);
  border-radius: 16px;
  box-shadow: 0 24px 80px rgba(0,0,0,.4);
}
.vow-auth-box h2 {
  font-family: 'Playfair Display', serif;
  margin: 12px 0;
}
.vow-auth-box p { color: #c3c8d2; line-height: 1.6; }
.vow-auth-box label {
  display: block;
  margin: 15px 0 7px;
  color: #e9d5a5;
}
.vow-auth-box input {
  width: 100%;
  box-sizing: border-box;
  padding: 13px;
  border: 1px solid #48516a;
  border-radius: 7px;
  background: #18233a;
  color: white;
  font: inherit;
}
.vow-auth-box button { cursor: pointer; }
.vow-auth-submit {
  width: 100%;
  margin-top: 22px;
  padding: 14px;
  border: 0;
  border-radius: 7px;
  background: #d9ab4c;
  color: #10182b;
  font-weight: 700;
}
.vow-auth-switch {
  background: none;
  border: 0;
  color: #e7bd68;
  margin-top: 18px;
  text-decoration: underline;
}
.vow-auth-close {
  position: absolute;
  top: 12px;
  right: 16px;
  background: none;
  border: 0;
  color: white;
  font-size: 27px;
}
.vow-auth-message {
  margin-top: 15px;
  font-size: 14px;
  overflow-wrap: anywhere;
}
`;

document.head.appendChild(authStyles);

const authBackdrop = document.createElement("div");

authBackdrop.className = "vow-auth-backdrop";

authBackdrop.innerHTML = `
  <section class="vow-auth-box" role="dialog"
    aria-modal="true" aria-labelledby="vowAuthTitle">

    <button class="vow-auth-close" type="button"
      aria-label="Close">×</button>

    <div style="color:#d9ab4c;letter-spacing:3px;font-size:12px">
      VOWORA / YOUR ACCOUNT
    </div>

    <h2 id="vowAuthTitle">Welcome to Vowora</h2>

    <p id="vowAuthDescription">
      Sign in to access your commitments.
    </p>

    <form id="vowAuthForm">
      <div id="vowNameField" style="display:none">
        <label for="vowName">Your name</label>
        <input id="vowName" type="text"
          maxlength="80" autocomplete="name">
      </div>

      <label for="vowEmail">Email address</label>
      <input id="vowEmail" type="email"
        required autocomplete="email">

      <label for="vowPassword">Password</label>
      <input id="vowPassword" type="password"
        required minlength="8" autocomplete="current-password">

      <button class="vow-auth-submit" id="vowAuthSubmit"
        type="submit">Sign in</button>
    </form>

    <button class="vow-auth-switch" id="vowAuthSwitch"
      type="button">Create a new account</button>

    <div class="vow-auth-message" id="vowAuthMessage"
      role="status" aria-live="polite"></div>
  </section>
`;

document.body.appendChild(authBackdrop);

const authForm = document.getElementById("vowAuthForm");
const authMessage = document.getElementById("vowAuthMessage");
const authSubmit = document.getElementById("vowAuthSubmit");
const authSwitch = document.getElementById("vowAuthSwitch");
const authNameField = document.getElementById("vowNameField");
const authTitle = document.getElementById("vowAuthTitle");
const authDescription = document.getElementById("vowAuthDescription");

let authMode = "login";
let currentSession = null;

function showAuthMessage(message, isError = false) {
  authMessage.textContent = message;
  authMessage.style.color = isError ? "#ff9999" : "#e7bd68";
}

function openAuth() {
  authBackdrop.classList.add("open");
  authMessage.textContent = "";
  authForm.reset();
}

function closeAuth() {
  authBackdrop.classList.remove("open");
}

function setAuthMode(mode) {
  authMode = mode;

  const registering = mode === "register";

  authTitle.textContent = registering
    ? "Create your Vowora account"
    : "Welcome back";

  authDescription.textContent = registering
    ? "Create an account to begin your commitments."
    : "Sign in to access your commitments.";

  authNameField.style.display = registering ? "block" : "none";

  document.getElementById("vowPassword").autocomplete =
    registering ? "new-password" : "current-password";

  authSubmit.textContent = registering
    ? "Create account"
    : "Sign in";

  authSwitch.textContent = registering
    ? "Already have an account? Sign in"
    : "Create a new account";

  authMessage.textContent = "";
}

authSwitch.addEventListener("click", () => {
  setAuthMode(authMode === "login" ? "register" : "login");
});

authBackdrop.querySelector(".vow-auth-close")
  .addEventListener("click", closeAuth);

authBackdrop.addEventListener("click", event => {
  if (event.target === authBackdrop) closeAuth();
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeAuth();
    closeModal();
  }
});

/* ==========================================
   PROFILE CREATION AFTER LOGIN
========================================== */

async function ensureProfile(user) {
  const displayName =
    user.user_metadata?.display_name ||
    user.email?.split("@")[0] ||
    "Vowora User";

  const { error } = await db
    .from("profiles")
    .upsert(
      {
        id: user.id,
        display_name: displayName,
        updated_at: new Date().toISOString()
      },
      { onConflict: "id" }
    );

  if (error) {
    console.error("Profile setup:", error.message);
  }
}

/* ==========================================
   REGISTER AND SIGN IN
========================================== */

authForm.addEventListener("submit", async event => {
  event.preventDefault();

  const email = document.getElementById("vowEmail")
    .value.trim();

  const password = document.getElementById("vowPassword")
    .value;

  const displayName = document.getElementById("vowName")
    .value.trim();

  authSubmit.disabled = true;
  authSubmit.textContent = "Please wait...";
  showAuthMessage("");

  try {
    if (authMode === "register") {
      if (!displayName) {
        throw new Error("Please enter your name.");
      }

      const { data, error } = await db.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: displayName },
          emailRedirectTo: window.location.origin
        }
      });

      if (error) throw error;

      if (data.session) {
        await ensureProfile(data.user);
        showAuthMessage("Your account is ready. Welcome to Vowora!");
        setTimeout(closeAuth, 1500);
      } else {
        showAuthMessage(
          "Registration received! Please check your email and click the verification link before signing in."
        );
      }

    } else {
      const { data, error } = await db.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      await ensureProfile(data.user);

      showAuthMessage("Signed in successfully!");

      setTimeout(closeAuth, 1000);
    }

  } catch (error) {
    showAuthMessage(error.message || "Something went wrong.", true);
  } finally {
    authSubmit.disabled = false;
    authSubmit.textContent =
      authMode === "register" ? "Create account" : "Sign in";
  }
});

/* ==========================================
   SIGN IN / SIGN OUT BUTTON
========================================== */

const signInBtn = document.getElementById("signInBtn");

function updateAccountButton(session) {
  currentSession = session;

  if (session?.user) {
    signInBtn.textContent = "Sign out";
    signInBtn.setAttribute("aria-label", "Sign out");
  } else {
    signInBtn.textContent = "Sign in";
    signInBtn.setAttribute("aria-label", "Sign in");
  }
}

signInBtn.addEventListener("click", async () => {
  if (currentSession?.user) {
    const { error } = await db.auth.signOut();

    if (error) {
      alert(error.message);
    } else {
      alert("You have signed out of Vowora.");
    }
  } else {
    setAuthMode("login");
    openAuth();
  }
});

db.auth.onAuthStateChange((event, session) => {
  updateAccountButton(session);
});

/* Check existing session */
async function restoreSession() {
  const { data, error } = await db.auth.getSession();

  if (error) {
    console.error("Session check:", error.message);
    return;
  }

  updateAccountButton(data.session);

  if (data.session?.user) {
    await ensureProfile(data.session.user);
  }
}

restoreSession();

/* ==========================================
   COMMITMENT PREVIEW
========================================== */

document.getElementById("commitmentForm")
  .addEventListener("submit", event => {
    event.preventDefault();

    const title = commitmentTitle.value.trim();
    const theme = commitmentTheme.value;

    if (!title || !theme) return;

    formResult.textContent =
      `Your "${theme}" commitment draft is ready to continue. ` +
      "This is a front-end preview only; it has not been saved or shared.";
  });

commitmentTheme.addEventListener("change", () => {
  formResult.textContent = "";
});

/* ==========================================
   MOBILE NAVIGATION
========================================== */

const menuToggle = document.getElementById("menuToggle");

menuToggle.addEventListener("click", () => {
  const nav = document.querySelector(".desktop-nav");
  const isOpen = nav.classList.toggle("show");

  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".desktop-nav a").forEach(link => {
  link.addEventListener("click", () => {
    document.querySelector(".desktop-nav").classList.remove("show");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

/* ==========================================
   COPYRIGHT
========================================== */

document.getElementById("year").textContent =
  new Date().getFullYear();
