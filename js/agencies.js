/* =========================================================
   AGENCY PRIVÉ — AGENCY DIRECTORY
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    initializeAgencyDirectory();
});

/* =========================================================
   AGENCY DIRECTORY DATA

   This remains empty until agencies are loaded from Supabase.
========================================================= */


/* =========================================================
   DIRECTORY STATE
========================================================= */

function initializeAgencyDirectory() {
    const cardGrid =
        document.getElementById("agencyCardGrid");

    if (!cardGrid) return;

    const state = {
        search: "",
        location: "",
        service: "",
        verified: false,
        featured: false,
        size: "",
        experience: 0,
        sort: "featured",
        page: 1,
        pageSize: 6
    };

    const elements = {
        form: document.getElementById("agencySearchForm"),
        search: document.getElementById("agencySearch"),
        location: document.getElementById("locationFilter"),
        service: document.getElementById("serviceFilter"),
        verified: document.getElementById("verifiedFilter"),
        featured: document.getElementById("featuredFilter"),
        experience: document.getElementById("experienceFilter"),
        sort: document.getElementById("sortFilter"),
        count: document.getElementById("resultCount"),
        grid: cardGrid,
        empty: document.getElementById("directoryEmptyState"),
        pagination: document.getElementById("directoryPagination"),
        clear: document.getElementById("clearFilters"),
        emptyClear: document.getElementById("emptyClearFilters"),
        filters: document.getElementById("directoryFilters"),
        filterButton: document.getElementById("mobileFilterButton"),
        overlay: document.getElementById("filterOverlay")
    };

    initializeStateFromUrl(state, elements);
    initializeDirectoryEvents(state, elements);
    renderDirectory(state, elements);
}

/* =========================================================
   URL VALUES
========================================================= */

function initializeStateFromUrl(state, elements) {
    const parameters =
        new URLSearchParams(window.location.search);

    state.search =
        parameters.get("search") || "";

    state.location =
        parameters.get("location") || "";

    elements.search.value = state.search;
    elements.location.value = state.location;
}

/* =========================================================
   EVENTS
========================================================= */

function initializeDirectoryEvents(state, elements) {
    elements.form?.addEventListener("submit", (event) => {
        event.preventDefault();

        state.search =
            elements.search.value.trim();

        state.location =
            elements.location.value;

        state.service =
            elements.service.value;

        state.page = 1;

        renderDirectory(state, elements);
    });

    elements.search?.addEventListener("input", () => {
        state.search =
            elements.search.value.trim();

        state.page = 1;

        renderDirectory(state, elements);
    });

    elements.location?.addEventListener("change", () => {
        state.location =
            elements.location.value;

        state.page = 1;

        renderDirectory(state, elements);
    });

    elements.service?.addEventListener("change", () => {
        state.service =
            elements.service.value;

        state.page = 1;

        renderDirectory(state, elements);
    });

    elements.verified?.addEventListener("change", () => {
        state.verified =
            elements.verified.checked;

        state.page = 1;

        renderDirectory(state, elements);
    });

    elements.featured?.addEventListener("change", () => {
        state.featured =
            elements.featured.checked;

        state.page = 1;

        renderDirectory(state, elements);
    });

    document
        .querySelectorAll('input[name="agencySize"]')
        .forEach((input) => {
            input.addEventListener("change", () => {
                state.size =
                    document.querySelector(
                        'input[name="agencySize"]:checked'
                    )?.value || "";

                state.page = 1;

                renderDirectory(state, elements);
            });
        });

    elements.experience?.addEventListener("change", () => {
        state.experience =
            Number(elements.experience.value);

        state.page = 1;

        renderDirectory(state, elements);
    });

    elements.sort?.addEventListener("change", () => {
        state.sort =
            elements.sort.value;

        state.page = 1;

        renderDirectory(state, elements);
    });

    elements.clear?.addEventListener("click", () => {
        clearDirectoryFilters(state, elements);
    });

    elements.emptyClear?.addEventListener("click", () => {
        clearDirectoryFilters(state, elements);
    });

    elements.filterButton?.addEventListener("click", () => {
        toggleMobileFilters(elements, true);
    });

    elements.overlay?.addEventListener("click", () => {
        toggleMobileFilters(elements, false);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            toggleMobileFilters(elements, false);
        }
    });
}

