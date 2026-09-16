/* =========================================================
   AGENCY PRIVÉ — DEMO REQUEST JAVASCRIPT

   Frontend validation only.
   Requests will be submitted to Supabase later.
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    initializeDemoForm();
    initializeDemoCharacterCounter();
    preselectRequestedPlan();
});

/* =========================================================
   HELPERS
========================================================= */

function getDemoElement(elementId) {
    return document.getElementById(elementId);
}

function isValidDemoEmail(emailAddress) {
    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    return emailPattern.test(
        emailAddress.trim()
    );
}

function isValidDemoWebsite(websiteAddress) {
    if (!websiteAddress.trim()) {
        return true;
    }

    try {
        const website =
            new URL(websiteAddress.trim());

        return (
            website.protocol === "http:" ||
            website.protocol === "https:"
        );
    } catch {
        return false;
    }
}

function simulateDemoRequest(
    duration = 900
) {
    return new Promise((resolve) => {
        window.setTimeout(resolve, duration);
    });
}

/* =========================================================
   FORM MESSAGE
========================================================= */

function showDemoMessage(
    message,
    messageType = "information"
) {
    const messageElement =
        getDemoElement("demoMessage");

    if (!messageElement) return;

    messageElement.textContent = message;

    messageElement.className =
        `demo-message show ${messageType}`;

    messageElement.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });
}

function clearDemoMessage() {
    const messageElement =
        getDemoElement("demoMessage");

    if (!messageElement) return;

    messageElement.textContent = "";
    messageElement.className =
        "demo-message";
}

/* =========================================================
   FIELD ERRORS
========================================================= */

function setDemoFieldError(
    input,
    errorElementId,
    message
) {
    const errorElement =
        getDemoElement(errorElementId);

    if (input) {
        input.classList.add("invalid");

        input.setAttribute(
            "aria-invalid",
            "true"
        );
    }

    if (errorElement) {
        errorElement.textContent =
            message;
    }
}

function clearDemoFieldError(
    input,
    errorElementId
) {
    const errorElement =
        getDemoElement(errorElementId);

    if (input) {
        input.classList.remove("invalid");

        input.removeAttribute(
            "aria-invalid"
        );
    }

    if (errorElement) {
        errorElement.textContent = "";
    }
}

/* =========================================================
   INITIALIZE FORM
========================================================= */

function initializeDemoForm() {
    const form =
        getDemoElement("demoForm");

    if (!form) return;

    const fields = [
        {
            inputId: "demoFirstName",
            errorId: "demoFirstNameError"
        },
        {
            inputId: "demoLastName",
            errorId: "demoLastNameError"
        },
        {
            inputId: "demoEmail",
            errorId: "demoEmailError"
        },
        {
            inputId: "demoAgencyName",
            errorId: "demoAgencyNameError"
        },
        {
            inputId: "demoAgencySize",
            errorId: "demoAgencySizeError"
        },
        {
            inputId: "demoPlan",
            errorId: "demoPlanError"
        },
        {
            inputId: "demoWebsite",
            errorId: "demoWebsiteError"
        },
        {
            inputId: "demoGoals",
            errorId: "demoGoalsError"
        }
    ];

    fields.forEach((field) => {
        const input =
            getDemoElement(field.inputId);

        if (!input) return;

        const clearError = () => {
            clearDemoFieldError(
                input,
                field.errorId
            );

            clearDemoMessage();
        };

        input.addEventListener(
            "input",
            clearError
        );

        input.addEventListener(
            "change",
            clearError
        );
    });

    const consent =
        getDemoElement("demoConsent");

    consent?.addEventListener(
        "change",
        () => {
            const consentError =
                getDemoElement(
                    "demoConsentError"
                );

            if (consentError) {
                consentError.textContent = "";
            }

            clearDemoMessage();
        }
    );

    form.addEventListener(
        "submit",
        async (event) => {
            event.preventDefault();

            clearDemoMessage();

            const formIsValid =
                validateDemoForm();

            if (!formIsValid) {
                showDemoMessage(
                    "Please complete the highlighted fields before requesting your demo.",
                    "error"
                );

                focusFirstDemoError();
                return;
            }

            setDemoButtonLoading(true);

            /*
             * This delay is temporary.
             *
             * It will eventually be replaced by:
             *
             * supabase
             *     .from("demo_requests")
             *     .insert(...)
             *
             * No demo information is currently stored.
             */
            await simulateDemoRequest(1000);

            setDemoButtonLoading(false);

            showDemoMessage(
                "Your demo request form is working. Supabase must be connected before requests can be submitted.",
                "information"
            );
        }
    );
}

/* =========================================================
   COMPLETE FORM VALIDATION
========================================================= */

function validateDemoForm() {
    const results = [
        validateDemoRequiredText(
            "demoFirstName",
            "demoFirstNameError",
            "First name is required."
        ),

        validateDemoRequiredText(
            "demoLastName",
            "demoLastNameError",
            "Last name is required."
        ),

        validateDemoEmail(),

        validateDemoRequiredText(
            "demoAgencyName",
            "demoAgencyNameError",
            "Agency name is required."
        ),

        validateDemoRequiredSelect(
            "demoAgencySize",
            "demoAgencySizeError",
            "Select your agency size."
        ),

        validateDemoRequiredSelect(
            "demoPlan",
            "demoPlanError",
            "Select the plan you would like to explore."
        ),

        validateDemoWebsite(),

        validateDemoGoals(),

        validateDemoConsent()
    ];

    return results.every(Boolean);
}

