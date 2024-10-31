import { fetchCategories, updateCategoryBudget, deleteCategoryBudget } from './api.js';
import { updateBudgetProgress } from './chartManager.js';
import { formatCurrency, showNotification } from './utils.js';

export function showBudgetModal() {
    document.getElementById('budgetModal')?.classList.remove('hidden');
}

export function hideBudgetModal() {
    document.getElementById('budgetModal')?.classList.add('hidden');
}

export async function loadCategoriesForBudget() {
    try {
        const categories = await fetchCategories();
        const categorySelect = document.getElementById('budgetCategory');
        if (!categorySelect) return;

        categorySelect.innerHTML = '<option value="">Seleziona categoria</option>';
        categories
            .filter(category => !category.budget)
            .forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                categorySelect.appendChild(option);
            });
    } catch (error) {
        console.error('Error loading categories for budget:', error);
        showNotification('Errore nel caricamento delle categorie', 'error');
    }
}

export async function handleNewBudget(e) {
    e.preventDefault();
    const form = e.target;
    const categoryId = parseInt(form.category.value);
    const budgetAmount = parseFloat(form.amount.value);

    if (isNaN(categoryId) || isNaN(budgetAmount)) {
        showNotification('Per favore, inserisci valori validi per categoria e importo.', 'error');
        return;
    }

    try {
        await updateCategoryBudget(categoryId, budgetAmount);
        await updateBudgetProgress();
        hideBudgetModal();
        await displayBudgetSummary();
        showNotification('Budget aggiornato con successo', 'success');
    } catch (error) {
        console.error('Error updating budget:', error);
        showNotification('Errore nell\'aggiornamento del budget', 'error');
    }
}

export async function removeBudget(categoryId) {
    try {
        await deleteCategoryBudget(categoryId);
        await Promise.all([
            updateBudgetProgress(),
            displayBudgetSummary()
        ]);
        showNotification('Budget rimosso con successo', 'success');
    } catch (error) {
        console.error('Error removing budget:', error);
        showNotification('Errore nella rimozione del budget', 'error');
    }
}

export async function displayBudgetSummary() {
    try {
        const summary = await fetch('/analytics/budget-summary').then(r => r.json());
        const summaryContainer = document.getElementById('budgetSummary');
        if (!summaryContainer) return;

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
    } catch (error) {
        console.error('Error displaying budget summary:', error);
        showNotification('Errore nel caricamento del riepilogo budget', 'error');
    }
}

export function initializeBudgetModal() {
    const addBudgetBtn = document.getElementById('addBudgetBtn');
    const closeBudgetModal = document.getElementById('closeBudgetModal');
    const newBudgetForm = document.getElementById('newBudgetForm');

    if (addBudgetBtn) {
        addBudgetBtn.addEventListener('click', async () => {
            await loadCategoriesForBudget();
            showBudgetModal();
        });
    }

    if (closeBudgetModal) {
        closeBudgetModal.addEventListener('click', hideBudgetModal);
    }

    if (newBudgetForm) {
        newBudgetForm.addEventListener('submit', handleNewBudget);
    }
}
