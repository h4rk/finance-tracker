import { updateBudgetProgress } from './chartManager.js';
import { formatCurrency } from './utils.js';

export function showBudgetModal() {
    const modal = document.getElementById('budgetModal');
    modal.classList.remove('hidden');
}

export function hideBudgetModal() {
    const modal = document.getElementById('budgetModal');
    modal.classList.add('hidden');
}

export function loadCategoriesForBudget(appData) {
    const categorySelect = document.getElementById('budgetCategory');
    categorySelect.innerHTML = '<option value="">Seleziona categoria</option>';
    
    appData.categories.forEach(category => {
        if (!category.budget) {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        }
    });
}

export function handleNewBudget(e, appData) {
    e.preventDefault();
    const form = e.target;
    const categoryId = parseInt(form.category.value);
    const budgetAmount = parseFloat(form.amount.value);

    if (isNaN(categoryId) || isNaN(budgetAmount)) {
        alert('Per favore, inserisci valori validi per categoria e importo.');
        return;
    }

    const category = appData.categories.find(c => c.id === categoryId);
    if (category) {
        category.budget = budgetAmount;
        updateBudgetProgress(appData);
        hideBudgetModal();
        displayBudgetSummary(appData);
        saveBudgets(appData);
    } else {
        console.error('Categoria non trovata:', categoryId);
    }
}

export function removeBudget(categoryId, appData) {
    const category = appData.categories.find(c => c.id === categoryId);
    if (category) {
        if (confirm(`Sei sicuro di voler rimuovere il budget per la categoria "${category.name}"?`)) {
            delete category.budget;
            updateBudgetProgress(appData);
            // Update the categories list in the main form if necessary
            // This might involve calling a function from uiManager.js
        }
    } else {
        console.error('Categoria non trovata:', categoryId);
    }
}

export function getBudgetSummary(appData) {
    const summary = {
        totalBudget: 0,
        totalSpent: 0,
        categorySummaries: []
    };

    appData.categories.forEach(category => {
        if (category.budget) {
            const spent = appData.transactions
                .filter(t => t.catId === category.id && t.amount < 0)
                .reduce((sum, t) => sum + Math.abs(t.amount), 0);
            
            summary.totalBudget += category.budget;
            summary.totalSpent += spent;
            summary.categorySummaries.push({
                categoryName: category.name,
                budget: category.budget,
                spent: spent,
                remaining: category.budget - spent
            });
        }
    });

    summary.totalRemaining = summary.totalBudget - summary.totalSpent;

    return summary;
}

export function displayBudgetSummary(appData) {
    const summary = getBudgetSummary(appData);
    const summaryContainer = document.getElementById('budgetSummary');
    
    let html = `
        <div class="bg-white p-4 rounded-lg shadow-md">
            <h3 class="text-xl font-semibold mb-4">Riepilogo Budget</h3>
            <div class="grid grid-cols-3 gap-4 mb-4">
                <div>
                    <p class="text-sm text-gray-600">Budget Totale</p>
                    <p class="text-lg font-semibold">${formatCurrency(summary.totalBudget)}</p>
                </div>
                <div>
                    <p class="text-sm text-gray-600">Speso Totale</p>
                    <p class="text-lg font-semibold">${formatCurrency(summary.totalSpent)}</p>
                </div>
                <div>
                    <p class="text-sm text-gray-600">Rimanente Totale</p>
                    <p class="text-lg font-semibold">${formatCurrency(summary.totalRemaining)}</p>
                </div>
            </div>
            <h4 class="text-lg font-semibold mt-6 mb-4">Dettagli per Categoria</h4>
            <div class="space-y-4">
    `;

    summary.categorySummaries.forEach(catSummary => {
        const percentage = (catSummary.spent / catSummary.budget) * 100;
        html += `
            <div class="bg-gray-100 p-4 rounded-lg">
                <p class="font-semibold">${catSummary.categoryName}</p>
                <div class="flex justify-between text-sm text-gray-600 mt-2">
                    <span>Budget: ${formatCurrency(catSummary.budget)}</span>
                    <span>Speso: ${formatCurrency(catSummary.spent)}</span>
                    <span>Rimanente: ${formatCurrency(catSummary.remaining)}</span>
                </div>
                <div class="mt-2 h-2 bg-gray-200 rounded-full">
                    <div class="h-full bg-blue-600 rounded-full" style="width: ${percentage}%"></div>
                </div>
            </div>
        `;
    });

    html += `
            </div>
        </div>
    `;

    summaryContainer.innerHTML = html;
}

export function initializeBudgetModal(appData) {
    const addBudgetBtn = document.getElementById('addBudgetBtn');
    const closeBudgetModal = document.getElementById('closeBudgetModal');
    const newBudgetForm = document.getElementById('newBudgetForm');

    addBudgetBtn.addEventListener('click', () => {
        loadCategoriesForBudget(appData);
        showBudgetModal();
    });

    closeBudgetModal.addEventListener('click', hideBudgetModal);

    newBudgetForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleNewBudget(e, appData);
    });
}

// Add other budget-related functions as needed
