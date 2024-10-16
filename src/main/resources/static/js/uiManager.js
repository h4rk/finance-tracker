import { updateMonthlySummary, addTransaction, addCategory, removeCategory, removeTransaction, filterTransactions, getCategoryName } from './dataManager.js';
import { updateTrendChart, updateBudgetProgress } from './chartManager.js';
import { formatCurrency, showNotification } from './utils.js';

export function loadDashboardData(appData) {
    updateMonthlySummary(appData);
    displayMonthlySummary(appData.monthlySummary);
    updateTrendChart(appData);
    updateBudgetProgress(appData);
}

function displayMonthlySummary(summary) {
    document.getElementById('income').textContent = formatCurrency(summary.income);
    document.getElementById('expenses').textContent = formatCurrency(summary.expenses);
    document.getElementById('balance').textContent = formatCurrency(summary.balance);
}

export function loadCategories(appData) {
    const categorySelect = document.getElementById('category');
    const categoryList = document.getElementById('categoryList');
    
    categorySelect.innerHTML = '<option value="">Seleziona categoria</option>';
    categoryList.innerHTML = '';

    appData.categories.forEach(category => {
        // Populate category select
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);

        // Populate category list
        const li = document.createElement('li');
        li.className = 'py-2 flex justify-between items-center';
        li.innerHTML = `
            <span>${category.name}</span>
            <button class="delete-category text-red-600 hover:text-red-800" data-category-id="${category.id}">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
            </button>
        `;
        categoryList.appendChild(li);
    });
}

