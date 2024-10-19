import { loadData, updateMonthlySummary } from './dataManager.js';
import { setupEventListeners, loadDashboardData, loadCategories, loadTransactions } from './uiManager.js';
import { updateTrendChart } from './chartManager.js';
import { showNotification } from './utils.js';
import { initializeBudgetModal } from './budgetManager.js';

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

            console.log('Setting up event listeners');
            setupEventListeners(appData);
            
            console.log('Initializing budget modal');
            initializeBudgetModal(appData);

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
