import { loadData } from './dataManager.js';
import { setupEventListeners, loadDashboardData, loadCategories, loadTransactions } from './uiManager.js';
import { updateTrendChart } from './chartManager.js';
import { showNotification } from './utils.js';
import { initializeBudgetModal, handleNewBudget, loadCategoriesForBudget } from './budgetManager.js';
import { initializeFlatpickr } from './dateManager.js';
import { fetchCategories, fetchTransactions, createCategory } from './api.js';
import { handleNewTransaction, updateTransactionList, handleEditTransaction } from './transactionManager.js';
import { handleNewCategory } from './categoryManager.js';

// Global app data object
let appData = {
    categories: [],
    transactions: [],
    catTypes: [],
    monthlySummary: { income: 0, expenses: 0, balance: 0 }
};

// Funzione per gestire il setup delle modali
function setupModals() {
    const modals = {
        transaction: {
            modalId: 'transactionModal',
            openBtn: 'addTransactionBtn',
            closeBtn: 'closeTransactionModal',
            form: 'newTransactionForm',
            onOpen: async () => {
                await initializeFlatpickr();
                await loadCategoriesForTransaction();
            },
            onSubmit: handleNewTransaction
        },
        category: {
            modalId: 'categoryModal',
            openBtn: 'addCategoryBtn',
            closeBtn: 'closeCategoryModal',
            form: 'newCategoryForm',
            onSubmit: handleNewCategory
        },
        budget: {
            modalId: 'budgetModal',
            openBtn: 'addBudgetBtn',
            closeBtn: 'closeBudgetModal',
            form: 'newBudgetForm',
            onOpen: loadCategoriesForBudget,
            onSubmit: handleNewBudget
        }
    };

    Object.values(modals).forEach(modal => {
        const modalElement = document.getElementById(modal.modalId);
        const openButton = document.getElementById(modal.openBtn);
        const closeButton = document.getElementById(modal.closeBtn);
        const form = modal.form ? document.getElementById(modal.form) : null;

        if (!modalElement || !openButton) {
            console.warn(`Modal setup incomplete for ${modal.modalId}`);
            return;
        }

        // Setup apertura modale
        openButton.addEventListener('click', async () => {
            console.log(`Opening modal: ${modal.modalId}`);
            modalElement.classList.remove('hidden');
            if (modal.onOpen) await modal.onOpen();
        });

        // Setup chiusura modale
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                modalElement.classList.add('hidden');
                if (form) form.reset();
            });
        }

        // Setup form submit
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                try {
                    await modal.onSubmit(e);
                    modalElement.classList.add('hidden');
                    form.reset();
                    // Aggiorna i dati dopo il submit
                    await Promise.all([
                        loadDashboardData(),
                        updateTransactionList(),
                        updateTrendChart()
                    ]);
                } catch (error) {
                    console.error('Form submission error:', error);
                    showNotification('Error submitting form', 'error');
                }
            });
        }
    });
}

// Gestione switch tipo transazione
function setupTransactionTypeSwitch() {
    const typeSwitch = document.getElementById('transactionType');
    const submitButton = document.getElementById('submitTransaction');
    const amountLabel = document.querySelector('label[for="amount"]');

    if (typeSwitch && submitButton && amountLabel) {
        typeSwitch.addEventListener('change', () => {
            const isIncome = typeSwitch.checked;
            submitButton.className = `px-4 py-2 ${isIncome ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white rounded-md transition duration-300`;
            amountLabel.textContent = `Amount (${isIncome ? 'Income' : 'Expense'})`;
        });
    }
}

// Caricamento categorie per transazioni
async function loadCategoriesForTransaction() {
    try {
        const categories = await fetchCategories();
        const categorySelect = document.getElementById('category');
        if (!categorySelect) return;

        categorySelect.innerHTML = categories
            .map(category => `<option value="${category.id}">${category.name}</option>`)
            .join('');
    } catch (error) {
        console.error('Error loading categories:', error);
        showNotification('Error loading categories', 'error');
    }
}

// Inizializzazione dell'app
document.addEventListener('DOMContentLoaded', async function() {
    try {
        console.log('Starting app initialization');
        
        // Setup UI iniziale
        setupModals();
        
        // Caricamento dati iniziali
        await Promise.all([
            loadDashboardData(),
            updateTransactionList(),
            updateTrendChart(),
            loadCategories()
        ]);

        console.log('App initialization completed');
    } catch (error) {
        console.error('Error during app initialization:', error);
        showNotification('Error initializing app', 'error');
    }
});

document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing event listeners...');
    
    // Edit Transaction Form
    const editTransactionForm = document.getElementById('editTransactionForm');
    if (editTransactionForm) {
        console.log('Found edit transaction form, attaching submit handler');
        editTransactionForm.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Edit form submit intercepted');
            handleEditTransaction(e);
        });
    } else {
        console.error('Edit transaction form not found');
    }
    
    // ... resto del codice
});

function setupModalBehavior() {
    // Chiudi modale con ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.classList.add('hidden');
            });
        }
    });

    // Chiudi modale cliccando fuori
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    });
}

export { appData };

