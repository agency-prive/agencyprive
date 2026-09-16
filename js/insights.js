/* =========================================================
   AGENCY PRIVÉ — INSIGHTS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    initializeInsights();
    initializeNewsletter();
});

/* =========================================================
   INSIGHT ARTICLES

   Published articles will be loaded from Supabase.
========================================================= */

const insightArticles = [];

/* =========================================================
   INITIALIZE INSIGHTS
========================================================= */

function initializeInsights() {
    const grid =
        document.getElementById(
            "insightGrid"
        );

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
            document.getElementById(
                "insightCount"
            ),

        empty:
            document.getElementById(
                "insightEmpty"
            ),

        search:
            document.getElementById(
                "insightSearch"
            ),

        categories:
            document.querySelectorAll(
                "[data-category]"
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
        button.addEventListener(
            "click",
            () => {
                elements.categories.forEach(
                    (categoryButton) => {
                        categoryButton.classList.remove(
                            "active"
                        );

                        categoryButton.setAttribute(
                            "aria-pressed",
                            "false"
                        );
                    }
                );

                button.classList.add("active");

                button.setAttribute(
                    "aria-pressed",
                    "true"
                );

                state.category =
                    button.dataset.category ||
                    "All";

                state.visible = 6;

                renderInsights(
                    state,
                    elements
                );
            }
        );
    });

    elements.search?.addEventListener(
        "input",
        () => {
            state.search =
                elements.search.value
                    .trim()
                    .toLowerCase();

            state.visible = 6;

            renderInsights(
                state,
                elements
            );
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

    renderInsights(state, elements);
}

/* =========================================================
   FILTER
========================================================= */

function getFilteredInsights(state) {
    return insightArticles.filter(
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
    const results =
        getFilteredInsights(state);

    const visibleResults =
        results.slice(
            0,
            state.visible
        );

    if (elements.count) {
        elements.count.textContent =
            results.length;
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
            state.visible >=
                results.length;
    }

    updateEmptyInsightMessage(
        state,
        elements,
        noResults
    );
}

function updateEmptyInsightMessage(
    state,
    elements,
    noResults
) {
    if (!noResults || !elements.empty) {
        return;
    }

    const heading =
        elements.empty.querySelector(
            "h2, h3"
        );

    const description =
        elements.empty.querySelector("p");

    const hasActiveFilters =
        state.category !== "All" ||
        Boolean(state.search);

    if (hasActiveFilters) {
        if (heading) {
            heading.textContent =
                "No insights match your search.";
        }

        if (description) {
            description.textContent =
                "Try another search term or clear the selected category.";
        }

        return;
    }

    if (heading) {
        heading.textContent =
            "No insights have been published yet.";
    }

    if (description) {
        description.textContent =
            "Research, agency guidance, and industry updates will appear here after publication.";
    }
}

/* =========================================================
   INSIGHT CARD
========================================================= */

function createInsightCard(article) {
    const themeClass =
        article.theme === "dark"
            ? ""
            : article.theme || "";

    const number =
        article.number || "";

    const category =
        article.category || "Insights";

    const title =
        article.title ||
        "Untitled article";

    const description =
        article.description || "";

    const readTime =
        article.readTime || "";

    return `
        <article class="insight-card">

            <div
                class="insight-card-visual
                ${escapeInsightHtml(
                    themeClass
                )}"
            >
                <span>
                    ${escapeInsightHtml(
                        number
                    )}
                </span>
            </div>

            <div class="insight-card-content">

                <span class="insight-card-category">
                    ${escapeInsightHtml(
                        category
                    )}
                </span>

                <h3>
                    ${escapeInsightHtml(
                        title
                    )}
                </h3>

                <p>
                    ${escapeInsightHtml(
                        description
                    )}
                </p>

                <div class="insight-card-footer">

                    <span>
                        ${escapeInsightHtml(
                            readTime
                        )}
                    </span>

                    <a
                        href="insight-article.html?id=${
                            article.id
                        }"
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
        const isAllCategory =
            button.dataset.category ===
            "All";

        button.classList.toggle(
            "active",
            isAllCategory
        );

        button.setAttribute(
            "aria-pressed",
            isAllCategory
                ? "true"
                : "false"
        );
    });

    renderInsights(state, elements);
}

/* =========================================================
   NEWSLETTER

   This validates the interface only.
   Subscriptions will later be stored through Supabase.
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

    form.addEventListener(
        "submit",
        (event) => {
            event.preventDefault();

            const emailValue =
                email.value.trim();

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

            if (
                !emailPattern.test(
                    emailValue
                )
            ) {
                message.textContent =
                    "Enter a valid business email address.";

                message.className =
                    "newsletter-message error";

                email.focus();
                return;
            }

            message.textContent =
                "Newsletter subscriptions will become available after Supabase is connected.";

            message.className =
                "newsletter-message information";
        }
    );

    email.addEventListener(
        "input",
        () => {
            message.textContent = "";

            message.className =
                "newsletter-message";
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