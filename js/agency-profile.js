document.addEventListener("DOMContentLoaded", () => {
    initializeAgencyProfile();
    initializeProfileNavigation();
    initializeContactModal();
    initializeSaveAgency();
    initializeReportButton();
});

/* =========================================================
   SAMPLE AGENCY DATA
========================================================= */

const agencyProfiles = {
    1: {
        name: "Northstar Vision",
        initials: "NV",
        tagline:
            "Creator management and digital growth, built around measurable performance.",
        location: "Los Angeles, United States",
        experience: "6 years in business",
        size: "11–50 team members",
        sidebarSize: "11–50",
        sidebarYears: "6 years",
        languages: "English, Spanish",
        founded: "2019",
        teamSize: "24",
        countryCount: "12",
        responseTime: "1 day",
        website: "https://example.com",
        description:
            "Northstar Vision helps creators build structured, sustainable digital businesses. Its team combines account management, creative planning, audience development, brand positioning, and performance reporting in one coordinated service.",
        secondaryDescription:
            "The agency works closely with each client to develop an individual strategy based on their audience, objectives, and preferred platforms.",
        services: [
            {
                name: "Creator Management",
                description:
                    "Day-to-day support, planning, and account coordination.",
                icon: "fa-solid fa-user-tie"
            },
            {
                name: "Audience Growth",
                description:
                    "Cross-platform strategy designed to grow relevant audiences.",
                icon: "fa-solid fa-arrow-trend-up"
            },
            {
                name: "Content Strategy",
                description:
                    "Editorial planning, creative direction, and campaign support.",
                icon: "fa-regular fa-lightbulb"
            },
            {
                name: "Brand Development",
                description:
                    "Positioning, identity, partnerships, and long-term planning.",
                icon: "fa-solid fa-pen-ruler"
            },
            {
                name: "Analytics & Reporting",
                description:
                    "Clear performance reporting and ongoing optimization.",
                icon: "fa-solid fa-chart-line"
            },
            {
                name: "Business Strategy",
                description:
                    "Commercial planning and sustainable revenue development.",
                icon: "fa-solid fa-briefcase"
            }
        ],
        expertise: [
            "Influencers",
            "Lifestyle Creators",
            "Fitness Creators",
            "Fashion Creators",
            "Gaming Creators",
            "Models",
            "Personal Brands"
        ],
        countries: [
            "United States",
            "Canada",
            "United Kingdom",
            "Australia",
            "Germany",
            "France"
        ]
    },

    2: {
        name: "Luminary Media",
        initials: "LM",
        tagline:
            "Creative strategy and creator representation for ambitious digital brands.",
        location: "London, United Kingdom",
        experience: "8 years in business",
        size: "11–50 team members",
        sidebarSize: "11–50",
        sidebarYears: "8 years",
        languages: "English, French",
        founded: "2017",
        teamSize: "31",
        countryCount: "9",
        responseTime: "2 days",
        website: "https://example.com",
        description:
            "Luminary Media is a multidisciplinary creator agency focused on representation, creative development, brand partnerships, and international growth.",
        secondaryDescription:
            "Its team combines strategic planning with hands-on campaign support for creators and companies across major digital platforms.",
        services: [
            {
                name: "Talent Management",
                description:
                    "Representation and long-term career support.",
                icon: "fa-solid fa-users"
            },
            {
                name: "Brand Partnerships",
                description:
                    "Partnership sourcing and campaign coordination.",
                icon: "fa-solid fa-handshake"
            },
            {
                name: "Creative Direction",
                description:
                    "Creative concepts and visual campaign planning.",
                icon: "fa-solid fa-wand-magic-sparkles"
            },
            {
                name: "Social Media Strategy",
                description:
                    "Cross-platform publishing and audience strategy.",
                icon: "fa-solid fa-share-nodes"
            }
        ],
        expertise: [
            "Fashion Creators",
            "Lifestyle Creators",
            "Influencers",
            "Models",
            "Creative Professionals"
        ],
        countries: [
            "United Kingdom",
            "France",
            "Germany",
            "Spain",
            "United States"
        ]
    },

    3: {
        name: "Atlas Agency",
        initials: "AA",
        tagline:
            "International talent representation and scalable audience development.",
        location: "Toronto, Canada",
        experience: "5 years in business",
        size: "2–10 team members",
        sidebarSize: "2–10",
        sidebarYears: "5 years",
        languages: "English, French",
        founded: "2020",
        teamSize: "9",
        countryCount: "7",
        responseTime: "1–2 days",
        website: "https://example.com",
        description:
            "Atlas Agency supports independent creators with focused management, campaign strategy, commercial partnerships, and international market development.",
        secondaryDescription:
            "The boutique team maintains a selective client list to provide direct and highly personalized support.",
        services: [
            {
                name: "Talent Management",
                description:
                    "Personalized representation and account support.",
                icon: "fa-solid fa-user-group"
            },
            {
                name: "Campaign Strategy",
                description:
                    "Campaign planning across multiple digital channels.",
                icon: "fa-solid fa-bullhorn"
            },
            {
                name: "Audience Development",
                description:
                    "Organic audience research and growth planning.",
                icon: "fa-solid fa-chart-simple"
            },
            {
                name: "Brand Positioning",
                description:
                    "Clear positioning and commercial identity development.",
                icon: "fa-solid fa-compass"
            }
        ],
        expertise: [
            "Gaming Creators",
            "Lifestyle Creators",
            "Fitness Creators",
            "Influencers"
        ],
        countries: [
            "Canada",
            "United States",
            "United Kingdom",
            "Australia"
        ]
    },

    4: {
        name: "Studio Kindred",
        initials: "SK",
        tagline:
            "Content production and brand direction for emerging creator businesses.",
        location: "Sydney, Australia",
        experience: "4 years in business",
        size: "2–10 team members",
        sidebarSize: "2–10",
        sidebarYears: "4 years",
        languages: "English",
        founded: "2021",
        teamSize: "7",
        countryCount: "5",
        responseTime: "2 days",
        website: "https://example.com",
        description:
            "Studio Kindred is a boutique creative agency helping creators develop recognizable brands through content strategy, production, design, and platform planning.",
        secondaryDescription:
            "Its collaborative approach is designed for creators who need a consistent visual identity and practical publishing system.",
        services: [
            {
                name: "Content Production",
                description:
                    "End-to-end support for digital content production.",
                icon: "fa-solid fa-camera"
            },
            {
                name: "Creative Direction",
                description:
                    "Visual concepts and consistent creative systems.",
                icon: "fa-solid fa-palette"
            },
            {
                name: "Brand Development",
                description:
                    "Brand identity and market positioning.",
                icon: "fa-solid fa-pen-nib"
            },
            {
                name: "Content Planning",
                description:
                    "Structured editorial and publishing calendars.",
                icon: "fa-regular fa-calendar"
            }
        ],
        expertise: [
            "Lifestyle Creators",
            "Fashion Creators",
            "Fitness Creators",
            "Creative Professionals"
        ],
        countries: [
            "Australia",
            "New Zealand",
            "Singapore",
            "United Kingdom"
        ]
    }
};

