import { APP_CONFIG } from '../config/constants';

export const formatCurrency = (amount = 0) => {
    const numeric = Number(amount) || 0;
    return `${APP_CONFIG.CURRENCY_SYMBOL}${numeric.toFixed(0)}`;
};

export const formatDateTime = (value) => {
    if (!value) return 'N/A';

    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return 'Invalid date';

    return date.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const generateDisplayOrderNumber = ({ orderId, createdAt }) => {
    const date = createdAt ? new Date(createdAt) : new Date();
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const suffix = String(orderId || '').replace(/[^a-zA-Z0-9]/g, '').slice(-4).toUpperCase();

    return `ORD-${yyyy}${mm}${dd}-${suffix || '0000'}`;
};
