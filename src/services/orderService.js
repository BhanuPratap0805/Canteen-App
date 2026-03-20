import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { CART_RULES, ORDER_STATUS, PAYMENT_STATUS } from '../config/constants';

const ORDERS_COLLECTION = 'orders';

const ensureDbConfigured = () => {
  if (!db) {
    throw new Error('Firestore is not configured. Check Firebase environment variables.');
  }
};

const nowIso = () => new Date().toISOString();

const generateOrderNumber = (orderId) => {
  const seed = String(orderId || '').replace(/[^a-zA-Z0-9]/g, '').slice(-6).toUpperCase();
  return `ORD-${seed || Date.now().toString().slice(-6)}`;
};

export const calculatePlatformFee = (subtotal = 0) => {
  const value = Number(subtotal) || 0;
  return value >= CART_RULES.PLATFORM_FEE_THRESHOLD
    ? CART_RULES.PLATFORM_FEE_ABOVE_THRESHOLD
    : CART_RULES.PLATFORM_FEE_BELOW_THRESHOLD;
};

export const calculateOrderTotals = (items = []) => {
  const subtotal = items.reduce((acc, item) => acc + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0);
  const platformFee = calculatePlatformFee(subtotal);
  const totalAmount = subtotal + platformFee;

  return {
    subtotal,
    platformFee,
    totalAmount,
  };
};

const mapOrderItems = (items = []) =>
  items.map((item) => ({
    id: item.id,
    name: item.name,
    price: Number(item.price) || 0,
    quantity: Number(item.quantity) || 0,
  }));

export const createPendingOrder = async ({ user, items, paymentMethod }) => {
  ensureDbConfigured();

  if (!user?.uid) {
    throw new Error('User session missing. Please login again.');
  }

  const sanitizedItems = mapOrderItems(items).filter((item) => item.quantity > 0);
  if (!sanitizedItems.length) {
    throw new Error('Your cart is empty. Add items before checkout.');
  }

  const totals = calculateOrderTotals(sanitizedItems);
  const createdAt = nowIso();

  const payload = {
    userId: user.uid,
    userName: user.name || 'Customer',
    userEmail: user.email || null,
    items: sanitizedItems,
    subtotal: totals.subtotal,
    platformFee: totals.platformFee,
    totalAmount: totals.totalAmount,
    status: ORDER_STATUS.PAYMENT_PENDING,
    paymentStatus: PAYMENT_STATUS.INITIATED,
    paymentMethod,
    createdAt,
    updatedAt: createdAt,
  };

  const ref = await addDoc(collection(db, ORDERS_COLLECTION), payload);
  const orderId = ref.id;
  const orderNumber = generateOrderNumber(orderId);

  await updateDoc(doc(db, ORDERS_COLLECTION, orderId), {
    orderNumber,
    updatedAt: nowIso(),
  });

  return {
    id: orderId,
    orderNumber,
    ...payload,
  };
};

export const updateOrderPaymentState = async ({
  orderId,
  paymentStatus,
  status,
  paymentMethod,
  paymentAttemptId,
  paymentGateway = null,
  paymentGatewayPaymentId = null,
  paymentErrorMessage = null,
}) => {
  ensureDbConfigured();
  if (!orderId) throw new Error('orderId is required.');

  await updateDoc(doc(db, ORDERS_COLLECTION, orderId), {
    paymentStatus,
    status,
    paymentMethod: paymentMethod || null,
    latestPaymentAttemptId: paymentAttemptId || null,
    paymentGateway: paymentGateway || null,
    paymentGatewayPaymentId: paymentGatewayPaymentId || null,
    paymentErrorMessage: paymentErrorMessage || null,
    updatedAt: nowIso(),
  });
};