/* =========================================================
   PROFILE RENDERING
========================================================= */

function initializeAgencyProfile() {
    const parameters = new URLSearchParams(
        window.location.search
    );

    const agencyId = parameters.get("id") || "1";

    const agency =
        agencyProfiles[agencyId] ||
        agencyProfiles[1];

    setText("agencyName", agency.name);
    setText("breadcrumbAgencyName", agency.name);
    setText("agencyLogo", agency.initials);
    setText("agencyTagline", agency.tagline);
    setText("agencyLocation", agency.location);
    setText("agencyExperience", agency.experience);
    setText("agencySize", agency.size);

    setText("agencyDescription", agency.description);
    setText(
        "agencyDescriptionSecondary",
        agency.secondaryDescription
    );

    setText("profileFounded", agency.founded);
    setText("profileTeamSize", agency.teamSize);
    setText("profileCountries", agency.countryCount);
    setText("profileResponse", agency.responseTime);

    setText("sidebarHeadquarters", agency.location);
    setText("sidebarSize", agency.sidebarSize);
    setText("sidebarYears", agency.sidebarYears);
    setText("sidebarLanguages", agency.languages);

    const websiteLink =
        document.getElementById("agencyWebsite");

    if (websiteLink) {
        websiteLink.href = agency.website;
    }

    document.title =
        `${agency.name} | Agency Privé`;

    renderServices(agency.services);
    renderExpertise(agency.expertise);
    renderLocations(agency.countries);
}

function setText(elementId, value) {
    const element =
        document.getElementById(elementId);

    if (element) {
        element.textContent = value;
    }
}

function renderServices(services) {
    const container =
        document.getElementById("servicesGrid");

    if (!container) return;

    container.innerHTML = services
        .map(
            (service) => `
                <article class="service-card">
                    <div class="service-card-icon">
                        <i class="${service.icon}"></i>
                    </div>

                    <div>
                        <h3>${service.name}</h3>
                        <p>${service.description}</p>
                    </div>
                </article>
            `
        )
        .join("");
}

function renderExpertise(expertise) {
    const container =
        document.getElementById("expertiseTags");

    if (!container) return;

    container.innerHTML = expertise
        .map((item) => `<span>${item}</span>`)
        .join("");
}

function renderLocations(countries) {
    const container =
        document.getElementById("locationList");

    if (!container) return;

    container.innerHTML = countries
        .map(
            (country) => `
                <div>
                    <i class="fa-solid fa-location-dot"></i>
                    <span>${country}</span>
                </div>
            `
        )
        .join("");
}

