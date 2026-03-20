import { AUTH_RULES, REGEX } from '../config/constants';

export const validateEmail = (value = '') => REGEX.EMAIL.test(value.trim().toLowerCase());

export const validatePassword = (value = '') => value.length >= AUTH_RULES.MIN_PASSWORD_LENGTH;

export const getPasswordValidationMessage = () =>
    `Password must be at least ${AUTH_RULES.MIN_PASSWORD_LENGTH} characters.`;
