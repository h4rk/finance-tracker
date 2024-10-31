import { fetchCategories, fetchTransactions, fetchCatTypes, createTransaction, createCategory, deleteCategory, deleteTransaction } from './api.js';
import { formatCurrency } from './utils.js';

// Funzioni principali semplificate
export async function loadData() {
    try {
        const [categories, transactions, catTypes] = await Promise.all([
            fetchCategories(),
            fetchTransactions(),
            fetchCatTypes()
        ]);
        
        return {
            categories,
            catTypes,
            transactions: transactions.map(transaction => ({
                ...transaction,
                categoryName: getCategoryNameFromList(categories, transaction.catIds)
            }))
        };
    } catch (error) {
        console.error('Error loading data:', error);
        throw error;
    }
}

export async function updateMonthlySummary() {
    try {
        const monthlyData = await fetch('/analytics/monthly').then(r => r.json());
        const { monthlyIncome: income, monthlyExpense: expenses } = monthlyData;
        const delta = income - expenses;

        updateSummaryUI({ income, expenses, delta });
        return { income, expenses, delta };
    } catch (error) {
        console.error('Error fetching monthly summary:', error);
        throw error;
    }
}

export async function addTransaction(transactionData) {
    try {
        await createTransaction(transactionData);
        await updateMonthlySummary();
        return { success: true, message: 'Transazione aggiunta con successo' };
    } catch (error) {
        console.error('Error adding transaction:', error);
        return { success: false, message: error.message };
    }
}

export async function addCategory(categoryData) {
    try {
        const result = await createCategory(categoryData);
        return result;
    } catch (error) {
        console.error('Error adding category:', error);
        throw error;
    }
}

export async function removeCategory(categoryId) {
    try {
        await deleteCategory(categoryId);
        return await fetchCategories(); // Ricarica le categorie aggiornate
    } catch (error) {
        console.error('Error removing category:', error);
        throw error;
    }
}

export async function removeTransaction(transactionId) {
    try {
        await deleteTransaction(transactionId);
        await updateMonthlySummary();
        return { success: true };
    } catch (error) {
        console.error('Error removing transaction:', error);
        throw error;
    }
}

// Funzioni di utilità
function updateSummaryUI({ income, expenses, delta }) {
    document.getElementById('income').textContent = formatCurrency(income);
    document.getElementById('expenses').textContent = formatCurrency(expenses);
    const balanceElement = document.getElementById('balance');
    balanceElement.textContent = formatCurrency(delta);
    
    balanceElement.className = delta > 0 ? 'text-green-600' : 
                              delta < 0 ? 'text-red-600' : '';
}

function getCategoryNameFromList(categories, catId) {
    if (!catId) return 'Categoria sconosciuta';
    
    const categoryId = typeof catId === 'object' ? Object.keys(catId)[0] : catId;
    const category = categories.find(cat => cat.id === parseInt(categoryId));
    return category ? category.name : 'Categoria sconosciuta';
}

// Add other data management functions as needed
