import { 
    createTransaction, 
    deleteTransaction, 
    fetchTransactions,
    getTransactionDetails,
    updateTransaction,
    fetchCategories
} from './api.js';
import { formatCurrency, showNotification } from './utils.js';
import { formatDate, initializeFlatpickr } from './dateManager.js';
import { loadDashboardData } from './uiManager.js';
import { updateTrendChart } from './chartManager.js';

export async function handleNewTransaction(e) {
    e.preventDefault();
    const form = e.target;
    
    // Aggiungere validazione
    const amount = parseFloat(form.amount.value);
    if (isNaN(amount) || amount <= 0) {
        showNotification('Please enter a valid amount', 'error');
        return;
    }

    if (!form.category.value) {
        showNotification('Please select a category', 'error');
        return;
    }
    
    try {
        const transactionData = {
            mov: {
                description: form.description.value,
                amount: parseFloat(form.amount.value) * (form.transactionType.checked ? 1 : -1),
                date: form.date.value
            },
            catId: parseInt(form.category.value)
        };

        await createTransaction(transactionData);
        
        // Aggiorna UI dopo la creazione
        await Promise.all([
            updateTransactionList(),
            loadDashboardData(),
            updateTrendChart()
        ]);
        
        // Chiudi la modale e resetta il form
        form.reset();
        document.getElementById('transactionModal').classList.add('hidden');
        showNotification('Transaction created successfully', 'success');
    } catch (error) {
        console.error('Error creating transaction:', error);
        showNotification('Error creating transaction', 'error');
    }
}

export async function handleDeleteTransaction(id) {
    if (!confirm('Are you sure you want to delete this transaction?')) return;
    
    try {
        await deleteTransaction(id);
        
        // Aggiorna UI dopo l'eliminazione
        await Promise.all([
            loadDashboardData(),
            updateTrendChart()
        ]);
        
        showNotification('Transaction deleted successfully', 'success');
    } catch (error) {
        console.error('Error deleting transaction:', error);
        showNotification('Error deleting transaction', 'error');
    }
}

export async function showTransactionDetails(id) {
    try {
        const transaction = await getTransactionDetails(id);
        const modal = document.getElementById('transactionDetails');
        if (!modal) return;

        // Popola i dettagli della transazione
        modal.querySelector('#transactionDate').textContent = formatDate(transaction.date);
        modal.querySelector('#transactionDescription').textContent = transaction.description;
        modal.querySelector('#transactionCategory').textContent = transaction.categoryName;
        modal.querySelector('#transactionAmount').textContent = formatCurrency(transaction.amount);
        modal.querySelector('#transactionType').textContent = transaction.amount > 0 ? 'Income' : 'Expense';

        modal.classList.remove('hidden');
    } catch (error) {
        console.error('Error loading transaction details:', error);
        showNotification('Error loading transaction details', 'error');
    }
}

export function showTransactionModal() {
    const modal = document.getElementById('transactionModal');
    if (!modal) return;
    modal.classList.remove('hidden');
}

export function hideTransactionModal() {
    const modal = document.getElementById('transactionModal');
    if (!modal) return;
    
    modal.classList.add('hidden');
    const form = document.getElementById('newTransactionForm');
    if (form) form.reset();
}

// Funzione per aggiornare la lista delle transazioni
export async function updateTransactionList() {
    try {
        const transactions = await fetchTransactions();
        const tbody = document.querySelector('#transactionTable tbody');
        if (!tbody) return;

        tbody.innerHTML = transactions.map(transaction => {
            // Gestisci il caso in cui ci sono multiple categorie
            const categoryNames = transaction.catNames || [];
            const categoryDisplay = categoryNames.length > 0 
                ? categoryNames.join(', ') 
                : 'N/A';

            return `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${formatDate(transaction.date)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${transaction.description}
                </td>
                <td class="px-6 py-4 text-sm text-gray-500">
                    ${categoryDisplay}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}">
                    ${formatCurrency(transaction.amount)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                        class="text-blue-600 hover:text-blue-900 mr-2 edit-transaction" 
                        data-transaction-id="${transaction.id}">
                        Edit
                    </button>
                    <button 
                        class="text-red-600 hover:text-red-900 delete-transaction" 
                        data-transaction-id="${transaction.id}">
                        Delete
                    </button>
                </td>
            </tr>
        `}).join('');

        // Event listeners per i pulsanti
        tbody.querySelectorAll('.edit-transaction').forEach(button => {
            button.addEventListener('click', () => {
                const id = button.dataset.transactionId;
                if (id) handleEditClick(id);
            });
        });

        tbody.querySelectorAll('.delete-transaction').forEach(button => {
            button.addEventListener('click', () => {
                const id = button.dataset.transactionId;
                if (id) handleDeleteTransaction(id);
            });
        });
    } catch (error) {
        console.error('Error updating transaction list:', error);
        showNotification('Error updating transactions', 'error');
    }
}

