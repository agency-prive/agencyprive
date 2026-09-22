/* =========================================================
   AGENCY PRIVÉ — ONLYFANS INDUSTRY INSIGHTS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    initializeInsights();
    initializeNewsletter();
});

/* =========================================================
   INSIGHT ARTICLES

   Add published articles here or load them from Supabase.

   Each public article must have:
   - A real published page
   - published: true
   - A category matching a filter in insights.html

   No unpublished or sample articles appear in the library.
========================================================= */

const insightArticles = [];

/* =========================================================
   INITIALIZE INSIGHTS
========================================================= */

function initializeInsights() {
    const grid =
        document.getElementById("insightGrid");

    if (!grid) return;

    const state = {
        category: "All",
        search: "",
        visible: 6,
        increment: 3
    };

    const elements = {
        grid,

        count:
            document.getElementById("insightCount"),

        empty:
            document.getElementById("insightEmpty"),

        search:
            document.getElementById("insightSearch"),

        categories:
            document.querySelectorAll(
                "#insightCategories [data-category]"
            ),

        clear:
            document.getElementById(
                "clearInsightFilters"
            ),

        loadMore:
            document.getElementById(
                "loadMoreInsights"
            )
    };

    elements.categories.forEach((button) => {
        button.addEventListener("click", () => {
            state.category =
                button.dataset.category || "All";

            state.visible = 6;

            updateCategoryButtons(elements);

            renderInsights(state, elements);
        });
    });

    elements.search?.addEventListener(
        "input",
        () => {
            state.search =
                elements.search.value
                    .trim()
                    .toLowerCase();

            state.visible = 6;

            renderInsights(state, elements);
        }
    );

    elements.clear?.addEventListener(
        "click",
        () => {
            clearInsightFilters(
                state,
                elements
            );
        }
    );

    elements.loadMore?.addEventListener(
        "click",
        () => {
            state.visible +=
                state.increment;

            renderInsights(
                state,
                elements
            );
        }
    );

    updateCategoryButtons(elements);
    renderInsights(state, elements);

    function updateCategoryButtons() {
        elements.categories.forEach((button) => {
            const isActive =
                button.dataset.category ===
                state.category;

            button.classList.toggle(
                "active",
                isActive
            );

            button.setAttribute(
                "aria-pressed",
                String(isActive)
            );
        });
    }
}

/* =========================================================
   FILTER
========================================================= */

function getPublishedInsights() {
    return insightArticles.filter((article) => {
        return (
            article.published === true &&
            article.id !== undefined &&
            Boolean(article.title)
        );
    });
}

function getFilteredInsights(state) {
    return getPublishedInsights().filter(
        (article) => {
            const matchesCategory =
                state.category === "All" ||
                article.category ===
                    state.category;

            const searchableText = [
                article.title || "",
                article.description || "",
                article.category || ""
            ]
                .join(" ")
                .toLowerCase();

            const matchesSearch =
                !state.search ||
                searchableText.includes(
                    state.search
                );

            return (
                matchesCategory &&
                matchesSearch
            );
        }
    );
}

/* =========================================================
   RENDER
========================================================= */

function renderInsights(state, elements) {
    const publishedArticles =
        getPublishedInsights();

    const results =
        getFilteredInsights(state);

    const visibleResults =
        results.slice(
            0,
            state.visible
        );

    if (elements.count) {
        elements.count.textContent =
            String(results.length);
    }

    elements.grid.innerHTML =
        visibleResults
            .map(createInsightCard)
            .join("");

    const noResults =
        results.length === 0;

    if (elements.empty) {
        elements.empty.hidden =
            !noResults;
    }

    elements.grid.hidden =
        noResults;

    if (elements.loadMore) {
        elements.loadMore.hidden =
            noResults ||
            state.visible >= results.length;
    }

    updateEmptyInsightMessage(
        state,
        elements,
        publishedArticles.length
    );
}

