/* =========================================================
   AGENCY PRIVÉ — COMPARE AGENCIES
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    initializeAgencyComparison();
});

/* =========================================================
   COMPARISON DATA

   Real approved agencies will be loaded from Supabase.
========================================================= */

const comparisonAgencies = [];

/* =========================================================
   INITIALIZE
========================================================= */

function initializeAgencyComparison() {
    const selectors = [
        document.getElementById(
            "compareAgencyOne"
        ),
        document.getElementById(
            "compareAgencyTwo"
        ),
        document.getElementById(
            "compareAgencyThree"
        )
    ];

    if (
        selectors.some(
            (selector) => !selector
        )
    ) {
        return;
    }

    const elements = {
        selectors,

        status:
            document.getElementById(
                "compareStatus"
            ),

        empty:
            document.getElementById(
                "compareEmptySection"
            ),

        comparison:
            document.getElementById(
                "comparisonSection"
            ),

        profileGrid:
            document.getElementById(
                "comparisonProfileGrid"
            ),

        table:
            document.getElementById(
                "comparisonTable"
            ),

        reset:
            document.getElementById(
                "resetComparison"
            )
    };

    populateAgencySelectors(
        selectors
    );

    selectors.forEach((selector) => {
        selector.addEventListener(
            "change",
            () => {
                preventDuplicateSelections(
                    selectors
                );

                renderComparison(
                    elements
                );
            }
        );
    });

    elements.reset?.addEventListener(
        "click",
        () => {
            selectors.forEach(
                (selector) => {
                    selector.value = "";
                }
            );

            preventDuplicateSelections(
                selectors
            );

            renderComparison(elements);
        }
    );

    renderComparison(elements);
}

/* =========================================================
   SELECTORS
========================================================= */

function populateAgencySelectors(
    selectors
) {
    const agenciesAreAvailable =
        comparisonAgencies.length > 0;

    selectors.forEach(
        (selector, index) => {
            selector.innerHTML = "";

            const placeholder =
                document.createElement(
                    "option"
                );

            placeholder.value = "";

            placeholder.textContent =
                agenciesAreAvailable
                    ? `Select agency ${
                        index + 1
                    }`
                    : "No agencies available";

            placeholder.selected = true;

            selector.appendChild(
                placeholder
            );

            if (!agenciesAreAvailable) {
                selector.disabled = true;
                return;
            }

            selector.disabled = false;

            comparisonAgencies.forEach(
                (agency) => {
                    const option =
                        document.createElement(
                            "option"
                        );

                    option.value =
                        String(agency.id);

                    option.textContent =
                        agency.name;

                    selector.appendChild(
                        option
                    );
                }
            );
        }
    );
}

function preventDuplicateSelections(
    selectors
) {
    const selectedValues =
        selectors
            .map(
                (selector) =>
                    selector.value
            )
            .filter(Boolean);

    selectors.forEach((selector) => {
        Array.from(
            selector.options
        ).forEach((option) => {
            if (!option.value) {
                option.disabled = false;
                return;
            }

            option.disabled =
                selectedValues.includes(
                    option.value
                ) &&
                selector.value !==
                    option.value;
        });
    });
}

/* =========================================================
   SELECTED AGENCIES
========================================================= */

function getSelectedAgencies(
    selectors
) {
    return selectors
        .map((selector) => {
            const selectedId =
                Number(selector.value);

            return comparisonAgencies.find(
                (agency) => {
                    return (
                        agency.id ===
                        selectedId
                    );
                }
            );
        })
        .filter(Boolean);
}

/* =========================================================
   RENDER
========================================================= */

