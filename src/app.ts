import express from 'express';
import jsonErrorHandler from './middleware/jsonErrors';
import createStudentsController from './modules/students/controller';
import { type Database } from './database';

export default function createApp(db: Database) {
    const app = express();
    app.use(express.json());
    app.use('/students', createStudentsController(db));
    app.use(jsonErrorHandler);
    return app;
}
