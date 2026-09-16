/* =========================================================
   AGENCY PRIVÉ — AUTHENTICATION JAVASCRIPT

   Frontend validation and interface behavior.
   Registration data is not stored until Supabase is connected.
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    initializeLoginForm();
    initializeRegistrationForm();
    initializePasswordToggles();
    initializeForgotPassword();
    initializeGoogleLogin();
    loadRememberedEmail();
});

/* =========================================================
   SHARED HELPERS
========================================================= */

function getElement(elementId) {
    return document.getElementById(elementId);
}

function simulateRequest(duration = 800) {
    return new Promise((resolve) => {
        window.setTimeout(resolve, duration);
    });
}

function isValidEmail(emailAddress) {
    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    return emailPattern.test(
        emailAddress.trim()
    );
}

function isValidWebsite(websiteAddress) {
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

function setInputError(
    input,
    errorElementId,
    message
) {
    const errorElement =
        getElement(errorElementId);

    if (input) {
        input.classList.add("invalid");
        input.setAttribute(
            "aria-invalid",
            "true"
        );
    }

    if (errorElement) {
        errorElement.textContent = message;
    }
}

function clearInputError(
    input,
    errorElementId
) {
    const errorElement =
        getElement(errorElementId);

    if (input) {
        input.classList.remove("invalid");
        input.removeAttribute("aria-invalid");
    }

    if (errorElement) {
        errorElement.textContent = "";
    }
}

function showAuthMessage(
    message,
    messageType = "information"
) {
    const authMessage =
        getElement("authMessage");

    if (!authMessage) return;

    authMessage.textContent = message;

    authMessage.className =
        `auth-message show ${messageType}`;

    authMessage.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });
}

function clearAuthMessage() {
    const authMessage =
        getElement("authMessage");

    if (!authMessage) return;

    authMessage.textContent = "";
    authMessage.className = "auth-message";
}

/* =========================================================
   PASSWORD TOGGLES
========================================================= */

function initializePasswordToggles() {
    const configurations = [
        {
            buttonId: "passwordToggle",
            inputId: "password"
        },
        {
            buttonId: "registrationPasswordToggle",
            inputId: "registrationPassword"
        },
        {
            buttonId: "confirmPasswordToggle",
            inputId: "confirmPassword"
        }
    ];

    configurations.forEach((configuration) => {
        const toggleButton =
            getElement(configuration.buttonId);

        const passwordInput =
            getElement(configuration.inputId);

        if (!toggleButton || !passwordInput) {
            return;
        }

        toggleButton.addEventListener(
            "click",
            () => {
                const passwordIsHidden =
                    passwordInput.type ===
                    "password";

                passwordInput.type =
                    passwordIsHidden
                        ? "text"
                        : "password";

                const icon =
                    toggleButton.querySelector("i");

                if (icon) {
                    icon.className =
                        passwordIsHidden
                            ? "fa-regular fa-eye-slash"
                            : "fa-regular fa-eye";
                }

                toggleButton.setAttribute(
                    "aria-label",
                    passwordIsHidden
                        ? "Hide password"
                        : "Show password"
                );
            }
        );
    });
}

/* =========================================================
   LOGIN
========================================================= */

