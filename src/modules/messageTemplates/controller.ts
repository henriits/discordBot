import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import type { Database } from '@/database';
import { jsonRoute } from '@/utils/middleware';
import buildRepository from './repository';

export default (db: Database) => {
    const templates = buildRepository(db);
    const router = Router();

    router.get(
        '/',
        jsonRoute(async () => {
            const templatesList = await templates.findAll();
            return templatesList;
        }, StatusCodes.CREATED)
    );
};
