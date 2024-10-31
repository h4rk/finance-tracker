/**
 * Formats a number as currency (EUR)
 * @param {number} amount - The amount to format
 * @returns {string} The formatted currency string
 */
export function formatCurrency(amount) {
    try {
        if (typeof amount !== 'number') {
            amount = parseFloat(amount);
        }
        
        if (isNaN(amount)) {
            throw new Error('Invalid amount');
        }

        const absAmount = Math.abs(amount);
        return amount < 0 ? `-€${absAmount.toFixed(2)}` : `€${absAmount.toFixed(2)}`;
    } catch (error) {
        console.error('Error formatting currency:', error);
        return '€0.00';
    }
}

/**
* Gets the name of a month given its index
* @param {number} monthIndex - The index of the month (0-11)
* @returns {string} The name of the month in Italian
*/
export function getMonthName(monthIndex) {
  const months = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 
                  'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
  return months[monthIndex];
}

/**
* Generates a random color
* @returns {string} A random color in hexadecimal format
*/
export function getRandomColor() {
    try {
        const color = Math.floor(Math.random()*16777215).toString(16);
        return '#' + '0'.repeat(6 - color.length) + color;
    } catch (error) {
        console.error('Error generating random color:', error);
        return '#000000';
    }
}

/**
* Formats a date string to a more readable format
* @param {string} dateString - The date string to format (YYYY-MM-DD)
* @returns {string} The formatted date string (DD/MM/YYYY)
*/
export function formatDate(dateString) {
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
}

/**
* Debounce function to limit how often a function can be called
* @param {Function} func - The function to debounce
* @param {number} wait - The number of milliseconds to wait
* @returns {Function} The debounced function
*/
export function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
* Validates an email address
* @param {string} email - The email address to validate
* @returns {boolean} True if the email is valid, false otherwise
*/
export function validateEmail(email) {
    try {
        if (!email || typeof email !== 'string') return false;
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(email.toLowerCase());
    } catch (error) {
        console.error('Error validating email:', error);
        return false;
    }
}

/**
* Truncates a string if it exceeds a certain length
* @param {string} str - The string to truncate
* @param {number} maxLength - The maximum length of the string
* @returns {string} The truncated string
*/
export function truncateString(str, maxLength = 50) {
    try {
        if (!str || typeof str !== 'string') return '';
        if (str.length <= maxLength) return str;
        return str.slice(0, maxLength - 3) + '...';
    } catch (error) {
        console.error('Error truncating string:', error);
        return '';
    }
}

/**
 * Displays a notification message to the user
 * @param {string} message - The message to display
 * @param {string} type - The type of notification ('success' or 'error')
 */
export function showNotification(message, type = 'info') {
    try {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.className = `
            fixed bottom-4 right-4 p-4 rounded-lg text-white
            ${getNotificationColor(type)}
            transform transition-transform duration-300 ease-in-out
        `;
        
        document.body.appendChild(notification);
        
        // Animazione entrata
        requestAnimationFrame(() => {
            notification.style.transform = 'translateY(0)';
        });

        // Rimuovi dopo 3 secondi con animazione
        setTimeout(() => {
            notification.style.transform = 'translateY(100%)';
            notification.addEventListener('transitionend', () => {
                document.body.removeChild(notification);
            });
        }, 3000);
    } catch (error) {
        console.error('Error showing notification:', error);
    }
}

function getNotificationColor(type) {
    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-yellow-500',
        info: 'bg-blue-500'
    };
    return colors[type] || colors.info;
}

// Add other utility functions as needed
