import express from 'express';
import { Client } from 'discord.js';
import jsonErrorHandler from './middleware/jsonErrors';
import createStudentsController from './modules/students/controller';
import createSprintsController from './modules/sprints/controller';
import createMessagesController from './modules/messageTemplates/controller';
import messages from './modules/discordMessages/controller';

import { type Database } from './database';

export default function createApp(db: Database, bot?: Client) {
    const app = express();
    app.use(express.json());
    app.use('/students', createStudentsController(db));
    app.use('/sprints', createSprintsController(db));
    app.use('/messages', createMessagesController(db));
    app.use('/congratulate', bot ? messages(db, bot) : messages(db));
    app.use(jsonErrorHandler);
    return app;
}
