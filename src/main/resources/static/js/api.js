import { API_BASE_URL } from './config.js';

// Function to fetch categories from the server
export async function fetchCategories() {
    try {
        const response = await authenticatedFetch('/cats');
        return await response.json();
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
}

// Function to fetch transactions from the server
export async function fetchTransactions() {
    try {
        const response = await authenticatedFetch('/movs');
        const data = await response.json();
        console.log('Fetched transactions:', data);
        return data;
    } catch (error) {
        console.error('Error fetching transactions:', error);
        throw error;
    }
}



export async function fetchTransactionsWithCategories() {
    const response = await fetch('/movs');
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const transactions = await response.json();
    
    // Fetch categories for each transaction
    const transactionsWithCategories = await Promise.all(transactions.map(async (transaction) => {
        const catResponse = await fetch(`/movs/${transaction.id}/categories`);
        if (catResponse.ok) {
            const categories = await catResponse.json();
            return { ...transaction, categories };
        }
        return transaction;
    }));
    
    return transactionsWithCategories;
}

// Function to fetch category types from the server
export async function fetchCatTypes() {
    try {
        const response = await fetch('/catTypes');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching category types:', error);
        throw error;
    }
}

// Function to create a new transaction
export async function createTransaction(transactionData) {
    console.log('createTransaction received:', JSON.stringify(transactionData, null, 2));
    try {
        const response = await fetch(`${API_BASE_URL}/movs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(transactionData),
        });

        console.log('Actual data sent to server:', JSON.stringify(transactionData, null, 2));
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);

        const rawResponse = await response.text();
        console.log('Raw response:', rawResponse);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}, message: ${rawResponse}`);
        }

        if (!rawResponse) {
            console.warn('Empty response from server, but status is OK. Returning submitted data.');
            return transactionData; // Return the data that was submitted
        }

        try {
            return JSON.parse(rawResponse);
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            throw new Error(`Invalid JSON response: ${rawResponse}`);
        }
    } catch (error) {
        console.error('Error in createTransaction:', error);
        throw error;
    }
}

// Function to create a new category
export async function createCategory(categoryData) {
    try {
        console.log('Sending category data:', categoryData);
        const response = await fetch('/cats', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(categoryData),
        });
        console.log('Server response status:', response.status);
        console.log('Response headers:', response.headers);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            const json = await response.json();
            console.log('Parsed JSON response:', json);
            return { success: true, id: json.id, message: 'Category created successfully' };
        } else {
            const text = await response.text();
            console.log('Raw server response:', text);
            return { success: true, message: 'Category created successfully' };
        }
    } catch (error) {
        console.error('Error in createCategory:', error);
        throw error;
    }
}

// Function to delete a category
export async function deleteCategory(categoryId) {
    try {
        const response = await fetch(`/cats/${categoryId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text(); // Get the raw text of the response
        console.log('Raw server response:', text); // Log the raw response
        if (!text) {
            return null; // If the response is empty, return null instead of trying to parse it
        }
        return JSON.parse(text); // Only try to parse if there's content
    } catch (error) {
        console.error('Error in deleteCategory:', error);
        throw error;
    }
}

// Function to delete a transaction
export async function deleteTransaction(transactionId) {
    try {
        const response = await fetch(`/movs/${transactionId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return { success: true, message: 'Transaction deleted successfully' };
    } catch (error) {
        console.error('Error deleting transaction:', error);
        throw error;
    }
}

// Add other API functions as needed

export async function testCreateMovement() {
    const newMovement = {
        date: "2023-05-15",
        description: "Test Movement",
        amount: 100.00,
        isIncome: true,
        catIds: [10] // Using the correct category ID
    };
    console.log('Test movement data:', JSON.stringify(newMovement, null, 2));
    const response = await fetch('/movs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMovement),
    });
    console.log('Test movement response status:', response.status);
    if (response.ok) {
        const text = await response.text();
        console.log('Response text:', text);
        if (text) {
            const data = JSON.parse(text);
            console.log('Test movement created:', data);
        } else {
            console.log('Empty response, but operation successful');
        }
    } else {
        const errorText = await response.text();
        console.error('Error creating test movement:', errorText);
    }
}

async function authenticatedFetch(url, options = {}) {
    const defaultOptions = {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            // Add any other default headers here
        },
    };

    const response = await fetch(url, { ...defaultOptions, ...options });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error('Error response:', errorBody);
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
    }

    return response;
}