export function loadTransactions(appData, transactions = appData.transactions) {
    const transactionTableBody = document.querySelector('#transactionTable tbody');
    transactionTableBody.innerHTML = '';

    transactions.forEach(transaction => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">${transaction.date}</td>
            <td class="px-6 py-4">${transaction.description}</td>
            <td class="px-6 py-4">${transaction.categoryName || getCategoryName(appData, transaction.catIds) || 'Categoria sconosciuta'}</td>
            <td class="px-6 py-4">${formatCurrency(Math.abs(transaction.amount))}</td>
            <td class="px-6 py-4 ${transaction.income ? 'text-green-600' : 'text-red-600'}">
                ${transaction.income ? 'Entrata' : 'Uscita'}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button class="text-indigo-600 hover:text-indigo-900 mr-2 edit-transaction" data-transaction-id="${transaction.id}">Modifica</button>
                <button class="text-red-600 hover:text-red-900 delete-transaction" data-transaction-id="${transaction.id}">Elimina</button>
            </td>
        `;
        transactionTableBody.appendChild(row);
    });

    console.log('Loaded transactions:', transactions);
}

export function setupEventListeners(appData) {
    document.getElementById('newTransactionForm').addEventListener('submit', e => handleNewTransaction(e, appData));
    document.getElementById('newCategoryForm').addEventListener('submit', e => handleNewCategory(e, appData));
    document.getElementById('transactionType').addEventListener('change', updateTransactionTypeLabel);
    document.getElementById('trendPeriod').addEventListener('change', () => updateTrendChart(appData));
    document.getElementById('transactionSearch').addEventListener('input', () => handleTransactionFilter(appData));
    document.getElementById('transactionFilter').addEventListener('change', () => handleTransactionFilter(appData));
    document.getElementById('categoryList').addEventListener('click', e => handleCategoryDelete(e, appData));
    document.getElementById('transactionTable').addEventListener('click', e => handleTransactionAction(e, appData));
}

export async function handleNewTransaction(e, appData) {
    e.preventDefault();
    const form = e.target;
    const amount = Math.abs(parseFloat(form.amount.value));
    const isIncome = form.transactionType.checked;

    const transactionData = {
        description: form.description.value,
        amount: amount,
        date: form.date.value,
        catId: parseInt(form.category.value),
        income: isIncome
    };
    console.log("New transaction object:", JSON.stringify(transactionData, null, 2));

    try {
        const newTransaction = await addTransaction(appData, transactionData);
        loadDashboardData(appData);
        loadTransactions(appData);
        form.reset();
        updateTransactionTypeUI();
        showNotification('Transazione aggiunta con successo', 'success');
    } catch (error) {
        console.error('Errore:', error);
        showNotification('Errore nell\'aggiunta della transazione: ' + error.message, 'error');
    }
}

async function handleNewCategory(e, appData) {
    e.preventDefault();
    const form = e.target;
    const categoryData = {
        name: form.newCategoryName.value,
        description: form.newCategoryDescription ? form.newCategoryDescription.value : '',
        type: parseInt(form.newCategoryType.value)
    };

    try {
        const newCategory = await addCategory(appData, categoryData);
        loadCategories(appData);
        form.reset();
        showNotification('Categoria aggiunta con successo', 'success');
    } catch (error) {
        console.error('Error adding category:', error);
        showNotification('Errore nell\'aggiunta della categoria: ' + error.message, 'error');
    }
}

async function handleCategoryDelete(e, appData) {
    if (e.target.closest('.delete-category')) {
        const categoryId = parseInt(e.target.closest('.delete-category').dataset.categoryId);
        try {
            await removeCategory(appData, categoryId);
            loadCategories(appData);
            updateBudgetProgress(appData);
        } catch (error) {
            console.error('Error deleting category:', error);
            // Handle error (e.g., show error message to user)
        }
    }
}

async function handleTransactionAction(e, appData) {
    if (e.target.classList.contains('delete-transaction')) {
        const transactionId = parseInt(e.target.dataset.transactionId);
        try {
            await removeTransaction(appData, transactionId);
            loadDashboardData(appData);
            loadTransactions(appData);
        } catch (error) {
            console.error('Error deleting transaction:', error);
            // Handle error (e.g., show error message to user)
        }
    } else if (e.target.classList.contains('edit-transaction')) {
        const transactionId = parseInt(e.target.dataset.transactionId);
        // Implement edit transaction logic here
        console.log('Edit transaction:', transactionId);
    }
}

function handleTransactionFilter(appData) {
    const searchTerm = document.getElementById('transactionSearch').value;
    const filterType = document.getElementById('transactionFilter').value;
    const filteredTransactions = filterTransactions(appData, searchTerm, filterType);
    loadTransactions(appData, filteredTransactions);
}

function updateTransactionTypeLabel() {
    const transactionType = document.getElementById('transactionType');
    const label = document.querySelector('label[for="amount"]');
    label.textContent = transactionType.checked ? 'Importo (Entrata):' : 'Importo (Uscita):';
    updateTransactionTypeColors();
}

function updateTransactionTypeColors() {
    const transactionType = document.getElementById('transactionType');
    const submitButton = document.getElementById('submitTransaction');
    
    if (transactionType.checked) {
        submitButton.classList.remove('bg-red-600', 'hover:bg-red-700', 'focus:ring-red-500');
        submitButton.classList.add('bg-green-600', 'hover:bg-green-700', 'focus:ring-green-500');
    } else {
        submitButton.classList.remove('bg-green-600', 'hover:bg-green-700', 'focus:ring-green-500');
        submitButton.classList.add('bg-red-600', 'hover:bg-red-700', 'focus:ring-red-500');
    }
}

// Add this function to update the UI based on the transaction type
function updateTransactionTypeUI() {
    const transactionType = document.getElementById('transactionType');
    const submitButton = document.getElementById('submitTransaction');
    if (transactionType.checked) {
        submitButton.classList.remove('bg-red-600', 'hover:bg-red-700', 'focus:ring-red-500');
        submitButton.classList.add('bg-green-600', 'hover:bg-green-700', 'focus:ring-green-500');
    } else {
        submitButton.classList.remove('bg-green-600', 'hover:bg-green-700', 'focus:ring-green-500');
        submitButton.classList.add('bg-red-600', 'hover:bg-red-700', 'focus:ring-red-500');
    }
}

// Add an event listener to update the UI when the transaction type changes
document.addEventListener('DOMContentLoaded', () => {
    const transactionType = document.getElementById('transactionType');
    transactionType.addEventListener('change', updateTransactionTypeUI);
    updateTransactionTypeUI(); // Initial UI update
});

// Add other UI-related functions as needed
