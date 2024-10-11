import { formatCurrency } from './utils.js';

let trendChart = null;

export function updateTrendChart(appData) {
    const ctx = document.getElementById('trendChart').getContext('2d');
    const selectedPeriod = parseInt(document.getElementById('trendPeriod').value);
    const { labels, data } = generateChartData(appData, selectedPeriod);

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

function generateChartData(appData, selectedPeriod) {
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

    return { labels, data };
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