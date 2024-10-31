import { 
    createTransaction, 
    deleteTransaction, 
    fetchTransactions,
    getTransactionDetails 
} from './api.js';
import { formatCurrency, showNotification } from './utils.js';
import { formatDate } from './dateManager.js';
import { loadDashboardData } from './uiManager.js';
import { updateTrendChart } from './chartManager.js';

export async function handleNewTransaction(e) {
    e.preventDefault();
    const form = e.target;
    
    try {
        const transactionData = {
            description: form.description.value,
            amount: parseFloat(form.amount.value) * (form.transactionType.checked ? 1 : -1),
            date: form.date.value,
            catIds: Array.from(form.category.selectedOptions)
                .map(option => parseInt(option.value))
                .filter(id => !isNaN(id))
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

        tbody.innerHTML = transactions.map(transaction => `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${formatDate(transaction.date)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${transaction.description}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${transaction.categoryName || 'N/A'}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}">
                    ${formatCurrency(transaction.amount)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                        class="text-indigo-600 hover:text-indigo-900 mr-2 view-transaction" 
                        data-transaction-id="${transaction.id}">
                        Details
                    </button>
                    <button 
                        class="text-red-600 hover:text-red-900 delete-transaction" 
                        data-transaction-id="${transaction.id}">
                        Delete
                    </button>
                </td>
            </tr>
        `).join('');

        // Event listeners per i pulsanti
        tbody.querySelectorAll('.view-transaction').forEach(button => {
            button.addEventListener('click', () => {
                const id = button.dataset.transactionId;
                if (id) showTransactionDetails(id);
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