function initializeLoginForm() {
    const loginForm =
        getElement("loginForm");

    if (!loginForm) return;

    const emailInput =
        getElement("email");

    const passwordInput =
        getElement("password");

    const rememberMe =
        getElement("rememberMe");

    emailInput?.addEventListener(
        "input",
        () => {
            clearInputError(
                emailInput,
                "emailError"
            );

            clearAuthMessage();
        }
    );

    passwordInput?.addEventListener(
        "input",
        () => {
            clearInputError(
                passwordInput,
                "passwordError"
            );

            clearAuthMessage();
        }
    );

    emailInput?.addEventListener(
        "blur",
        validateLoginEmail
    );

    passwordInput?.addEventListener(
        "blur",
        validateLoginPassword
    );

    loginForm.addEventListener(
        "submit",
        async (event) => {
            event.preventDefault();
            clearAuthMessage();

            const emailIsValid =
                validateLoginEmail();

            const passwordIsValid =
                validateLoginPassword();

            if (
                !emailIsValid ||
                !passwordIsValid
            ) {
                showAuthMessage(
                    "Please review the highlighted fields.",
                    "error"
                );

                return;
            }

            saveRememberedEmail(
                emailInput,
                rememberMe
            );

            setButtonLoading(
                "loginButton",
                true,
                "Checking account..."
            );

            /*
             * Replace this delay with:
             *
             * supabase.auth.signInWithPassword()
             */
            await simulateRequest(900);

            setButtonLoading(
                "loginButton",
                false,
                "Log In to Dashboard"
            );

            showAuthMessage(
                "The login interface is ready. Connect Supabase before accepting real logins.",
                "information"
            );
        }
    );
}

function validateLoginEmail() {
    const emailInput =
        getElement("email");

    if (!emailInput) return false;

    const emailValue =
        emailInput.value.trim();

    if (!emailValue) {
        setInputError(
            emailInput,
            "emailError",
            "Email address is required."
        );

        return false;
    }

    if (!isValidEmail(emailValue)) {
        setInputError(
            emailInput,
            "emailError",
            "Enter a valid email address."
        );

        return false;
    }

    clearInputError(
        emailInput,
        "emailError"
    );

    return true;
}

function validateLoginPassword() {
    const passwordInput =
        getElement("password");

    if (!passwordInput) return false;

    if (!passwordInput.value) {
        setInputError(
            passwordInput,
            "passwordError",
            "Password is required."
        );

        return false;
    }

    if (passwordInput.value.length < 8) {
        setInputError(
            passwordInput,
            "passwordError",
            "Password must contain at least eight characters."
        );

        return false;
    }

    clearInputError(
        passwordInput,
        "passwordError"
    );

    return true;
}

/* =========================================================
   REMEMBER EMAIL
========================================================= */

function saveRememberedEmail(
    emailInput,
    rememberCheckbox
) {
    if (!emailInput || !rememberCheckbox) {
        return;
    }

    if (rememberCheckbox.checked) {
        localStorage.setItem(
            "agencyPriveRememberedEmail",
            emailInput.value.trim()
        );

        return;
    }

    localStorage.removeItem(
        "agencyPriveRememberedEmail"
    );
}

function loadRememberedEmail() {
    const emailInput =
        getElement("email");

    const rememberMe =
        getElement("rememberMe");

    if (!emailInput || !rememberMe) {
        return;
    }

    const rememberedEmail =
        localStorage.getItem(
            "agencyPriveRememberedEmail"
        );

    if (!rememberedEmail) return;

    emailInput.value = rememberedEmail;
    rememberMe.checked = true;
}

/* =========================================================
   FORGOT PASSWORD
========================================================= */

function initializeForgotPassword() {
    const forgotPassword =
        getElement("forgotPassword");

    const emailInput =
        getElement("email");

    if (!forgotPassword || !emailInput) {
        return;
    }

    forgotPassword.addEventListener(
        "click",
        (event) => {
            event.preventDefault();
            clearAuthMessage();

            const emailValue =
                emailInput.value.trim();

            if (!emailValue) {
                showAuthMessage(
                    "Enter your account email before requesting password recovery.",
                    "information"
                );

                emailInput.focus();
                return;
            }

            if (!isValidEmail(emailValue)) {
                setInputError(
                    emailInput,
                    "emailError",
                    "Enter a valid email address."
                );

                showAuthMessage(
                    "Enter a valid email before requesting password recovery.",
                    "error"
                );

                emailInput.focus();
                return;
            }

            /*
             * Replace with:
             *
             * supabase.auth.resetPasswordForEmail()
             */
            showAuthMessage(
                `Password recovery will be sent to ${emailValue} after Supabase is connected.`,
                "information"
            );
        }
    );
}

/* =========================================================
   GOOGLE LOGIN
========================================================= */

