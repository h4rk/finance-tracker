let appData = null;
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

document.addEventListener('DOMContentLoaded', function() {
    const transactionTypeToggle = document.getElementById('transactionType');
    
    transactionTypeToggle.addEventListener('change', function() {
        const leftLabel = this.parentNode.previousElementSibling;
        const rightLabel = this.parentNode.nextElementSibling;
        
        if (this.checked) {
            leftLabel.classList.remove('font-bold');
            rightLabel.classList.add('font-bold');
        } else {
            leftLabel.classList.add('font-bold');
            rightLabel.classList.remove('font-bold');
        }
    });
});

function loadDataSync() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', '../data/data.json', false);  // false makes the request synchronous
  xhr.send(null);

  if (xhr.status === 200) {
      appData = JSON.parse(xhr.responseText);
      console.log('Dati caricati sincronamente:', appData);
  } else {
      console.error('Errore nel caricamento sincrono dei dati:', xhr.status, xhr.statusText);
  }
}

async function loadData() {
  try {
      const savedData = localStorage.getItem('financeTrackerData');
      if (savedData) {
          appData = JSON.parse(savedData);
          console.log('Dati caricati dal localStorage');
      } else {
          console.log('Tentativo di caricamento del file JSON...');
          const response = await fetch('./data/data.json');
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          appData = await response.json();
          console.log('Dati caricati dal file JSON');
      }
  } catch (error) {
      console.error('Errore dettagliato nel caricamento dei dati:', error);
      console.error('Stack trace:', error.stack);
      // Inizializza appData con dati di default se il caricamento fallisce
      appData = {
          monthlySummary: { income: 0, expenses: 0, balance: 0 },
          categories: [],
          transactions: []
      };
  } finally {
      console.log('Stato finale di appData:', appData);
  }
}

function saveData() {
  localStorage.setItem('financeTrackerData', JSON.stringify(appData));
}

function loadDashboardData() {
    updateMonthlySummary();
    updateTrendChart();
    updateBudgetProgress();
}

function updateMonthlySummary() {
    const income = appData.transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
    const expenses = Math.abs(appData.transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0));
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

function updateBudgetProgress() {
    const budgetProgressBars = document.getElementById('budgetProgressBars');
    budgetProgressBars.innerHTML = '';

    appData.categories.forEach(category => {
        const spent = appData.transactions
            .filter(t => t.category === category.name && t.amount < 0)
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);
        const budget = category.budget;
        const percentage = Math.min((spent / budget) * 100, 100);

        const barHtml = `
            <div class="mb-4">
                <div class="flex justify-between mb-1">
                    <span class="text-sm font-medium text-gray-700">${category.name}</span>
                    <span class="text-sm font-medium text-gray-700">${formatCurrency(spent)} / ${formatCurrency(budget)}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                    <div class="bg-blue-600 h-2.5 rounded-full" style="width: ${percentage}%"></div>
                </div>
            </div>
        `;
        budgetProgressBars.innerHTML += barHtml;
    });
}

function loadCategories() {
    const categoryList = document.getElementById('categoryList');
    const categorySelect = document.getElementById('category');

    categoryList.innerHTML = '';
    categorySelect.innerHTML = '<option value="">Seleziona categoria</option>';

    appData.categories.forEach(category => {
        categoryList.innerHTML += `
            <li class="py-3 flex justify-between items-center">
                <span class="text-gray-700">${category.name} (${category.type === 'income' ? 'Entrata' : 'Spesa'})</span>
                <button class="text-red-600 hover:text-red-800 delete-category" data-category="${category.name}">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                    </svg>
                </button>
            </li>
        `;
        categorySelect.innerHTML += `<option value="${category.name}">${category.name}</option>`;
    });
}

function loadTransactions() {
    const transactionTableBody = document.querySelector('#transactionTable tbody');
    transactionTableBody.innerHTML = '';

    appData.transactions.forEach(transaction => {
        const row = `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${transaction.date}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${transaction.description}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${transaction.category}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}">
                    ${formatCurrency(Math.abs(transaction.amount))}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button class="text-indigo-600 hover:text-indigo-900 mr-2 edit-transaction" data-id="${transaction.id}">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                    </button>
                    <button class="text-red-600 hover:text-red-900 delete-transaction" data-id="${transaction.id}">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                        </svg>
                    </button>
                </td>
            </tr>
        `;
        transactionTableBody.innerHTML += row;
    });
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
}

