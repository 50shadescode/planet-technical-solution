// ================= NAV / HAMBURGER =================
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");
const navAnchors = document.querySelectorAll(".nav-link");
const navbar = document.querySelector(".navbar");

// toggle menu
hamburger.addEventListener("click", () => {
  const isOpen = hamburger.classList.toggle("active");
  navLinks.classList.toggle("open");
  hamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");
});

// close menu when clicking a link (mobile)
navAnchors.forEach(a => {
  a.addEventListener("click", () => {
    navLinks.classList.remove("open");
    hamburger.classList.remove("active");
    hamburger.setAttribute("aria-expanded", "false");
  });
});

// close menu when clicking outside (mobile)
document.addEventListener("click", (e) => {
  const clickedInsideNav = navLinks.contains(e.target);
  const clickedHamburger = hamburger.contains(e.target);

  if (!clickedInsideNav && !clickedHamburger) {
    navLinks.classList.remove("open");
    hamburger.classList.remove("active");
    hamburger.setAttribute("aria-expanded", "false");
  }
});

// smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    const id = this.getAttribute("href");
    if (!id || id === "#") return;

    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// active link on scroll (navbar-height aware)
const sections = document.querySelectorAll("section[id]");

function setActiveLink() {
  const offset = navbar?.offsetHeight ?? 80;
  const scrollPos = window.scrollY + offset + 20;

  let currentId = "home"; // default

  sections.forEach(sec => {
    const top = sec.offsetTop;
    const bottom = top + sec.offsetHeight;
    if (scrollPos >= top && scrollPos < bottom) {
      currentId = sec.id;
    }
  });

  navAnchors.forEach(l => l.classList.remove("active"));
  const activeLink = document.querySelector(`.nav-link[href="#${currentId}"]`);
  if (activeLink) activeLink.classList.add("active");
}

window.addEventListener("scroll", setActiveLink);
window.addEventListener("resize", setActiveLink);
setActiveLink();


// ================= THEME TOGGLE (Light/Dark) =================
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const themeText = document.getElementById("themeText");
const rootEl = document.documentElement;

function applyTheme(theme){
  if(theme === "dark"){
    rootEl.setAttribute("data-theme", "dark");
    if(themeIcon) themeIcon.textContent = "☀️";
    if(themeText) themeText.textContent = "Light";
  } else {
    rootEl.removeAttribute("data-theme");
    if(themeIcon) themeIcon.textContent = "🌙";
    if(themeText) themeText.textContent = "Dark";
  }
}

// init theme: saved > system preference
const storedTheme = localStorage.getItem("theme");
if(storedTheme){
  applyTheme(storedTheme);
} else {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(prefersDark ? "dark" : "light");
}

if(themeToggle){
  themeToggle.addEventListener("click", () => {
    const isDark = rootEl.getAttribute("data-theme") === "dark";
    const nextTheme = isDark ? "light" : "dark";
    applyTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
  });
}


// ================= RFQ EMAIL HANDLER =================
const rfqForm = document.getElementById("rfqForm");
const recipientEmail = "info@planet.co.ke";

if(rfqForm){
  rfqForm.addEventListener("submit", function(e){
    e.preventDefault();

    const data = new FormData(rfqForm);
    const fullName = data.get("fullName");
    const organization = data.get("organization") || "N/A";
    const email = data.get("email");
    const phone = data.get("phone");
    const serviceType = data.get("serviceType");
    const projectLocation = data.get("projectLocation");
    const budget = data.get("budget") || "N/A";
    const timeline = data.get("timeline") || "N/A";
    const message = data.get("message");

    const subject = `RFQ Request - ${serviceType} (${fullName})`;

    const body =
`Hello Planet Technical Solutions,

I would like to request a quote for the following project:

Full Name: ${fullName}
Organization: ${organization}
Email: ${email}
Phone: ${phone}
Service Type: ${serviceType}
Project Location: ${projectLocation}
Estimated Budget: ${budget}
Expected Timeline: ${timeline}

Project Details:
${message}

Regards,
${fullName}`;

    const mailtoLink =
      `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    alert("Your email app will open with the RFQ details. Please review and send.");
    window.location.href = mailtoLink;
  });
}
