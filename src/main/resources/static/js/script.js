let appData = {
    categories: [],
    transactions: [],
    catTypes: [],
    monthlySummary: { income: 0, expenses: 0, balance: 0 }
};
let trendChart = null;

document.addEventListener('DOMContentLoaded', async function() {
    try {
        await loadData();
        if (appData) {
            loadDashboardData();
            loadCategories();
            loadTransactions();
            setupEventListeners();
        } else {
            throw new Error('Impossibile inizializzare appData');
        }
    } catch (error) {
        console.error('Errore durante l\'inizializzazione:', error);
        console.error('Stack trace:', error.stack);
    }
});

async function loadData() {
    try {
        // Carica le categorie
        const categoriesResponse = await fetch('/cats');
        if (!categoriesResponse.ok) {
            throw new Error(`HTTP error! status: ${categoriesResponse.status}`);
        }
        appData.categories = await categoriesResponse.json();
        console.log('Categorie caricate:', appData.categories);

        // Carica i movimenti
        const movsResponse = await fetch('/movs');
        if (!movsResponse.ok) {
            throw new Error(`HTTP error! status: ${movsResponse.status}`);
        }
        appData.transactions = await movsResponse.json();
        console.log('Movimenti caricati:', appData.transactions);

        // Carica i tipi di categoria
        await loadCatTypes();

        console.log('Dati caricati dagli endpoint');
    } catch (error) {
        console.error('Errore dettagliato nel caricamento dei dati:', error);
        console.error('Stack trace:', error.stack);
    } finally {
        console.log('Stato finale di appData:', appData);
    }
    setupBudgetModal();
}

function loadDashboardData() {
    updateMonthlySummary();
    updateTrendChart();
    updateBudgetProgress();
}

function updateMonthlySummary() {
    const income = appData.transactions.filter(t => t.isIncome).reduce((sum, t) => sum + t.amount, 0);
    const expenses = Math.abs(appData.transactions.filter(t => !t.isIncome).reduce((sum, t) => sum + t.amount, 0));
    const balance = income - expenses;

    document.getElementById('income').textContent = formatCurrency(income);
    document.getElementById('expenses').textContent = formatCurrency(expenses);
    document.getElementById('balance').textContent = formatCurrency(balance);
}