function handleNewTransaction(e) {
    e.preventDefault();
    const form = e.target;
    const editId = form.querySelector('button[type="submit"]').dataset.editId;
    
    const transactionData = {
        date: form.date.value,
        description: form.description.value,
        category: form.category.value,
        amount: form.transactionType.checked ? parseFloat(form.amount.value) : -parseFloat(form.amount.value)
    };

    if (editId) {
        // Aggiornamento
        const index = appData.transactions.findIndex(t => t.id === parseInt(editId));
        if (index !== -1) {
            appData.transactions[index] = { ...appData.transactions[index], ...transactionData };
        }
        form.querySelector('button[type="submit"]').textContent = 'Inserisci';
        form.querySelector('button[type="submit"]').dataset.editId = '';
    } else {
        // Nuova transazione
        transactionData.id = Date.now();
        appData.transactions.push(transactionData);
    }

    loadDashboardData();
    loadTransactions();
    saveData();
    form.reset();
}

function handleNewCategory(e) {
    e.preventDefault();
    const form = e.target;
    const newCategory = {
        name: form.newCategoryName.value,
        type: form.newCategoryType.value,
        budget: 0
    };
    appData.categories.push(newCategory);
    loadCategories();
    updateBudgetProgress();
    form.reset();
    saveData();
}

function updateTransactionTypeLabel() {
    const transactionType = document.getElementById('transactionType');
    const leftLabel = transactionType.parentNode.previousElementSibling;
    const rightLabel = transactionType.parentNode.nextElementSibling;
    
    if (transactionType.checked) {
        leftLabel.classList.remove('font-bold');
        rightLabel.classList.add('font-bold');
    } else {
        leftLabel.classList.add('font-bold');
        rightLabel.classList.remove('font-bold');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const transactionType = document.getElementById('transactionType');
    if (transactionType) {
        transactionType.addEventListener('change', updateTransactionTypeLabel);
        // Inizializza l'etichetta al caricamento della pagina
        updateTransactionTypeLabel();
    } else {
        console.error('Elemento transactionType non trovato');
    }
});

function filterTransactions() {
    const searchTerm = document.getElementById('transactionSearch').value.toLowerCase();
    const filterType = document.getElementById('transactionFilter').value;
    const rows = document.querySelectorAll('#transactionTable tbody tr');

    rows.forEach(row => {
        const type = parseFloat(row.querySelector('td:nth-child(4)').textContent) > 0 ? 'income' : 'expense';
        const matchesSearch = Array.from(row.children).some(cell => cell.textContent.toLowerCase().includes(searchTerm));
        const matchesFilter = filterType === 'all' || type === filterType;

        row.classList.toggle('hidden', !(matchesSearch && matchesFilter));
    });
}

function handleCategoryDelete(e) {
    if (e.target.closest('.delete-category')) {
        const categoryName = e.target.closest('.delete-category').dataset.category;
        appData.categories = appData.categories.filter(c => c.name !== categoryName);
        loadCategories();
        updateBudgetProgress();
        saveData();
    }
}

function handleTransactionAction(e) {
    const actionButton = e.target.closest('.edit-transaction, .delete-transaction');
    if (actionButton) {
        const transactionId = parseInt(actionButton.dataset.id);
        if (actionButton.classList.contains('edit-transaction')) {
            editTransaction(transactionId);
        } else if (actionButton.classList.contains('delete-transaction')) {
            deleteTransaction(transactionId);
        }
    }
}

function editTransaction(transactionId) {
    const transaction = appData.transactions.find(t => t.id === transactionId);
    if (transaction) {
        document.getElementById('transactionType').checked = transaction.amount > 0;
        document.getElementById('amount').value = Math.abs(transaction.amount);
        document.getElementById('description').value = transaction.description;
        document.getElementById('category').value = transaction.category;
        document.getElementById('date').value = transaction.date;
        
        // Cambia il pulsante "Inserisci" in "Aggiorna"
        const submitButton = document.querySelector('#newTransactionForm button[type="submit"]');
        submitButton.textContent = 'Aggiorna';
        submitButton.dataset.editId = transactionId;
    }
}

function deleteTransaction(transactionId) {
    appData.transactions = appData.transactions.filter(t => t.id !== transactionId);
    loadDashboardData();
    loadTransactions();
    saveData();
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