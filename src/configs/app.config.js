/**
 * here we specify the encryption algorithm used from within the app.
 */

export const ENV_NAME = process.env.REACT_APP_ENV_NAME || true;

export const PRODUCTION = process.env.REACT_APP_PRODUCTION || true;

export const DEBUG = process.env.REACT_APP_APP_DEBUG || true;

export const URL = process.env.REACT_APP_APP_URL || 'https://appdev.vencru.com';

export const API_URL = process.env.REACT_APP_API_URL || 'https://apidev.vencru.com';

export const APP_KEY = process.env.REACT_APP_APP_KEY || null;

export const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || null;

export const PAYSTACK_KEY = process.env.REACT_APP_PAYSTACK_KEY || null;

export const PAYSTACK_STARTER_PLAN = process.env.REACT_APP_PAYSTACK_STARTER_PLAN || null;

export const PAYSTACK_GROWTH_PLAN = process.env.REACT_APP_PAYSTACK_GROWTH_PLAN || null;
