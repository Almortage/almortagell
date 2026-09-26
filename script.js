const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const header = $("#siteHeader");
const menuToggle = $("#menuToggle");
const mainNav = $("#mainNav");
const progress = $("#scrollProgress");
const backTop = $("#backTop");

function updateScrollUI() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = max > 0 ? window.scrollY / max : 0;
  progress.style.width = `${Math.min(100, Math.max(0, ratio * 100))}%`;
  header.classList.toggle("scrolled", window.scrollY > 20);
  backTop.classList.toggle("show", window.scrollY > 500);
}
window.addEventListener("scroll", updateScrollUI, {passive:true});
updateScrollUI();

menuToggle.addEventListener("click", () => {
  const open = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});
$$(".main-nav a").forEach(link => link.addEventListener("click", () => {
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));
backTop.addEventListener("click", () => window.scrollTo({top:0, behavior:"smooth"}));

const revealItems = $$(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, {threshold:.12});
  revealItems.forEach(el => observer.observe(el));
} else {
  revealItems.forEach(el => el.classList.add("visible"));
}

// Project filters
const filterButtons = $$(".filter-btn");
const projectCards = $$(".project-card");
const emptyState = $("#emptyState");

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach(b => b.classList.toggle("active", b === button));

    let visibleCount = 0;
    projectCards.forEach(card => {
      const show = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("hidden", !show);
      if (show) visibleCount++;
    });
    emptyState.classList.toggle("show", visibleCount === 0);
  });
});

// Project modal
const modal = $("#projectModal");
const modalImage = $("#modalImage");
const modalTitle = $("#modalTitle");
const modalDescription = $("#modalDescription");
const modalCategory = $("#modalCategory");
const modalClose = $("#modalClose");

function categoryLabel(value) {
  const map = {
    branding: "هوية بصرية",
    university: "جامعي",
    scouts: "كشافة",
    advertising: "إعلاني"
  };
  return map[value] || "مشروع";
}

function openProject(card) {
  modalImage.src = card.dataset.image;
  modalImage.alt = card.dataset.title;
  modalTitle.textContent = card.dataset.title;
  modalDescription.textContent = card.dataset.description;
  modalCategory.textContent = categoryLabel(card.dataset.category);
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  modalClose.focus();
}

function closeProject() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  modalImage.src = "";
}

$$(".view-project").forEach(button => {
  button.addEventListener("click", () => openProject(button.closest(".project-card")));
});
modalClose.addEventListener("click", closeProject);
$$("[data-close-modal]").forEach(el => el.addEventListener("click", closeProject));
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && modal.classList.contains("open")) closeProject();
});

// Contact form
const contactForm = $("#contactForm");
const nameInput = $("#name");
const emailInput = $("#email");
const serviceInput = $("#service");
const messageInput = $("#message");
const submitBtn = $("#submitBtn");
const formStatus = $("#formStatus");

function setError(id, message) {
  const el = $(`#${id}Error`);
  if (el) el.textContent = message;
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

contactForm.addEventListener("submit", event => {
  event.preventDefault();

  setError("name", "");
  setError("email", "");
  setError("message", "");
  formStatus.className = "form-status";
  formStatus.textContent = "";

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const service = serviceInput.value.trim() || "غير محدد";
  const message = messageInput.value.trim();

  let valid = true;
  if (name.length < 2) {
    setError("name", "يرجى كتابة الاسم.");
    valid = false;
  }
  if (!validEmail(email)) {
    setError("email", "يرجى كتابة بريد إلكتروني صحيح.");
    valid = false;
  }
  if (message.length < 10) {
    setError("message", "اكتب تفاصيل أكثر عن المشروع.");
    valid = false;
  }

  if (!valid) {
    formStatus.className = "form-status show error";
    formStatus.textContent = "يرجى مراجعة البيانات المطلوبة.";
    return;
  }

  // غيّر البريد هنا إلى بريدك الحقيقي.
  const receiver = "your@email.com";
  const subject = `طلب مشروع جديد من ${name}`;
  const body =
`الاسم: ${name}
البريد الإلكتروني: ${email}
نوع المشروع: ${service}

تفاصيل المشروع:
${message}`;

  submitBtn.disabled = true;
  submitBtn.querySelector("span:first-child").textContent = "جاري تجهيز الرسالة...";

  window.location.href =
    `mailto:${receiver}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  window.setTimeout(() => {
    submitBtn.disabled = false;
    submitBtn.querySelector("span:first-child").textContent = "إرسال الرسالة";
    formStatus.className = "form-status show success";
    formStatus.textContent = "تم تجهيز الرسالة. إذا لم يفتح تطبيق البريد، راجع إعدادات البريد في جهازك.";
    contactForm.reset();
  }, 700);
});

// Placeholder social links: prevent navigation until real links are added.
$$("[data-placeholder-link]").forEach(link => {
  link.addEventListener("click", event => {
    event.preventDefault();
    alert("أضف رابط واتساب/إنستجرام الحقيقي في ملف index.html.");
  });
});

$("#year").textContent = new Date().getFullYear();
