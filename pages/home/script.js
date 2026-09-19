import { pets } from "./pets.js";

window.addEventListener("DOMContentLoaded", () => {
    const menuButton = document.querySelector(".hamb__field");
    const mobileMenu = document.querySelector(".popup");
    const menuOverlay = document.querySelector(".blackout");
    const menuSource = document.querySelector(".nav__list");
    const mobileTrigger = document.querySelector(".hamb");

    if (menuButton && mobileMenu && menuOverlay && menuSource) {
        const menuContainer = menuSource.cloneNode(true);

        const toggleMenu = (isOpen) => {
            mobileMenu.classList.toggle("open", isOpen);
            menuButton.classList.toggle("active", isOpen);
            menuOverlay.classList.toggle("active", isOpen);
            document.body.classList.toggle("noscroll", isOpen);
        };

        const closeMenu = () => {
            toggleMenu(false);
        };

        const openMenu = (event) => {
            event.preventDefault();

            if (!mobileMenu.contains(menuContainer)) {
                mobileMenu.appendChild(menuContainer);
            }

            const isOpen = mobileMenu.classList.contains("open");

            toggleMenu(!isOpen);
        };

        menuButton.addEventListener("click", openMenu);

        menuOverlay.addEventListener("click", closeMenu);

        menuContainer.addEventListener("click", (event) => {
            if (event.target.closest(".nav__link")) {
                closeMenu();
            }
        });

        document.addEventListener("click", (event) => {
            const clickedInsideMenu = event.target.closest(".nav__list");
            const clickedMenuButton = event.target.closest(".hamb__field");

            if (!clickedInsideMenu && !clickedMenuButton) {
                closeMenu();
            }
        });

        window.addEventListener("scroll", () => {
            mobileTrigger?.classList.toggle("hide", window.scrollY >= 50);
        });
    }

    const gallery = document.querySelector(".pets__gallery");
    const previousButton = document.querySelector(".pets__arrow--left");
    const nextButton = document.querySelector(".pets__arrow--right");

    if (!gallery || !previousButton || !nextButton) {
        return;
    }

    const createSequence = (amount) => {
        const result = [];
        const start = Math.floor(Math.random() * pets.length);

        for (let i = 0; i < amount; i++) {
            result.push((start + i) % pets.length);
        }

        return result;
    };

    const cardIndexes = createSequence(15);

    const createPetCard = (petIndex) => {
        const pet = pets[petIndex];

        const card = document.createElement("div");

        card.className = "pet-card pointer";
        card.dataset.index = petIndex;

        card.innerHTML = `
            <img
                src="${pet.img}"
                alt="${pet.name} pets picture"
            >

            <h3 class="pet-card__name">
                ${pet.name}
            </h3>

            <a class="pet-card__button">
                Learn more
            </a>
        `;

        nextButton.before(card);
    };

    cardIndexes.forEach(createPetCard);

    const petCards = Array.from(
        gallery.querySelectorAll(".pet-card")
    );

    let currentSlide = 0;

    const renderSlides = () => {
        petCards.forEach((card) => {
            card.style.display = "none";
            card.classList.remove(
                "mobile-hidden",
                "tablet-hidden"
            );
        });

        const visibleCards = [
            petCards[currentSlide],
            petCards[(currentSlide + 1) % petCards.length],
            petCards[(currentSlide + 2) % petCards.length],
        ];

        visibleCards.forEach((card, index) => {
            card.style.display = "";

            if (index === 1) {
                card.classList.add("mobile-hidden");
            }

            if (index === 2) {
                card.classList.add(
                    "mobile-hidden",
                    "tablet-hidden"
                );
            }
        });
    };

    const moveSlider = (direction) => {
        currentSlide += direction * 3;

        if (currentSlide >= petCards.length) {
            currentSlide = 0;
        }

        if (currentSlide < 0) {
            currentSlide =
                petCards.length -
                3;
        }

        renderSlides();
    };

    previousButton.addEventListener("click", () => {
        moveSlider(-1);
    });

    nextButton.addEventListener("click", () => {
        moveSlider(1);
    });

    renderSlides();
    const modalWindow = document.querySelector(".overlay");
    const modal = document.querySelector(".modal");
    const closeModalButton = document.querySelector(".modal-button");

    if (!modalWindow || !modal || !closeModalButton) {
        return;
    }

    const lockPageScroll = (event) => {
        event.preventDefault();
    };

    const getPetInfo = (index) => pets[index];

    const removeModalContent = () => {
        const content = modal.querySelector(".modal__2-column");

        if (content) {
            content.remove();
        }
    };

    const buildModalContent = (pet) => {
        const modalContent = document.createElement("div");

        modalContent.className = "modal__2-column";

        modalContent.innerHTML = `
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
                        Inoculations: ${pet.inoculations}
                    </li>

                    <li class="diseases">
                        Diseases: ${pet.diseases}
                    </li>

                    <li class="parasites">
                        Parasites: ${pet.parasites}
                    </li>
                </ul>
            </div>
        `;

        closeModalButton.after(modalContent);
    };

    const openModal = (petIndex) => {
        const pet = getPetInfo(petIndex);

        if (!pet) {
            return;
        }

        removeModalContent();
        buildModalContent(pet);

        modalWindow.classList.remove("hide");
        modalWindow.classList.add("show");

        document.addEventListener(
            "wheel",
            lockPageScroll,
            { passive: false }
        );
    };

    const closeModal = () => {
        modalWindow.classList.remove("show");
        modalWindow.classList.add("hide");

        removeModalContent();

        document.removeEventListener(
            "wheel",
            lockPageScroll
        );
    };

    gallery.addEventListener("click", (event) => {
        const card = event.target.closest(".pet-card");

        if (!card) {
            return;
        }

        openModal(Number(card.dataset.index));
    });

    closeModalButton.addEventListener(
        "click",
        closeModal
    );

    modalWindow.addEventListener("click", (event) => {
        if (event.target === modalWindow) {
            closeModal();
        }
    });
});
