/* =========================================================
   AGENCY PRIVÉ — ONLYFANS AGENCY PROFILE

   Approved agency profiles will be loaded from Supabase.
   Do not add fictional agencies or verification claims here.
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    initializeAgencyProfile();
});

/* =========================================================
   PROFILE DATA

   Supabase integration will replace this empty collection.
   Only published, approved OnlyFans agencies should be shown.
========================================================= */

const agencyProfiles = [];

/* =========================================================
   INITIALIZE
========================================================= */

function initializeAgencyProfile() {
    const unavailable = document.getElementById(
        "profileUnavailable"
    );

    const profileContent = document.getElementById(
        "agencyProfileContent"
    );

    if (!unavailable || !profileContent) return;

    const agencyId = new URLSearchParams(
        window.location.search
    ).get("id");

    const agency = agencyProfiles.find((profile) => {
        return (
            String(profile.id) === agencyId &&
            profile.status === "published" &&
            profile.approved === true &&
            profile.platform === "onlyfans"
        );
    });

    if (!agency) {
        showUnavailableProfile(unavailable, profileContent);
        return;
    }

    renderAgencyProfile(agency);

    unavailable.hidden = true;
    profileContent.hidden = false;

    initializeProfileNavigation();
    initializeSaveAgency(agency.id);

    /*
     * Inquiries and reports remain hidden until their submission
     * endpoints exist. Do not show a form that cannot send messages.
     */
}

/* =========================================================
   EMPTY STATE
========================================================= */

function showUnavailableProfile(
    unavailable,
    profileContent
) {
    unavailable.hidden = false;
    profileContent.hidden = true;

    document.title =
        "Agency Profile Unavailable | Agency Privé";
}

/* =========================================================
   PROFILE RENDER
========================================================= */

function renderAgencyProfile(agency) {
    const name = String(agency.name || "").trim();

    if (!name) return;

    setText("agencyName", name);
    setText("breadcrumbAgencyName", name);

    const initials = String(
        agency.initials ||
        name
            .split(/\s+/)
            .slice(0, 2)
            .map((word) => word.charAt(0))
            .join("")
    ).slice(0, 3);

    setText("agencyLogo", initials.toUpperCase());

    setOptionalText(
        "agencyTagline",
        agency.tagline
    );

    setOptionalText(
        "agencyLocation",
        agency.location,
        "agencyLocationItem"
    );

    setOptionalText(
        "agencyExperience",
        agency.experience,
        "agencyExperienceItem"
    );

    setOptionalText(
        "agencySize",
        agency.size,
        "agencySizeItem"
    );

    setText(
        "agencyDescription",
        agency.description ||
        "This agency has not provided an overview."
    );

    setOptionalText(
        "agencyDescriptionSecondary",
        agency.secondaryDescription
    );

    renderOptionalStat(
        "profileFounded",
        "profileFoundedItem",
        agency.founded
    );

    renderOptionalStat(
        "profileTeamSize",
        "profileTeamSizeItem",
        agency.teamSize
    );

    /*
     * Count the listed countries instead of displaying a
     * manually entered number that may contradict the list.
     */
    const countries = Array.isArray(agency.countries)
        ? agency.countries.filter(Boolean)
        : [];

    renderOptionalStat(
        "profileCountries",
        "profileCountriesItem",
        countries.length ? countries.length : null
    );

    renderOptionalStat(
        "profileResponse",
        "profileResponseItem",
        agency.responseTime
    );

    const statGrid = document.getElementById(
        "profileStatGrid"
    );

    if (statGrid) {
        statGrid.hidden = ![
            "profileFoundedItem",
            "profileTeamSizeItem",
            "profileCountriesItem",
            "profileResponseItem"
        ].some((id) => {
            const item = document.getElementById(id);
            return item && !item.hidden;
        });
    }

    setOptionalText(
        "sidebarHeadquarters",
        agency.location,
        "sidebarHeadquartersItem"
    );

    setOptionalText(
        "sidebarSize",
        agency.sidebarSize || agency.size,
        "sidebarSizeItem"
    );

    setOptionalText(
        "sidebarYears",
        agency.sidebarYears || agency.experience,
        "sidebarYearsItem"
    );

    setOptionalText(
        "sidebarLanguages",
        formatLanguages(agency.languages),
        "sidebarLanguagesItem"
    );

    renderVerification(agency);
    renderWebsite(agency.website);
    renderServices(agency.services);
    renderExpertise(agency.expertise);
    renderLocations(countries);
    renderSocialProfiles(agency.socials);
    renderRelatedAgencies(agency);

    document.title = `${name} | Agency Privé`;
}

function setText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = String(value ?? "");
}

function setOptionalText(id, value, wrapperId =Id = id) {
    const element = document.getElementById(id);
    const wrapper = document.getElementById(wrapperId);

    const hasValue =
        value !== null &&
        value !== undefined &&
        String(value).trim() !== "";

    if (element) {
        element.textContent = hasValue
            ? String(value)
            : "";
    }

    if (wrapper) {
        wrapper.hidden = !hasValue;
    }
}