function updateEmptyInsightMessage(
    state,
    elements,
    publishedCount
) {
    if (!elements.empty) return;

    const heading =
        elements.empty.querySelector(
            "h2, h3"
        );

    const description =
        elements.empty.querySelector("p");

    const hasActiveFilters =
        state.category !== "All" ||
        Boolean(state.search);

    if (publishedCount === 0) {
        if (heading) {
            heading.textContent =
                "Insights are coming soon";
        }

        if (description) {
            description.textContent =
                "OnlyFans industry guides and agency research will appear here when they are published.";
        }

        if (elements.clear) {
            elements.clear.hidden = true;
        }

        return;
    }

    if (hasActiveFilters) {
        if (heading) {
            heading.textContent =
                "No insights match your search";
        }

        if (description) {
            description.textContent =
                "Try another search term or clear the selected category.";
        }

        if (elements.clear) {
            elements.clear.hidden = false;
        }

        return;
    }

    if (heading) {
        heading.textContent =
            "No insights available";
    }

    if (description) {
        description.textContent =
            "Published articles will appear here.";
    }

    if (elements.clear) {
        elements.clear.hidden = true;
    }
}

/* =========================================================
   INSIGHT CARD
========================================================= */

function createInsightCard(article) {
    const allowedThemes = [
        "light",
        "gold"
    ];

    const themeClass =
        allowedThemes.includes(article.theme)
            ? article.theme
            : "";

    return `
        <article class="insight-card">

            <div class="insight-card-visual ${themeClass}">
                <span>
                    ${escapeInsightHtml(
                        article.number || ""
                    )}
                </span>
            </div>

            <div class="insight-card-content">

                <span class="insight-card-category">
                    ${escapeInsightHtml(
                        article.category || "Insights"
                    )}
                </span>

                <h3>
                    ${escapeInsightHtml(
                        article.title
                    )}
                </h3>

                <p>
                    ${escapeInsightHtml(
                        article.description || ""
                    )}
                </p>

                <div class="insight-card-footer">
                    <span>
                        ${escapeInsightHtml(
                            article.readTime || ""
                        )}
                    </span>

                    <a
                        href="insight-article.html?id=${encodeURIComponent(
                            article.id
                        )}"
                    >
                        Read
                        <i class="fa-solid fa-arrow-right"></i>
                    </a>
                </div>

            </div>

        </article>
    `;
}

/* =========================================================
   CLEAR FILTERS
========================================================= */

function clearInsightFilters(
    state,
    elements
) {
    state.category = "All";
    state.search = "";
    state.visible = 6;

    if (elements.search) {
        elements.search.value = "";
    }

    elements.categories.forEach((button) => {
        const isActive =
            button.dataset.category === "All";

        button.classList.toggle(
            "active",
            isActive
        );

        button.setAttribute(
            "aria-pressed",
            String(isActive)
        );
    });

    renderInsights(state, elements);
}

/* =========================================================
   NEWSLETTER

   Subscriptions are closed until a real signup service
   is connected. Do not collect email addresses locally.
========================================================= */

function initializeNewsletter() {
    const form =
        document.getElementById(
            "newsletterForm"
        );

    const email =
        document.getElementById(
            "newsletterEmail"
        );

    const message =
        document.getElementById(
            "newsletterMessage"
        );

    if (!form || !email || !message) {
        return;
    }

    email.disabled = true;

    const submitButton =
        form.querySelector(
            'button[type="submit"]'
        );

    if (submitButton) {
        submitButton.disabled = true;
    }

    message.textContent =
        "Newsletter subscriptions are not open yet.";

    form.addEventListener(
        "submit",
        (event) => {
            event.preventDefault();
        }
    );
}

/* =========================================================
   HTML SAFETY
========================================================= */

function escapeInsightHtml(value) {
    const element =
        document.createElement("div");

    element.textContent =
        String(value);

    return element.innerHTML;
}