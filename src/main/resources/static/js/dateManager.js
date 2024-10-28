import flatpickr from 'https://cdn.jsdelivr.net/npm/flatpickr@4.6.13/+esm';

// Configurazione base per flatpickr
const FLATPICKR_CONFIG = {
    dateFormat: "Y-m-d",
    defaultDate: new Date(),
    locale: "it",
    altInput: true,
    altFormat: "d/m/Y",
    static: true
};

// Funzione principale per inizializzare il datepicker
export function initializeModalDatepicker() {
    console.log('Initializing modal datepicker...'); // Debug
    
    const dateInput = document.querySelector('#date');
    if (!dateInput) {
        console.warn('Date input not found');
        return;
    }

    // Rimuovi istanza precedente se esiste
    if (dateInput._flatpickr) {
        dateInput._flatpickr.destroy();
    }

    return flatpickr(dateInput, FLATPICKR_CONFIG);
}

// Funzione per formattare le date
export function formatDate(dateInput) {
    try {
        const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
        if (isNaN(date.getTime())) {
            throw new Error('Invalid date input');
        }
        return date.toLocaleDateString('it-IT', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric' 
        });
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'Data non valida';
    }
}

// Esportiamo initializeFlatpickr come alias di initializeModalDatepicker
// per mantenere la compatibilità con il codice esistente
export const initializeFlatpickr = initializeModalDatepicker;