function renderOptionalStat(id, wrapperId, value) {
    setOptionalText(id, value, wrapperId);
}

function formatLanguages(languages) {
    if (Array.isArray(languages)) {
        return languages
            .filter(Boolean)
            .join(", ");
    }

    return languages || "";
}

/* =========================================================
   VERIFICATION AND SPONSORED PLACEMENT
========================================================= */

function renderVerification(agency) {
    const verifiedBadge = document.getElementById(
        "profileVerifiedBadge"
    );

    const featuredBadge = document.getElementById(
        "profileFeaturedBadge"
    );

    const description = document.getElementById(
        "verificationDescription"
    );

    const checklist = document.getElementById(
        "verificationChecklist"
    );

    const isVerified =
        agency.verificationStatus === "verified";

    if (verifiedBadge) {
        verifiedBadge.hidden = !isVerified;
    }

    /*
     * This badge describes paid placement only. It never
     * implies that the agency is verified or independently ranked.
     */
    if (featuredBadge) {
        featuredBadge.hidden =
            agency.sponsored !== true;
    }

    if (description) {
        description.textContent = isVerified
            ? "Agency Privé has reviewed this agency's business identity. Verification does not guarantee service quality or outcomes."
            : "This agency has not received an Agency Privé verification badge. A paid plan does not grant verification.";
    }

    if (checklist) {
        checklist.replaceChildren();

        /*
         * No individual verification checks are displayed until
         * confirmed review details are available from the database.
         */
        checklist.hidden = true;
    }
}

/* =========================================================
   WEBSITE LINK
========================================================= */

function renderWebsite(value) {
    const link = document.getElementById(
        "agencyWebsite"
    );

    if (!link) return;

    const url = getSafeExternalUrl(value);

    link.hidden = !url;

    if (url) {
        link.href = url;
    } else {
        link.removeAttribute("href");
    }
}

function getSafeExternalUrl(value) {
    if (typeof value !== "string" || !value.trim()) {
        return null;
    }

    try {
        const url = new URL(value.trim());

        if (
            url.protocol !== "https:" &&
            url.protocol !== "http:"
        ) {
            return null;
        }

        return url.href;
    } catch {
        return null;
    }
}

/* =========================================================
   SERVICES
========================================================= */

function renderServices(services) {
    const container = document.getElementById(
        "servicesGrid"
    );

    if (!container) return;

    container.replaceChildren();

    const list = Array.isArray(services)
        ? services
        : [];

    if (!list.length) {
        const message = document.createElement("p");
        message.textContent =
            "No OnlyFans services have been listed yet.";
        container.appendChild(message);
        return;
    }

    list.forEach((service) => {
        const name = typeof service === "string"
            ? service
            : service?.name;

        if (!name) return;

        const card = document.createElement("article");
        card.className = "service-card";

        const iconWrapper = document.createElement("div");
        iconWrapper.className = "service-card-icon";

        const icon = document.createElement("i");
        icon.className = "fa-solid fa-check";
        icon.setAttribute("aria-hidden", "true");
        iconWrapper.appendChild(icon);

        const content = document.createElement("div");

        const heading = document.createElement("h3");
        heading.textContent = name;
        content.appendChild(heading);

        const description =
            typeof service === "object"
                ? service.description
                : "";

        if (description) {
            const paragraph = document.createElement("p");
            paragraph.textContent = description;
            content.appendChild(paragraph);
        }

        card.append(iconWrapper, content);
        container.appendChild(card);
    });
}

/* =========================================================
   CREATOR SPECIALTIES
========================================================= */

function renderExpertise(expertise) {
    const container = document.getElementById(
        "expertiseTags"
    );

    if (!container) return;

    container.replaceChildren();

    const list = Array.isArray(expertise)
        ? expertise.filter(Boolean)
        : [];

    if (!list.length) {
        const message = document.createElement("p");
        message.textContent =
            "No OnlyFans creator specialties have been listed yet.";
        container.appendChild(message);
        return;
    }

    list.forEach((specialty) => {
        const tag = document.createElement("span");
        tag.textContent = String(specialty);
        container.appendChild(tag);
    });
}

/* =========================================================
   LOCATIONS
========================================================= */

function renderLocations(countries) {
    const container = document.getElementById(
        "locationList"
    );

    if (!container) return;

    container.replaceChildren();

    if (!countries.length) {
        const message = document.createElement("p");
        message.textContent =
            "No service regions have been listed yet.";
        container.appendChild(message);
        return;
    }

    countries.forEach((country) => {
        const item = document.createElement("div");

        const icon = document.createElement("i");
        icon.className = "fa-solid fa-location-dot";
        icon.setAttribute("aria-hidden", "true");

        const label = document.createElement("span");
        label.textContent = String(country);

        item.append(icon, label);
        container.appendChild(item);
    });
}

