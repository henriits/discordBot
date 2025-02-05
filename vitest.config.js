/* eslint-disable */
import path from 'node:path';

export default {
    test: {
        globals: true,
        coverage: {
            provider: 'v8',
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@tests': path.resolve(__dirname, './tests'),
        },
    },
};
