document.addEventListener('DOMContentLoaded', () => {
    
    // Détection de la langue de la page (en, cs, de)
    const lang = document.documentElement.lang || 'en';

    const i18n = {
        en: {
            yearsText: (y) => `${y} years`,
            headlineSummary: (m) => `€${m}/month could become approximately`,
            inYears: (y) => `in ${y} years`,
            btnContinue: (m) => `I'll invest €${m}/month → Continue to Step 2`,
            formSuccess: "Thanks! Your message has been sent to Stefan.",
            formError: "Oops! There was a problem submitting your form.",
            formNetworkError: "Oops! Please check your connection and try again."
        },
        cs: {
            yearsText: (y) => {
                if (y === 1) return `1 rok`;
                if (y >= 2 && y <= 4) return `${y} roky`;
                return `${y} let`;
            },
            headlineSummary: (m) => `€${m}/měsíčně by mohlo přinést přibližně`,
            inYears: (y) => {
                if (y === 1) return `za 1 rok`;
                if (y >= 2 && y <= 4) return `za ${y} roky`;
                return `za ${y} let`;
            },
            btnContinue: (m) => `Budu investovat €${m}/měsíc → Pokračovat ke Kroku 2`,
            formSuccess: "Děkujeme! Vaše zpráva byla odeslána Stefanovi.",
            formError: "Jejda! Při odesílání formuláře došlo k chybě.",
            formNetworkError: "Jejda! Zkontrolujte prosím připojení k internetu a zkuste to znovu."
        },
        de: {
            yearsText: (y) => y === 1 ? `1 Jahr` : `${y} Jahre`,
            headlineSummary: (m) => `€${m}/Monat könnten ungefähr werden`,
            inYears: (y) => y === 1 ? `in 1 Jahr` : `in ${y} Jahren`,
            btnContinue: (m) => `Ich investiere €${m}/Monat → Weiter zu Schritt 2`,
            formSuccess: "Vielen Dank! Ihre Nachricht wurde an Stefan gesendet.",
            formError: "Hoppla! Beim Absenden des Formulars ist ein Problem aufgetreten.",
            formNetworkError: "Hoppla! Bitte überprüfen Sie Ihre Internetverbindung und versuchen Sie es erneut."
        }
    };

    const currentTexts = i18n[lang] || i18n.en;

    // Elements du calculateur
    const sliderAmount = document.getElementById('slider-amount');
    const sliderYears = document.getElementById('slider-years');
    const displayAmount = document.getElementById('display-amount');
    const displayYears = document.getElementById('display-years');
    
    const displayHeadlineSummary = document.getElementById('calc-headline-summary');
    const displayTotalHeadline = document.getElementById('display-total-headline');
    const displayYearsHeadline = document.getElementById('display-years-headline');
    
    const displayContributions = document.getElementById('display-total-contributions');
    const displayGrowth = document.getElementById('display-total-growth');
    const btnContinue = document.getElementById('btn-continue-step2');
    const svgChart = document.getElementById('compounding-chart');

    // Boutons de contrôle + / -
    const btnAmountMinus = document.getElementById('btn-amount-minus');
    const btnAmountPlus = document.getElementById('btn-amount-plus');
    const btnYearsMinus = document.getElementById('btn-years-minus');
    const btnYearsPlus = document.getElementById('btn-years-plus');

    if (sliderAmount && sliderYears && svgChart) {
        
        function updateCalculator() {
            const monthly = parseInt(sliderAmount.value) || 100;
            const years = parseInt(sliderYears.value) || 20;
            const rate = 0.09; // 9% rendement annuel moyen

            if (displayAmount) displayAmount.textContent = `€ ${monthly}`;
            if (displayYears) displayYears.textContent = currentTexts.yearsText(years);

            let currentVal = 0;
            const yearlyData = [{ year: 0, contributions: 0, total: 0 }];

            for (let y = 1; y <= years; y++) {
                for (let m = 0; m < 12; m++) {
                    currentVal = (currentVal + monthly) * (1 + rate / 12);
                }
                yearlyData.push({
                    year: y,
                    contributions: monthly * 12 * y,
                    total: currentVal
                });
            }

            const total = currentVal;
            const totalContributions = monthly * 12 * years;
            const growth = total - totalContributions;

            const fmt = (num) => '€' + Math.round(num).toLocaleString(lang === 'de' ? 'de-DE' : (lang === 'cs' ? 'cs-CZ' : 'en-US'));

            if (displayHeadlineSummary) displayHeadlineSummary.textContent = currentTexts.headlineSummary(monthly);
            if (displayTotalHeadline) displayTotalHeadline.textContent = fmt(total);
            if (displayYearsHeadline) displayYearsHeadline.textContent = currentTexts.inYears(years);

            if (displayContributions) displayContributions.textContent = fmt(totalContributions);
            if (displayGrowth) displayGrowth.textContent = fmt(growth);

            if (btnContinue) {
                btnContinue.textContent = currentTexts.btnContinue(monthly);
            }

            drawAreaChart(yearlyData, total, years);
        }

       function drawAreaChart(data, maxVal, totalYears) {
            svgChart.innerHTML = '';
            
            // Dimensions avec hauteur augmentée de 50% (330px)
            const width = svgChart.clientWidth || svgChart.getBoundingClientRect().width || 600;
            const height = 330; // Nouvelle hauteur 330px
            
            svgChart.setAttribute('width', '100%');
            svgChart.setAttribute('height', '330');
            svgChart.setAttribute('viewBox', `0 0 ${width} ${height}`);

            const paddingLeft = 15;
            const paddingRight = 60; // Espace pour l'axe Y à droite
            const paddingTop = 15;
            const paddingBottom = 25; // Espace pour l'axe X (années)

            const plotWidth = Math.max(10, width - paddingLeft - paddingRight);
            const plotHeight = Math.max(10, height - paddingTop - paddingBottom);

            if (!maxVal || maxVal <= 0) return;

            // Calcul des points des deux courbes
            const pointsContrib = data.map(d => {
                const x = paddingLeft + (d.year / totalYears) * plotWidth;
                const y = paddingTop + plotHeight - (d.contributions / maxVal) * plotHeight;
                return `${x.toFixed(1)},${y.toFixed(1)}`;
            });

            const pointsTotal = data.map(d => {
                const x = paddingLeft + (d.year / totalYears) * plotWidth;
                const y = paddingTop + plotHeight - (d.total / maxVal) * plotHeight;
                return `${x.toFixed(1)},${y.toFixed(1)}`;
            });

            const originX = paddingLeft.toFixed(1);
            const baselineY = (paddingTop + plotHeight).toFixed(1);
            const endX = (paddingLeft + plotWidth).toFixed(1);

            // 1. Polygone Zone Dorée (Growth)
            const polyTotalPoints = [
                `${originX},${baselineY}`,
                ...pointsTotal,
                `${endX},${baselineY}`
            ].join(' ');

            const polyTotal = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            polyTotal.setAttribute('points', polyTotalPoints);
            polyTotal.setAttribute('fill', '#d97706'); // Gold harmonisé
            polyTotal.setAttribute('opacity', '0.85');

            // 2. Polygone Zone Bleue (Contributions)
            const polyContribPoints = [
                `${originX},${baselineY}`,
                ...pointsContrib,
                `${endX},${baselineY}`
            ].join(' ');

            const polyContrib = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            polyContrib.setAttribute('points', polyContribPoints);
            polyContrib.setAttribute('fill', '#2563eb'); // Bleu
            polyContrib.setAttribute('opacity', '0.9');

            svgChart.appendChild(polyTotal);
            svgChart.appendChild(polyContrib);

            // 3. Ligne de l'Axe X (Bas)
            const axisX = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            axisX.setAttribute('x1', originX);
            axisX.setAttribute('y1', baselineY);
            axisX.setAttribute('x2', endX);
            axisX.setAttribute('y2', baselineY);
            axisX.setAttribute('stroke', '#cbd5e1');
            axisX.setAttribute('stroke-width', '1');
            svgChart.appendChild(axisX);

            // 4. Libellés Axe X (Années)
            const yearStep = Math.max(1, Math.floor(totalYears / 4));
            for (let y = 0; y <= totalYears; y += yearStep) {
                const x = paddingLeft + (y / totalYears) * plotWidth;
                const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                text.setAttribute('x', x.toFixed(1));
                text.setAttribute('y', (height - 5).toFixed(1));
                text.setAttribute('font-size', '11');
                text.setAttribute('fill', '#64748b');
                text.setAttribute('font-family', 'sans-serif');
                text.setAttribute('text-anchor', y === 0 ? 'start' : (y === totalYears ? 'end' : 'middle'));
                text.textContent = y === 0 ? '0' : `${y}y`;
                svgChart.appendChild(text);
            }

            // 5. Libellés Axe Y (Montants à DROITE)
            const yTicks = 3;
            for (let i = 0; i <= yTicks; i++) {
                const val = (maxVal / yTicks) * i;
                const y = paddingTop + plotHeight - (i / yTicks) * plotHeight;
                
                const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                text.setAttribute('x', (paddingLeft + plotWidth + 8).toFixed(1));
                text.setAttribute('y', (y + 4).toFixed(1));
                text.setAttribute('font-size', '10');
                text.setAttribute('fill', '#64748b');
                text.setAttribute('font-family', 'sans-serif');
                text.setAttribute('text-anchor', 'start');
                
                const formattedVal = val >= 1000000 
                    ? `€${(val / 1000000).toFixed(1)}M` 
                    : (val >= 1000 ? `€${Math.round(val / 1000)}k` : `€${Math.round(val)}`);
                text.textContent = formattedVal;
                svgChart.appendChild(text);
            }
        }   

        // Ecouteurs sur les sliders
        sliderAmount.addEventListener('input', updateCalculator);
        sliderYears.addEventListener('input', updateCalculator);

        // Ecouteurs sur les boutons + / -
        if (btnAmountMinus) btnAmountMinus.addEventListener('click', () => { sliderAmount.value = Math.max(10, parseInt(sliderAmount.value) - 10); updateCalculator(); });
        if (btnAmountPlus) btnAmountPlus.addEventListener('click', () => { sliderAmount.value = Math.min(1000, parseInt(sliderAmount.value) + 10); updateCalculator(); });
        if (btnYearsMinus) btnYearsMinus.addEventListener('click', () => { sliderYears.value = Math.max(1, parseInt(sliderYears.value) - 1); updateCalculator(); });
        if (btnYearsPlus) btnYearsPlus.addEventListener('click', () => { sliderYears.value = Math.min(100, parseInt(sliderYears.value) + 1); updateCalculator(); });

        updateCalculator();
        window.addEventListener('resize', updateCalculator);
    }

    // Case à cocher Step 2 (Revolut)
    const revolutCheckbox = document.getElementById('revolut-checkbox');
    const revolutSubmitBtn = document.getElementById('step2-submit-btn');

    if (revolutCheckbox && revolutSubmitBtn) {
        revolutSubmitBtn.style.opacity = revolutCheckbox.checked ? '1' : '0.85';

        revolutCheckbox.addEventListener('change', (e) => {
            revolutSubmitBtn.style.opacity = e.target.checked ? '1' : '0.85';
        });

        revolutSubmitBtn.addEventListener('click', () => {
            if (revolutCheckbox) revolutCheckbox.checked = true;
        });
    }

    // Case à cocher Step 3 (Auto-invest)
    const step3Checkbox = document.getElementById('step3-checkbox');
    const step3SubmitBtn = document.getElementById('step3-submit-btn');

    if (step3Checkbox && step3SubmitBtn) {
        step3SubmitBtn.style.opacity = step3Checkbox.checked ? '1' : '0.85';

        step3Checkbox.addEventListener('change', (e) => {
            step3SubmitBtn.style.opacity = e.target.checked ? '1' : '0.85';
        });

        step3SubmitBtn.addEventListener('click', () => {
            if (step3Checkbox) step3Checkbox.checked = true;
        });
    }

});
// Select the form and the status message element
var form = document.getElementById("contact-form");
var statusMessage = document.getElementById("form-status");

