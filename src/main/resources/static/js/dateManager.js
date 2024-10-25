import flatpickr from 'https://cdn.jsdelivr.net/npm/flatpickr@4.6.13/+esm';
import 'https://cdn.jsdelivr.net/npm/flatpickr@4.6.13/dist/l10n/it.js';

export function initializeFlatpickr() {
    flatpickr.localize(flatpickr.l10ns.it);
    
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        flatpickr(input, {
            dateFormat: "d/m/Y",
            locale: "it",
            allowInput: true,
            disableMobile: true,
            altInput: true,
            altFormat: "d/m/Y",
            onReady: function(dateObj, dateStr, instance) {
                const clear = document.createElement('div');
                clear.innerHTML = "Clear";
                clear.className = 'flatpickr-clear';
                clear.addEventListener('click', (e) => {
                    e.preventDefault();
                    instance.clear();
                    instance.close();
                });
                instance.calendarContainer.appendChild(clear);
            }
        });
    });
}

export function getCurrentDate() {
    return new Date().toISOString().split('T')[0];
}

export function formatDate(date) {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    return date.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function parseDate(dateString) {
    const [day, month, year] = dateString.split('/');
    return new Date(year, month - 1, day);
}