function initializeGoogleLogin() {
    const googleLogin =
        getElement("googleLogin");

    if (!googleLogin) return;

    googleLogin.addEventListener(
        "click",
        async () => {
            clearAuthMessage();

            const originalContent =
                googleLogin.innerHTML;

            googleLogin.disabled = true;

            googleLogin.innerHTML = `
                <i class="fa-solid fa-spinner fa-spin"></i>
                Connecting to Google...
            `;

            /*
             * Replace with:
             *
             * supabase.auth.signInWithOAuth()
             */
            await simulateRequest(850);

            googleLogin.disabled = false;
            googleLogin.innerHTML =
                originalContent;

            showAuthMessage(
                "Google login will become available after Supabase is connected.",
                "information"
            );
        }
    );
}

/* =========================================================
   REGISTRATION
========================================================= */

function initializeRegistrationForm() {
    const form =
        getElement("registrationForm");

    if (!form) return;

    let currentStep = 1;
    const totalSteps = 4;

    const steps = Array.from(
        form.querySelectorAll(".wizard-step")
    );

    const progressItems = Array.from(
        form.querySelectorAll(
            ".wizard-progress-item"
        )
    );

    const nextButtons =
        form.querySelectorAll(".wizard-next");

    const backButtons =
        form.querySelectorAll(".wizard-back");

    initializeRegistrationPlan();

    initializeConditionalField(
        "otherServiceCheckbox",
        "otherServiceField",
        "otherService"
    );

    initializeConditionalField(
        "otherNicheCheckbox",
        "otherNicheField",
        "otherNiche"
    );

    initializeSelectionCounters();
    initializeCountrySearch();
    initializeLogoUpload();
    initializeAboutCounter();
    initializeRegistrationFieldClearing();

    showRegistrationStep(currentStep);

    nextButtons.forEach((button) => {
        button.addEventListener(
            "click",
            () => {
                clearAuthMessage();

                if (
                    !validateRegistrationStep(
                        currentStep
                    )
                ) {
                    showAuthMessage(
                        "Please complete the required information before continuing.",
                        "error"
                    );

                    focusFirstInvalidField();
                    return;
                }

                if (currentStep < totalSteps) {
                    currentStep += 1;

                    showRegistrationStep(
                        currentStep
                    );

                    scrollRegistrationToTop();
                }
            }
        );
    });

    backButtons.forEach((button) => {
        button.addEventListener(
            "click",
            () => {
                clearAuthMessage();

                if (currentStep > 1) {
                    currentStep -= 1;

                    showRegistrationStep(
                        currentStep
                    );

                    scrollRegistrationToTop();
                }
            }
        );
    });

    progressItems.forEach((item) => {
        item.addEventListener(
            "click",
            () => {
                const targetStep =
                    Number(
                        item.dataset.stepTarget
                    );

                if (
                    targetStep < currentStep &&
                    item.classList.contains(
                        "completed"
                    )
                ) {
                    currentStep = targetStep;

                    showRegistrationStep(
                        currentStep
                    );

                    scrollRegistrationToTop();
                }
            }
        );
    });

    form.addEventListener(
        "submit",
        async (event) => {
            event.preventDefault();
            clearAuthMessage();

            if (!validateRegistrationStep(4)) {
                showAuthMessage(
                    "Please complete the required verification information.",
                    "error"
                );

                focusFirstInvalidField();
                return;
            }

            const selectedPlan =
                getSelectedPlanInformation();

            setButtonLoading(
                "registrationButton",
                true,
                "Submitting Agency..."
            );

            /*
             * Replace this demonstration with:
             *
             * 1. Supabase Auth signUp()
             * 2. Upload logo to Supabase Storage
             * 3. Insert agency profile
             * 4. Insert selected plan
             * 5. Insert services and expertise
             * 6. Insert countries served
             * 7. Insert social links
             *
             * No registration data is currently stored.
             */
            await simulateRequest(1100);

            setButtonLoading(
                "registrationButton",
                false,
                "Submit Agency"
            );

            showAuthMessage(
                `${selectedPlan.label} was selected. Connect Supabase before accepting real registrations.`,
                "information"
            );
        }
    );

    function showRegistrationStep(
        stepNumber
    ) {
        steps.forEach((step) => {
            const stepValue =
                Number(step.dataset.step);

            const isActive =
                stepValue === stepNumber;

            step.classList.toggle(
                "active",
                isActive
            );

            step.hidden = !isActive;
        });

        progressItems.forEach((item) => {
            const itemStep =
                Number(
                    item.dataset.stepTarget
                );

            item.classList.toggle(
                "active",
                itemStep === stepNumber
            );

            item.classList.toggle(
                "completed",
                itemStep < stepNumber
            );

            item.setAttribute(
                "aria-current",
                itemStep === stepNumber
                    ? "step"
                    : "false"
            );
        });
    }
}