/* =========================================================
   FILTERING AND SORTING
========================================================= */

function getFilteredAgencies(state) {
    const normalizedSearch =
        state.search.toLowerCase();

    const filtered = agencies.filter((agency) => {
        const searchableText = [
            agency.name,
            agency.location,
            agency.description,
            ...agency.services
        ]
            .join(" ")
            .toLowerCase();

        const matchesSearch =
            !normalizedSearch ||
            searchableText.includes(normalizedSearch);

        const matchesLocation =
            !state.location ||
            agency.location === state.location;

        const matchesService =
            !state.service ||
            agency.services.includes(state.service);

        const matchesVerified =
            !state.verified ||
            agency.verified;

        const matchesFeatured =
            !state.featured ||
            agency.featured;

        const matchesSize =
            !state.size ||
            agency.size === state.size;

        const matchesExperience =
            agency.years >= state.experience;

        return (
            matchesSearch &&
            matchesLocation &&
            matchesService &&
            matchesVerified &&
            matchesFeatured &&
            matchesSize &&
            matchesExperience
        );
    });

    return sortAgencies(filtered, state.sort);
}

function sortAgencies(agencyList, sortValue) {
    return [...agencyList].sort((first, second) => {
        switch (sortValue) {
            case "rating":
                return second.rating - first.rating;

            case "experience":
                return second.years - first.years;

            case "name":
                return first.name.localeCompare(second.name);

            case "featured":
            default:
                return (
                    Number(second.featured) -
                        Number(first.featured) ||
                    second.rating - first.rating
                );
        }
    });
}

/* =========================================================
   RENDER
========================================================= */

function renderDirectory(state, elements) {
    const results =
        getFilteredAgencies(state);

    const totalPages =
        Math.ceil(results.length / state.pageSize);

    if (state.page > totalPages && totalPages > 0) {
        state.page = totalPages;
    }

    const startIndex =
        (state.page - 1) * state.pageSize;

    const visibleAgencies =
        results.slice(
            startIndex,
            startIndex + state.pageSize
        );

    elements.count.textContent =
        results.length;

    elements.grid.innerHTML =
        visibleAgencies
            .map(createAgencyCard)
            .join("");

    const noResults =
        results.length === 0;

    elements.empty.hidden =
        !noResults;

    elements.grid.hidden =
        noResults;

    renderPagination(
        state,
        elements,
        totalPages
    );
}

function createAgencyCard(agency) {
    const badges = [];

    if (agency.featured) {
        badges.push(`
            <span class="badge badge-select">
                PRIVÉ SELECT
            </span>
        `);
    }

    if (agency.verified) {
        badges.push(`
            <span class="badge badge-verified">
                <i class="fa-solid fa-circle-check"></i>
                VERIFIED
            </span>
        `);
    }

    const serviceTags =
        agency.services
            .slice(0, 3)
            .map((service) => {
                return `<span>${escapeHtml(service)}</span>`;
            })
            .join("");

    return `
        <article class="agency-card">

            <div class="agency-card-top">

                <div class="agency-identity">
                    <div class="agency-monogram">
                        ${escapeHtml(agency.initials)}
                    </div>

                    <div>
                        <h2 class="agency-name">
                            ${escapeHtml(agency.name)}
                        </h2>

                        <span class="agency-location">
                            <i class="fa-solid fa-location-dot"></i>
                            ${escapeHtml(agency.location)}
                        </span>
                    </div>
                </div>

                <div class="agency-badges">
                    ${badges.join("")}
                </div>

            </div>

            <p class="agency-description">
                ${escapeHtml(agency.description)}
            </p>

            <div class="agency-services">
                ${serviceTags}
            </div>

            <div class="agency-card-meta">
                <div>
                    <strong>${agency.rating.toFixed(1)}</strong>
                    <span>${agency.reviews} reviews</span>
                </div>

                <div>
                    <strong>${agency.years}</strong>
                    <span>Years active</span>
                </div>

                <div>
                    <strong>${escapeHtml(agency.size)}</strong>
                    <span>Team size</span>
                </div>
            </div>

            <a
                href="agency-profile.html?id=${agency.id}"
                class="agency-card-link"
            >
                View Agency Profile
                <i class="fa-solid fa-arrow-right"></i>
            </a>

        </article>
    `;
}

