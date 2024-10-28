import { 
    fetchTransactions, 
    createTransaction, 
    deleteTransaction 
} from './api.js';
import { formatCurrency, showNotification } from './utils.js';
import { formatDate, initializeModalDatepicker } from './dateManager.js';

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
            loadTransactions(),
            updateDashboardData()
        ]);
        
        form.reset();
        showNotification('Transazione aggiunta con successo', 'success');
    } catch (error) {
        console.error('Error creating transaction:', error);
        showNotification('Errore nella creazione della transazione', 'error');
    }
}

export async function handleDeleteTransaction(transactionId) {
    if (!confirm('Sei sicuro di voler eliminare questa transazione?')) return;
    
    try {
        await deleteTransaction(transactionId);
        
        // Aggiorna UI dopo l'eliminazione
        await Promise.all([
            loadTransactions(),
            updateDashboardData()
        ]);
        
        showNotification('Transazione eliminata con successo', 'success');
    } catch (error) {
        console.error('Error deleting transaction:', error);
        showNotification('Errore nell\'eliminazione della transazione', 'error');
    }
}

export async function loadTransactions(filters = {}) {
    try {
        const transactions = await fetchTransactions();
        displayTransactions(filterTransactions(transactions, filters));
    } catch (error) {
        console.error('Error loading transactions:', error);
        showNotification('Errore nel caricamento delle transazioni', 'error');
    }
}

export async function showTransactionDetails(transactionId) {
    try {
        const response = await fetch(`/movs/${transactionId}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const transaction = await response.json();
        const modal = document.getElementById('transactionDetails');
        if (!modal) return;

        modal.innerHTML = `
            <div class="bg-white p-4 rounded-lg shadow">
                <h3 class="text-lg font-semibold mb-2">Dettagli Transazione</h3>
                <p><strong>Data:</strong> ${formatDate(transaction.date)}</p>
                <p><strong>Descrizione:</strong> ${transaction.description}</p>
                <p><strong>Importo:</strong> ${formatCurrency(transaction.amount)}</p>
                <p><strong>Tipo:</strong> ${transaction.amount >= 0 ? 'Entrata' : 'Uscita'}</p>
                <p><strong>Categorie:</strong> ${transaction.categoryName || 'N/A'}</p>
            </div>
        `;
        
        modal.classList.remove('hidden');
    } catch (error) {
        console.error('Error loading transaction details:', error);
        showNotification('Errore nel caricamento dei dettagli', 'error');
    }
}

function filterTransactions(transactions, { searchTerm = '', type = 'all', startDate = null, endDate = null } = {}) {
    return transactions.filter(transaction => {
        const matchesSearch = !searchTerm || 
            transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
            
        const matchesType = type === 'all' || 
            (type === 'income' && transaction.amount > 0) ||
            (type === 'expense' && transaction.amount < 0);
            
        const matchesDateRange = (!startDate || new Date(transaction.date) >= new Date(startDate)) &&
                                (!endDate || new Date(transaction.date) <= new Date(endDate));
                                
        return matchesSearch && matchesType && matchesDateRange;
    });
}

function displayTransactions(transactions) {
    const container = document.getElementById('transactionsList');
    if (!container) return;

    if (!transactions.length) {
        container.innerHTML = `
            <div class="text-center py-4 text-gray-500">
                Nessuna transazione trovata
            </div>
        `;
        return;
    }

    container.innerHTML = transactions.map(transaction => `
        <div class="bg-white p-4 rounded-lg shadow mb-4">
            <div class="flex justify-between items-center">
                <div>
                    <p class="font-semibold">${transaction.description}</p>
                    <p class="text-sm text-gray-600">${formatDate(transaction.date)}</p>
                </div>
                <div class="text-right">
                    <p class="font-semibold ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}">
                        ${formatCurrency(transaction.amount)}
                    </p>
                    <p class="text-sm text-gray-600">${transaction.categoryName || 'N/A'}</p>
                </div>
            </div>
            <div class="mt-2 flex justify-end space-x-2">
                <button 
                    class="text-blue-600 hover:text-blue-800"
                    onclick="showTransactionDetails(${transaction.id})">
                    Dettagli
                </button>
                <button 
                    class="text-red-600 hover:text-red-800"
                    onclick="handleDeleteTransaction(${transaction.id})">
                    Elimina
                </button>
            </div>
        </div>
    `).join('');
}

async function updateDashboardData() {
    try {
        const [monthlyData, budgetData] = await Promise.all([
            fetch('/analytics/monthly').then(r => r.json()),
            fetch('/analytics/budget-summary').then(r => r.json())
        ]);

        updateDashboardUI(monthlyData, budgetData);
    } catch (error) {
        console.error('Error updating dashboard:', error);
        showNotification('Errore nell\'aggiornamento della dashboard', 'error');
    }
}

function updateDashboardUI(monthlyData, budgetData) {
    // Aggiorna i totali mensili
    if (monthlyData) {
        document.getElementById('monthlyIncome')?.textContent = 
            formatCurrency(monthlyData.monthlyIncome);
        document.getElementById('monthlyExpenses')?.textContent = 
            formatCurrency(monthlyData.monthlyExpense);
    }

    // Aggiorna il riepilogo budget
    if (budgetData) {
        document.getElementById('totalBudget')?.textContent = 
            formatCurrency(budgetData.totalBudget);
        document.getElementById('totalSpent')?.textContent = 
            formatCurrency(budgetData.totalSpent);
    }
}

export function initializeTransactionListeners() {
    const form = document.getElementById('newTransactionForm');
    const searchInput = document.getElementById('transactionSearch');
    const typeFilter = document.getElementById('transactionType');
    const dateFilter = document.getElementById('dateFilter');

    if (form) {
        form.addEventListener('submit', handleNewTransaction);
    }

    if (searchInput) {
        searchInput.addEventListener('input', e => {
            loadTransactions({ searchTerm: e.target.value });
        });
    }

    if (typeFilter) {
        typeFilter.addEventListener('change', e => {
            loadTransactions({ type: e.target.value });
        });
    }

    if (dateFilter) {
        dateFilter.addEventListener('change', e => {
            const [startDate, endDate] = e.target.value.split(',');
            loadTransactions({ startDate, endDate });
        });
    }

    // Aggiungi listener per aprire/chiudere la modale
    const addTransactionBtn = document.getElementById('addTransactionBtn');
    const closeModalBtn = document.getElementById('closeTransactionModal');
    
    if (addTransactionBtn) {
        addTransactionBtn.addEventListener('click', showTransactionModal);
    }
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', hideTransactionModal);
    }

    // Inizializza il datepicker al caricamento della pagina
    initializeModalDatepicker();
}

function showTransactionModal() {
    const modal = document.getElementById('transactionModal');
    if (!modal) return;
    
    modal.classList.remove('hidden');
    
    // Inizializza il datepicker dopo che la modale è visibile
    setTimeout(() => {
        const instance = initializeModalDatepicker();
        if (instance) {
            console.log('Datepicker initialized successfully');
        }
    }, 0);
}

export function hideTransactionModal() {
    const modal = document.getElementById('transactionModal');
    if (!modal) return;
    
    modal.classList.add('hidden');
    
    // Reset del form
    const form = document.getElementById('newTransactionForm');
    if (form) form.reset();
}
