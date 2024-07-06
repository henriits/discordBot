import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import type { Database } from '@/database';
import { jsonRoute } from '@/utils/middleware';
import buildRepository from './repository';
import MessageNotFound from '@/utils/errors/moduleErrors/messageNotFound';
import * as schema from './schema';

export default (db: Database) => {
    const templates = buildRepository(db);
    const router = Router();

    router.get(
        '/',
        jsonRoute(async () => {
            const templatesList = await templates.findAll();
            return templatesList;
        })
    );
    router.get(
        '/:id',
        jsonRoute(async (req) => {
            const id = schema.parseId(req.params.id);
            const record = await templates.findById(id);
            if (!record) {
                throw new MessageNotFound();
            }
            return record;
        })
    );
    router.post(
        '/',
        jsonRoute(async (req) => {
            const body = schema.parseInsertable(req.body);
            return templates.addMessage(body);
        }, StatusCodes.CREATED)
    );
    router.patch(
        '/:id',
        jsonRoute(async (req) => {
            const id = schema.parseId(req.params.id);
            const bodyPatch = schema.parseUpdatable(req.body);
            const record = await templates.update(id, bodyPatch);

            if (!record) {
                throw new MessageNotFound();
            }
            return record;
        })
    );
    router.delete(
        '/:id(\\d+)',
        jsonRoute(async (req) => {
            const id = schema.parseId(req.params.id);
            const record = await templates.remove(id);
            if (!record) {
                throw new MessageNotFound();
            }
            return record;
        })
    );
    return router;
};