/* =========================================================
   REGISTRATION PLAN
========================================================= */

function initializeRegistrationPlan() {
    const planSelect =
        getElement("registrationPlan");

    const planNote =
        getElement("registrationPlanNote");

    if (!planSelect) return;

    const planConfigurations = {
        free: {
            value: "free",
            label: "Free",
            note: "$0 forever. Create a permanent basic agency profile."
        },
        prive: {
            value: "prive",
            label: "Privé",
            note: "$59/month with a seven-day free trial."
        },
        select: {
            value: "select",
            label: "Privé Select",
            note: "$149/month with featured visibility and lead tools."
        },
        elite: {
            value: "elite",
            label: "Privé Elite",
            note: "$399/month. Application and approval may be required."
        }
    };

    const urlParameters =
        new URLSearchParams(
            window.location.search
        );

    const requestedPlan =
        urlParameters
            .get("plan")
            ?.trim()
            .toLowerCase();

    const planAliases = {
        free: "free",
        prive: "prive",
        privé: "prive",
        premium: "prive",
        pro: "prive",
        select: "select",
        "prive-select": "select",
        "privé-select": "select",
        featured: "select",
        elite: "elite",
        "prive-elite": "elite",
        "privé-elite": "elite"
    };

    const normalizedPlan =
        planAliases[requestedPlan];

    if (normalizedPlan) {
        planSelect.value = normalizedPlan;
    }

    const updatePlanNote = () => {
        const selectedPlan =
            planConfigurations[
                planSelect.value
            ];

        if (!planNote) return;

        planNote.textContent =
            selectedPlan
                ? selectedPlan.note
                : "Choose the plan that best fits your agency.";
    };

    planSelect.addEventListener(
        "change",
        () => {
            clearInputError(
                planSelect,
                "registrationPlanError"
            );

            clearAuthMessage();
            updatePlanNote();
        }
    );

    updatePlanNote();
}

function getSelectedPlanInformation() {
    const planSelect =
        getElement("registrationPlan");

    const planLabels = {
        free: "Free",
        prive: "Privé",
        select: "Privé Select",
        elite: "Privé Elite"
    };

    const planValue =
        planSelect?.value || "";

    return {
        value: planValue,
        label:
            planLabels[planValue] ||
            "Your plan"
    };
}

function validateRegistrationPlan() {
    return validateRequiredSelect(
        "registrationPlan",
        "registrationPlanError",
        "Select a registration plan."
    );
}

/* =========================================================
   CONDITIONAL FIELDS
========================================================= */

function initializeConditionalField(
    checkboxId,
    fieldContainerId,
    textInputId
) {
    const checkbox =
        getElement(checkboxId);

    const container =
        getElement(fieldContainerId);

    const input =
        getElement(textInputId);

    if (!checkbox || !container || !input) {
        return;
    }

    const updateField = () => {
        container.hidden =
            !checkbox.checked;

        if (checkbox.checked) {
            input.setAttribute(
                "required",
                ""
            );

            return;
        }

        input.removeAttribute("required");
        input.value = "";

        clearInputError(
            input,
            checkboxId ===
                "otherServiceCheckbox"
                ? "servicesError"
                : "creatorNichesError"
        );
    };

    checkbox.addEventListener(
        "change",
        updateField
    );

    updateField();
}

