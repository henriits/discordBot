import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { type Database } from '@/database';
import { jsonRoute } from '@/utils/middleware';
import buildRepository from './repository';
import * as schema from './schema';
import SprintNotFound from '../../utils/errors/moduleErrors/sprintError';
import SprintNameNotUnique from '@/utils/errors/moduleErrors/sprintNameNotUniqueError';

export default (db: Database) => {
    const sprints = buildRepository(db);
    const router = Router();

    router.get(
        '/',
        jsonRoute(async () => {
            const sprintsList = await sprints.findAll();
            return sprintsList;
        })
    );
    router.get(
        '/:id(\\d+)',
        jsonRoute(async (req) => {
            const id = schema.parseId(req.params.id);
            const record = await sprints.findById(id);
            if (!record) {
                throw new SprintNotFound();
            }
            return record;
        })
    );
    router.post(
        '/',
        jsonRoute(async (req) => {
            const body = schema.parseInsertable(req.body);
            // Check if sprint name is unique
            const existingSprint = await sprints.findBySprintName(
                body.sprintName
            );
            if (existingSprint) {
                throw new SprintNameNotUnique();
            }

            return sprints.addSprint(body);
        }, StatusCodes.CREATED)
    );
    router.patch(
        '/:id(\\d+)',
        jsonRoute(async (req) => {
            const id = schema.parseId(req.params.id);
            const bodyPatch = schema.parseUpdatable(req.body);
            const record = await sprints.update(id, bodyPatch);

            if (!record) {
                throw new SprintNotFound();
            }
            return record;
        })
    );
    router.delete(
        '/:id(\\d+)',
        jsonRoute(async (req) => {
            const id = schema.parseId(req.params.id);
            const record = await sprints.remove(id);
            if (!record) {
                throw new SprintNotFound();
            }
            return record;
        })
    );
    return router;
};
