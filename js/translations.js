/* =========================================================
   AGENCY PRIVÉ — LOCAL TRANSLATIONS

   Translation keys are used by elements containing:
   data-translate="translationKey"
========================================================= */

const translations = {
    en: {
        navAgencies: "Agencies",
        navRankings: "Rankings",
        navCompare: "Compare",
        navInsights: "Insights",
        navForAgencies: "For Agencies",
        navLogin: "Log in",
        getDemo: "Get a Demo",
        startTrial: "Start Free Trial"
    },

    tl: {
        navAgencies: "Mga Agency",
        navRankings: "Mga Ranggo",
        navCompare: "Paghambingin",
        navInsights: "Mga Artikulo",
        navForAgencies: "Para sa mga Agency",
        navLogin: "Mag-log in",
        getDemo: "Humingi ng Demo",
        startTrial: "Simulan ang Libreng Trial"
    },

    es: {
        navAgencies: "Agencias",
        navRankings: "Clasificaciones",
        navCompare: "Comparar",
        navInsights: "Artículos",
        navForAgencies: "Para agencias",
        navLogin: "Iniciar sesión",
        getDemo: "Solicitar una demo",
        startTrial: "Iniciar prueba gratuita"
    },

    fr: {
        navAgencies: "Agences",
        navRankings: "Classements",
        navCompare: "Comparer",
        navInsights: "Analyses",
        navForAgencies: "Pour les agences",
        navLogin: "Se connecter",
        getDemo: "Demander une démo",
        startTrial: "Commencer l’essai gratuit"
    },

    de: {
        navAgencies: "Agenturen",
        navRankings: "Ranglisten",
        navCompare: "Vergleichen",
        navInsights: "Einblicke",
        navForAgencies: "Für Agenturen",
        navLogin: "Anmelden",
        getDemo: "Demo anfordern",
        startTrial: "Kostenlos testen"
    },

    pt: {
        navAgencies: "Agências",
        navRankings: "Classificações",
        navCompare: "Comparar",
        navInsights: "Conteúdos",
        navForAgencies: "Para agências",
        navLogin: "Entrar",
        getDemo: "Solicitar demonstração",
        startTrial: "Iniciar teste gratuito"
    },

    ja: {
        navAgencies: "エージェンシー",
        navRankings: "ランキング",
        navCompare: "比較",
        navInsights: "インサイト",
        navForAgencies: "企業向け",
        navLogin: "ログイン",
        getDemo: "デモを申し込む",
        startTrial: "無料トライアルを開始"
    },

    zh: {
        navAgencies: "公司目录",
        navRankings: "排名",
        navCompare: "比较",
        navInsights: "行业资讯",
        navForAgencies: "公司服务",
        navLogin: "登录",
        getDemo: "申请演示",
        startTrial: "开始免费试用"
    }
};

/* =========================================================
   LANGUAGE INFORMATION
========================================================= */

const languageInformation = {
    en: {
        code: "EN",
        direction: "ltr"
    },

    tl: {
        code: "TL",
        direction: "ltr"
    },

    es: {
        code: "ES",
        direction: "ltr"
    },

    fr: {
        code: "FR",
        direction: "ltr"
    },

    de: {
        code: "DE",
        direction: "ltr"
    },

    pt: {
        code: "PT",
        direction: "ltr"
    },

    ja: {
        code: "JA",
        direction: "ltr"
    },

    zh: {
        code: "ZH",
        direction: "ltr"
    },

    ar: {
        code: "AR",
        direction: "rtl"
    }
};

/* =========================================================
   SET WEBSITE LANGUAGE
========================================================= */

function setWebsiteLanguage(languageCode) {
    const selectedLanguage =
        translations[languageCode] ||
        translations.en;

    const translationElements =
        document.querySelectorAll(
            "[data-translate]"
        );

    translationElements.forEach((element) => {
        const translationKey =
            element.dataset.translate;

        const translatedValue =
            selectedLanguage[translationKey] ||
            translations.en[translationKey];

        if (translatedValue) {
            element.textContent =
                translatedValue;
        }
    });

    updateDocumentLanguage(languageCode);

    updateLanguageCode(languageCode);

    localStorage.setItem(
        "agencyPriveLanguage",
        languageCode
    );
}

/* =========================================================
   UPDATE HTML LANGUAGE AND DIRECTION
========================================================= */

function updateDocumentLanguage(languageCode) {
    const information =
        languageInformation[languageCode];

    const supportedCode =
        translations[languageCode]
            ? languageCode
            : "en";

    document.documentElement.lang =
        supportedCode;

    document.documentElement.dir =
        information?.direction || "ltr";
}

/* =========================================================
   UPDATE GLOBE BUTTON
========================================================= */

function updateLanguageCode(languageCode) {
    const currentLanguage =
        document.getElementById(
            "currentLanguage"
        );

    if (!currentLanguage) return;

    const selectedOption =
        document.querySelector(
            `[data-language="${languageCode}"] small`
        );

    if (selectedOption) {
        currentLanguage.textContent =
            selectedOption.textContent;

        return;
    }

    currentLanguage.textContent =
        languageInformation[languageCode]?.code ||
        "EN";
}

/* =========================================================
   LOAD SAVED LANGUAGE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {
        const savedLanguage =
            localStorage.getItem(
                "agencyPriveLanguage"
            ) || "en";

        setWebsiteLanguage(savedLanguage);
    }
);

/*
 * This allows main.js to call the function.
 */
window.setWebsiteLanguage =
    setWebsiteLanguage;