/* =========================================================
   SERVICE COUNTER
========================================================= */

function initializeSelectionCounters() {
    const serviceInputs =
        document.querySelectorAll(
            'input[name="services"]'
        );

    const counter =
        getElement("servicesSelectedCount");

    const updateCounter = () => {
        if (!counter) return;

        counter.textContent =
            document.querySelectorAll(
                'input[name="services"]:checked'
            ).length;
    };

    serviceInputs.forEach((input) => {
        input.addEventListener(
            "change",
            () => {
                updateCounter();

                const error =
                    getElement("servicesError");

                if (error) {
                    error.textContent = "";
                }
            }
        );
    });

    updateCounter();
}

/* =========================================================
   COUNTRY SEARCH
========================================================= */

function initializeCountrySearch() {
    const searchInput =
        getElement("countrySearch");

    const countryOptions =
        getElement("countryOptions");

    if (!searchInput || !countryOptions) {
        return;
    }

    const cards = Array.from(
        countryOptions.querySelectorAll(
            "[data-country]"
        )
    );

    searchInput.addEventListener(
        "input",
        () => {
            const searchValue =
                searchInput.value
                    .trim()
                    .toLowerCase();

            cards.forEach((card) => {
                const countryName =
                    card.dataset.country
                        .toLowerCase();

                card.classList.toggle(
                    "filtered-out",
                    !countryName.includes(
                        searchValue
                    )
                );
            });
        }
    );

    countryOptions.addEventListener(
        "change",
        () => {
            const error =
                getElement(
                    "countriesServedError"
                );

            if (error) {
                error.textContent = "";
            }
        }
    );
}

/* =========================================================
   LOGO UPLOAD
========================================================= */

function initializeLogoUpload() {
    const fileInput =
        getElement("agencyLogo");

    const preview =
        getElement("logoPreview");

    const error =
        getElement("agencyLogoError");

    if (!fileInput || !preview) return;

    fileInput.addEventListener(
        "change",
        () => {
            const file =
                fileInput.files?.[0];

            if (error) {
                error.textContent = "";
            }

            fileInput.classList.remove(
                "invalid"
            );

            if (!file) {
                resetLogoPreview(preview);
                return;
            }

            const allowedTypes = [
                "image/png",
                "image/jpeg",
                "image/webp"
            ];

            if (!allowedTypes.includes(file.type)) {
                fileInput.value = "";

                setInputError(
                    fileInput,
                    "agencyLogoError",
                    "Upload a PNG, JPG, or WEBP image."
                );

                resetLogoPreview(preview);
                return;
            }

            const maximumSize =
                5 * 1024 * 1024;

            if (file.size > maximumSize) {
                fileInput.value = "";

                setInputError(
                    fileInput,
                    "agencyLogoError",
                    "The logo must be smaller than 5 MB."
                );

                resetLogoPreview(preview);
                return;
            }

            const reader =
                new FileReader();

            reader.addEventListener(
                "load",
                () => {
                    preview.innerHTML = "";

                    const image =
                        document.createElement(
                            "img"
                        );

                    image.src = reader.result;
                    image.alt =
                        "Agency logo preview";

                    preview.appendChild(image);
                }
            );

            reader.readAsDataURL(file);
        }
    );
}

function resetLogoPreview(preview) {
    preview.innerHTML =
        '<i class="fa-regular fa-image"></i>';
}

/* =========================================================
   ABOUT COUNTER
========================================================= */

function initializeAboutCounter() {
    const textarea =
        getElement("agencyAbout");

    const counter =
        getElement("aboutCharacterCount");

    if (!textarea || !counter) return;

    const updateCounter = () => {
        counter.textContent =
            textarea.value.length;
    };

    textarea.addEventListener(
        "input",
        () => {
            updateCounter();

            clearInputError(
                textarea,
                "agencyAboutError"
            );
        }
    );

    updateCounter();
}

