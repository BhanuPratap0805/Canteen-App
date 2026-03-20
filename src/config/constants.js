export const ROLES = {
    USER: 'user',
    ADMIN: 'admin',
    STUDENT: 'student',
    CANTEEN: 'canteen',
};

export const ORDER_STATUS = {
    PAYMENT_PENDING: 'payment_pending',
    RECEIVED: 'received',
    PREPARING: 'preparing',
    READY: 'ready',
    COMPLETED: 'completed',
};

export const PAYMENT_STATUS = {
    INITIATED: 'initiated',
    PENDING: 'pending',
    PAID: 'paid',
    FAILED: 'failed',
    CANCELLED: 'cancelled',
    PENDING_CASH_COLLECTION: 'pending_cash_collection',
};

export const PAYMENT_METHODS = {
    COUNTER: 'counter',
    UPI: 'upi',
    CARD: 'card',
};

export const CART_RULES = {
    PLATFORM_FEE_THRESHOLD: 50,
    PLATFORM_FEE_ABOVE_THRESHOLD: 2,
    PLATFORM_FEE_BELOW_THRESHOLD: 3,
};

export const AUTH_RULES = {
    MIN_PASSWORD_LENGTH: 6,
    IDLE_TIMEOUT_MS: 15 * 60 * 1000,
};

export const APP_CONFIG = {
    CURRENCY: 'INR',
    CURRENCY_SYMBOL: '₹',
};

export const REGEX = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    ROLL_NUMBER: /^[A-Z]{2}\d{7}$/,
};