/* =========================================================
   REQUIRED TEXT
========================================================= */

function validateDemoRequiredText(
    inputId,
    errorId,
    errorMessage
) {
    const input =
        getDemoElement(inputId);

    if (!input) return false;

    if (!input.value.trim()) {
        setDemoFieldError(
            input,
            errorId,
            errorMessage
        );

        return false;
    }

    clearDemoFieldError(
        input,
        errorId
    );

    return true;
}

/* =========================================================
   REQUIRED SELECT
========================================================= */

function validateDemoRequiredSelect(
    selectId,
    errorId,
    errorMessage
) {
    const select =
        getDemoElement(selectId);

    if (!select) return false;

    if (!select.value) {
        setDemoFieldError(
            select,
            errorId,
            errorMessage
        );

        return false;
    }

    clearDemoFieldError(
        select,
        errorId
    );

    return true;
}

/* =========================================================
   EMAIL VALIDATION
========================================================= */

function validateDemoEmail() {
    const emailInput =
        getDemoElement("demoEmail");

    if (!emailInput) return false;

    const emailValue =
        emailInput.value.trim();

    if (!emailValue) {
        setDemoFieldError(
            emailInput,
            "demoEmailError",
            "Business email is required."
        );

        return false;
    }

    if (!isValidDemoEmail(emailValue)) {
        setDemoFieldError(
            emailInput,
            "demoEmailError",
            "Enter a valid business email address."
        );

        return false;
    }

    clearDemoFieldError(
        emailInput,
        "demoEmailError"
    );

    return true;
}

/* =========================================================
   WEBSITE VALIDATION
========================================================= */

function validateDemoWebsite() {
    const websiteInput =
        getDemoElement("demoWebsite");

    if (!websiteInput) return true;

    if (
        !isValidDemoWebsite(
            websiteInput.value
        )
    ) {
        setDemoFieldError(
            websiteInput,
            "demoWebsiteError",
            "Enter a complete address beginning with http:// or https://."
        );

        return false;
    }

    clearDemoFieldError(
        websiteInput,
        "demoWebsiteError"
    );

    return true;
}

/* =========================================================
   GOALS VALIDATION
========================================================= */

function validateDemoGoals() {
    const goalsInput =
        getDemoElement("demoGoals");

    if (!goalsInput) return false;

    const goalsValue =
        goalsInput.value.trim();

    if (!goalsValue) {
        setDemoFieldError(
            goalsInput,
            "demoGoalsError",
            "Tell us what you would like to explore during the demo."
        );

        return false;
    }

    if (goalsValue.length < 20) {
        setDemoFieldError(
            goalsInput,
            "demoGoalsError",
            "Please provide at least 20 characters."
        );

        return false;
    }

    clearDemoFieldError(
        goalsInput,
        "demoGoalsError"
    );

    return true;
}

/* =========================================================
   CONSENT VALIDATION
========================================================= */

function validateDemoConsent() {
    const consent =
        getDemoElement("demoConsent");

    const consentError =
        getDemoElement(
            "demoConsentError"
        );

    if (!consent) return false;

    if (!consent.checked) {
        if (consentError) {
            consentError.textContent =
                "Confirm that we may contact you about the demo request.";
        }

        return false;
    }

    if (consentError) {
        consentError.textContent = "";
    }

    return true;
}

/* =========================================================
   CHARACTER COUNTER
========================================================= */

function initializeDemoCharacterCounter() {
    const goalsInput =
        getDemoElement("demoGoals");

    const characterCount =
        getDemoElement(
            "demoCharacterCount"
        );

    if (
        !goalsInput ||
        !characterCount
    ) {
        return;
    }

    const updateCounter = () => {
        characterCount.textContent =
            goalsInput.value.length;
    };

    goalsInput.addEventListener(
        "input",
        updateCounter
    );

    updateCounter();
}

/* =========================================================
   PRESELECT PLAN FROM URL
========================================================= */

function preselectRequestedPlan() {
    const planSelect =
        getDemoElement("demoPlan");

    if (!planSelect) return;

    const parameters =
        new URLSearchParams(
            window.location.search
        );

    const requestedPlan =
        parameters.get("plan");

    const supportedPlans = [
        "free",
        "prive",
        "select",
        "elite",
        "not-sure"
    ];

    if (
        requestedPlan &&
        supportedPlans.includes(
            requestedPlan
        )
    ) {
        planSelect.value =
            requestedPlan;
    }
}

/* =========================================================
   BUTTON LOADING
========================================================= */

function setDemoButtonLoading(
    isLoading
) {
    const button =
        getDemoElement(
            "demoSubmitButton"
        );

    if (!button) return;

    const textElement =
        button.querySelector("span");

    const iconElement =
        button.querySelector("i");

    button.disabled = isLoading;

    if (textElement) {
        textElement.textContent =
            isLoading
                ? "Sending Request..."
                : "Request My Demo";
    }

    if (iconElement) {
        iconElement.className =
            isLoading
                ? "fa-solid fa-spinner fa-spin"
                : "fa-solid fa-arrow-right";
    }
}

/* =========================================================
   FOCUS FIRST ERROR
========================================================= */

function focusFirstDemoError() {
    const firstInvalid =
        document.querySelector(
            "#demoForm .invalid, " +
            "#demoConsent:not(:checked)"
        );

    firstInvalid?.focus();
}