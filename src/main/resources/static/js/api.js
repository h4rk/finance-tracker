import { API_BASE_URL } from './config.js';

// Configurazione base per le chiamate fetch
const defaultHeaders = {
    'Content-Type': 'application/json',
};

// Funzione helper per le chiamate API
async function apiCall(endpoint, options = {}) {
    try {
        const url = `${API_BASE_URL}${endpoint}`;
        const response = await fetch(url, {
            headers: defaultHeaders,
            ...options,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        // Gestione risposta vuota
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        }
        return null;
    } catch (error) {
        console.error(`API Error (${endpoint}):`, error);
        throw error;
    }
}

// TRANSACTIONS API
export async function fetchTransactions(filters = {}) {
    try {
        const queryParams = new URLSearchParams(filters).toString();
        const endpoint = `/movs${queryParams ? `?${queryParams}` : ''}`;
        const data = await apiCall(endpoint);
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return [];
    }
}

export async function createTransaction(transactionData) {
    return apiCall('/movs', {
        method: 'POST',
        body: JSON.stringify(transactionData)
    });
}

export async function updateTransaction(transactionId, transactionData) {
    return apiCall(`/movs/${transactionId}`, {
        method: 'PUT',
        body: JSON.stringify(transactionData)
    });
}

export async function deleteTransaction(transactionId) {
    return apiCall(`/movs/${transactionId}`, {
        method: 'DELETE'
    });
}

export async function getTransactionDetails(transactionId) {
    return apiCall(`/movs/${transactionId}`);
}

// CATEGORIES API
export async function fetchCategories() {
    try {
        const data = await apiCall('/cats');
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

export async function createCategory(categoryData) {
    return apiCall('/cats', {
        method: 'POST',
        body: JSON.stringify(categoryData)
    });
}

export async function updateCategory(categoryId, categoryData) {
    return apiCall(`/cats/${categoryId}`, {
        method: 'PUT',
        body: JSON.stringify(categoryData)
    });
}

export async function deleteCategory(categoryId) {
    return apiCall(`/cats/${categoryId}`, {
        method: 'DELETE'
    });
}

export async function getCategoryDetails(categoryId) {
    return apiCall(`/cats/${categoryId}`);
}

// BUDGET API
export async function updateCategoryBudget(categoryId, amount) {
    return apiCall(`/cats/${categoryId}/budget`, {
        method: 'PUT',
        body: JSON.stringify({ amount })
    });
}

export async function deleteCategoryBudget(categoryId) {
    return apiCall(`/cats/${categoryId}/budget`, {
        method: 'DELETE'
    });
}

// ANALYTICS API
export async function fetchMonthlyAnalytics() {
    return apiCall('/analytics/monthly');
}

export async function fetchBudgetSummary() {
    return apiCall('/analytics/budget-summary');
}

export async function fetchTransactionsByCategory(categoryId) {
    return apiCall(`/movs?categoryId=${categoryId}`);
}

// CATEGORY TYPES API
export async function fetchCatTypes() {
    try {
        const data = await apiCall('/catTypes');
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('Error fetching category types:', error);
        return [];
    }
}

// AUTHENTICATION
export async function authenticatedFetch(url, options = {}) {
    return apiCall(url, {
        ...options,
        credentials: 'include'
    });
}

// DEBUG/TEST Functions
export async function testCreateMovement() {
    const testData = {
        date: "2023-05-15",
        description: "Test Movement",
        amount: 100.00,
        isIncome: true,
        catIds: [10]
    };
    
    try {
        const result = await createTransaction(testData);
        console.log('Test movement created:', result);
        return result;
    } catch (error) {
        console.error('Test movement creation failed:', error);
        throw error;
    }
}