/* =========================================================
   SECTION NAVIGATION
========================================================= */

function initializeProfileNavigation() {
    const links = Array.from(
        document.querySelectorAll(
            ".profile-navigation a"
        )
    );

    const sections = links
        .map((link) =>
            document.querySelector(
                link.getAttribute("href")
            )
        )
        .filter(Boolean);

    links.forEach((link) => {
        link.addEventListener("click", () => {
            links.forEach((item) =>
                item.classList.remove("active")
            );

            link.classList.add("active");
        });
    });

    if (!("IntersectionObserver" in window)) {
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            const visibleEntry = entries
                .filter((entry) => entry.isIntersecting)
                .sort(
                    (first, second) =>
                        second.intersectionRatio -
                        first.intersectionRatio
                )[0];

            if (!visibleEntry) return;

            links.forEach((link) => {
                link.classList.toggle(
                    "active",
                    link.getAttribute("href") ===
                        `#${visibleEntry.target.id}`
                );
            });
        },
        {
            rootMargin: "-25% 0px -60% 0px",
            threshold: [0.1, 0.25, 0.5]
        }
    );

    sections.forEach((section) => {
        observer.observe(section);
    });
}

/* =========================================================
   CONTACT MODAL
========================================================= */

function initializeContactModal() {
    const modal =
        document.getElementById("contactModal");

    const openButton =
        document.getElementById(
            "contactAgencyButton"
        );

    const closeButton =
        document.getElementById(
            "closeContactModal"
        );

    const form =
        document.getElementById(
            "agencyContactForm"
        );

    const message =
        document.getElementById(
            "contactFormMessage"
        );

    if (!modal || !openButton || !closeButton) {
        return;
    }

    const openModal = () => {
        modal.classList.add("open");
        modal.setAttribute("aria-hidden", "false");
        document.body.classList.add(
            "profile-modal-open"
        );

        window.setTimeout(() => {
            document
                .getElementById("contactName")
                ?.focus();
        }, 100);
    };

    const closeModal = () => {
        modal.classList.remove("open");
        modal.setAttribute("aria-hidden", "true");
        document.body.classList.remove(
            "profile-modal-open"
        );

        openButton.focus();
    };

    openButton.addEventListener("click", openModal);
    closeButton.addEventListener("click", closeModal);

    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (
            event.key === "Escape" &&
            modal.classList.contains("open")
        ) {
            closeModal();
        }
    });

    form?.addEventListener("submit", (event) => {
        event.preventDefault();

        const name =
            document.getElementById(
                "contactName"
            );

        const email =
            document.getElementById(
                "contactEmail"
            );

        const contactMessage =
            document.getElementById(
                "contactMessage"
            );

        if (
            !name?.value.trim() ||
            !email?.value.trim() ||
            !contactMessage?.value.trim()
        ) {
            if (message) {
                message.textContent =
                    "Complete all fields before sending your inquiry.";

                message.className =
                    "contact-form-message show";
            }

            return;
        }

        if (message) {
            message.textContent =
                "Your inquiry form is working. Connect your database or email service before accepting real messages.";

            message.className =
                "contact-form-message show success";
        }

        form.reset();
    });
}

/* =========================================================
   SAVE AGENCY
========================================================= */

function initializeSaveAgency() {
    const button =
        document.getElementById(
            "saveAgencyButton"
        );

    if (!button) return;

    const parameters =
        new URLSearchParams(window.location.search);

    const agencyId =
        parameters.get("id") || "1";

    const storageKey =
        `agencyPriveSavedAgency-${agencyId}`;

    const updateButton = (saved) => {
        button.classList.toggle("saved", saved);
        button.setAttribute(
            "aria-pressed",
            String(saved)
        );

        const icon = button.querySelector("i");
        const text = button.querySelector("span");

        if (icon) {
            icon.className = saved
                ? "fa-solid fa-bookmark"
                : "fa-regular fa-bookmark";
        }

        if (text) {
            text.textContent = saved
                ? "Agency Saved"
                : "Save Agency";
        }
    };

    let isSaved =
        localStorage.getItem(storageKey) === "true";

    updateButton(isSaved);

    button.addEventListener("click", () => {
        isSaved = !isSaved;

        if (isSaved) {
            localStorage.setItem(
                storageKey,
                "true"
            );
        } else {
            localStorage.removeItem(storageKey);
        }

        updateButton(isSaved);
    });
}

/* =========================================================
   REPORT PROFILE
========================================================= */

function initializeReportButton() {
    const button =
        document.getElementById(
            "reportProfileButton"
        );

    if (!button) return;

    button.addEventListener("click", () => {
        button.textContent =
            "Report form coming soon";
        button.disabled = true;
    });
}