/* =========================================================
   SOCIAL LINKS
========================================================= */

function renderSocialProfiles(socials) {
    const card = document.getElementById(
        "profileSocialCard"
    );

    const container = document.getElementById(
        "profileSocials"
    );

    if (!card || !container) return;

    container.replaceChildren();

    const supported = [
        ["instagram", "Instagram", "fa-brands fa-instagram"],
        ["x", "X", "fa-brands fa-x-twitter"],
        ["tiktok", "TikTok", "fa-brands fa-tiktok"],
        ["linkedin", "LinkedIn", "fa-brands fa-linkedin-in"]
    ];

    supported.forEach(([key, label, iconClass]) => {
        const url = getSafeExternalUrl(
            socials?.[key]
        );

        if (!url) return;

        const link = document.createElement("a");
        link.href = url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.setAttribute("aria-label", label);

        const icon = document.createElement("i");
        icon.className = iconClass;
        icon.setAttribute("aria-hidden", "true");

        link.append(icon, document.createTextNode(label));
        container.appendChild(link);
    });

    card.hidden = container.childElementCount === 0;
}

/* =========================================================
   RELATED AGENCIES

   Only actual approved, published OnlyFans agencies qualify.
========================================================= */

function renderRelatedAgencies(currentAgency) {
    const section = document.getElementById(
        "relatedAgenciesSection"
    );

    const grid = document.getElementById(
        "relatedAgencyGrid"
    );

    if (!section || !grid) return;

    grid.replaceChildren();

    const related = agencyProfiles
        .filter((agency) => {
            return (
                String(agency.id) !==
                    String(currentAgency.id) &&
                agency.status === "published" &&
                agency.approved === true &&
                agency.platform === "onlyfans"
            );
        })
        .slice(0, 3);

    related.forEach((agency) => {
        if (!agency.name) return;

        const card = document.createElement("article");
        card.className = "related-agency-card";

        const logo = document.createElement("div");
        logo.className = "related-agency-logo";
        logo.textContent = String(
            agency.initials ||
            agency.name
                .split(/\s+/)
                .slice(0, 2)
                .map((word) => word.charAt(0))
                .join("")
        ).slice(0, 3).toUpperCase();

        card.appendChild(logo);

        if (
            agency.verificationStatus ===
            "verified"
        ) {
            const badge = document.createElement("span");
            badge.className = "badge badge-verified";
            badge.textContent = "Verified";
            card.appendChild(badge);
        }

        const heading = document.createElement("h3");
        heading.textContent = agency.name;
        card.appendChild(heading);

        if (agency.tagline) {
            const description = document.createElement("p");
            description.textContent = agency.tagline;
            card.appendChild(description);
        }

        const link = document.createElement("a");
        link.href =
            `agency-profile.html?id=${encodeURIComponent(
                agency.id
            )}`;

        link.appendChild(
            document.createTextNode("View Profile ")
        );

        const icon = document.createElement("i");
        icon.className = "fa-solid fa-arrow-right";
        icon.setAttribute("aria-hidden", "true");

        link.appendChild(icon);
        card.appendChild(link);

        grid.appendChild(card);
    });

    section.hidden = grid.childElementCount === 0;
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

    if (!links.length) return;

    const sections = links
        .map((link) => {
            return document.querySelector(
                link.getAttribute("href")
            );
        })
        .filter(Boolean);

    links.forEach((link) => {
        link.addEventListener("click", () => {
            links.forEach((item) => {
                item.classList.remove("active");
            });

            link.classList.add("active");
        });
    });

    if (!("IntersectionObserver" in window)) {
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            const visible = entries
                .filter((entry) => entry.isIntersecting)
                .sort((first, second) => {
                    return (
                        second.intersectionRatio -
                        first.intersectionRatio
                    );
                })[0];

            if (!visible) return;

            links.forEach((link) => {
                link.classList.toggle(
                    "active",
                    link.getAttribute("href") ===
                        `#${visible.target.id}`
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
   SAVE AGENCY

   Saves this agency ID in this browser only.
========================================================= */

function initializeSaveAgency(agencyId) {
    const button = document.getElementById(
        "saveAgencyButton"
    );

    if (!button || !agencyId) return;

    button.hidden = false;

    const storageKey =
        `agencyPriveSavedAgency-${agencyId}`;

    function updateButton(saved) {
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
    }

    let saved = false;

    try {
        saved =
            localStorage.getItem(storageKey) ===
            "true";
    } catch {
        // Saving may be unavailable in private browsing.
    }

    updateButton(saved);

    button.addEventListener("click", () => {
        saved = !saved;

        try {
            if (saved) {
                localStorage.setItem(
                    storageKey,
                    "true"
                );
            } else {
                localStorage.removeItem(
                    storageKey
                );
            }

            updateButton(saved);
        } catch {
            saved = !saved;
            updateButton(saved);
        }
    });
}