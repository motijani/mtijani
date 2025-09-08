document.addEventListener("DOMContentLoaded", () => {
  tsParticles.load("tsparticles", {
    particles: {
      number: { value: 30, density: { enable: true, value_area: 800 } },
      color: { value: "#00ffff" },
      shape: { type: "circle" },
      opacity: {
        value: 0.4,
        random: true,
        anim: { enable: true, speed: 0.5, opacity_min: 0.1, sync: false },
      },
      size: { value: 2.5, random: true, anim: { enable: false } },
      move: {
        enable: true,
        speed: 1.2,
        direction: "none",
        random: true,
        straight: false,
        outMode: "bounce",
        bounce: true,
        attract: { enable: false },
      },
      collisions: { enable: true },
    },
    interactivity: {
      detectsOn: "canvas",
      events: {
        onhover: { enable: true, mode: "grab" },
        onclick: { enable: true, mode: "push" },
        resize: true,
      },
      modes: {
        grab: { distance: 150, line_linked: { opacity: 0.7 } },
        push: { particles_nb: 3 },
      },
    },
    retina_detect: true,
  });

  // Project Slider Functionality
  const slider = document.querySelector(".project-slider");
  const items = document.querySelectorAll(".project-item");
  const dotsContainer = document.querySelector(".project-dots");
  const prevBtn = document.getElementById("prevProject");
  const nextBtn = document.getElementById("nextProject");
  let currentIndex = 0;
  const totalProjects = items.length;

  // Dynamically create navigation dots
  function createNavigationDots() {
    if (!dotsContainer) return;

    dotsContainer.innerHTML = "";
    for (let i = 0; i < totalProjects; i++) {
      const dot = document.createElement("span");
      dot.className = `project-dot ${i === 0 ? "active" : ""}`;
      dot.setAttribute("data-index", i);
      dot.setAttribute("aria-label", `Go to Project ${i + 1}`);
      dot.addEventListener("click", () => goToProject(i));
      dotsContainer.appendChild(dot);
    }
  }

  if (slider && items.length > 0 && dotsContainer && prevBtn && nextBtn) {
    createNavigationDots();

    function updateSliderUI(index) {
      const dots = document.querySelectorAll(".project-dot");
      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === index);
      });
      prevBtn.disabled = index === 0;
      nextBtn.disabled = index === totalProjects - 1;
    }

    function goToProject(index) {
      index = Math.max(0, Math.min(index, totalProjects - 1));
      slider.scrollTo({
        left: items[index].offsetLeft - slider.offsetLeft,
        behavior: "smooth",
      });
      currentIndex = index;
      updateSliderUI(currentIndex);
    }

    updateSliderUI(currentIndex);

    nextBtn.addEventListener("click", () => {
      goToProject(currentIndex + 1);
    });

    prevBtn.addEventListener("click", () => {
      goToProject(currentIndex - 1);
    });

    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        goToProject(currentIndex);
      }, 250);
    });
  } else {
    console.error("Project slider elements not found or incomplete.");
  }

  const navLinks = document.querySelectorAll("nav a");
  const sections = [...document.querySelectorAll("section")];

  const getGithubData = async () => {
    const apiUrl = "https://api.github.com/users/motijani";

    try {
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const userData = await response.json();
      return userData;
    } catch (error) {
      console.error("Error fetching GitHub data:", error);
      throw error;
    }
  };

  const getBio = async () => {
    try {
      const userData = await getGithubData();
      return [userData.bio, userData.avatar_url];
    } catch (error) {
      console.error("Error getting bio:", error);
      return "Unable to load bio from GitHub";
    }
  };

  const displayBio = async () => {
    const bioElement = document.querySelector(".github-profile");
    if (bioElement) {
      bioElement.innerHTML = '<p class="loading">Loading bio...</p>';
      try {
        const bioData = await getBio();
        const bioSummary = bioData[0];
        const pfpLink = bioData[1];

        if (bioSummary && pfpLink) {
          bioElement.innerHTML = `
            <div class="github-bio-container">
              <div class="github-bio-content">
                <h3>Github</h3>
                <p class="bio-text">${bioSummary}</p>
                <a href="https://github.com/motijani" target="_blank" rel="noopener noreferrer" class="github-link">
                  View GitHub Profile
                </a>
              </div>
              <img src="${pfpLink}" alt="github pfp" class="github-avatar">
            </div>
          `;
        } else {
          bioElement.innerHTML = '<p class="no-bio">No bio available</p>';
        }
      } catch (error) {
        bioElement.innerHTML =
          '<p class="error">Unable to load bio from GitHub</p>';
      }
    }
  };

  function updateNavHighlight() {
    let currentSectionId = "";
    const scrollPosition = window.scrollY;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 80;
      const sectionHeight = section.offsetHeight;

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        currentSectionId = section.getAttribute("id");
      }
    });

    navLinks.forEach((navLink) => {
      const isActive = navLink.getAttribute("href") === `#${currentSectionId}`;
      navLink.classList.toggle("active", isActive);
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        const navHeight = document.querySelector("nav").offsetHeight;
        const targetPosition = targetElement.offsetTop - navHeight + 1;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  updateNavHighlight();
  window.addEventListener("scroll", updateNavHighlight);

  displayBio();
});
