/* =========================================================
   AGENCY PRIVÉ — RANKINGS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    initializeRankings();
});

/* =========================================================
   RANKING DATA

   Real approved agencies will be loaded from Supabase.
========================================================= */

const rankingAgencies = [];

/* =========================================================
   INITIALIZE
========================================================= */

function initializeRankings() {
    const podium =
        document.getElementById("rankingPodium");

    const table =
        document.getElementById("rankingTable");

    if (!podium || !table) return;

    const elements = {
        category:
            document.getElementById(
                "rankingCategory"
            ),

        region:
            document.getElementById(
                "rankingRegion"
            ),

        search:
            document.getElementById(
                "rankingSearch"
            ),

        reset:
            document.getElementById(
                "resetRankings"
            ),

        emptyReset:
            document.getElementById(
                "emptyResetRankings"
            ),

        title:
            document.getElementById(
                "rankingTitle"
            ),

        count:
            document.getElementById(
                "rankingCount"
            ),

        podium,

        table,

        empty:
            document.getElementById(
                "rankingEmpty"
            )
    };

    const update = () => {
        renderRankings(elements);
    };

    elements.category?.addEventListener(
        "change",
        update
    );

    elements.region?.addEventListener(
        "change",
        update
    );

    elements.search?.addEventListener(
        "input",
        update
    );

    elements.reset?.addEventListener(
        "click",
        () => {
            resetRankings(elements);
        }
    );

    elements.emptyReset?.addEventListener(
        "click",
        () => {
            resetRankings(elements);
        }
    );

    renderRankings(elements);
}

/* =========================================================
   SCORE

   This will calculate ranking scores after Supabase returns
   real approved agency information.
========================================================= */

function calculateRankingScore(agency) {
    const ratingScore =
        (agency.rating / 5) * 35;

    const reviewConfidence =
        Math.min(
            agency.reviews / 100,
            1
        );

    const reputationScore =
        ratingScore *
        (
            0.75 +
            reviewConfidence * 0.25
        );

    const experienceScore =
        Math.min(
            agency.years / 10,
            1
        ) * 25;

    const verificationScore =
        agency.verified
            ? 20
            : 0;

    const profileScore =
        (
            agency.profileQuality /
            100
        ) * 20;

    return Number(
        (
            reputationScore +
            experienceScore +
            verificationScore +
            profileScore
        ).toFixed(1)
    );
}

/* =========================================================
   FILTER
========================================================= */

function getRankingResults(elements) {
    const category =
        elements.category?.value ||
        "overall";

    const region =
        elements.region?.value ||
        "";

    const search =
        elements.search?.value
            .trim()
            .toLowerCase() ||
        "";

    return rankingAgencies
        .filter((agency) => {
            const services =
                Array.isArray(
                    agency.services
                )
                    ? agency.services
                    : [];

            const matchesCategory =
                category === "overall" ||
                services.includes(category);

            const matchesRegion =
                !region ||
                agency.region === region;

            const matchesSearch =
                !search ||
                agency.name
                    .toLowerCase()
                    .includes(search);

            return (
                matchesCategory &&
                matchesRegion &&
                matchesSearch
            );
        })
        .map((agency) => {
            return {
                ...agency,
                score:
                    calculateRankingScore(
                        agency
                    )
            };
        })
        .sort((first, second) => {
            return (
                second.score -
                    first.score ||
                second.rating -
                    first.rating
            );
        });
}

/* =========================================================
   RENDER
========================================================= */

function renderRankings(elements) {
    const results =
        getRankingResults(elements);

    if (elements.count) {
        elements.count.textContent =
            results.length;
    }

    updateRankingTitle(elements);

    const noResults =
        results.length === 0;

    if (elements.empty) {
        elements.empty.hidden =
            !noResults;
    }

    elements.podium.hidden =
        noResults;

    elements.table.hidden =
        noResults;

    if (noResults) {
        elements.podium.innerHTML = "";
        elements.table.innerHTML = "";

        updateEmptyRankingMessage(
            elements
        );

        return;
    }

    elements.podium.innerHTML =
        results
            .slice(0, 3)
            .map((agency, index) => {
                return createPodiumCard(
                    agency,
                    index + 1
                );
            })
            .join("");

    elements.table.innerHTML =
        results
            .map((agency, index) => {
                return createRankingRow(
                    agency,
                    index + 1
                );
            })
            .join("");
}

