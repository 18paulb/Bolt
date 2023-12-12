import '@shopify/shopify-api/adapters/node';
import {shopifyApi, LATEST_API_VERSION} from '@shopify/shopify-api';
import express from 'express';

export const shopify = shopifyApi({
    // The next 4 values are typically read from environment variables for added security
    apiKey: 'APIKeyFromPartnersDashboard',
    apiSecretKey: 'APISecretFromPartnersDashboard',
    scopes: ['read_products'],
    hostName: 'ngrok-tunnel-address',
    ...
});