/* =========================================================
   PAGINATION
========================================================= */

function renderPagination(
    state,
    elements,
    totalPages
) {
    elements.pagination.innerHTML = "";

    if (totalPages <= 1) return;

    const previousButton =
        createPaginationButton(
            '<i class="fa-solid fa-chevron-left"></i>',
            state.page - 1,
            state.page === 1
        );

    elements.pagination.appendChild(
        previousButton
    );

    for (
        let pageNumber = 1;
        pageNumber <= totalPages;
        pageNumber += 1
    ) {
        const button =
            createPaginationButton(
                pageNumber,
                pageNumber,
                false
            );

        button.classList.toggle(
            "active",
            pageNumber === state.page
        );

        elements.pagination.appendChild(
            button
        );
    }

    const nextButton =
        createPaginationButton(
            '<i class="fa-solid fa-chevron-right"></i>',
            state.page + 1,
            state.page === totalPages
        );

    elements.pagination.appendChild(
        nextButton
    );

    elements.pagination
        .querySelectorAll("button")
        .forEach((button) => {
            button.addEventListener("click", () => {
                const requestedPage =
                    Number(button.dataset.page);

                if (
                    !requestedPage ||
                    requestedPage < 1 ||
                    requestedPage > totalPages
                ) {
                    return;
                }

                state.page = requestedPage;

                renderDirectory(
                    state,
                    elements
                );

                document
                    .querySelector(
                        ".agency-directory-section"
                    )
                    ?.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
            });
        });
}

function createPaginationButton(
    content,
    page,
    disabled
) {
    const button =
        document.createElement("button");

    button.type = "button";
    button.innerHTML = content;
    button.dataset.page = page;
    button.disabled = disabled;

    return button;
}

/* =========================================================
   CLEAR FILTERS
========================================================= */

function clearDirectoryFilters(state, elements) {
    state.search = "";
    state.location = "";
    state.service = "";
    state.verified = false;
    state.featured = false;
    state.size = "";
    state.experience = 0;
    state.sort = "featured";
    state.page = 1;

    elements.search.value = "";
    elements.location.value = "";
    elements.service.value = "";
    elements.verified.checked = false;
    elements.featured.checked = false;
    elements.experience.value = "0";
    elements.sort.value = "featured";

    const allSizes =
        document.querySelector(
            'input[name="agencySize"][value=""]'
        );

    if (allSizes) {
        allSizes.checked = true;
    }

    renderDirectory(state, elements);
    toggleMobileFilters(elements, false);
}

/* =========================================================
   MOBILE FILTERS
========================================================= */

function toggleMobileFilters(elements, open) {
    elements.filters?.classList.toggle(
        "open",
        open
    );

    elements.overlay?.classList.toggle(
        "open",
        open
    );

    document.body.classList.toggle(
        "navigation-open",
        open
    );
}

/* =========================================================
   HTML SAFETY
========================================================= */

function escapeHtml(value) {
    const element =
        document.createElement("div");

    element.textContent =
        String(value);

    return element.innerHTML;
}