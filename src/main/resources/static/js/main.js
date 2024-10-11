import { loadData, updateMonthlySummary } from './dataManager.js';
import { setupEventListeners, loadDashboardData, loadCategories, loadTransactions } from './uiManager.js';
import { setupBudgetModal } from './budgetManager.js';
import { updateTrendChart } from './chartManager.js';
import { showNotification } from './utils.js';

import { testCreateMovement } from './api.js';
window.testCreateMovement = testCreateMovement;

// Global app data object
let appData = {
    categories: [],
    transactions: [],
    catTypes: [],
    monthlySummary: { income: 0, expenses: 0, balance: 0 }
};

async function initializeApp() {
    try {
        // Load initial data
        await loadData(appData);

        // Setup UI components
        setupBudgetModal();
        setupEventListeners(appData);

        // Load and display data
        loadDashboardData(appData);
        loadCategories(appData);
        loadTransactions(appData);

        // Update charts
        updateMonthlySummary(appData);
        updateTrendChart(appData);

        showNotification('Applicazione inizializzata con successo', 'success');
    } catch (error) {
        console.error('Errore durante l\'inizializzazione:', error);
        showNotification('Errore durante l\'inizializzazione dell\'applicazione', 'error');
    }
}

// Event listener for DOMContentLoaded
document.addEventListener('DOMContentLoaded', initializeApp);

// Export appData for use in other modules if needed
export { appData };