function updateRankingTitle(elements) {
    if (!elements.title) return;

    const category =
        elements.category?.value ||
        "overall";

    const region =
        elements.region?.value ||
        "";

    let title =
        category === "overall"
            ? "Agency rankings"
            : `${category} agency rankings`;

    if (region) {
        title += ` in ${region}`;
    } else {
        title += " worldwide";
    }

    elements.title.textContent = title;
}

function updateEmptyRankingMessage(elements) {
    if (!elements.empty) return;

    const heading =
        elements.empty.querySelector(
            "h2, h3"
        );

    const description =
        elements.empty.querySelector("p");

    if (heading) {
        heading.textContent =
            "Rankings are not available yet.";
    }

    if (description) {
        description.textContent =
            "Rankings will appear when sufficient verified agency data becomes available.";
    }
}

/* =========================================================
   PODIUM
========================================================= */

function createPodiumCard(
    agency,
    position
) {
    const positions = [
        "position-one",
        "position-two",
        "position-three"
    ];

    const location =
        agency.location || "";

    const name =
        agency.name || "Unnamed Agency";

    const rating =
        Number(agency.rating) || 0;

    const score =
        Number(agency.score) || 0;

    return `
        <article
            class="podium-card
            ${positions[position - 1]}"
        >

            <span class="podium-position">
                ${String(position).padStart(
                    2,
                    "0"
                )}
            </span>

            <span class="podium-label">
                ${
                    position === 1
                        ? "TOP RANKED AGENCY"
                        : "GLOBAL RANKING"
                }
            </span>

            <div class="podium-agency">

                <h3>
                    ${escapeRankingHtml(name)}
                </h3>

                <span>
                    ${escapeRankingHtml(location)}
                </span>

                <div class="podium-score">

                    <div>
                        <strong>
                            ${score.toFixed(1)}
                        </strong>

                        <span>
                            Ranking score
                        </span>
                    </div>

                    <div>
                        <strong>
                            ${rating.toFixed(1)}
                        </strong>

                        <span>
                            Client rating
                        </span>
                    </div>

                </div>

                <a
                    href="agency-profile.html?id=${
                        agency.id
                    }"
                    class="podium-link"
                >
                    View Agency

                    <i class="fa-solid fa-arrow-right"></i>
                </a>

            </div>

        </article>
    `;
}

/* =========================================================
   TABLE ROW
========================================================= */

function createRankingRow(
    agency,
    position
) {
    const initials =
        agency.initials || "AP";

    const name =
        agency.name || "Unnamed Agency";

    const location =
        agency.location || "";

    const rating =
        Number(agency.rating) || 0;

    const reviews =
        Number(agency.reviews) || 0;

    const years =
        Number(agency.years) || 0;

    const score =
        Number(agency.score) || 0;

    return `
        <article class="ranking-row">

            <span class="ranking-number">
                ${String(position).padStart(
                    2,
                    "0"
                )}
            </span>

            <div class="ranking-agency">

                <span class="ranking-monogram">
                    ${escapeRankingHtml(
                        initials
                    )}
                </span>

                <div>
                    <strong>
                        ${escapeRankingHtml(
                            name
                        )}
                    </strong>

                    <span>
                        ${escapeRankingHtml(
                            location
                        )}
                    </span>
                </div>

            </div>

            <div class="ranking-value">
                <strong>
                    ${rating.toFixed(1)}
                </strong>

                <span>
                    ${reviews}
                    ${
                        reviews === 1
                            ? "review"
                            : "reviews"
                    }
                </span>
            </div>

            <div class="ranking-value">
                <strong>
                    ${years}
                    ${
                        years === 1
                            ? "year"
                            : "years"
                    }
                </strong>

                <span>
                    Experience
                </span>
            </div>

            <div class="ranking-value">
                <strong>
                    ${
                        agency.verified
                            ? "Verified"
                            : "Unverified"
                    }
                </strong>

                <span>
                    Trust status
                </span>
            </div>

            <strong class="ranking-total">
                ${score.toFixed(1)}
            </strong>

            <a
                href="agency-profile.html?id=${
                    agency.id
                }"
            >
                View

                <i class="fa-solid fa-arrow-right"></i>
            </a>

        </article>
    `;
}

/* =========================================================
   RESET
========================================================= */

function resetRankings(elements) {
    if (elements.category) {
        elements.category.value =
            "overall";
    }

    if (elements.region) {
        elements.region.value = "";
    }

    if (elements.search) {
        elements.search.value = "";
    }

    renderRankings(elements);
}

/* =========================================================
   HTML SAFETY
========================================================= */

function escapeRankingHtml(value) {
    const element =
        document.createElement("div");

    element.textContent =
        String(value);

    return element.innerHTML;
}