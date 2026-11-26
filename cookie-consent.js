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

    // 5. If user already made a selection, keep banner hidden
    if (savedConsent === 'granted' || savedConsent === 'denied') {
        return;
    }

    // 6. Multilingual copy (EN, DE, CS)
    var translations = {
        en: {
            text: 'We use cookies to analyze site traffic and improve your browsing experience. By clicking \u201cAccept\u201d, you consent to our use of cookies in accordance with our <a href="privacy.html" class="cookie-banner-link">Privacy Policy</a>.',
            accept: 'Accept',
            decline: 'Decline',
            ariaLabel: 'Cookie consent'
        },
        de: {
            text: 'Wir verwenden Cookies, um den Website-Verkehr zu analysieren und Ihr Nutzungserlebnis zu verbessern. Mit dem Klick auf \u201eAkzeptieren\u201c stimmen Sie der Verwendung von Cookies gem\u00e4\u00df unserer <a href="privacy.html" class="cookie-banner-link">Datenschutzerkl\u00e4rung</a> zu.',
            accept: 'Akzeptieren',
            decline: 'Ablehnen',
            ariaLabel: 'Cookie-Einwilligung'
        },
        cs: {
            text: 'Pou\u017e\u00edv\u00e1me cookies k anal\u00fdze n\u00e1v\u0161t\u011bvnosti a zlep\u0161en\u00ed u\u017eivatelsk\u00e9ho z\u00e1\u017eitku. Kliknut\u00edm na \u201eP\u0159ijmout\u201c souhlas\u00edte s pou\u017e\u00edv\u00e1n\u00edm cookies v souladu s na\u0161imi <a href="privacy.html" class="cookie-banner-link">Z\u00e1sadami ochrany osobn\u00edch \u00fadaj\u016f</a>.',
            accept: 'P\u0159ijmout',
            decline: 'Odm\u00edtnout',
            ariaLabel: 'Souhlas s cookies'
        }
    };

    function getLang() {
        var htmlLang = (document.documentElement.lang || 'en').toLowerCase().trim();
        if (htmlLang.indexOf('cs') === 0) return 'cs';
        if (htmlLang.indexOf('de') === 0) return 'de';
        return 'en';
    }

    function initBanner() {
        if (document.getElementById('cookie-consent-banner')) return;

        var t = translations[getLang()] || translations.en;

        var banner = document.createElement('div');
        banner.id = 'cookie-consent-banner';
        banner.className = 'cookie-consent-banner';
        banner.setAttribute('role', 'region');
        banner.setAttribute('aria-label', t.ariaLabel);

        banner.innerHTML =
            '<div class="cookie-consent-container">' +
                '<p class="cookie-consent-text">' + t.text + '</p>' +
                '<div class="cookie-consent-actions">' +
                    '<button type="button" class="cookie-btn cookie-btn-decline" id="cookie-btn-decline">' + t.decline + '</button>' +
                    '<button type="button" class="cookie-btn cookie-btn-accept" id="cookie-btn-accept">' + t.accept + '</button>' +
                '</div>' +
            '</div>';

        document.body.appendChild(banner);

        var acceptBtn = document.getElementById('cookie-btn-accept');
        var declineBtn = document.getElementById('cookie-btn-decline');

        function removeBanner() {
            banner.style.opacity = '0';
            banner.style.transform = 'translateY(100%)';
            banner.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
            setTimeout(function () {
                if (banner && banner.parentNode) {
                    banner.parentNode.removeChild(banner);
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
                removeBanner();
            });
        }

        if (declineBtn) {
            declineBtn.addEventListener('click', function () {
                try {
                    localStorage.setItem(STORAGE_KEY, 'denied');
                } catch (e) {}
                removeBanner();
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBanner);
    } else {
        initBanner();
    }
})();