/* =========================================================
   CLEAR REGISTRATION ERRORS
========================================================= */

function initializeRegistrationFieldClearing() {
    const fields = [
        [
            "registrationPlan",
            "registrationPlanError"
        ],
        ["firstName", "firstNameError"],
        ["lastName", "lastNameError"],
        [
            "registrationEmail",
            "registrationEmailError"
        ],
        [
            "registrationPassword",
            "registrationPasswordError"
        ],
        [
            "confirmPassword",
            "confirmPasswordError"
        ],
        ["companyName", "companyNameError"],
        ["country", "countryError"],
        [
            "companyWebsite",
            "companyWebsiteError"
        ],
        [
            "yearsInBusiness",
            "yearsInBusinessError"
        ],
        ["agencyAbout", "agencyAboutError"],
        ["instagram", "instagramError"],
        ["xProfile", "xProfileError"],
        ["tiktok", "tiktokError"],
        ["linkedin", "linkedinError"]
    ];

    fields.forEach(
        ([inputId, errorId]) => {
            const input =
                getElement(inputId);

            if (!input) return;

            const clear = () => {
                clearInputError(
                    input,
                    errorId
                );

                clearAuthMessage();
            };

            input.addEventListener(
                "input",
                clear
            );

            input.addEventListener(
                "change",
                clear
            );
        }
    );

    const groupedInputs =
        document.querySelectorAll(
            'input[name="creatorNiches"], ' +
            'input[name="agencySize"]'
        );

    groupedInputs.forEach((input) => {
        input.addEventListener(
            "change",
            () => {
                const errorId =
                    input.name ===
                    "creatorNiches"
                        ? "creatorNichesError"
                        : "agencySizeError";

                const error =
                    getElement(errorId);

                if (error) {
                    error.textContent = "";
                }

                clearAuthMessage();
            }
        );
    });

    [
        [
            "authorizedRepresentative",
            "authorizedRepresentativeError"
        ],
        [
            "acceptTerms",
            "acceptTermsError"
        ]
    ].forEach(
        ([checkboxId, errorId]) => {
            const checkbox =
                getElement(checkboxId);

            checkbox?.addEventListener(
                "change",
                () => {
                    const error =
                        getElement(errorId);

                    if (error) {
                        error.textContent = "";
                    }

                    clearAuthMessage();
                }
            );
        }
    );
}

/* =========================================================
   STEP VALIDATION
========================================================= */

function validateRegistrationStep(
    stepNumber
) {
    switch (stepNumber) {
        case 1:
            return validateAgencyDetailsStep();

        case 2:
            return validateServicesStep();

        case 3:
            return validateExpertiseStep();

        case 4:
            return validateAboutStep();

        default:
            return false;
    }
}

function validateAgencyDetailsStep() {
    const results = [
        validateRegistrationPlan(),

        validateRequiredText(
            "firstName",
            "firstNameError",
            "First name is required."
        ),

        validateRequiredText(
            "lastName",
            "lastNameError",
            "Last name is required."
        ),

        validateRegistrationEmail(),

        validateRegistrationPassword(),

        validatePasswordConfirmation(),

        validateRequiredText(
            "companyName",
            "companyNameError",
            "Agency name is required."
        ),

        validateRequiredSelect(
            "country",
            "countryError",
            "Select your primary location."
        ),

        validateCompanyWebsite()
    ];

    return results.every(Boolean);
}

function validateServicesStep() {
    const selectedServices =
        document.querySelectorAll(
            'input[name="services"]:checked'
        );

    const error =
        getElement("servicesError");

    let valid =
        selectedServices.length > 0;

    if (!valid && error) {
        error.textContent =
            "Select at least one service.";
    }

    const otherCheckbox =
        getElement("otherServiceCheckbox");

    const otherInput =
        getElement("otherService");

    if (
        otherCheckbox?.checked &&
        !otherInput?.value.trim()
    ) {
        otherInput?.classList.add("invalid");

        if (error) {
            error.textContent =
                "Specify your additional service.";
        }

        valid = false;
    }

    if (valid && error) {
        error.textContent = "";
    }

    return valid;
}

