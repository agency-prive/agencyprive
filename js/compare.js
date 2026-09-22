/* =========================================================
   AGENCY PRIVÉ — COMPARE ONLYFANS AGENCIES
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    initializeAgencyComparison();
});

/* =========================================================
   COMPARISON DATA

   Add approved, published OnlyFans management agencies here
   or load them from Supabase.

   Do not add sample agencies to the public comparison page.
========================================================= */

const comparisonAgencies = [];

/* =========================================================
   INITIALIZE
========================================================= */

function initializeAgencyComparison() {
    const selectors = [
        document.getElementById("compareAgencyOne"),
        document.getElementById("compareAgencyTwo"),
        document.getElementById("compareAgencyThree")
    ];

    if (selectors.some((selector) => !selector)) {
        return;
    }

    const elements = {
        selectors,

        status:
            document.getElementById("compareStatus"),

        empty:
            document.getElementById("compareEmptySection"),

        comparison:
            document.getElementById("comparisonSection"),

        profileGrid:
            document.getElementById("comparisonProfileGrid"),

        table:
            document.getElementById("comparisonTable"),

        reset:
            document.getElementById("resetComparison")
    };

    populateAgencySelectors(selectors);
    preventDuplicateSelections(selectors);

    selectors.forEach((selector) => {
        selector.addEventListener("change", () => {
            preventDuplicateSelections(selectors);
            renderComparison(elements);
        });
    });

    elements.reset?.addEventListener("click", () => {
        selectors.forEach((selector) => {
            selector.value = "";
        });

        preventDuplicateSelections(selectors);
        renderComparison(elements);
    });

    renderComparison(elements);
}

/* =========================================================
   SELECTORS
========================================================= */

function populateAgencySelectors(selectors) {
    const enoughAgencies =
        comparisonAgencies.length >= 2;

    selectors.forEach((selector, index) => {
        selector.innerHTML = "";

        const placeholder =
            document.createElement("option");

        placeholder.value = "";

        placeholder.textContent =
            enoughAgencies
                ? `Select agency ${index + 1}`
                : "No agencies available to compare";

        selector.appendChild(placeholder);
        selector.disabled = !enoughAgencies;

        if (!enoughAgencies) {
            return;
        }

        comparisonAgencies.forEach((agency) => {
            const option =
                document.createElement("option");

            option.value =
                String(agency.id);

            option.textContent =
                agency.name;

            selector.appendChild(option);
        });
    });
}

function preventDuplicateSelections(selectors) {
    const selectedValues =
        selectors
            .map((selector) => selector.value)
            .filter(Boolean);

    selectors.forEach((selector) => {
        Array.from(selector.options).forEach((option) => {
            if (!option.value) {
                option.disabled = false;
                return;
            }

            option.disabled =
                selectedValues.includes(option.value) &&
                selector.value !== option.value;
        });
    });
}

/* =========================================================
   SELECTED AGENCIES
========================================================= */

function getSelectedAgencies(selectors) {
    const selectedIds =
        selectors
            .map((selector) => selector.value)
            .filter(Boolean);

    const uniqueIds =
        [...new Set(selectedIds)];

    return uniqueIds
        .map((id) => {
            return comparisonAgencies.find((agency) => {
                return String(agency.id) === id;
            });
        })
        .filter(Boolean);
}

/* =========================================================
   RENDER
========================================================= */

