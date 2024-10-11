import { updateBudgetProgress } from './chartManager.js';
import { formatCurrency } from './utils.js';

export function setupBudgetModal() {
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
                                <!-- Options will be loaded dynamically -->
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

export function showBudgetModal() {
    const modal = document.getElementById('budgetModal');
    modal.classList.remove('hidden');
    loadCategoriesForBudget();
}

export function hideBudgetModal() {
    const modal = document.getElementById('budgetModal');
    modal.classList.add('hidden');
}

function loadCategoriesForBudget(appData) {
    const categorySelect = document.getElementById('budgetCategory');
    categorySelect.innerHTML = '<option value="">Seleziona categoria</option>';
    
    appData.categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
    });
}

export function handleNewBudget(e, appData) {
    e.preventDefault();
    const form = e.target;
    const categoryId = parseInt(form.category.value);
    const budgetAmount = parseFloat(form.amount.value);

    const category = appData.categories.find(c => c.id === categoryId);
    if (category) {
        category.budget = budgetAmount;
        updateBudgetProgress(appData);
        hideBudgetModal();
        // Update the categories list in the main form if necessary
        // This might involve calling a function from uiManager.js
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
        <h3 class="text-lg font-semibold mb-2">Riepilogo Budget</h3>
        <p>Budget Totale: ${formatCurrency(summary.totalBudget)}</p>
        <p>Speso Totale: ${formatCurrency(summary.totalSpent)}</p>
        <p>Rimanente Totale: ${formatCurrency(summary.totalRemaining)}</p>
        <h4 class="text-md font-semibold mt-4 mb-2">Dettagli per Categoria:</h4>
    `;

    summary.categorySummaries.forEach(catSummary => {
        html += `
            <div class="mb-2">
                <p><strong>${catSummary.categoryName}</strong></p>
                <p>Budget: ${formatCurrency(catSummary.budget)} | Speso: ${formatCurrency(catSummary.spent)} | Rimanente: ${formatCurrency(catSummary.remaining)}</p>
            </div>
        `;
    });

    summaryContainer.innerHTML = html;
}

// Add other budget-related functions as needed