async function handleEditClick(transactionId) {
    console.log('Edit clicked for transaction:', transactionId);
    try {
        const transaction = await getTransactionDetails(transactionId);
        console.log('Transaction details received:', transaction);
        showEditTransactionModal(transaction);
    } catch (error) {
        console.error('Error loading transaction details:', error);
        showNotification('Error loading transaction details', 'error');
    }
}

function validateTransactionData(data) {
    if (!data.id) {
        throw new Error('Transaction ID is required');
    }
    if (!data.description) {
        throw new Error('Description is required');
    }
    if (isNaN(data.amount)) {
        throw new Error('Invalid amount');
    }
    if (!data.date) {
        throw new Error('Date is required');
    }
    if (!Array.isArray(data.catIds)) {
        throw new Error('Categories must be an array');
    }
    if (data.catIds.some(id => isNaN(id))) {
        throw new Error('Invalid category ID');
    }
    return true;
}

export async function handleEditTransaction(e) {
    e.preventDefault();
    console.log('Edit form submitted');
    
    const form = e.target;
    const transactionId = document.getElementById('editTransactionId').value;
    
    try {
        const amount = parseFloat(form.amount.value);
        const transactionData = {
            id: parseInt(transactionId),
            description: form.description.value,
            amount: amount,
            date: form.date.value,
            isIncome: amount >= 0,
            catIds: Array.from(form.category.selectedOptions).map(option => parseInt(option.value))
        };

        console.log('Prepared transaction data:', transactionData);

        // Validate data before sending
        validateTransactionData(transactionData);
        console.log('Data validation passed');

        console.log('Sending update request:', {
            transactionId,
            transactionData
        });

        await updateTransaction(transactionId, transactionData);
        
        // Aggiorna UI
        console.log('Updating UI components...');
        await Promise.all([
            updateTransactionList(),
            loadDashboardData(),
            updateTrendChart()
        ]);
        console.log('UI updates completed');
        
        // Chiudi modale
        hideEditTransactionModal();
        showNotification('Transaction updated successfully', 'success');
    } catch (error) {
        console.error('Error updating transaction:', error);
        console.error('Error details:', {
            transactionId,
            formData: {
                description: form.description.value,
                amount: form.amount.value,
                date: form.date.value,
                categories: Array.from(form.category.selectedOptions).map(opt => opt.value)
            }
        });
        showNotification(error.message || 'Error updating transaction', 'error');
    }
}

export function hideEditTransactionModal() {
    const modal = document.getElementById('editTransactionModal');
    if (modal) {
        modal.classList.add('hidden');
        document.getElementById('editTransactionForm')?.reset();
    }
}

async function updateCategorySelect(selectElement) {
    try {
        const categories = await fetchCategories();
        selectElement.innerHTML = categories.map(category => 
            `<option value="${category.id}">${category.name}</option>`
        ).join('');
    } catch (error) {
        console.error('Error updating category select:', error);
        showNotification('Error loading categories', 'error');
    }
}

export function showEditTransactionModal(transaction) {
    console.log('Showing edit modal for transaction:', transaction);
    const modal = document.getElementById('editTransactionModal');
    if (!modal) {
        console.error('Edit modal not found');
        return;
    }

    // Popola form
    document.getElementById('editTransactionId').value = transaction.id;
    document.getElementById('editAmount').value = Math.abs(transaction.amount);
    document.getElementById('editDescription').value = transaction.description;
    document.getElementById('editDate').value = transaction.date;

    // Aggiorna le categorie e seleziona quelle corrette
    const editCategory = document.getElementById('editCategory');
    console.log('Current transaction catIds:', transaction.catIds);
    updateCategorySelect(editCategory).then(() => {
        if (transaction.catIds && transaction.catIds.length > 0) {
            // Seleziona tutte le categorie associate
            transaction.catIds.forEach(catId => {
                const option = editCategory.querySelector(`option[value="${catId}"]`);
                if (option) {
                    option.selected = true;
                }
            });
        }
    });

    // Inizializza flatpickr per il campo data
    initializeFlatpickr('#editDate');

    modal.classList.remove('hidden');
}

