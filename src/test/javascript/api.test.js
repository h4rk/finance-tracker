import { fetchTransactions, createTransaction } from '../main/resources/static/js/api.js';

describe('API Tests', () => {
    test('fetchTransactions returns array', async () => {
        const transactions = await fetchTransactions();
        expect(Array.isArray(transactions)).toBe(true);
    });
    // ...
}); 