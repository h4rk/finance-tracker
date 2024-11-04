import { fetchCategories, createCategory, deleteCategory, updateCategory, getCategoryDetails } from './api.js';
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

export async function handleEditCategory(e) {
    e.preventDefault();
    const form = e.target;
    const categoryId = document.getElementById('editCategoryId').value;
    
    try {
        const categoryData = {
            name: form.name.value,
            type: parseInt(form.type.value)
        };

        await updateCategory(categoryId, categoryData);
        
        // Aggiorna UI
        await loadCategories();
        hideEditCategoryModal();
        showNotification('Category updated successfully', 'success');
    } catch (error) {
        console.error('Error updating category:', error);
        showNotification('Error updating category', 'error');
    }
}

export function hideEditCategoryModal() {
    const modal = document.getElementById('editCategoryModal');
    if (modal) {
        modal.classList.add('hidden');
        document.getElementById('editCategoryForm')?.reset();
    }
}

export function showEditCategoryModal(category) {
    console.log('Showing edit modal for category:', category);
    const modal = document.getElementById('editCategoryModal');
    if (!modal) {
        console.error('Edit category modal not found');
        return;
    }

    // Popola form
    document.getElementById('editCategoryId').value = category.id;
    document.getElementById('editCategoryName').value = category.name;
    document.getElementById('editCategoryType').value = category.type;

    modal.classList.remove('hidden');
}

export function displayCategories(categories) {
    const categoryList = document.getElementById('categoryList');
    if (!categoryList) {
        console.error('Category list element not found');
        return;
    }

    categoryList.innerHTML = categories.map(category => `
        <li class="py-2 px-3 flex justify-between items-center hover:bg-gray-50 rounded-lg transition-colors duration-200">
            <span class="text-gray-700">${category.name}</span>
            <div class="flex space-x-2">
                <button class="edit-category text-blue-600 hover:text-blue-800 transition-colors duration-200" 
                        data-category-id="${category.id}"
                        title="Edit Category">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" 
                              stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                        </path>
                    </svg>
                </button>
                <button class="delete-category text-red-600 hover:text-red-800 transition-colors duration-200" 
                        data-category-id="${category.id}"
                        title="Delete Category">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" 
                              stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                        </path>
                    </svg>
                </button>
            </div>
        </li>
    `).join('');

    attachCategoryEventListeners(categoryList);
}

function attachCategoryEventListeners(categoryList) {
    // Event listeners per i pulsanti
    categoryList.querySelectorAll('.edit-category').forEach(button => {
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            const categoryId = button.dataset.categoryId;
            if (categoryId) {
                try {
                    console.log('Edit clicked for category:', categoryId);
                    const category = await getCategoryDetails(categoryId);
                    console.log('Category details received:', category);
                    showEditCategoryModal(category);
                } catch (error) {
                    console.error('Error loading category details:', error);
                    showNotification('Error loading category details', 'error');
                }
            }
        });
    });

    categoryList.querySelectorAll('.delete-category').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const categoryId = button.dataset.categoryId;
            if (categoryId) handleCategoryDelete(categoryId);
        });
    });
}

// Add other category-related functions as needed
