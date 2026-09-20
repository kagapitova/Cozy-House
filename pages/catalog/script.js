import { pets } from "../home/pets.js";

window.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamb__field");
  const popup = document.querySelector(".popup");
  const navItems = document.querySelector(".nav__items");
  const blackout = document.querySelector(".blackout");

  const mobileNav = navItems.cloneNode(true);

  function openMenu() {
    popup.classList.add("open");
    hamburger.classList.add("active");
    blackout.classList.add("active");
    document.body.classList.add("noscroll");

    popup.appendChild(mobileNav);
  }

  function closeMenu() {
    popup.classList.remove("open");
    hamburger.classList.remove("active");
    blackout.classList.remove("active");
    document.body.classList.remove("noscroll");
  }

  hamburger.addEventListener("click", () => {
    if (popup.classList.contains("open")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  blackout.addEventListener("click", closeMenu);

  mobileNav.addEventListener("click", (event) => {
    if (event.target.classList.contains("nav__link")) {
      closeMenu();
    }
  });
  const THEME_KEY = "cozy-house-theme";
  const themeToggles = document.querySelectorAll(".theme-toggle");

  function applyTheme(theme) {
    const isPink = theme === "pink";

    document.documentElement.classList.toggle("pink-theme", isPink);

    themeToggles.forEach((toggle) => {
      toggle.setAttribute("aria-pressed", String(isPink));

      toggle.setAttribute(
        "aria-label",
        isPink
          ? "Switch to brown theme"
          : "Switch to pink theme",
      );
    });
  }

  applyTheme(localStorage.getItem(THEME_KEY) || "brown");

  themeToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const isPink = document.documentElement.classList.contains("pink-theme");

      const nextTheme = isPink ? "brown" : "pink";

      applyTheme(nextTheme);
      localStorage.setItem(THEME_KEY, nextTheme);
    });
  });
  const gallery = document.querySelector(".pets-gallery");
  const filters = document.querySelectorAll(".pets-filter");

  let currentCategory = "all";
  let currentPage = 1;

  const arrowLeft2 = document.querySelector(".arrow_left_2");
  const arrowLeft1 = document.querySelector(".arrow_left_1");
  const arrowCenter = document.querySelector(".arrow_center");
  const arrowRight1 = document.querySelector(".arrow_right_1");
  const arrowRight2 = document.querySelector(".arrow_right_2");

  function getCardsPerPage() {
    if (window.matchMedia("(max-width: 600px)").matches) {
      return 3;
    }

    if (window.matchMedia("(max-width: 768px)").matches) {
      return 6;
    }

    return 8;
  }

  function getFilteredPets() {
    if (currentCategory === "all") {
      return pets;
    }

    return pets.filter(
      (pet) => pet.category === currentCategory,
    );
  }

  function getPageCount() {
    return Math.ceil(
      getFilteredPets().length / getCardsPerPage(),
    );
  }
  function createCard(pet, index) {
    const card = document.createElement("div");

    card.classList.add(
      "one-pets-item",
      "pointer",
    );

    card.dataset.index = index;

    card.innerHTML = `
      <img
        src="${pet.img}"
        alt="${pet.name} pets picture"
      >

      <h3 class="one-pets-name">
        ${pet.name}
      </h3>

      <button
        class="button-one-pets"
        type="button"
      >
        Learn more
      </button>
    `;

    return card;
  }

  function renderCards() {
    const filteredPets = getFilteredPets();
    const cardsPerPage = getCardsPerPage();
    const pageCount = getPageCount();

    if (currentPage > pageCount) {
      currentPage = pageCount || 1;
    }

    const startIndex =
      (currentPage - 1) * cardsPerPage;

    const currentPets = filteredPets.slice(
      startIndex,
      startIndex + cardsPerPage,
    );

    gallery.innerHTML = "";

    currentPets.forEach((pet) => {
      const originalIndex = pets.indexOf(pet);

      gallery.appendChild(
        createCard(pet, originalIndex),
      );
    });

    updatePagination(pageCount);
  }
  filters.forEach((filter) => {
    filter.addEventListener("click", () => {
      currentCategory = filter.dataset.category;
      currentPage = 1;

      filters.forEach((item) => {
        item.classList.remove("pets-filter--active");
      });

      filter.classList.add("pets-filter--active");

      renderCards();
    });
  });
  function updatePagination(pageCount) {
    arrowCenter.textContent = currentPage;

    const isFirstPage = currentPage === 1;
    const isLastPage =
      currentPage === pageCount || pageCount === 0;

    arrowLeft2.disabled = isFirstPage;
    arrowLeft1.disabled = isFirstPage;

    arrowRight1.disabled = isLastPage;
    arrowRight2.disabled = isLastPage;

    arrowLeft2.classList.toggle(
      "disabled",
      isFirstPage,
    );

    arrowLeft1.classList.toggle(
      "disabled",
      isFirstPage,
    );

    arrowRight1.classList.toggle(
      "disabled",
      isLastPage,
    );

    arrowRight2.classList.toggle(
      "disabled",
      isLastPage,
    );
  }

  arrowLeft2.addEventListener("click", () => {
    currentPage = 1;
    renderCards();
  });

  arrowLeft1.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage -= 1;
      renderCards();
    }
  });

  arrowRight1.addEventListener("click", () => {
    const pageCount = getPageCount();

    if (currentPage < pageCount) {
      currentPage += 1;
      renderCards();
    }
  });

  arrowRight2.addEventListener("click", () => {
    currentPage = getPageCount();
    renderCards();
  });

  const modal = document.querySelector(".overlay");
  const modalCloseButton =
    document.querySelector(".modal-button");

  function preventScroll(event) {
    event.preventDefault();
  }

  function formatValue(value) {
    return Array.isArray(value)
      ? value.join(", ")
      : value;
  }

  function createModalCard(pet) {
    const modalCard = document.createElement("div");

    modalCard.classList.add("modal__2-column");

    modalCard.innerHTML = `
      <img
        class="modal__img"
        src="${pet.img}"
        alt="${pet.name} pets picture"
      >

      <div class="modal__info">

        <div class="name">
          ${pet.name}
        </div>

        <div class="type-breed">
          ${pet.type} - ${pet.breed}
        </div>

        <div class="description">
          ${pet.description}
        </div>

        <ul class="characteristics">
          <li class="age">
            Age: ${pet.age}
          </li>

          <li class="inoculations">
            Inoculations: ${formatValue(
              pet.inoculations,
            )}
          </li>

          <li class="diseases">
            Diseases: ${formatValue(pet.diseases)}
          </li>

          <li class="parasites">
            Parasites: ${formatValue(pet.parasites)}
          </li>
        </ul>

      </div>
    `;

    modalCloseButton.after(modalCard);
  }

  function openModal(index) {
    const pet = pets[index];

    modal.classList.add("show");
    modal.classList.remove("hide");

    createModalCard(pet);

    document.addEventListener(
      "wheel",
      preventScroll,
      { passive: false },
    );
  }

  function closeModal() {
    modal.classList.add("hide");
    modal.classList.remove("show");

    const modalCard =
      modal.querySelector(".modal__2-column");

    if (modalCard) {
      modalCard.remove();
    }

    document.removeEventListener(
      "wheel",
      preventScroll,
    );
  }

  gallery.addEventListener("click", (event) => {
    const card = event.target.closest(
      ".one-pets-item",
    );

    if (!card) {
      return;
    }

    openModal(Number(card.dataset.index));
  });

  modalCloseButton.addEventListener(
    "click",
    closeModal,
  );

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });
  window.addEventListener("resize", () => {
    renderCards();
  });
  renderCards();
});