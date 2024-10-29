import { fetchCategories, createCategory, deleteCategory } from './api.js';
import { showNotification } from './utils.js';
import { loadCategories } from './uiManager.js';

// PORCO DE DIOOOOOO

export async function handleNewCategory(e) {
    e.preventDefault();
    const form = e.target;
    const categoryData = {
        name: form.newCategoryName.value,
        type: parseInt(form.newCategoryType.value)
    };

    try {
        await createCategory(categoryData);
        await loadCategories();
        form.reset();
        document.getElementById('categoryModal').classList.add('hidden');
        showNotification('Category created successfully', 'success');
    } catch (error) {
        console.error('Error creating category:', error);
        showNotification('Error creating category', 'error');
    }
}

export async function handleCategoryDelete(categoryId) {
    if (confirm('Sei sicuro di voler eliminare questa categoria?')) {
        try {
            await deleteCategory(categoryId);
            await Promise.all([
                loadCategories(),
                updateBudgetProgress()
            ]);
            showNotification('Categoria eliminata con successo', 'success');
        } catch (error) {
            console.error('Error deleting category:', error);
            showNotification('Errore nell\'eliminazione della categoria', 'error');
        }
    }
}

export async function showCategoryDetails(categoryId) {
    try {
        const [category, transactions] = await Promise.all([
            fetch(`/cats/${categoryId}`).then(r => r.json()),
            fetch(`/movs?categoryId=${categoryId}`).then(r => r.json())
        ]);

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
    } catch (error) {
        console.error('Error loading category details:', error);
        showNotification('Errore nel caricamento dei dettagli della categoria', 'error');
    }
}

export function hideCategoryDetails() {
    document.getElementById('categoryDetails')?.classList.add('hidden');
}

export function getCategoryTypeName(typeId) {
    const types = {
        1: 'Entrata',
        2: 'Uscita',
        3: 'Entrambi'
    };
    return types[typeId] || 'Sconosciuto';
}

export async function updateCategorySelect(selectElement, includeAll = false) {
    try {
        const categories = await fetchCategories();
        let options = includeAll ? '<option value="all">Tutte le categorie</option>' : '';
        categories.forEach(category => {
            options += `<option value="${category.id}">${category.name}</option>`;
        });
        selectElement.innerHTML = options;
    } catch (error) {
        console.error('Error updating category select:', error);
        showNotification('Errore nell\'aggiornamento delle categorie', 'error');
    }
}

export function updateCategoryTypeColors() {
    const categoryTypeSelect = document.getElementById('newCategoryType');
    const submitButton = document.getElementById('submitCategory');
    
    if (!categoryTypeSelect || !submitButton) return;

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
