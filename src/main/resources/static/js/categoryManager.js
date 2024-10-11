import { addCategory, removeCategory } from './dataManager.js';
import { loadCategories, updateBudgetProgress } from './uiManager.js';
import { showNotification } from './utils.js';

export async function handleNewCategory(e, appData) {
    e.preventDefault();
    const form = e.target;
    const categoryData = {
        name: form.newCategoryName.value,
        description: form.newCategoryDescription ? form.newCategoryDescription.value : '',
        type: parseInt(form.newCategoryType.value)
    };

    try {
        await addCategory(appData, categoryData);
        loadCategories(appData);
        form.reset();
        showNotification('Categoria aggiunta con successo', 'success');
    } catch (error) {
        console.error('Error adding category:', error);
        showNotification('Errore nell\'aggiunta della categoria', 'error');
    }
}

export async function handleCategoryDelete(e, appData) {
    if (e.target.closest('.delete-category')) {
        const categoryId = parseInt(e.target.closest('.delete-category').dataset.categoryId);
        if (confirm('Sei sicuro di voler eliminare questa categoria?')) {
            try {
                await removeCategory(appData, categoryId);
                loadCategories(appData);
                updateBudgetProgress(appData);
                showNotification('Categoria eliminata con successo', 'success');
            } catch (error) {
                console.error('Error deleting category:', error);
                showNotification('Errore nell\'eliminazione della categoria', 'error');
            }
        }
    }
}

export function showCategoryDetails(category, appData) {
    const transactions = appData.transactions.filter(t => t.catId === category.id);
    const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
    const detailsHtml = `
        <div class="bg-white p-4 rounded-lg shadow">
            <h3 class="text-lg font-semibold mb-2">Dettagli Categoria</h3>
            <p><strong>Nome:</strong> ${category.name}</p>
            <p><strong>Descrizione:</strong> ${category.description || 'N/A'}</p>
            <p><strong>Tipo:</strong> ${getCategoryTypeName(category.type)}</p>
            <p><strong>Budget:</strong> ${category.budget ? formatCurrency(category.budget) : 'Non impostato'}</p>
            <p><strong>Totale Transazioni:</strong> ${formatCurrency(totalAmount)}</p>
            <p><strong>Numero di Transazioni:</strong> ${transactions.length}</p>
        </div>
    `;
    
    const detailsContainer = document.getElementById('categoryDetails');
    detailsContainer.innerHTML = detailsHtml;
    detailsContainer.classList.remove('hidden');
}

export function hideCategoryDetails() {
    const detailsContainer = document.getElementById('categoryDetails');
    detailsContainer.classList.add('hidden');
}

export function getCategoryTypeName(typeId) {
    const types = {
        1: 'Entrata',
        2: 'Uscita',
        3: 'Entrambi'
    };
    return types[typeId] || 'Sconosciuto';
}

export function getCategorySelectOptions(appData, includeAll = false) {
    let options = includeAll ? '<option value="all">Tutte le categorie</option>' : '';
    appData.categories.forEach(category => {
        options += `<option value="${category.id}">${category.name}</option>`;
    });
    return options;
}

export function updateCategoryTypeColors() {
    const categoryTypeSelect = document.getElementById('newCategoryType');
    const submitButton = document.getElementById('submitCategory');
    
    switch (categoryTypeSelect.value) {
        case '1': // Income
            submitButton.className = 'bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded';
            break;
        case '2': // Expense
            submitButton.className = 'bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded';
            break;
        default: // Both or unselected
            submitButton.className = 'bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded';
    }
}

// Add other category-related functions as needed