function updateTrendChart() {
    const ctx = document.getElementById('trendChart').getContext('2d');
    const selectedPeriod = parseInt(document.getElementById('trendPeriod').value);
    const today = new Date();
    const labels = [];
    const data = [];

    for (let i = selectedPeriod - 1; i >= 0; i--) {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
        labels.push(getMonthName(date.getMonth()));
        
        const monthTransactions = appData.transactions.filter(t => {
            const tDate = new Date(t.date);
            return tDate.getMonth() === date.getMonth() && tDate.getFullYear() === date.getFullYear();
        });
        
        const monthBalance = monthTransactions.reduce((sum, t) => sum + t.amount, 0);
        data.push(monthBalance);
    }

    if (trendChart) {
        trendChart.destroy();
    }

    trendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Saldo',
                data: data,
                borderColor: '#4F46E5',
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                tension: 0.1,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

function updateTransactionTypeLabel() {
    const transactionType = document.getElementById('transactionType');
    const label = document.querySelector('label[for="amount"]');
    if (transactionType.checked) {
        label.textContent = 'Importo (Entrata):';
    } else {
        label.textContent = 'Importo (Uscita):';
    }
}


function updateBudgetProgress() {
    const budgetProgressBars = document.getElementById('budgetProgressBars');
    budgetProgressBars.innerHTML = '';

    appData.categories.forEach(category => {
        if (category.budget) {
            const spent = appData.transactions
                .filter(t => t.catId === category.catId && !t.isIncome)
                .reduce((sum, t) => sum + Math.abs(t.amount), 0);
            const budget = category.budget;
            const percentage = Math.min((spent / budget) * 100, 100);

            const barHtml = `
                <div class="mb-4">
                    <div class="flex justify-between mb-1">
                        <span class="text-sm font-medium text-gray-700">${category.name}</span>
                        <div>
                            <span class="text-sm font-medium text-gray-700">${formatCurrency(spent)} / ${formatCurrency(budget)}</span>
                            <button class="ml-2 text-red-600 hover:text-red-800" onclick="removeBudget(${category.catId})">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2.5">
                        <div class="bg-blue-600 h-2.5 rounded-full" style="width: ${percentage}%"></div>
                    </div>
                </div>
            `;
            budgetProgressBars.innerHTML += barHtml;
        }
    });
}

function loadCategories() {
    const categorySelect = document.getElementById('category');
    const categoryList = document.getElementById('categoryList');
    
    categorySelect.innerHTML = '<option value="">Seleziona categoria</option>';
    categoryList.innerHTML = '';

    appData.categories.forEach(category => {
        // Popola il select delle categorie
        const option = document.createElement('option');
        option.value = category.id; // Usa 'id' invece di 'catId'
        option.textContent = category.name;
        categorySelect.appendChild(option);

        // Popola la lista delle categorie
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

function loadTransactions(transactions = appData.transactions) {
    const transactionTableBody = document.querySelector('#transactionTable tbody');
    transactionTableBody.innerHTML = '';

    transactions.forEach(transaction => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">${transaction.date}</td>
            <td class="px-6 py-4">${transaction.description}</td>
            <td class="px-6 py-4">${formatCurrency(transaction.amount)}</td>
            <td class="px-6 py-4 ${transaction.isIncome ? 'text-green-600' : 'text-red-600'}">${transaction.isIncome ? 'Entrata' : 'Uscita'}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button class="text-indigo-600 hover:text-indigo-900 mr-2 edit-transaction" data-transaction-id="${transaction.id}">Modifica</button>
                <button class="text-red-600 hover:text-red-900 delete-transaction" data-transaction-id="${transaction.id}">Elimina</button>
            </td>
        `;
        transactionTableBody.appendChild(row);
    });
}


function filterTransactions() {
    const searchTerm = document.getElementById('transactionSearch').value.toLowerCase();
    const filterType = document.getElementById('transactionFilter').value;
    const filteredTransactions = appData.transactions.filter(transaction => {
        const matchesSearch = transaction.description.toLowerCase().includes(searchTerm);
        const matchesFilter = filterType === 'all' || 
                              (filterType === 'income' && transaction.isIncome) || 
                              (filterType === 'expense' && !transaction.isIncome);
        return matchesSearch && matchesFilter;
    });
    loadTransactions(filteredTransactions);
}


async function loadCatTypes() {
    try {
        const response = await fetch('/catTypes');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        appData.catTypes = await response.json();
        console.log('Tipi di categoria caricati:', appData.catTypes);
        
        const catTypeSelect = document.getElementById('newCategoryType');
        catTypeSelect.innerHTML = '';
        appData.catTypes.forEach(type => {
            const option = document.createElement('option');
            option.value = type.id;
            option.textContent = type.name;
            catTypeSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Errore nel caricamento dei tipi di categoria:', error);
    }
}


function getCategoryName(catId) {
    const category = appData.categories.find(cat => cat.id === catId);
    return category ? category.name : 'Categoria sconosciuta';
}

async function handleNewTransaction(e) {
    e.preventDefault();
    const form = e.target;
    const newTransaction = {
        description: form.description.value,
        amount: parseFloat(form.amount.value),
        date: form.date.value,
        isIncome: form.transactionType.checked
    };

    try {
        const response = await fetch('/movs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newTransaction),
        });
        if (!response.ok) throw new Error('Errore nella creazione della transazione');

        await loadData();
        loadDashboardData();
        loadTransactions();
        form.reset();
    } catch (error) {
        console.error('Errore:', error);
    }
}

async function handleNewCategory(e) {
    e.preventDefault();
    const form = e.target;
    const newCategory = {
        name: form.newCategoryName.value,
        description: form.newCategoryDescription ? form.newCategoryDescription.value : '',
        type: parseInt(form.newCategoryType.value)
    };

    try {
        const response = await fetch('/cats', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newCategory),
        });
        if (!response.ok) throw new Error('Errore nella creazione della categoria');

        await loadData();
        loadCategories();
        form.reset();
    } catch (error) {
        console.error('Errore:', error);
    }
}

async function handleCategoryDelete(e) {
    if (e.target.closest('.delete-category')) {
        const categoryId = e.target.closest('.delete-category').dataset.categoryId;
        try {
            const response = await fetch(`/cats/${categoryId}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Errore nell\'eliminazione della categoria');

            await loadData();
            loadCategories();
            updateBudgetProgress();
        } catch (error) {
            console.error('Errore:', error);
        }
    }
}

async function deleteTransaction(transactionId) {
    try {
        const response = await fetch(`/movs/${transactionId}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Errore nell\'eliminazione della transazione');

        await loadData();
        loadDashboardData();
        loadTransactions();
    } catch (error) {
        console.error('Errore:', error);
    }
}

function setupEventListeners() {
    document.getElementById('newTransactionForm').addEventListener('submit', handleNewTransaction);
    document.getElementById('newCategoryForm').addEventListener('submit', handleNewCategory);
    document.getElementById('transactionType').addEventListener('change', updateTransactionTypeLabel);
    document.getElementById('trendPeriod').addEventListener('change', updateTrendChart);
    document.getElementById('transactionSearch').addEventListener('input', filterTransactions);
    document.getElementById('transactionFilter').addEventListener('change', filterTransactions);
    document.getElementById('categoryList').addEventListener('click', handleCategoryDelete);
    document.getElementById('transactionTable').addEventListener('click', handleTransactionAction);
    document.getElementById('addBudgetBtn').addEventListener('click', showBudgetModal);
    document.getElementById('closeBudgetModal').addEventListener('click', hideBudgetModal);
    document.getElementById('newBudgetForm').addEventListener('submit', handleNewBudget);
}

function formatCurrency(amount) {
    return '€' + Math.abs(amount).toFixed(2);
}

function getMonthName(monthIndex) {
    const months = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 
                    'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
    return months[monthIndex];
}

function getRandomColor() {
    return '#' + Math.floor(Math.random()*16777215).toString(16);
}

function updateTransactionTypeColors() {
    const transactionType = document.getElementById('transactionType');
    const submitButton = document.getElementById('submitTransaction');
    
    if (transactionType.checked) {
        // Entrata
        submitButton.classList.remove('bg-red-600', 'hover:bg-red-700', 'focus:ring-red-500');
        submitButton.classList.add('bg-green-600', 'hover:bg-green-700', 'focus:ring-green-500');
    } else {
        // Uscita
        submitButton.classList.remove('bg-green-600', 'hover:bg-green-700', 'focus:ring-green-500');
        submitButton.classList.add('bg-red-600', 'hover:bg-red-700', 'focus:ring-red-500');
    }
}

function handleTransactionAction(e) {
    if (e.target.classList.contains('edit-transaction')) {
        const transactionId = e.target.dataset.transactionId;
        // Implementa la logica per modificare la transazione
        console.log('Modifica transazione:', transactionId);
    } else if (e.target.classList.contains('delete-transaction')) {
        const transactionId = e.target.dataset.transactionId;
        deleteTransaction(transactionId);
    }
}


document.addEventListener('DOMContentLoaded', function() {
    const transactionType = document.getElementById('transactionType');
    if (transactionType) {
        transactionType.addEventListener('change', function() {
            updateTransactionTypeLabel();
            updateTransactionTypeColors();
        });
        // Inizializza i colori al caricamento della pagina
        updateTransactionTypeColors();
    } else {
        console.error('Elemento transactionType non trovato');
    }
});

// Aggiungi questa funzione alla fine del file

function setupBudgetModal() {
    const modal = document.createElement('div');
    modal.className = 'fixed z-10 inset-0 overflow-y-auto hidden';
    modal.id = 'budgetModal';
    modal.innerHTML = `
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 transition-opacity" aria-hidden="true">
                <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Crea nuovo budget</h3>
                    <form id="newBudgetForm">
                        <div class="mb-4">
                            <label for="budgetCategory" class="block text-sm font-medium text-gray-700">Categoria</label>
                            <select id="budgetCategory" name="category" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                                <!-- Le opzioni verranno caricate dinamicamente -->
                            </select>
                        </div>
                        <div class="mb-4">
                            <label for="budgetAmount" class="block text-sm font-medium text-gray-700">Importo budget</label>
                            <input type="number" id="budgetAmount" name="amount" required min="0" step="0.01" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                        </div>
                    </form>
                </div>
                <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button type="submit" form="newBudgetForm" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm">
                        Crea budget
                    </button>
                    <button type="button" id="closeBudgetModal" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                        Annulla
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function showBudgetModal() {
    const modal = document.getElementById('budgetModal');
    modal.classList.remove('hidden');
    loadCategoriesForBudget();
}

function hideBudgetModal() {
    const modal = document.getElementById('budgetModal');
    modal.classList.add('hidden');
}

function loadCategoriesForBudget() {
    const categorySelect = document.getElementById('budgetCategory');
    categorySelect.innerHTML = '<option value="">Seleziona categoria</option>';
    
    appData.categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id; // Usa 'id' invece di 'catId'
        option.textContent = category.name;
        categorySelect.appendChild(option);
    });
}

function handleNewBudget(e) {
    e.preventDefault();
    const form = e.target;
    const categoryName = form.category.value;
    const budgetAmount = parseFloat(form.amount.value);

    const category = appData.categories.find(c => c.name === categoryName);
    if (category) {
        category.budget = budgetAmount;
        updateBudgetProgress();
        hideBudgetModal();
        // Aggiorna la lista delle categorie nel form principale
        loadCategories();
    } else {
        console.error('Categoria non trovata:', categoryName);
    }
}

function removeBudget(categoryName) {
    const category = appData.categories.find(c => c.name === categoryName);
    if (category) {
        if (confirm(`Sei sicuro di voler rimuovere il budget per la categoria "${categoryName}"?`)) {
            delete category.budget;
            updateBudgetProgress();
            // Aggiorna la lista delle categorie nel form principale
            loadCategories();
        }
    } else {
        console.error('Categoria non trovata:', categoryName);
    }
}

// Aggiungi questa riga alla fine del file
window.removeBudget = removeBudget;

// Funzioni di test per gli endpoint

async function testGetCategories() {
    const response = await fetch('/cats');
    const data = await response.json();
    console.log('Categorie:', data);
}

async function testCreateCategory() {
    const newCategory = {
        name: "Test Category",
        description: "Test Description",
        type: 2 // Assumi che 2 sia l'ID per il tipo "Both"
    };
    const response = await fetch('/cats', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCategory),
    });
    console.log('Categoria creata:', response.ok);
}

async function testGetMovements() {
    const response = await fetch('/movs');
    const data = await response.json();
    console.log('Movimenti:', data);
}

async function testCreateMovement() {
    const newMovement = {
        date: "2023-05-15",
        description: "Test Movement",
        amount: 100.00,
        isIncome: true
    };
    const response = await fetch('/movs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMovement),
    });
    console.log('Movimento creato:', response.ok);
}

