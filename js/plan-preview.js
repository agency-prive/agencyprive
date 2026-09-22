/* Homepage plan preview. All content is illustrative, not live agency data. */
document.addEventListener("DOMContentLoaded", () => {
    const section = document.getElementById("planPreview");
    if (!section) return;

    const input = document.getElementById("planPreviewAgencyName");
    const name = document.getElementById("planPreviewName");
    const monogram = document.getElementById("planPreviewMonogram");
    const tier = document.getElementById("planPreviewTier");
    const placement = document.getElementById("planPreviewPlacement");
    const description = document.getElementById("planPreviewDescription");
    const features = document.getElementById("planPreviewFeatures");
    const price = document.getElementById("planPreviewPrice");
    const link = document.getElementById("planPreviewLink");
    const buttons = Array.from(section.querySelectorAll("[data-plan-preview]"));

    const plans = {
        free: {
            title: "FREE",
            price: "$0 · forever",
            description: "Build a clear presence with your agency description, services, location, and links.",
            features: ["Agency description and services", "Website and social links", "Apply for independent verification"],
            href: "register.html?plan=free",
            action: "Create Free Profile",
            featured: false
        },
        prive: {
            title: "PRIVÉ",
            price: "$49 / month",
            description: "Present your work in more depth and give prospective clients a clear way to contact you.",
            features: ["Enhanced profile and case studies", "Contact CTA and lead notifications", "Profile analytics"],
            href: "register.html?plan=prive",
            action: "Choose Privé",
            featured: false
        },
        select: {
            title: "PRIVÉ SELECT",
            price: "$129 / month",
            description: "Add clearly labelled visibility opportunities and more detailed lead insights.",
            features: ["Featured placement opportunities", "Category and country exposure", "Advanced analytics and lead tracking"],
            href: "register.html?plan=select",
            action: "Choose Privé Select",
            featured: true
        },
        elite: {
            title: "PRIVÉ ELITE",
            price: "$299 / month · launch price",
            description: "Explore premium presentation, placement opportunities, and tailored support.",
            features: ["Premium placement opportunities", "Editorial feature and customization", "Advanced lead tools and quarterly review"],
            href: "demo.html?plan=elite",
            action: "Discuss Privé Elite",
            featured: true
        }
    };

    function updateAgencyName() {
        const agencyName = input.value.trim() || "Your Agency";
        name.textContent = agencyName;
        const initials = agencyName.split(/\s+/).slice(0, 2).map(word => word[0] || "").join("").toLocaleUpperCase();
        monogram.textContent = initials || "YA";
    }

    function setPlan(key) {
        const plan = plans[key];
        if (!plan) return;
        buttons.forEach(button => {
            const selected = button.dataset.planPreview === key;
            button.setAttribute("aria-pressed", String(selected));
        });
        tier.textContent = plan.title;
        price.textContent = plan.price;
        description.textContent = plan.description;
        placement.hidden = !plan.featured;
        features.replaceChildren(...plan.features.map(feature => {
            const item = document.createElement("li");
            item.textContent = feature;
            return item;
        }));
        link.href = plan.href;
        link.replaceChildren(document.createTextNode(plan.action + " "));
        const icon = document.createElement("i");
        icon.className = "fa-solid fa-arrow-right";
        icon.setAttribute("aria-hidden", "true");
        link.appendChild(icon);
    }

    input.addEventListener("input", updateAgencyName);
    buttons.forEach(button => button.addEventListener("click", () => setPlan(button.dataset.planPreview)));
    updateAgencyName();
    setPlan("free");
});
