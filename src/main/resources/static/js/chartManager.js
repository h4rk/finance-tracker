import { formatCurrency } from './utils.js';

let trendChart = null;

export async function updateTrendChart() {
    const ctx = document.getElementById('trendChart').getContext('2d');

    // Fetch data from the new API
    const response = await fetch('http://localhost:8080/analytics/yearly');
    const yearlyData = await response.json();

    // Get current date
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Prepare data for the chart
    const labels = [];
    const incomeData = [];
    const expenseData = [];
    const deltaData = [];

    // Ultimi 12 mesi
    for (let i = 11; i >= 0; i--) {
        let month = (currentMonth - i + 12) % 12;
        let year = currentYear - (month > currentMonth ? 1 : 0);
        let monthKey = month + 1;

        labels.push(getMonthName(month) + ' ' + year);

        if (yearlyData[monthKey]) {
            incomeData.push(yearlyData[monthKey].monthlyIncome);
            expenseData.push(yearlyData[monthKey].monthlyExpense);
            deltaData.push(yearlyData[monthKey].monthlyIncome - yearlyData[monthKey].monthlyExpense);
        } else {
            // If no data for this month, push zeros
            incomeData.push(0);
            expenseData.push(0);
            deltaData.push(0);
        }
    }

    // Destroy existing chart if present
    if (window.trendChart instanceof Chart) {
        window.trendChart.destroy();
    }

    // Create new chart
    window.trendChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Bilancio mensile',
                    data: deltaData,
                    backgroundColor: (context) => {
                        const chart = context.chart;
                        const {ctx, chartArea} = chart;
                        if (!chartArea) {
                            return null;
                        }
                        const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                        if (deltaData[context.dataIndex] >= 0) {
                            gradient.addColorStop(0, 'rgba(75, 192, 75, 0.2)');
                            gradient.addColorStop(1, 'rgba(75, 192, 75, 0.8)');
                        } else {
                            gradient.addColorStop(0, 'rgba(255, 99, 132, 0.2)');
                            gradient.addColorStop(1, 'rgba(255, 99, 132, 0.8)');
                        }
                        return gradient;
                    },
                    borderColor: deltaData.map(value => value >= 0 ? 'rgba(75, 192, 75, 1)' : 'rgba(255, 99, 132, 1)'),
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // Permette di controllare l'altezza indipendentemente dalla larghezza
            aspectRatio: 2, // Imposta un rapporto di aspetto di 2:1 (larghezza:altezza)
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    beginAtZero: true,
                    afterDataLimits: (scale) => {
                        const maxPositive = Math.max(0, ...deltaData);
                        const maxNegative = Math.abs(Math.min(0, ...deltaData));
                        const absMax = Math.max(maxPositive, maxNegative, 1);
                        
                        // Add 10% padding
                        const padding = absMax * 0.1;
                        
                        scale.max = maxPositive + padding;
                        scale.min = -maxNegative - padding;
                        
                        // Ensure zero is always included
                        if (scale.max < 0) scale.max = padding;
                        if (scale.min > 0) scale.min = -padding;
                    },
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value);
                        },
                        stepSize: (context) => {
                            const range = context.max - context.min;
                            return Math.pow(10, Math.floor(Math.log10(range))) / 2;
                        }
                    },
                    grid: {
                        color: (context) => {
                            if (context.tick.value === 0) {
                                return 'rgba(0, 0, 0, 0.5)';
                            }
                            return 'rgba(0, 0, 0, 0.1)';
                        },
                        lineWidth: (context) => {
                            if (context.tick.value === 0) {
                                return 2;
                            }
                            return 1;
                        },
                    },
                    afterFit: (scaleInstance) => {
                        scaleInstance.max = Math.max(scaleInstance.max, 1);
                        scaleInstance.min = Math.min(scaleInstance.min, -1);
                    }
                }
            },
            hover: {
                mode: 'nearest',
                intersect: true,
                animationDuration: 400
            },
            plugins: {
                tooltip: {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    titleColor: '#333',
                    titleFont: {
                        weight: 'bold',
                        size: 16
                    },
                    bodyColor: '#333',
                    bodyFont: {
                        size: 14
                    },
                    borderColor: 'rgba(0, 0, 0, 0.1)',
                    borderWidth: 1,
                    cornerRadius: 8,
                    padding: 12,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    callbacks: {
                        label: function(context) {
                            const index = context.dataIndex;
                            const income = incomeData[index];
                            const expense = expenseData[index];
                            const balance = deltaData[index];
                            return [
                                `📈 Entrate: ${formatCurrency(income)}`,
                                `📉 Uscite: ${formatCurrency(expense)}`,
                                `💰 Bilancio totale: ${formatCurrency(balance)}`
                            ];
                        },
                        beforeBody: function(context) {
                            return '─────────────────────';
                        },
                        title: function(context) {
                            return context[0].label; // This will now include the year
                        }
                    },
                    displayColors: false
                },
                legend: {
                    display: false
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
