const feedGrid = document.getElementById("feedGrid");
const companyFilter = document.getElementById("companyFilter");
const roleFilter = document.getElementById("roleFilter");
const applyFiltersBtn = document.getElementById("applyFiltersBtn");
const clearFiltersBtn = document.getElementById("clearFiltersBtn");
const emptyState = document.getElementById("emptyState");
const totalPosts = document.getElementById("totalPosts");
const experienceForm = document.getElementById("experienceForm");
const formMessage = document.getElementById("formMessage");
const scrollToFormBtn = document.getElementById("scrollToFormBtn");
const submissionSection = document.getElementById("submissionSection");

function getExperienceCards() {
  return Array.from(document.querySelectorAll(".experience-card"));
}

function updatePostCount() {
  const cards = getExperienceCards();
  totalPosts.textContent = cards.length;
}

function applyFilters() {
  const companyValue = companyFilter.value.toLowerCase().trim();
  const roleValue = roleFilter.value.toLowerCase().trim();

  const cards = getExperienceCards();
  let visibleCount = 0;

  cards.forEach((card) => {
    const company = (card.dataset.company || "").toLowerCase();
    const role = (card.dataset.role || "").toLowerCase();

    const matchesCompany = company.includes(companyValue);
    const matchesRole = role.includes(roleValue);

    if (matchesCompany && matchesRole) {
      card.style.display = "flex";
      visibleCount++;
    } else {
      card.style.display = "none";
    }
  });

  if (visibleCount === 0) {
    emptyState.classList.remove("hidden");
    feedGrid.classList.add("hidden");
  } else {
    emptyState.classList.add("hidden");
    feedGrid.classList.remove("hidden");
  }
}

applyFiltersBtn.addEventListener("click", applyFilters);

clearFiltersBtn.addEventListener("click", () => {
  companyFilter.value = "";
  roleFilter.value = "";

  const cards = getExperienceCards();
  cards.forEach((card) => {
    card.style.display = "flex";
  });

  emptyState.classList.add("hidden");
  feedGrid.classList.remove("hidden");
});

experienceForm.addEventListener("submit", () => {
  formMessage.textContent = "Submitting experience...";
  formMessage.style.color = "#0f6a4f";
});

scrollToFormBtn.addEventListener("click", () => {
  submissionSection.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});

updatePostCount();