function renderComparison(elements) {
    const selectedAgencies =
        getSelectedAgencies(elements.selectors);

    const availableCount =
        comparisonAgencies.length;

    const hasComparison =
        selectedAgencies.length >= 2;

    if (elements.empty) {
        elements.empty.hidden =
            hasComparison;
    }

    if (elements.comparison) {
        elements.comparison.hidden =
            !hasComparison;
    }

    if (elements.status) {
        elements.status.textContent =
            createStatusMessage(
                selectedAgencies.length,
                availableCount
            );
    }

    updateEmptyComparisonMessage(
        elements,
        selectedAgencies.length,
        availableCount
    );

    if (!hasComparison) {
        if (elements.profileGrid) {
            elements.profileGrid.innerHTML = "";
        }

        if (elements.table) {
            elements.table.innerHTML = "";
        }

        return;
    }

    const columnClass =
        selectedAgencies.length === 3
            ? "columns-three"
            : "columns-two";

    elements.profileGrid.className =
        `comparison-profile-grid ${columnClass}`;

    elements.profileGrid.innerHTML =
        selectedAgencies
            .map(createComparisonCard)
            .join("");

    elements.table.innerHTML =
        createComparisonTable(
            selectedAgencies,
            columnClass
        );

    initializeRemoveButtons(elements);
}

function createStatusMessage(
    selectedCount,
    availableCount
) {
    if (availableCount < 2) {
        return "Agency comparison will be available when at least two OnlyFans management agencies have published profiles.";
    }

    if (selectedCount === 0) {
        return "Select at least two agencies to begin comparing.";
    }

    if (selectedCount === 1) {
        return "Select one more agency to begin comparing.";
    }

    if (selectedCount === 2) {
        return availableCount >= 3
            ? "Comparing two agencies. You may add one more."
            : "Comparing two agencies.";
    }

    return "Comparing three agencies.";
}

function updateEmptyComparisonMessage(
    elements,
    selectedCount,
    availableCount
) {
    if (!elements.empty) return;

    const heading =
        elements.empty.querySelector("h2, h3");

    const description =
        elements.empty.querySelector("p");

    if (availableCount < 2) {
        if (heading) {
            heading.textContent =
                "Agency comparisons are coming soon";
        }

        if (description) {
            description.textContent =
                "Once at least two OnlyFans management agencies have published profiles, you can compare their services and business information here.";
        }

        return;
    }

    if (heading) {
        heading.textContent =
            selectedCount === 1
                ? "Select one more agency"
                : "Select two agencies";
    }

    if (description) {
        description.textContent =
            "Choose at least two published agencies to view a side-by-side comparison.";
    }
}

/* =========================================================
   PROFILE CARDS
========================================================= */

function createComparisonCard(agency) {
    const services =
        Array.isArray(agency.services)
            ? agency.services
            : [];

    const serviceTags =
        services
            .map((service) => {
                return `
                    <span>
                        ${escapeCompareHtml(service)}
                    </span>
                `;
            })
            .join("");

    const name =
        agency.name || "Agency";

    const location =
        agency.location || "Location not provided";

    return `
        <article
            class="comparison-profile-card ${
                agency.featured ? "featured" : ""
            }"
        >
            <div class="comparison-card-heading">

                <span class="comparison-monogram">
                    ${escapeCompareHtml(agency.initials || "AP")}
                </span>

                <button
                    type="button"
                    class="remove-comparison-agency"
                    data-agency-id="${escapeCompareHtml(agency.id)}"
                    aria-label="Remove ${escapeCompareHtml(name)}"
                >
                    <i class="fa-solid fa-xmark"></i>
                </button>

            </div>

            <h2>
                ${escapeCompareHtml(name)}
            </h2>

            <span class="comparison-location">
                <i class="fa-solid fa-location-dot"></i>
                ${escapeCompareHtml(location)}
            </span>

            <div class="comparison-services">
                ${serviceTags}
            </div>

            <a href="agency-profile.html?id=${encodeURIComponent(agency.id)}">
                View Full Profile
                <i class="fa-solid fa-arrow-right"></i>
            </a>
        </article>
    `;
}

/* =========================================================
   COMPARISON TABLE
========================================================= */