function validateExpertiseStep() {
    const selectedNiches =
        document.querySelectorAll(
            'input[name="creatorNiches"]:checked'
        );

    const selectedCountries =
        document.querySelectorAll(
            'input[name="countriesServed"]:checked'
        );

    const selectedSize =
        document.querySelector(
            'input[name="agencySize"]:checked'
        );

    const nicheError =
        getElement("creatorNichesError");

    const countryError =
        getElement("countriesServedError");

    const sizeError =
        getElement("agencySizeError");

    let nichesValid =
        selectedNiches.length > 0;

    const countriesValid =
        selectedCountries.length > 0;

    const sizeValid =
        Boolean(selectedSize);

    if (nicheError) {
        nicheError.textContent =
            nichesValid
                ? ""
                : "Select at least one creator niche.";
    }

    if (countryError) {
        countryError.textContent =
            countriesValid
                ? ""
                : "Select at least one country or region.";
    }

    if (sizeError) {
        sizeError.textContent =
            sizeValid
                ? ""
                : "Select your agency size.";
    }

    const otherNicheCheckbox =
        getElement("otherNicheCheckbox");

    const otherNicheInput =
        getElement("otherNiche");

    if (
        otherNicheCheckbox?.checked &&
        !otherNicheInput?.value.trim()
    ) {
        otherNicheInput?.classList.add(
            "invalid"
        );

        if (nicheError) {
            nicheError.textContent =
                "Specify the additional creator niche.";
        }

        nichesValid = false;
    }

    const yearsValid =
        validateRequiredSelect(
            "yearsInBusiness",
            "yearsInBusinessError",
            "Select how long the agency has operated."
        );

    return (
        nichesValid &&
        countriesValid &&
        sizeValid &&
        yearsValid
    );
}

function validateAboutStep() {
    const aboutValid =
        validateMinimumText(
            "agencyAbout",
            "agencyAboutError",
            80,
            "Write at least 80 characters about your agency."
        );

    const socialFields = [
        ["instagram", "instagramError"],
        ["xProfile", "xProfileError"],
        ["tiktok", "tiktokError"],
        ["linkedin", "linkedinError"]
    ];

    const socialResults =
        socialFields.map(
            ([inputId, errorId]) => {
                return validateOptionalWebsite(
                    inputId,
                    errorId
                );
            }
        );

    const representativeValid =
        validateRequiredCheckbox(
            "authorizedRepresentative",
            "authorizedRepresentativeError",
            "Confirm that you are authorized to represent the agency."
        );

    const termsValid =
        validateRequiredCheckbox(
            "acceptTerms",
            "acceptTermsError",
            "You must accept the terms to submit the agency."
        );

    return (
        aboutValid &&
        socialResults.every(Boolean) &&
        representativeValid &&
        termsValid
    );
}

/* =========================================================
   VALIDATION HELPERS
========================================================= */

function validateRequiredText(
    inputId,
    errorId,
    message
) {
    const input =
        getElement(inputId);

    if (!input) return false;

    if (!input.value.trim()) {
        setInputError(
            input,
            errorId,
            message
        );

        return false;
    }

    clearInputError(
        input,
        errorId
    );

    return true;
}

function validateMinimumText(
    inputId,
    errorId,
    minimumLength,
    message
) {
    const input =
        getElement(inputId);

    if (!input) return false;

    if (
        input.value.trim().length <
        minimumLength
    ) {
        setInputError(
            input,
            errorId,
            message
        );

        return false;
    }

    clearInputError(
        input,
        errorId
    );

    return true;
}

function validateRequiredSelect(
    inputId,
    errorId,
    message
) {
    const select =
        getElement(inputId);

    if (!select) return false;

    if (!select.value) {
        setInputError(
            select,
            errorId,
            message
        );

        return false;
    }

    clearInputError(
        select,
        errorId
    );

    return true;
}

