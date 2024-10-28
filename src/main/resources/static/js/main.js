import { loadData, updateMonthlySummary } from './dataManager.js';
import { setupEventListeners, loadDashboardData, loadCategories, loadTransactions, setupModalInteractions } from './uiManager.js';
import { updateTrendChart } from './chartManager.js';
import { showNotification } from './utils.js';
import { initializeBudgetModal } from './budgetManager.js';
import { initializeFlatpickr } from './dateManager.js';

import { testCreateMovement } from './api.js';
window.testCreateMovement = testCreateMovement;

// Global app data object
let appData = {
    categories: [],
    transactions: [],
    catTypes: [],
    monthlySummary: { income: 0, expenses: 0, balance: 0 }
};

// Event listener for DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(async function() {
        try {
            console.log('Starting app initialization');
            await loadData(appData);
            await updateMonthlySummary(appData);

            console.log('Initializing Flatpickr');
            initializeFlatpickr();

            console.log('Setting up event listeners');
            setupEventListeners(appData);
            
            console.log('Setting up modal interactions');
            setupModalInteractions();

            console.log('Loading dashboard data');
            loadDashboardData(appData);
            
            console.log('Loading categories');
            loadCategories(appData);
            
            console.log('Loading transactions');
            loadTransactions(appData);

            console.log('Updating monthly summary');
            updateMonthlySummary(appData);
            
            console.log('Updating trend chart');
            updateTrendChart(appData);

            console.log('App initialization completed successfully');
            showNotification('Applicazione inizializzata con successo', 'success');
        } catch (error) {
            console.error('Error initializing app:', error);
            console.error('Error stack:', error.stack);
            if (error.message.includes('Bad Request')) {
                showNotification('There was an issue with the data request. Please try again later or contact support.', 'error');
            } else {
                showNotification('An unexpected error occurred. Please try again later.', 'error');
            }
        }
    }, 100); // Small delay to ensure DOM is ready
});

// Export appData for use in other modules if needed
export { appData };

// Add these functions to your existing JavaScript

function setupModals() {
    // Category Modal
    const categoryModal = document.getElementById('categoryModal');
    const addCategoryBtn = document.getElementById('addCategoryBtn');
    const closeCategoryModal = document.getElementById('closeCategoryModal');

    addCategoryBtn.addEventListener('click', () => categoryModal.classList.remove('hidden'));
    closeCategoryModal.addEventListener('click', () => categoryModal.classList.add('hidden'));

    // Transaction Modal
    const transactionModal = document.getElementById('transactionModal');
    const addTransactionBtn = document.getElementById('addTransactionBtn');
    const closeTransactionModal = document.getElementById('closeTransactionModal');

    addTransactionBtn.addEventListener('click', () => transactionModal.classList.remove('hidden'));
    closeTransactionModal.addEventListener('click', () => transactionModal.classList.add('hidden'));
}

// Call this function when the page loads
document.addEventListener('DOMContentLoaded', setupModals);