// Check if the form exists on the current page before running the script
if (form) {
    form.addEventListener("submit", async function(event) {
        // 1. Prevent the browser from redirecting to the Formspree page
        event.preventDefault(); 

        // 2. Gather the data from the form
        var data = new FormData(event.target);

        // 3. Send the data silently in the background
        fetch(event.target.action, {
            method: form.method,
            body: data,
            headers: {
                'Accept': 'application/json' // This tells Formspree we want a silent background response
            }
        }).then(response => {
            const pageLang = document.documentElement.lang || 'en';
            const msgSuccess = pageLang === 'cs' ? "Děkujeme! Vaše zpráva byla odeslána Stefanovi." : (pageLang === 'de' ? "Vielen Dank! Ihre Nachricht wurde an Stefan gesendet." : "Thanks! Your message has been sent to Stefan.");
            const msgError = pageLang === 'cs' ? "Jejda! Při odesílání formuláře došlo k chybě." : (pageLang === 'de' ? "Hoppla! Beim Absenden des Formulars ist ein Problem aufgetreten." : "Oops! There was a problem submitting your form.");
            const msgNetError = pageLang === 'cs' ? "Jejda! Zkontrolujte prosím připojení k internetu a zkuste to znovu." : (pageLang === 'de' ? "Hoppla! Bitte überprüfen Sie Ihre Internetverbindung und versuchen Sie es erneut." : "Oops! Please check your connection and try again.");

            if (response.ok) {
                // Success! Clear the form and show a green thank you message
                form.reset();
                statusMessage.innerHTML = msgSuccess;
                statusMessage.style.color = "#16a34a"; // A nice green color
                statusMessage.style.display = "block";
            } else {
                // If there's an error on Formspree's side
                statusMessage.innerHTML = msgError;
                statusMessage.style.color = "#dc2626"; // A red color
                statusMessage.style.display = "block";
            }
        }).catch(error => {
            const pageLang = document.documentElement.lang || 'en';
            const msgNetError = pageLang === 'cs' ? "Jejda! Zkontrolujte prosím připojení k internetu a zkuste to znovu." : (pageLang === 'de' ? "Hoppla! Bitte überprüfen Sie Ihre Internetverbindung und versuchen Sie es erneut." : "Oops! Please check your connection and try again.");
            // If the user's internet drops
            statusMessage.innerHTML = msgNetError;
            statusMessage.style.color = "#dc2626";
            statusMessage.style.display = "block";
        });
    });
}