function createComparisonTable(
    agencies,
    columnClass
) {
    const rows = [
        {
            label: "Client rating",

            values: agencies.map((agency) => {
                const rating =
                    Number(agency.rating);

                const reviews =
                    Number(agency.reviews);

                if (
                    !Number.isFinite(rating) ||
                    rating <= 0 ||
                    !Number.isInteger(reviews) ||
                    reviews <= 0
                ) {
                    return "No published reviews";
                }

                return `
                    <i class="fa-solid fa-star"></i>
                    ${rating.toFixed(1)}
                    (${reviews} ${
                        reviews === 1
                            ? "review"
                            : "reviews"
                    })
                `;
            })
        },
        {
            label: "Verification",

            values: agencies.map((agency) => {
                return agency.verified === true
                    ? '<i class="fa-solid fa-circle-check"></i> Verified'
                    : "Not verified";
            })
        },
        {
            label: "Years active",

            values: agencies.map((agency) => {
                const years =
                    Number(agency.years);

                if (
                    !Number.isFinite(years) ||
                    years < 0 ||
                    agency.years === null ||
                    agency.years === ""
                ) {
                    return "Not provided";
                }

                return `${years} ${
                    years === 1 ? "year" : "years"
                }`;
            })
        },
        {
            label: "Team size",

            values: agencies.map((agency) => {
                return escapeCompareHtml(
                    agency.size || "Not provided"
                );
            })
        },
        {
            label: "Primary region",

            values: agencies.map((agency) => {
                return escapeCompareHtml(
                    agency.region || "Not provided"
                );
            })
        },
        {
            label: "Profile quality",

            values: agencies.map((agency) => {
                const quality =
                    Number(agency.profileQuality);

                if (
                    !Number.isFinite(quality) ||
                    agency.profileQuality === null ||
                    agency.profileQuality === ""
                ) {
                    return "Not available";
                }

                return `${Math.max(
                    0,
                    Math.min(100, quality)
                )}%`;
            })
        },
        {
            label: "Typical response",

            values: agencies.map((agency) => {
                return escapeCompareHtml(
                    agency.responseTime ||
                    "Not available"
                );
            })
        },
        {
            label: "OnlyFans services",

            values: agencies.map((agency) => {
                const services =
                    Array.isArray(agency.services)
                        ? agency.services
                        : [];

                if (!services.length) {
                    return "Not provided";
                }

                return services
                    .map((service) => {
                        return escapeCompareHtml(service);
                    })
                    .join(", ");
            })
        }
    ];

    const headerRow = `
        <div class="comparison-row ${columnClass}">

            <div class="comparison-label">
                Category
            </div>

            ${agencies
                .map((agency) => {
                    return `
                        <div class="comparison-value">
                            <strong>
                                ${escapeCompareHtml(
                                    agency.name || "Agency"
                                )}
                            </strong>
                        </div>
                    `;
                })
                .join("")}

        </div>
    `;

    const informationRows =
        rows
            .map((row) => {
                return `
                    <div class="comparison-row ${columnClass}">

                        <div class="comparison-label">
                            ${escapeCompareHtml(row.label)}
                        </div>

                        ${row.values
                            .map((value) => {
                                return `
                                    <div class="comparison-value">
                                        ${value}
                                    </div>
                                `;
                            })
                            .join("")}

                    </div>
                `;
            })
            .join("");

    return headerRow + informationRows;
}

/* =========================================================
   REMOVE SELECTED AGENCY
========================================================= */

function initializeRemoveButtons(elements) {
    elements.profileGrid
        .querySelectorAll(
            ".remove-comparison-agency"
        )
        .forEach((button) => {
            button.addEventListener("click", () => {
                const agencyId =
                    button.dataset.agencyId;

                const matchingSelector =
                    elements.selectors.find((selector) => {
                        return selector.value === agencyId;
                    });

                if (matchingSelector) {
                    matchingSelector.value = "";
                }

                preventDuplicateSelections(
                    elements.selectors
                );

                renderComparison(elements);
            });
        });
}

/* =========================================================
   HTML SAFETY
========================================================= */

function escapeCompareHtml(value) {
    const element =
        document.createElement("div");

    element.textContent =
        String(value);

    return element.innerHTML;
}