import express from 'express';
import jsonErrorHandler from './middleware/jsonErrors';

export default function createApp() {
    const app = express();
    app.use(express.json());

    app.use(jsonErrorHandler);
    return app;
}
