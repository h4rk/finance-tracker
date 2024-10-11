import { addTransaction, removeTransaction, filterTransactions } from './dataManager.js';
import { loadTransactions, loadDashboardData } from './uiManager.js';
import { formatCurrency, formatDate, showNotification } from './utils.js';

export async function handleNewTransaction(e, appData) {
    e.preventDefault();
    const form = e.target;
    const amount = Math.abs(parseFloat(form.amount.value));
    const isIncome = form.transactionType.checked;

    const transactionData = {
        description: form.description.value,
        amount: isIncome ? amount : -amount,
        date: form.date.value,
        catId: parseInt(form.category.value),
    };

    try {
        console.log('Submitting transaction:', transactionData);
        const result = await addTransaction(appData, transactionData);
        if (result.success) {
            console.log('Transaction added successfully');
            loadDashboardData(appData);
            loadTransactions(appData);
            form.reset();
            showNotification(result.message, 'success');
        } else {
            throw new Error(result.message || 'Unknown error occurred');
        }
    } catch (error) {
        console.error('Error adding transaction:', error);
        showNotification('Errore nell\'aggiunta della transazione: ' + error.message, 'error');
    }
}

export async function handleDeleteTransaction(transactionId, appData) {
    if (confirm('Sei sicuro di voler eliminare questa transazione?')) {
        try {
            const result = await removeTransaction(appData, transactionId);
            if (result.success) {
                loadDashboardData(appData);
                loadTransactions(appData);
                showNotification(result.message, 'success');
            } else {
                throw new Error(result.message || 'Unknown error occurred');
            }
        } catch (error) {
            console.error('Error deleting transaction:', error);
            showNotification('Errore nell\'eliminazione della transazione: ' + error.message, 'error');
        }
    }
}

export function handleTransactionFilter(appData) {
    const searchTerm = document.getElementById('transactionSearch').value;
    const filterType = document.getElementById('transactionFilter').value;
    const filteredTransactions = filterTransactions(appData, searchTerm, filterType);
    loadTransactions(appData, filteredTransactions);
}

export function showTransactionDetails(transaction, appData) {
    const category = appData.categories.find(cat => cat.id === transaction.catId);
    const detailsHtml = `
        <div class="bg-white p-4 rounded-lg shadow">
            <h3 class="text-lg font-semibold mb-2">Dettagli Transazione</h3>
            <p><strong>Data:</strong> ${formatDate(transaction.date)}</p>
            <p><strong>Descrizione:</strong> ${transaction.description}</p>
            <p><strong>Categoria:</strong> ${category ? category.name : 'N/A'}</p>
            <p><strong>Importo:</strong> ${formatCurrency(transaction.amount)}</p>
            <p><strong>Tipo:</strong> ${transaction.amount > 0 ? 'Entrata' : 'Uscita'}</p>
        </div>
    `;
    
    const detailsContainer = document.getElementById('transactionDetails');
    detailsContainer.innerHTML = detailsHtml;
    detailsContainer.classList.remove('hidden');
}

export function hideTransactionDetails() {
    const detailsContainer = document.getElementById('transactionDetails');
    detailsContainer.classList.add('hidden');
}

export function exportTransactions(appData) {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Data,Descrizione,Categoria,Importo,Tipo\n";

    appData.transactions.forEach(t => {
        const category = appData.categories.find(cat => cat.id === t.catId);
        const row = [
            formatDate(t.date),
            t.description,
            category ? category.name : 'N/A',
            formatCurrency(t.amount),
            t.amount > 0 ? "Entrata" : "Uscita"
        ].join(",");
        csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transactions_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.className = `fixed bottom-4 right-4 p-4 rounded-lg text-white ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}`;
    document.body.appendChild(notification);
    setTimeout(() => {
        document.body.removeChild(notification);
    }, 3000);
}

// Add other transaction-related functions as needed