// Puoi chiamare queste funzioni dalla console del browser per testare gli endpoint
// Ad esempio: testGetCategories()

// Funzione per aggiornare un budget esistente


// async function updateBudget(categoryId, newBudgetAmount) {
//     try {
//         const response = await fetch(`/cats/${categoryId}`, {
//             method: 'PUT',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ budget: newBudgetAmount }),
//         });
//         if (!response.ok) throw new Error('Errore nell\'aggiornamento del budget');
//         console.log('Budget aggiornato con successo');
//         await loadData();
//         updateBudgetProgress();
//     } catch (error) {
//         console.error('Errore nell\'aggiornamento del budget:', error);
//     }
// }

// Funzione per ottenere le statistiche mensili
function getMonthlyStats(year, month) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    
    const monthTransactions = appData.transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate >= startDate && tDate <= endDate;
    });

    const income = monthTransactions.filter(t => t.isIncome).reduce((sum, t) => sum + t.amount, 0);
    const expenses = monthTransactions.filter(t => !t.isIncome).reduce((sum, t) => sum + Math.abs(t.amount), 0);

    return {
        income,
        expenses,
        balance: income - expenses
    };
}

// Funzione per esportare i dati in formato CSV
function exportToCSV() {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Data,Descrizione,Categoria,Importo,Tipo\n";

    appData.transactions.forEach(t => {
        const row = [
            t.date,
            t.description,
            getCategoryName(t.catId),
            t.amount,
            t.isIncome ? "Entrata" : "Uscita"
        ].join(",");
        csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "finance_data.csv");
    document.body.appendChild(link);
    link.click();
}

// Queste funzioni possono essere chiamate secondo necessità o aggiunte all'interfaccia utente