import { 
    fetchTransactions, 
    fetchCategories, 
    deleteCategory, 
    deleteTransaction 
} from './api.js';
import { updateTrendChart, updateBudgetProgress } from './chartManager.js';
import { formatCurrency, showNotification } from './utils.js';
import { formatDate } from './dateManager.js';
import { handleNewTransaction } from './transactionManager.js';

// Dashboard Loading
async function loadDashboardData() {
    try {
        const [transactions, monthlyData] = await Promise.all([
            fetchTransactions(),
            fetch('/analytics/monthly').then(r => r.json())
        ]);
        
        // Verifica che transactions sia un array valido
        if (!Array.isArray(transactions)) {
            console.error('Transactions is not an array:', transactions);
            throw new Error('Invalid transactions data');
        }

        const { monthlyIncome: income, monthlyExpense: expenses } = monthlyData;
        const delta = income - expenses;
        
        displayMonthlySummary({ income, expenses, delta });
        
        // Aggiorna i grafici solo se ci sono transazioni
        if (transactions.length > 0) {
            updateTrendChart(transactions);
            updateBudgetProgress(transactions);
        } else {
            console.log('No transactions available');
            // Opzionalmente, mostra un messaggio o uno stato vuoto
        }
        
    } catch (error) {
        console.error('Error loading dashboard:', error);
        showNotification('Errore nel caricamento della dashboard', 'error');
    }
}

// Data Loading Functions
async function loadCategories() {
    try {
        const categories = await fetchCategories();
        displayCategories(categories);
        updateCategorySelect(categories);
        return categories;
    } catch (error) {
        console.error('Error loading categories:', error);
        showNotification('Errore nel caricamento delle categorie', 'error');
    }
}

async function loadTransactions(filters = {}) {
    try {
        const transactions = await fetchTransactions();
        const filteredTransactions = filterTransactions(transactions, filters);
        displayTransactions(filteredTransactions);
        return filteredTransactions;
    } catch (error) {
        console.error('Error loading transactions:', error);
        showNotification('Errore nel caricamento delle transazioni', 'error');
    }
}

// Event Handlers
function setupEventListeners() {
    const elements = [
        { id: 'newTransactionForm', event: 'submit', handler: handleNewTransaction },
        // { id: 'newCategoryForm', event: 'submit', handler: handleNewCategory }, fra mi sa che non serve e mi duplichi le categorie
        { id: 'transactionSearch', event: 'input', handler: handleTransactionFilter },
        { id: 'transactionFilter', event: 'change', handler: handleTransactionFilter },
        { id: 'trendPeriod', event: 'change', handler: () => loadDashboardData() },
        { id: 'transactionType', event: 'change', handler: updateTransactionTypeUI }
    ];

    elements.forEach(({ id, event, handler }) => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener(event, handler);
        }
    });

    setupDelegatedEvents();
    setupModalInteractions();
}

function setupDelegatedEvents() {
    // Category list delegation
    const categoryList = document.getElementById('categoryList');
    if (categoryList) {
        categoryList.addEventListener('click', async (e) => {
            const deleteBtn = e.target.closest('.delete-category');
            if (deleteBtn) {
                const categoryId = deleteBtn.dataset.categoryId;
                await handleDeleteCategory(categoryId);
            }
        });
    }

    // Transaction table delegation
    const transactionTable = document.getElementById('transactionTable');
    if (transactionTable) {
        transactionTable.addEventListener('click', async (e) => {
            const target = e.target;
            const transactionId = target.dataset.transactionId;

            if (target.classList.contains('delete-transaction')) {
                await handleDeleteTransaction(transactionId);
            } else if (target.classList.contains('view-transaction')) {
                await showTransactionDetails(transactionId);
            }
        });
    }
}

async function handleDeleteCategory(categoryId) {
    try {
        await deleteCategory(categoryId);
        await Promise.all([
            loadCategories(),
            loadTransactions()
        ]);
        showNotification('Categoria eliminata con successo', 'success');
    } catch (error) {
        console.error('Error deleting category:', error);
        showNotification('Errore nell\'eliminazione della categoria', 'error');
    }
}

async function handleDeleteTransaction(transactionId) {
    try {
        await deleteTransaction(transactionId);
        await Promise.all([
            loadDashboardData(),
            loadTransactions()
        ]);
        showNotification('Transazione eliminata con successo', 'success');
    } catch (error) {
        console.error('Error deleting transaction:', error);
        showNotification('Errore nell\'eliminazione della transazione', 'error');
    }
}

async function handleTransactionFilter() {
    const searchTerm = document.getElementById('transactionSearch').value;
    const filterType = document.getElementById('transactionFilter').value;
    await loadTransactions({ searchTerm, filterType });
}

