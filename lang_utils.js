/**
 * Language utility functions for internationalization support
 */

/**
 * Translates a given key into the specified language.
 * Supports basic translations for common UI elements.
 *
 * @param {string} key - The translation key (e.g., 'hello', 'save', 'cancel')
 * @param {string} [lang='en'] - The language code (e.g., 'en', 'es', 'fr')
 * @returns {string} The translated string
 *
 * @example
 * translate('hello', 'es'); // Returns 'Hola'
 * translate('save'); // Returns 'Save' (default English)
 */
const translate = (key, lang = 'en') => {
    const translations = {
        en: {
            hello: 'Hello',
            save: 'Save',
            cancel: 'Cancel',
            loading: 'Loading...',
            error: 'Error',
            success: 'Success'
        },
        es: {
            hello: 'Hola',
            save: 'Guardar',
            cancel: 'Cancelar',
            loading: 'Cargando...',
            error: 'Error',
            success: 'Éxito'
        },
        fr: {
            hello: 'Bonjour',
            save: 'Enregistrer',
            cancel: 'Annuler',
            loading: 'Chargement...',
            error: 'Erreur',
            success: 'Succès'
        }
    };

    return translations[lang]?.[key] || translations.en[key] || key;
};

/**
 * Gets the current language from browser/storage or defaults to 'en'
 * @returns {string} The current language code
 */
const getCurrentLanguage = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem('language') || 'en';
    }
    return 'en';
};

/**
 * Sets the current language in storage
 * @param {string} lang - The language code to set
 */
const setCurrentLanguage = (lang) => {
    if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('language', lang);
    }
};

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
    // CommonJS
    module.exports = { translate, getCurrentLanguage, setCurrentLanguage };
} else if (typeof exports !== 'undefined') {
    // ES6 modules (for environments that support it)
    exports.translate = translate;
    exports.getCurrentLanguage = getCurrentLanguage;
    exports.setCurrentLanguage = setCurrentLanguage;
}

// Also make available globally if in browser
if (typeof window !== 'undefined') {
    window.translate = translate;
    window.getCurrentLanguage = getCurrentLanguage;
    window.setCurrentLanguage = setCurrentLanguage;
}