function validateRequiredCheckbox(
    checkboxId,
    errorId,
    message
) {
    const checkbox =
        getElement(checkboxId);

    const error =
        getElement(errorId);

    if (!checkbox) return false;

    if (!checkbox.checked) {
        if (error) {
            error.textContent = message;
        }

        return false;
    }

    if (error) {
        error.textContent = "";
    }

    return true;
}

function validateRegistrationEmail() {
    const input =
        getElement("registrationEmail");

    if (!input) return false;

    const email =
        input.value.trim();

    if (!email) {
        setInputError(
            input,
            "registrationEmailError",
            "Business email is required."
        );

        return false;
    }

    if (!isValidEmail(email)) {
        setInputError(
            input,
            "registrationEmailError",
            "Enter a valid business email."
        );

        return false;
    }

    clearInputError(
        input,
        "registrationEmailError"
    );

    return true;
}

function validateCompanyWebsite() {
    const input =
        getElement("companyWebsite");

    if (!input) return true;

    if (!isValidWebsite(input.value)) {
        setInputError(
            input,
            "companyWebsiteError",
            "Use a complete address beginning with http:// or https://."
        );

        return false;
    }

    clearInputError(
        input,
        "companyWebsiteError"
    );

    return true;
}

function validateOptionalWebsite(
    inputId,
    errorId
) {
    const input =
        getElement(inputId);

    if (!input || !input.value.trim()) {
        clearInputError(
            input,
            errorId
        );

        return true;
    }

    if (!isValidWebsite(input.value)) {
        setInputError(
            input,
            errorId,
            "Enter a complete URL beginning with http:// or https://."
        );

        return false;
    }

    clearInputError(
        input,
        errorId
    );

    return true;
}

function validateRegistrationPassword() {
    const input =
        getElement("registrationPassword");

    if (!input) return false;

    const password =
        input.value;

    if (!password) {
        setInputError(
            input,
            "registrationPasswordError",
            "Password is required."
        );

        return false;
    }

    if (password.length < 8) {
        setInputError(
            input,
            "registrationPasswordError",
            "Use at least eight characters."
        );

        return false;
    }

    const containsLetter =
        /[A-Za-z]/.test(password);

    const containsNumber =
        /\d/.test(password);

    if (
        !containsLetter ||
        !containsNumber
    ) {
        setInputError(
            input,
            "registrationPasswordError",
            "Include at least one letter and one number."
        );

        return false;
    }

    clearInputError(
        input,
        "registrationPasswordError"
    );

    return true;
}

function validatePasswordConfirmation() {
    const password =
        getElement("registrationPassword");

    const confirmation =
        getElement("confirmPassword");

    if (!password || !confirmation) {
        return false;
    }

    if (!confirmation.value) {
        setInputError(
            confirmation,
            "confirmPasswordError",
            "Confirm your password."
        );

        return false;
    }

    if (
        password.value !==
        confirmation.value
    ) {
        setInputError(
            confirmation,
            "confirmPasswordError",
            "Passwords do not match."
        );

        return false;
    }

    clearInputError(
        confirmation,
        "confirmPasswordError"
    );

    return true;
}

function focusFirstInvalidField() {
    const activeStep =
        document.querySelector(
            ".wizard-step.active"
        );

    const firstInvalid =
        activeStep?.querySelector(
            ".invalid, input:invalid, select:invalid"
        );

    firstInvalid?.focus();
}

function scrollRegistrationToTop() {
    const form =
        getElement("registrationForm");

    form?.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

/* =========================================================
   BUTTON LOADING
========================================================= */

function setButtonLoading(
    buttonId,
    isLoading,
    buttonText
) {
    const button =
        getElement(buttonId);

    if (!button) return;

    const textElement =
        button.querySelector("span");

    const iconElement =
        button.querySelector("i");

    button.disabled = isLoading;

    if (textElement) {
        textElement.textContent =
            buttonText;
    }

    if (iconElement) {
        iconElement.className =
            isLoading
                ? "fa-solid fa-spinner fa-spin"
                : "fa-solid fa-arrow-right";
    }
}