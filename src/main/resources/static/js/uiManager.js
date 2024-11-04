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
import { displayCategories } from './categoryManager.js';

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
        { id: 'transactionSearch', event: 'input', handler: handleTransactionFilter },
        { id: 'transactionFilter', event: 'change', handler: handleTransactionFilter },
        { id: 'trendPeriod', event: 'change', handler: () => loadDashboardData() }
    ];

    elements.forEach(({ id, event, handler }) => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener(event, handler);
        }
    });

    setupDelegatedEvents();
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

// Esporta tutte le funzioni necessarie in un unico export
export {
    loadDashboardData,
    loadCategories,
    loadTransactions,
    setupEventListeners,
    displayTransactions,
    updateCategorySelect
};