// UI Display Functions
function displayMonthlySummary({ income, expenses, delta }) {
    document.getElementById('income').textContent = formatCurrency(income);
    document.getElementById('expenses').textContent = formatCurrency(expenses);
    const balanceElement = document.getElementById('balance');
    balanceElement.textContent = formatCurrency(delta);
    balanceElement.className = delta > 0 ? 'text-green-600' : 'text-red-600';
}

function displayCategories(categories) {
    const categoryList = document.getElementById('categoryList');
    if (!categoryList) return;

    categoryList.innerHTML = categories.map(category => `
        <li class="py-2 flex justify-between items-center">
            <span>${category.name}</span>
            <button class="delete-category text-red-600 hover:text-red-800" 
                    data-category-id="${category.id}">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" 
                          stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                    </path>
                </svg>
            </button>
        </li>
    `).join('');
}

function displayTransactions(transactions) {
    const tbody = document.querySelector('#transactionTable tbody');
    if (!tbody) return;

    tbody.innerHTML = transactions.map(transaction => `
        <tr>
            <td class="px-6 py-4 whitespace-nowrap">${formatDate(transaction.date)}</td>
            <td class="px-6 py-4">${transaction.description}</td>
            <td class="px-6 py-4">${transaction.categoryName || 'N/A'}</td>
            <td class="px-6 py-4">${formatCurrency(transaction.amount)}</td>
            <td class="px-6 py-4 ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}">
                ${transaction.amount >= 0 ? 'Entrata' : 'Uscita'}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button class="text-indigo-600 hover:text-indigo-900 mr-2 view-transaction" 
                        data-transaction-id="${transaction.id}">Visualizza</button>
                <button class="text-red-600 hover:text-red-900 delete-transaction" 
                        data-transaction-id="${transaction.id}">Elimina</button>
            </td>
        </tr>
    `).join('');
}

function updateCategorySelect(categories) {
    const select = document.getElementById('category');
    if (!select) return;

    select.innerHTML = `
        <option value="">Seleziona categoria</option>
        ${categories.map(category => `
            <option value="${category.id}">${category.name}</option>
        `).join('')}
    `;
}

function filterTransactions(transactions, { searchTerm = '', filterType = 'all' } = {}) {
    return transactions.filter(transaction => {
        const matchesSearch = !searchTerm || 
            transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || 
            (filterType === 'income' && transaction.amount > 0) ||
            (filterType === 'expense' && transaction.amount < 0);
        return matchesSearch && matchesType;
    });
}

function updateTransactionTypeUI() {
    const transactionType = document.getElementById('transactionType');
    const submitButton = document.getElementById('submitTransaction');
    const label = document.querySelector('label[for="amount"]');
    
    if (!transactionType || !submitButton || !label) return;

    const isIncome = transactionType.checked;
    
    // Update label
    label.textContent = isIncome ? 'Importo (Entrata):' : 'Importo (Uscita):';
    
    // Update button colors
    submitButton.classList.remove(
        isIncome ? 'bg-red-600' : 'bg-green-600',
        isIncome ? 'hover:bg-red-700' : 'hover:bg-green-700',
        isIncome ? 'focus:ring-red-500' : 'focus:ring-green-500'
    );
    submitButton.classList.add(
        isIncome ? 'bg-green-600' : 'bg-red-600',
        isIncome ? 'hover:bg-green-700' : 'hover:bg-red-700',
        isIncome ? 'focus:ring-green-500' : 'focus:ring-red-500'
    );
}

async function showTransactionDetails(transactionId) {
    try {
        const transaction = await fetch(`/movs/${transactionId}`).then(r => r.json());
        const modal = document.getElementById('transactionDetails');
        if (!modal) return;

        // Populate modal with transaction details
        modal.querySelector('.transaction-date').textContent = formatDate(transaction.date);
        modal.querySelector('.transaction-description').textContent = transaction.description;
        modal.querySelector('.transaction-amount').textContent = formatCurrency(transaction.amount);
        modal.querySelector('.transaction-categories').textContent = transaction.categoryName || 'N/A';

        modal.classList.remove('hidden');
    } catch (error) {
        console.error('Error loading transaction details:', error);
        showNotification('Errore nel caricamento dei dettagli della transazione', 'error');
    }
}

function setupModalInteractions() {
    document.addEventListener('click', (e) => {
        if (e.target.matches('[id$="Modal"], [id$="Modal"] [id^="close"]')) {
            e.target.closest('.modal').classList.add('hidden');
        }
    });
}

// Initialize UI when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    loadDashboardData();
    updateTransactionTypeUI();
});

// Esportiamo tutte le funzioni necessarie
export {
    loadDashboardData,
    loadCategories,
    loadTransactions,
    setupEventListeners
};
