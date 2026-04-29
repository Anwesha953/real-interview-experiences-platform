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
const modeToggle = document.getElementById("modeToggle");

function getExperienceCards() {
  return Array.from(document.querySelectorAll(".experience-card"));
}

function updatePostCount() {
  const cards = getExperienceCards();
  totalPosts.textContent = cards.length;
}

function populateDropdowns() {
  const cards = getExperienceCards();

  const companies = [...new Set(cards.map(card => card.dataset.company).filter(Boolean))].sort();
  const roles = [...new Set(cards.map(card => card.dataset.role).filter(Boolean))].sort();

  companyFilter.innerHTML = `<option value="all">All Companies</option>`;
  roleFilter.innerHTML = `<option value="all">All Roles</option>`;

  companies.forEach(company => {
    const option = document.createElement("option");
    option.value = company.toLowerCase();
    option.textContent = company;
    companyFilter.appendChild(option);
  });

  roles.forEach(role => {
    const option = document.createElement("option");
    option.value = role.toLowerCase();
    option.textContent = role;
    roleFilter.appendChild(option);
  });
}

function applyFilters() {
  const companyValue = companyFilter.value.toLowerCase().trim();
  const roleValue = roleFilter.value.toLowerCase().trim();

  const cards = getExperienceCards();
  let visibleCount = 0;

  cards.forEach((card) => {
    const company = (card.dataset.company || "").toLowerCase();
    const role = (card.dataset.role || "").toLowerCase();

    const matchesCompany = companyValue === "all" || company === companyValue;
    const matchesRole = roleValue === "all" || role === roleValue;

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
  companyFilter.value = "all";
  roleFilter.value = "all";

  const cards = getExperienceCards();
  cards.forEach((card) => {
    card.style.display = "flex";
  });

  emptyState.classList.add("hidden");
  feedGrid.classList.remove("hidden");
});

experienceForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const company = document.getElementById("companyName").value.trim();
  const role = document.getElementById("roleName").value.trim();
  const question1 = document.getElementById("questionText").value.trim();
  const answer = document.getElementById("answerText").value.trim();
  const reaction = document.getElementById("reactionText").value.trim();

  if (!company || !role || !question1) {
    formMessage.textContent = "Please fill all required fields marked with *.";
    formMessage.style.color = "red";
    return;
  }

  formMessage.textContent = "Submitting experience...";
  formMessage.style.color = "#0f6a4f";

  try {
    const response = await fetch("https://Anwesha2005.pythonanywhere.com/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        company,
        role,
        question1,
        answer,
        reaction
      })
    });

    const result = await response.json();

    if (response.ok) {
      formMessage.textContent = "Post added successfully!";
      formMessage.style.color = "#0f6a4f";
      experienceForm.reset();
      loadPosts(); // 🔥 this refreshes UI instantly
    } else {
      formMessage.textContent = "Failed to submit.";
      formMessage.style.color = "red";
    }
  } catch (error) {
    formMessage.textContent = "Backend connection failed.";
    formMessage.style.color = "red";
  }
});

scrollToFormBtn.addEventListener("click", () => {
  submissionSection.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});

function applySavedTheme() {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    modeToggle.textContent = "☀️ Light";
  } else {
    document.body.classList.remove("dark-mode");
    modeToggle.textContent = "🌙 Dark";
  }
}

modeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark");
    modeToggle.textContent = "☀️ Light";
  } else {
    localStorage.setItem("theme", "light");
    modeToggle.textContent = "🌙 Dark";
  }
});



async function loadPosts() {
  try {
    const response = await fetch("https://Anwesha2005.pythonanywhere.com/posts");
    const posts = await response.json();

    feedGrid.innerHTML = ""; // clear existing cards

    posts.forEach((post) => {
      const card = document.createElement("div");
      card.className = "experience-card";
      card.dataset.company = post.company;
      card.dataset.role = post.role;

      card.innerHTML = `
        <div class="card-top">
          <div class="company-logo text-logo">${post.company}</div>
          <div class="card-title">
            <h3>${post.company}</h3>
            <span>${post.role}</span>
          </div>
          <div class="card-time">${isRecent(post.created_at) ? "recent" : ""}</div>
        </div>

        <div class="card-section">
          <h4>Interview Question</h4>
          <p>${post.question1}</p>
        </div>

        <div class="card-section">
          <h4>Your Answer</h4>
          <p>${post.answer || "—"}</p>
        </div>

        <div class="card-section">
          <h4>Interviewer Reaction</h4>
          <p>${post.reaction || "—"}</p>
        </div>

        <div class="card-footer">
          <span>Posted anonymously</span>
        </div>
      `;

      feedGrid.appendChild(card);
    });

    populateDropdowns();
    updatePostCount();

  } catch (err) {
    console.error("Failed to load posts", err);
  }
}

function isRecent(createdAt) {
  if (!createdAt) return false;

  const postDate = new Date(createdAt);
  const now = new Date();

  const diffMs = now - postDate;
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  return diffDays <= 7;
}

loadPosts();
applySavedTheme();

async function loadPostCount() {
  try {
    const response = await fetch("https://Anwesha2005.pythonanywhere.com/count");
    const data = await response.json();
    totalPosts.textContent = data.count;
  } catch (error) {
    console.error("Could not load post count", error);
  }
}

loadPostCount();