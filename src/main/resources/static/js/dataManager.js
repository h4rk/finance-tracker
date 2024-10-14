import { fetchCategories, fetchTransactions, fetchCatTypes, createTransaction, createCategory, deleteCategory, deleteTransaction } from './api.js';

export async function loadData(appData) {
    try {
        const [categories, transactions, catTypes] = await Promise.all([
            fetchCategories(),
            fetchTransactions(),
            fetchCatTypes()
        ]);

        appData.categories = categories;
        appData.catTypes = catTypes;
        appData.transactions = transactions.map(transaction => ({
            ...transaction,
            categoryName: getCategoryName(appData, transaction.catIds)
        }));

        console.log('Data loaded successfully');

        return appData;
    } catch (error) {
        console.error('Error loading data:', error);
        throw error;
    }
}

export function updateMonthlySummary(appData) {
    const income = appData.transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
    const expenses = Math.abs(appData.transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0));
    const balance = income - expenses;

    appData.monthlySummary = { income, expenses, balance };
    return appData.monthlySummary;
}

export async function addTransaction(appData, transactionData) {
    try {
        const result = await createTransaction(transactionData);
        if (result.success) {
            const newTransaction = {
                id: result.id || Date.now(), // Use the server-provided ID or generate a temporary one
                ...transactionData,
                categoryName: getCategoryName(appData, { [transactionData.catId]: '' })
            };
            appData.transactions.push(newTransaction);
            updateMonthlySummary(appData);
            return newTransaction;
        } else {
            throw new Error(result.message || 'Unknown error occurred');
        }
    } catch (error) {
        console.error('Error adding transaction:', error);
        throw error;
    }
}

export async function addCategory(appData, categoryData) {
    try {
        const result = await createCategory(categoryData);
        console.log('Server response for new category:', result);
        if (result && result.success) {
            const newCategory = {
                id: result.id || Date.now(), // Use server-provided ID if available
                ...categoryData
            };
            appData.categories.push(newCategory);
            return newCategory;
        } else {
            throw new Error('Category creation failed: ' + (result ? result.message : 'Unknown error'));
        }
    } catch (error) {
        console.error('Error adding category:', error);
        throw error;
    }
}

export async function removeCategory(appData, categoryId) {
    try {
        const result = await deleteCategory(categoryId);
        // If deleteCategory returns null (empty response) or any truthy value, consider it successful
        if (result !== undefined) {
            appData.categories = appData.categories.filter(c => c.id !== categoryId);
            return appData.categories;
        } else {
            throw new Error('Deletion failed');
        }
    } catch (error) {
        console.error('Error removing category:', error);
        throw error;
    }
}

export async function removeTransaction(appData, transactionId) {
    try {
        const result = await deleteTransaction(transactionId);
        if (result.success) {
            appData.transactions = appData.transactions.filter(t => t.id !== transactionId);
            updateMonthlySummary(appData);
        }
        return result;
    } catch (error) {
        console.error('Error removing transaction:', error);
        throw error;
    }
}

export function filterTransactions(appData, searchTerm, filterType) {
    return appData.transactions.filter(transaction => {
        const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterType === 'all' || 
                              (filterType === 'income' && transaction.amount > 0) || 
                              (filterType === 'expense' && transaction.amount < 0);
        return matchesSearch && matchesFilter;
    });
}

export function getCategoryName(appData, catId) {
    if (!catId) return 'Categoria sconosciuta';
    
    let categoryId;
    if (typeof catId === 'object') {
        categoryId = Object.keys(catId)[0];
    } else {
        categoryId = catId;
    }
    
    const category = appData.categories.find(cat => cat.id === parseInt(categoryId));
    return category ? category.name : 'Categoria sconosciuta';
}

// Add other data management functions as needed