function renderComparison(elements) {
    const selectedAgencies =
        getSelectedAgencies(
            elements.selectors
        );

    const agenciesAreAvailable =
        comparisonAgencies.length > 0;

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
            agenciesAreAvailable
                ? createStatusMessage(
                    selectedAgencies.length
                )
                : "Agency comparison will become available when approved agencies are published.";
    }

    updateEmptyComparisonMessage(
        elements,
        agenciesAreAvailable
    );

    if (!hasComparison) {
        if (elements.profileGrid) {
            elements.profileGrid.innerHTML =
                "";
        }

        if (elements.table) {
            elements.table.innerHTML =
                "";
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

    initializeRemoveButtons(
        elements
    );

    elements.comparison.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

function updateEmptyComparisonMessage(
    elements,
    agenciesAreAvailable
) {
    if (!elements.empty) return;

    const heading =
        elements.empty.querySelector(
            "h2, h3"
        );

    const description =
        elements.empty.querySelector("p");

    if (!agenciesAreAvailable) {
        if (heading) {
            heading.textContent =
                "No agencies available to compare.";
        }

        if (description) {
            description.textContent =
                "Approved agencies will become available here after they are published.";
        }

        return;
    }

    if (heading) {
        heading.textContent =
            "Select agencies to compare.";
    }

    if (description) {
        description.textContent =
            "Choose at least two agencies to view a detailed side-by-side comparison.";
    }
}

function createStatusMessage(
    selectedCount
) {
    if (selectedCount === 0) {
        return "Select at least two agencies to begin comparing.";
    }

    if (selectedCount === 1) {
        return "Select one more agency to begin comparing.";
    }

    if (selectedCount === 2) {
        return "Comparing two agencies. You may add one more.";
    }

    return "Comparing the maximum of three agencies.";
}

/* =========================================================
   PROFILE CARDS
========================================================= */

function createComparisonCard(
    agency
) {
    const services =
        Array.isArray(agency.services)
            ? agency.services
            : [];

    const serviceTags =
        services
            .map((service) => {
                return `
                    <span>
                        ${escapeCompareHtml(
                            service
                        )}
                    </span>
                `;
            })
            .join("");

    const initials =
        agency.initials || "AP";

    const name =
        agency.name || "Unnamed Agency";

    const location =
        agency.location || "";

    return `
        <article
            class="comparison-profile-card ${
                agency.featured
                    ? "featured"
                    : ""
            }"
        >
            <div class="comparison-card-heading">

                <span class="comparison-monogram">
                    ${escapeCompareHtml(
                        initials
                    )}
                </span>

                <button
                    type="button"
                    class="remove-comparison-agency"
                    data-agency-id="${
                        agency.id
                    }"
                    aria-label="Remove ${escapeCompareHtml(
                        name
                    )}"
                >
                    <i class="fa-solid fa-xmark"></i>
                </button>

            </div>

            <h2>
                ${escapeCompareHtml(name)}
            </h2>

            <span class="comparison-location">
                <i class="fa-solid fa-location-dot"></i>

                ${escapeCompareHtml(
                    location
                )}
            </span>

            <div class="comparison-services">
                ${serviceTags}
            </div>

            <a
                href="agency-profile.html?id=${
                    agency.id
                }"
            >
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

            values: agencies.map(
                (agency) => {
                    const rating =
                        Number(
                            agency.rating
                        ) || 0;

                    const reviews =
                        Number(
                            agency.reviews
                        ) || 0;

                    return `
                        <i class="fa-solid fa-star"></i>

                        ${rating.toFixed(1)}

                        (${reviews}
                        ${
                            reviews === 1
                                ? "review"
                                : "reviews"
                        })
                    `;
                }
            )
        },
        {
            label: "Verification",

            values: agencies.map(
                (agency) => {
                    return agency.verified
                        ? `
                            <i class="fa-solid fa-circle-check"></i>
                            Verified
                        `
                        : "Not verified";
                }
            )
        },
        {
            label: "Years active",

            values: agencies.map(
                (agency) => {
                    const years =
                        Number(
                            agency.years
                        ) || 0;

                    return `${years} ${
                        years === 1
                            ? "year"
                            : "years"
                    }`;
                }
            )
        },
        {
            label: "Team size",

            values: agencies.map(
                (agency) => {
                    return escapeCompareHtml(
                        agency.size || ""
                    );
                }
            )
        },
        {
            label: "Primary region",

            values: agencies.map(
                (agency) => {
                    return escapeCompareHtml(
                        agency.region || ""
                    );
                }
            )
        },
        {
            label: "Profile quality",

            values: agencies.map(
                (agency) => {
                    const profileQuality =
                        Number(
                            agency.profileQuality
                        ) || 0;

                    return `${profileQuality}%`;
                }
            )
        },
        {
            label: "Typical response",

            values: agencies.map(
                (agency) => {
                    return escapeCompareHtml(
                        agency.responseTime ||
                            "Not available"
                    );
                }
            )
        },
        {
            label: "Services listed",

            values: agencies.map(
                (agency) => {
                    const services =
                        Array.isArray(
                            agency.services
                        )
                            ? agency.services
                            : [];

                    return `${
                        services.length
                    } ${
                        services.length === 1
                            ? "service"
                            : "services"
                    }`;
                }
            )
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
                                    agency.name ||
                                        "Unnamed Agency"
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
                            ${escapeCompareHtml(
                                row.label
                            )}
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

    return (
        headerRow +
        informationRows
    );
}

/* =========================================================
   REMOVE SELECTED AGENCY
========================================================= */

function initializeRemoveButtons(
    elements
) {
    document
        .querySelectorAll(
            ".remove-comparison-agency"
        )
        .forEach((button) => {
            button.addEventListener(
                "click",
                () => {
                    const agencyId =
                        button.dataset
                            .agencyId;

                    const matchingSelector =
                        elements.selectors.find(
                            (selector) => {
                                return (
                                    selector.value ===
                                    agencyId
                                );
                            }
                        );

                    if (matchingSelector) {
                        matchingSelector.value =
                            "";
                    }

                    preventDuplicateSelections(
                        elements.selectors
                    );

                    renderComparison(
                        elements
                    );
                }
            );
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