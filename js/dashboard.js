/* =========================================================
   AGENCY PRIVÉ — DASHBOARD PREVIEW

   The dashboard is a public interface preview.
   Authentication, profile editing, analytics, and billing
   will be connected after the backend is ready.
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    initializeDashboardSidebar();
    initializeDashboardNavigation();
    initializeDashboardPreviewActions();
});

/* =========================================================
   MOBILE SIDEBAR
========================================================= */

function initializeDashboardSidebar() {
    const sidebar = document.getElementById(
        "dashboardSidebar"
    );

    const overlay = document.getElementById(
        "sidebarOverlay"
    );

    const openButton = document.getElementById(
        "sidebarOpen"
    );

    const closeButton = document.getElementById(
        "sidebarClose"
    );

    if (!sidebar) return;

    function setSidebarOpen(open) {
        sidebar.classList.toggle("open", open);
        overlay?.classList.toggle("show", open);

        openButton?.setAttribute(
            "aria-expanded",
            String(open)
        );

        document.body.style.overflow = open
            ? "hidden"
            : "";

        if (open) {
            closeButton?.focus();
        } else if (
            sidebar.contains(document.activeElement)
        ) {
            openButton?.focus();
        }
    }

    openButton?.setAttribute("aria-expanded", "false");
    openButton?.setAttribute(
        "aria-controls",
        "dashboardSidebar"
    );

    openButton?.addEventListener("click", () => {
        setSidebarOpen(true);
    });

    closeButton?.addEventListener("click", () => {
        setSidebarOpen(false);
    });

    overlay?.addEventListener("click", () => {
        setSidebarOpen(false);
    });

    document.addEventListener("keydown", (event) => {
        if (
            event.key === "Escape" &&
            sidebar.classList.contains("open")
        ) {
            setSidebarOpen(false);
        }
    });

    sidebar.addEventListener("click", (event) => {
        if (
            event.target.closest("a") &&
            window.innerWidth <= 820
        ) {
            setSidebarOpen(false);
        }
    });
}

/* =========================================================
   SECTION NAVIGATION
========================================================= */

function initializeDashboardNavigation() {
    const links = Array.from(
        document.querySelectorAll(
            ".dashboard-navigation a"
        )
    );

    links.forEach((link) => {
        link.addEventListener("click", () => {
            links.forEach((item) => {
                item.classList.remove("active");
            });

            link.classList.add("active");
        });
    });
}

/* =========================================================
   PREVIEW ACTIONS
========================================================= */

function initializeDashboardPreviewActions() {
    const logoutButton = document.getElementById(
        "logoutButton"
    );

    logoutButton?.addEventListener("click", () => {
        /*
         * There is no authenticated session to end yet.
         * Return to the login page without claiming a logout.
         */
        window.location.href = "login.html";
    });
}