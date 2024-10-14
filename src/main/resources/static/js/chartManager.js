import { formatCurrency } from './utils.js';

let trendChart = null;

export function updateTrendChart(appData) {
    const ctx = document.getElementById('trendChart').getContext('2d');
    const periodSelect = document.getElementById('trendPeriod');
    const months = parseInt(periodSelect.value);

    // Raggruppa le transazioni per mese
    const monthlyData = groupTransactionsByMonth(appData.transactions, months);

    // Prepara i dati per il grafico
    const labels = Object.keys(monthlyData).sort();
    const incomeData = [];
    const expenseData = [];

    labels.forEach(month => {
        incomeData.push(monthlyData[month].income);
        expenseData.push(-monthlyData[month].expense); // Negativo per mostrarlo sotto lo zero
    });

    // Distruggi il grafico esistente se presente
    if (window.trendChart instanceof Chart) {
        window.trendChart.destroy();
    }

    // Crea il nuovo grafico
    window.trendChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Entrate',
                    data: incomeData,
                    backgroundColor: 'rgba(75, 192, 75, 0.8)', // Verde
                    borderColor: 'rgba(75, 192, 75, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Uscite',
                    data: expenseData,
                    backgroundColor: 'rgba(255, 99, 132, 0.8)', // Rosso
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += formatCurrency(context.parsed.y);
                            }
                            return label;
                        }
                    }
                },
                legend: {
                    display: true,
                    position: 'top'
                }
            }
        }
    });
}

function groupTransactionsByMonth(transactions, months) {
    const now = new Date();
    const monthlyData = {};

    for (let i = 0; i < months; i++) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthlyData[monthKey] = { income: 0, expense: 0 };
    }

    transactions.forEach(transaction => {
        const transactionDate = new Date(transaction.date);
        const monthKey = `${transactionDate.getFullYear()}-${String(transactionDate.getMonth() + 1).padStart(2, '0')}`;
        
        if (monthlyData[monthKey]) {
            if (transaction.income) {
                monthlyData[monthKey].income += transaction.amount;
            } else {
                monthlyData[monthKey].expense += transaction.amount;
            }
        }
    });

    return monthlyData;
}

export function updateBudgetProgress(appData) {
    const budgetProgressBars = document.getElementById('budgetProgressBars');
    budgetProgressBars.innerHTML = '';

    appData.categories.forEach(category => {
        if (category.budget) {
            const spent = appData.transactions
                .filter(t => t.catId === category.id && t.amount < 0)
                .reduce((sum, t) => sum + Math.abs(t.amount), 0);
            const budget = category.budget;
            const percentage = Math.min((spent / budget) * 100, 100);

            const barHtml = `
                <div class="mb-4">
                    <div class="flex justify-between mb-1">
                        <span class="text-sm font-medium text-gray-700">${category.name}</span>
                        <div>
                            <span class="text-sm font-medium text-gray-700">${formatCurrency(spent)} / ${formatCurrency(budget)}</span>
                            <button class="ml-2 text-red-600 hover:text-red-800" onclick="removeBudget(${category.id})">
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

function getMonthName(monthIndex) {
    const months = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 
                    'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
    return months[monthIndex];
}

// Add other chart-related functions as needed
