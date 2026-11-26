/**
 * Golden Goose — GDPR Cookie Consent & Google Analytics 4 (Consent Mode v2)
 *
 * ============================================================================
 * PLACEHOLDER CONFIGURATION:
 * Replace 'G-XXXXXXXXXX' below with your actual GA4 Measurement ID.
 * No other code changes are needed across the website.
 * ============================================================================
 */
var GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';

(function () {
    'use strict';

    var GA_ID = (typeof window !== 'undefined' && window.GA_MEASUREMENT_ID) ? window.GA_MEASUREMENT_ID : GA_MEASUREMENT_ID;
    var STORAGE_KEY = 'gg_cookie_consent';

    // 1. Initialize dataLayer and gtag function
    window.dataLayer = window.dataLayer || [];
    function gtag() {
        window.dataLayer.push(arguments);
    }
    window.gtag = gtag;

    // 2. Default consent to 'denied' BEFORE loading gtag.js
    gtag('consent', 'default', {
        'analytics_storage': 'denied',
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied'
    });

    // 3. Read saved choice from localStorage
    var savedConsent = null;
    try {
        savedConsent = localStorage.getItem(STORAGE_KEY);
    } catch (e) {}

    // If user previously accepted cookies, update consent immediately
    if (savedConsent === 'granted') {
        gtag('consent', 'update', {
            'analytics_storage': 'granted',
            'ad_storage': 'granted',
            'ad_user_data': 'granted',
            'ad_personalization': 'granted'
        });
    }

    // 4. Load gtag.js asynchronously
    if (GA_ID) {
        var script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_ID);
        document.head.appendChild(script);

        gtag('js', new Date());
        gtag('config', GA_ID);
    }

    // 5. If user already made a selection, keep modal hidden
    if (savedConsent === 'granted' || savedConsent === 'denied') {
        return;
    }

    function getLang() {
        var htmlLang = (document.documentElement.lang || 'en').toLowerCase().trim();
        if (htmlLang.indexOf('cs') === 0) return 'cs';
        if (htmlLang.indexOf('de') === 0) return 'de';
        return 'en';
    }

    function getPrivacyUrl() {
        var path = (window.location.pathname || '').toLowerCase();
        var inSubdir = path.indexOf('/de/') !== -1 || path.indexOf('/cs/') !== -1;
        if (inSubdir) {
            return 'privacy.html';
        }
        var lang = getLang();
        if (lang === 'de') return 'de/privacy.html';
        if (lang === 'cs') return 'cs/privacy.html';
        return 'privacy.html';
    }

    function isPrivacyPage() {
        var path = ((window.location.pathname || '') + ' ' + (window.location.href || '')).toLowerCase();
        return path.indexOf('privacy.html') !== -1;
    }

    // 6. Multilingual copy (EN, DE, CS)
    var translations = {
        en: {
            title: 'Cookie Preferences',
            text: 'We use cookies and Google Analytics 4 (with IP anonymization) to analyze traffic and improve your browsing experience. Analytics cookies are set to denied by default and will only activate if you click \u201cAccept\u201d. For details, read our <a href="{privacyUrl}" target="_blank" class="cookie-modal-link">Privacy Policy</a>.',
            accept: 'Accept',
            decline: 'Decline',
            ariaLabel: 'Cookie consent dialog'
        },
        de: {
            title: 'Cookie-Einstellungen',
            text: 'Wir verwenden Cookies und Google Analytics 4 (mit IP-Anonymisierung), um den Website-Verkehr zu analysieren und Ihr Nutzungserlebnis zu verbessern. Analyse-Cookies sind standardm\u00e4\u00dfig deaktiviert und werden erst aktiviert, wenn Sie auf \u201eAkzeptieren\u201c klicken. Weitere Informationen finden Sie in unserer <a href="{privacyUrl}" target="_blank" class="cookie-modal-link">Datenschutzerkl\u00e4rung</a>.',
            accept: 'Akzeptieren',
            decline: 'Ablehnen',
            ariaLabel: 'Cookie-Einwilligungsdialog'
        },
        cs: {
            title: 'Nastaven\u00ed soubor\u016f cookie',
            text: 'Pou\u017e\u00edv\u00e1me cookies a Google Analytics 4 (s anonymizac\u00ed IP) k anal\u00fdze n\u00e1v\u0161t\u011bvnosti a zlep\u0161en\u00ed webu. Analytick\u00e9 cookies jsou ve v\u00fdchoz\u00edm stavu zam\u00edtnuty a aktivuj\u00ed se pouze po kliknut\u00ed na \u201eP\u0159ijmout\u201c. V\u00edce informac\u00ed v na\u0161ich <a href="{privacyUrl}" target="_blank" class="cookie-modal-link">Z\u00e1sad\u00e1ch ochrany osobn\u00edch \u00fadaj\u016f</a>.',
            accept: 'P\u0159ijmout',
            decline: 'Odm\u00edtnout',
            ariaLabel: 'Dialog souhlasu s cookies'
        }
    };

    function initModal() {
        if (document.getElementById('cookie-consent-modal')) return;

        var lang = getLang();
        var t = translations[lang] || translations.en;
        var privacyUrl = getPrivacyUrl();
        var bodyText = t.text.replace('{privacyUrl}', privacyUrl);
        var onPrivacyPage = isPrivacyPage();

        var backdrop = document.createElement('div');
        backdrop.id = 'cookie-consent-modal';
        backdrop.className = 'cookie-modal-backdrop' + (onPrivacyPage ? ' cookie-page-mode' : '');
        backdrop.setAttribute('role', 'dialog');
        backdrop.setAttribute('aria-modal', onPrivacyPage ? 'false' : 'true');
        backdrop.setAttribute('aria-labelledby', 'cookie-modal-title');

        backdrop.innerHTML =
            '<div class="cookie-modal-card">' +
                '<div class="cookie-modal-header">' +
                    '<span class="cookie-modal-icon">\ud83c\udf6a</span>' +
                    '<h2 id="cookie-modal-title" class="cookie-modal-title">' + t.title + '</h2>' +
                '</div>' +
                '<p class="cookie-modal-body">' + bodyText + '</p>' +
                '<div class="cookie-modal-actions">' +
                    '<button type="button" class="cookie-btn cookie-btn-decline" id="cookie-btn-decline">' + t.decline + '</button>' +
                    '<button type="button" class="cookie-btn cookie-btn-accept" id="cookie-btn-accept">' + t.accept + '</button>' +
                '</div>' +
            '</div>';

        document.body.appendChild(backdrop);

        var acceptBtn = document.getElementById('cookie-btn-accept');
        var declineBtn = document.getElementById('cookie-btn-decline');

        function removeModal() {
            backdrop.style.opacity = '0';
            backdrop.style.transition = 'opacity 0.25s ease';
            setTimeout(function () {
                if (backdrop && backdrop.parentNode) {
                    backdrop.parentNode.removeChild(backdrop);
                }
            }, 250);
        }

        if (acceptBtn) {
            acceptBtn.addEventListener('click', function () {
                try {
                    localStorage.setItem(STORAGE_KEY, 'granted');
                } catch (e) {}
                gtag('consent', 'update', {
                    'analytics_storage': 'granted',
                    'ad_storage': 'granted',
                    'ad_user_data': 'granted',
                    'ad_personalization': 'granted'
                });
                removeModal();
            });
        }

        if (declineBtn) {
            declineBtn.addEventListener('click', function () {
                try {
                    localStorage.setItem(STORAGE_KEY, 'denied');
                } catch (e) {}
                removeModal();
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initModal);
    } else {
        initModal();
    }
})();
